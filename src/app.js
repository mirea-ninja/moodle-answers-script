import User from "./messenger/user";
import Chat from "./messenger/chat";
import Client from "./network/client";
import ShortAnswerQuestion from "./question/short-answer-question";
import TrueFalseQuestion from "./question/true-false-question";
import MultiChoiceCheckBoxQuestion from "./question/multi-choice-check-box-question";
import MultiChoiceQuestion from "./question/multi-choice-question";
import NumericalQuestion from "./question/numerical-question";
import MatchQuestion from "./question/match-question";

export default class App {
    /**
     * @type {Question[]}
     */
    _questions = [];
    /**
     * @type {string}
     */
    UserId = undefined;
    /**
     * @type User
     */
    _user = undefined;
    /**
     * @type Chat
     */
    _chat = undefined;
    /**
     * @type Client
     */
    _client = undefined;

    get Questions() {
        return this._questions;
    };

    /**
     * @param {HTMLElement} questionBlock
     * @return Question
     * @constructor
     */
    GetQuestion(questionBlock) {
        let questionTypes = ['shortanswer', // вписать короткий ответ
            'truefalse',    // вопрос на верно/неверно
            'numerical',    // коротки ответ в виде числа
            'multichoice',  // вопрос с множественными вариантами ответов
            'match' // вопрос на соответствие
        ];
        let question = undefined;
        const classList = questionBlock.classList;
        for (const questionType of questionTypes) {
            if (classList.contains(questionType)) {
                const domQuestionBlock = questionBlock.querySelector('.qtext');
                const domAnswerBlock = questionBlock.querySelector('.answer');
                switch (questionType) {
                    case 'shortanswer':
                        question = new ShortAnswerQuestion(domQuestionBlock, domAnswerBlock);
                        break;
                    case 'truefalse':
                        question = new TrueFalseQuestion(domQuestionBlock, domAnswerBlock);
                        break;
                    case 'multichoice':
                        let isCheckBox = domAnswerBlock.querySelector('input[type=checkbox]') !== null;
                        if (isCheckBox) {
                            question = new MultiChoiceCheckBoxQuestion(domQuestionBlock, domAnswerBlock);
                        } else {
                            question = new MultiChoiceQuestion(domQuestionBlock, domAnswerBlock);
                        }
                        break;
                    case 'numerical':
                        question = new NumericalQuestion(domQuestionBlock, domAnswerBlock);
                        break;
                    case 'match':
                        question = new MatchQuestion(domQuestionBlock, domAnswerBlock);
                        break;
                }
                return question;
            }
        }
    }

    SearchQuestions(contextElement = document.body) {
        this._questions = [];
        const questionsBlock = contextElement.querySelectorAll('.que');

        for (let i = 0; i < questionsBlock.length; i++) {
            let question = this.GetQuestion(questionsBlock[i]);
            if (question) {
                this._questions.push(question);
            }
        }

        return this.Questions;
    }

    IsProtectedPage() {
        return document.body.classList.contains("quiz-secure-window");
    }

    DisableProtectedPageRestrictions() {
        window.addEventListener("mousedown", event => event.stopPropagation(), true);
        window.addEventListener("dragstart", event => event.stopPropagation(), true);
        window.addEventListener("contextmenu", event => event.stopPropagation(), true);
        window.addEventListener('copy', event => event.stopPropagation(), true);
        window.addEventListener('beforeprint', event => event.stopPropagation(), true);
    }

    Start(){
        this._user = new User();
        this._chat = new Chat();

        this._user.UserId =this.UserId
        this._chat.CreateChat();

        if (this.IsProtectedPage()) {
            this.DisableProtectedPageRestrictions();
        }

        const room = CryptoJS.SHA256(this.Questions[0].TextQuestion).toString();
        this._client = new Client('https://mirea.ninja:5000/', this._user, room);

        this._client.RegisterConnectListenerAndSendQuestionData(this.Questions);

        this._client.callBackNewMessageReceived = (message) => {
            this._chat.AddChatMessage(message);
        };
        this._chat.callBackSendMessage = (message) => {
            this._client.SendChatMessage(message);
        };
        this._client.RegisterAddChatMessagesListener();

        for (const question of this.Questions) {
            question.CreateHints();

            this._client.callBackArrayUpdateViewersCounter.push((data) => {
                if (question.TextQuestion === data['question']) {
                    question.ViewerCounter = data['viewers'];
                }
            });

            this._client.callBackArrayUpdateAnswersInformation.push((data) => {
                if (question.TextQuestion === data['question']) {
                    question.HintAnswers = data['answers'];
                }
            });

            question.callBackAnswerChange = (newAnswerData) => {
                this._client.SendNewAnswerToQuestion(newAnswerData);
            };

            question.CallBackApprovalButton = (message) => {
                this._client.SendNewApprovalAnswers(message);
            };
        }
        this._client.RegisterUpdateAnswersListener();
        this._client.RegisterUpdateViewersListener();
    }
}