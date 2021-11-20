import User from "./messenger/user";
import Chat from "./messenger/chat";
import Client from "./network/client";
import ShortAnswerQuestion from "./question/short-answer-question";
import TrueFalseQuestion from "./question/true-false-question";
import MultiChoiceCheckBoxQuestion from "./question/multi-choice-check-box-question";
import MultiChoiceQuestion from "./question/multi-choice-question";
import NumericalQuestion from "./question/numerical-question";
import MatchQuestion from "./question/match-question";

const QUESTIONS_SELECTOR = '.que';
const SERVER_URL = 'https://mirea.ninja:5000/';

/**
 * @param {HTMLElement} questionBlock
 * @return Question
 * @constructor
 */
function GetQuestion(questionBlock) {
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

function GetQuestions(selector, contextElement = document.body) {
    let questions = [];
    const questionsBlock = contextElement.querySelectorAll(selector);

    for (let i = 0; i < questionsBlock.length; i++) {
        let question = GetQuestion(questionsBlock[i]);
        if (question) {
            questions.push(question);
        }
    }

    return questions;
}

function IsProtectedPage() {
    return document.body.classList.contains("quiz-secure-window");
}

function DisableProtectedPageRestrictions() {
    window.addEventListener("mousedown", event => event.stopPropagation(), true);
    window.addEventListener("dragstart", event => event.stopPropagation(), true);
    window.addEventListener("contextmenu", event => event.stopPropagation(), true);
    window.addEventListener('copy', event => event.stopPropagation(), true);
    window.addEventListener('beforeprint', event => event.stopPropagation(), true);
}

/**
 * @type User
 */
let user;
/**
 * @type Chat
 */
let chat;
/**
 * @type Client
 */
let client;
/**
 * @type {Question[]}
 */
let questions = [];

document.addEventListener("DOMContentLoaded", OnDOMReady);

function OnWindowLoad() {

    if (IsProtectedPage()) {
        DisableProtectedPageRestrictions();
    }

    const room = CryptoJS.SHA256(questions[0].TextQuestion).toString();
    client = new Client(SERVER_URL, user, room);

    client.RegisterConnectListenerAndSendQuestionData(questions);

    client.callBackNewMessageReceived = (message) => {
        chat.AddChatMessage(message);
    };
    chat.callBackSendMessage = (message) => {
        client.SendChatMessage(message);
    };
    client.RegisterAddChatMessagesListener();

    for (const question of questions) {
        question.CreateHints();

        client.callBackArrayUpdateViewersCounter.push((data) => {
            if (question.TextQuestion === data['question']) {
                question.ViewerCounter = data['viewers'];
            }
        });

        client.callBackArrayUpdateAnswersInformation.push((data) => {
            if (question.TextQuestion === data['question']) {
                question.HintAnswers = data['answers'];
            }
        });

        question.callBackAnswerChange = (newAnswerData) => {
            client.SendNewAnswerToQuestion(newAnswerData);
        };

        question.CallBackApprovalButton = (message) => {
            client.SendNewApprovalAnswers(message);
        };
    }
    client.RegisterUpdateAnswersListener();
    client.RegisterUpdateViewersListener();

}

function OnDOMReady() {
    questions = GetQuestions(QUESTIONS_SELECTOR);

    if (questions.length === 0) {
        return;
    }

    user = new User();
    chat = new Chat();

    chat.CreateChat();

    FingerprintJS.load()
        .then(fp => fp.get())
        .then(result => {
            user.UserId = result.visitorId;
            switch (document.readyState) {
                case 'loading':
                case 'interactive':
                    window.addEventListener('load', OnWindowLoad);
                    break;
                case 'complete':
                    OnWindowLoad();
                    break;
            }
        });
}