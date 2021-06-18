// ==UserScript==
// @name         Mirea Ninja Answers
// @namespace    https://mirea.ninja/
// @version      1.1.5.1
// @description  online test answers!
// @author       admin
// @match        *://*/*
// @updateURL    https://raw.githubusercontent.com/SyntOwl/answers-script/main/answers-script.meta.js
// @downloadURL  https://raw.githubusercontent.com/SyntOwl/answers-script/main/answers-script.user.js
// @supportURL   https://mirea.ninja/t/novaya-versiya-skripta-dlya-obmena-otvetami-v-testirovaniya-v-sdo/486
// @require      https://cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs@3/dist/fp.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js
// @require      https://cdn.socket.io/4.1.2/socket.io.min.js
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    const QUESTIONS_SELECTOR = '.que';
    const SERVER_URL = 'https://mirea.ninja:5000/';

    class User {

        listName = ['Крофос',
            'Соми',
            'Афионаполис',
            'Костолом',
            'Райнор',
            'Фэктори',
            'Фокос',
            'Чармондер',
            'Самордер',
            'Рока',
            'Зонт',
            'Кустик',
            'Хромус',
            'Харивер',
            'Шильма',
            'Нискофор',
            'Разор',
            'Миру',
            'Кросун',
            'Сивилиус',
            'Протон',
            'Слардар',
            'Дум'];

        /**
         * @private
         * @type {string}
         */
        _userId = undefined;

        /**
         * @return string
         */
        get UserId() {
            if (!this._userId) {
                console.error('User Id not set.');
            }
            return this._userId;
        }

        set UserId(newId) {
            this._userId = newId;
        }

        get UserName() {
            let codeLastSymbolUserId = this._userId.charCodeAt(this.UserId.length - 1);
            return (this.listName)[codeLastSymbolUserId % (this.listName.length - 1)];
        }
    }

    class Chat {

        /**
         * @private
         * @type {string}
         */
        _codeHTML = `
                <div id="chat-block">
                    <input type="checkbox" id="chat-button" aria-hidden="true">
                    <div class="chat-nav">
                        <label for="chat-button" class="chat-button" onclick></label>
                        <section>
                            <div id="chat-messages" style="max-height: 700px; overflow-y: scroll; padding-right: 10px;">
                            </div>
                            <div>
                                <textarea id="chat-input" placeholder="Написать сообщение"></textarea>
                                <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg" id="send-chat-message-icon">
                                    <path d="M28.2758 4.29001C28.1423 4.15569 27.9738 4.06268 27.7898 4.02194C27.6059 3.9812 27.4143 3.99441 27.2376 4.06001L5.48526 12.06C5.29766 12.132 5.13615 12.26 5.02218 12.427C4.90821 12.594 4.84717 12.7921 4.84717 12.995C4.84717 13.1979 4.90821 13.3961 5.02218 13.5631C5.13615 13.7301 5.29766 13.858 5.48526 13.93L13.9786 17.36L20.2472 11L21.6413 12.41L15.343 18.78L18.7443 27.37C18.8176 27.5561 18.9444 27.7156 19.1083 27.8279C19.2723 27.9403 19.4658 28.0002 19.6638 28C19.8636 27.9959 20.0575 27.9306 20.2199 27.8128C20.3823 27.6949 20.5056 27.5301 20.5735 27.34L28.4834 5.34001C28.5508 5.16309 28.567 4.97044 28.5303 4.78454C28.4935 4.59863 28.4052 4.42712 28.2758 4.29001Z" fill="#377DFF"/>
                                </svg>
                            </div>
                        </section>
                    </div>
                </div>
                `;

        /**
         * @private
         * @type {string}
         * @const
         */
        _codeCSS = `.chat-nav {
                        width: 485px;
                        height: 800px;
                        background: #EFEFEF;
                        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
                        border-radius: 20px;
                        position: fixed;
                        padding: 0;
                        top: 16.7%;
                        margin-top: -99.7px;
                        right: 0;
                        background: #EFEFEF;;
                        -webkit-transform: translateX(100%);
                        -moz-transform: translateX(100%);
                        transform: translateX(100%);
                        -webkit-transition: 0.34s;
                        -moz-transition: 0.34s;
                        transition: 0.34s;
                        z-index: 9998;
                    }
                    .chat-nav > section {
                        padding: 15px;
                        color: #8D8D8D
                    }
                    .chat-button {
                        position: absolute;
                        right: 99.8%;
                        top: 41%;
                        box-shadow: 0px 2px 0px 0px rgb(0 0 0 / 25%);
                        margin-top: -24px;
                        left: -24px;
                        padding: 1em 0;
                        background: inherit;
                        border-bottom-left-radius: 7px;
                        border-top-left-radius: 7px;
                        color: #8D8D8D;
                        font-size: 1.4em;
                        line-height: 1;
                        text-align: center;
                    }
                    .chat-button:after {
                        content: '<';
                        font: normal 18px/1 'FontAwesome';
                        text-decoration: inherit;
                    }
                    .chat-button:hover{
                        cursor: pointer;
                        color:#1f1c1c;
                    }
                    [id='chat-button'] {
                        position: absolute;
                        right:0;
                        display:none;
                    }
                    [id='chat-button']:checked ~ .chat-nav {
                        -webkit-transform: translateX(0);
                        -moz-transform: translateX(0);
                        transform: translateX(0);
                    }
                    [id='chat-button']:checked ~ .chat-nav > .chat-button:after {
                        content:'>';
                        font: normal 18px/1 'FontAwesome';
                    }
                    body {
                        -webkit-animation: bugfix infinite 1s;
                        animation: bugfix infinite 1s;
                    }
                    @-webkit-keyframes bugfix {
                        to { padding: 0; }
                    }
                    @media (max-width: 350px) {
                        .chat-nav {
                            width: 100%;
                        }
                    }
                    .chat-message-text {
                        word-break: break-all;
                        font-size: 18px;
                        line-height: 21px;
                        padding-left: 10px;
                        padding-top: 8px;
                        padding-right: 4px;
                        padding-bottom: 8px;
                        color: #FFFFFF;
                    }
                    .chat-message {
                        width: 343px;
                        margin-top: 5px;
                    }
                    .your-chat-message{
                        float: right;
                    }
                    .chat-message-text-other{
                        color: #363636;
                        left: 15px;
                        background: #FFFFFF;
                        border-radius: 1px 20px 20px 20px;
                        min-height: 45px;
                    }
                    .chat-message-text-your{
                        right: 15px;
                        background: #377DFF;
                        border-radius: 20px 20px 1px 20px;
                        min-height: 45px;
                        margin-bottom:5px;
                    }
                    .chat-message-user-type {
                        font-size: 14px;
                        line-height: 16px;
                    }
                    .other-chat-message-type{
                        left: 15px;
                        color: #B4B4B4;
                        margin-bottom:5px;
                    }
                    .your-chat-message-type{
                        right: 20px;
                        color: #B4B4B4;
                    }
                    #chat-input{
                        position: absolute;
                        bottom: 0px;
                        margin-top: 0px;
                        margin-bottom: 5px;
                        width: 462.73px;
                        height: 59px;
                        background: #FFFFFF;
                        resize: none;
                        border-radius: 20px;
                        padding: 5px;
                    }
                    #chat-input:focus-visible {
                        outline: -webkit-focus-ring-color auto 0px !important;
                    }
                    #send-chat-message-icon{
                        position: absolute;
                        bottom: 4px;
                        right: 0;
                        margin-bottom: 12px;
                        margin-right: 18px;
                    }
                    #send-chat-message-icon:hover{
                        cursor: pointer;
                    }
                    .another-chat-message{
                        float:left;
                    }`

        /**
         * @protected
         * @type HTMLDivElement
         */
        _domChatBlock;

        /**
         * @private
         * @type User
         */
        _user;
        /**
         * @public
         * @callback
            * @param {{userInfo: string, text: string, user: string}} message
         */
        callBackSendMessage;

        /**
         * @param {User}user
         */
        set User(user) {
            this._user = user;
        }

        /**
         * @return {HTMLOrSVGImageElement}
         */
        get SendButtonElement() {
            return this._domChatBlock.querySelector('#send-chat-message-icon');
        }

        /**
         * @return {HTMLTextAreaElement}
         */
        get InputTextBox() {
            return this._domChatBlock.querySelector('#chat-input');
        }

        /**
         * @return {HTMLDivElement}
         */
        get ChatMessages() {
            return this._domChatBlock.querySelector('#chat-messages');
        }

        /**
         * @private
         */
        RegisterSendButtonListener() {
            let _this = this;
            this.SendButtonElement.addEventListener('click', function () {

                let textMessage = _this.InputTextBox.value;
                if (textMessage !== '') {
                    let message = {
                        user: _this._user.UserName,
                        userInfo: _this._user.UserId,
                        text: textMessage
                    }
                    if (_this.callBackSendMessage) {
                        _this.callBackSendMessage(message);
                    }
                }
            });
        }

        CreateChat() {
            // Add html chat code in page
            document.body.insertAdjacentHTML('beforeend', this._codeHTML);
            // Add css chat code in page
            GM_addStyle(this._codeCSS);

            this._domChatBlock = document.body.querySelector('[id=chat-block]');

            this.RegisterSendButtonListener();
        }

        /**
         * @param {[{userInfo: string, text: string, user: string}]} messages
         */
        AddChatMessage(messages) {
            for (const message of messages) {
                let messageHtml;
                if (message['user_info'] !== this._user.UserId) {
                    messageHtml = `<div class="chat-message another-chat-message">
                                    <p class="chat-message-user-type other-chat-message-type">${message['user']}</p>
                                    <p class="chat-message-text chat-message-text-other">${message['text']}</p>
                                </div>`;
                } else {
                    messageHtml = `<div class="chat-message your-chat-message">
                            <p class="chat-message-text chat-message-text-your">${message['text']}</p>
                            <p class="chat-message-user-type your-chat-message-type your-chat-message">вы</p>
                        </div>`;
                }

                this.ChatMessages.insertAdjacentHTML('beforeend', messageHtml);

            }
        }
    }

    class Client {
        /**
         * @param {string}url
         * @param {User}user
         * @param {string}room
         */
        constructor(url, user, room) {
            this._soccet = io(url);
            this._user = user;
            this._room = room;
        }

        /**
         * @param {Question[]}questions
         */
        RegisterConnectListener(questions) {
            this._soccet.on('connect', () => {
                this._soccet.emit('join', this._room);

                // отправка запроса для счётчика просмотров и создания нового вопроса
                this._soccet.emit('view_question', {
                    'data': {
                        'questions': questions[0].TextQuestion,
                        'user_info': user.UserId,
                        'room': this._room
                    }
                });
                // получаем сообщения чата
                this._soccet.emit('get_chat', this._room);
                // отправляем текущие ответы на сервер
                this.UpdateAnswersOnDocumentReady(questions);
            });
        }

        SendChatMessage(message) {
            this._soccet.emit(message);
        }

        /**
         * @param {Question[]}questions
         */
        UpdateAnswersOnDocumentReady(questions) {
            for (const question of questions) {
                const text = question.TextQuestion;
                const type = question.Type;
                const answers = question.Answers;
                for (const answer of answers) {
                    this._soccet.emit('add_answer', {
                        'user_info': this._user.UserId,
                        'question': text,
                        'question_type': type,
                        'answer': answer,
                        'room': this._room
                    })
                }
            }
        }

        UpdateAnswersInformation(data) {
            /**
             * @type {Question[]}
             */
            let questions;

            for (const question of questions) {
                if (question.TextQuestion !== data['question']) {
                    continue;
                }

                const answers = question.Answers;
                for (const answer of answers) {

                }
            }

        }

    }

    class Image {
        /**
         * @protected
         * @type HTMLImageElement
         */
        _imgElement;

        /**
         * @param {HTMLImageElement} img
         * @constructor
         */
        constructor(img) {
            this._imgElement = img;
        }

        get CheckLoad() {
            return this._imgElement.complete;
        }

        get Base64() {
            if (!this.CheckLoad) {
                console.error('Image not loaded, failed to get Base64.');
                return '';
            }
            let canvas = document.createElement("canvas");
            canvas.width = this._imgElement.width;
            canvas.height = this._imgElement.height;
            let ctx = canvas.getContext("2d");
            ctx.drawImage(this._imgElement, 0, 0);
            let dataURL = canvas.toDataURL("image/png");
            return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
        }

        /**
         * @return {string}
         */
        get SHA256() {
            if (!this.CheckLoad) {
                console.error('Image not loaded, failed to get SHA256.');
                return '';
            }
            return CryptoJS.SHA256(this.Base64).toString();
        }
    }

    /**
     * @abstract
     */
    class Question {

        /**
         * @protected
         * @type HTMLDivElement
         */
        _domQuestionBlock;

        /**
         * @protected
         * @type HTMLDivElement
         */
        _domAnswerBlock;

        /**
         * @protected
         * @type string
         */
        _type;

        /**
         * @public
         * @callback
            * @param {{textQuestion: string, newAnswers: string[]}} questionInfo
         */
        callBackAnswerChange;

        /**
         * @param {HTMLDivElement}domQuestionBlock
         * @param {HTMLDivElement}domAnswerBlock
         */
        constructor(domQuestionBlock, domAnswerBlock) {
            this._domQuestionBlock = domQuestionBlock;
            this._domAnswerBlock = domAnswerBlock;
        }

        /**
         * @return string
         */
        get Type() {
            return this._type;
        }

        /**
         * @return {string[]}
         * @abstract
         */
        get Answers() {

        };

        /**
         * @return {string}
         */
        get TextQuestion() {
            let text;
            text = this._domQuestionBlock.innerText;

            const imagesElements = this._domQuestionBlock.querySelectorAll('.qtext img');
            for (const imageElement of imagesElements) {
                let img = new Image(imageElement);
                let imgHash = img.SHA256;
                if (imgHash.length === 0) {
                    console.error('Image not loaded, perhaps the question will not be identified correctly.');
                }
                text += " img:" + imgHash;
            }

            return text;
        }

        CreateHintDomBlock() {

        }
    }

    /**
     * @extends Question
     */
    class ShortAnswerQuestion extends Question {

        /**
         * @param {HTMLDivElement}domQuestionBlock
         * @param {HTMLDivElement}domAnswerBlock
         */
        constructor(domQuestionBlock, domAnswerBlock) {
            super(domQuestionBlock, domAnswerBlock);
            this._type = 'shortanswer';
        }

        get Answers() {
            let answer = this._domAnswerBlock.querySelector('input').value.trim();
            return [answer];
        }
    }

    /**
     * @extends Question
     */
    class TrueFalseQuestion extends Question {

        /**
         * @param {HTMLDivElement}domQuestionBlock
         * @param {HTMLDivElement}domAnswerBlock
         */
        constructor(domQuestionBlock, domAnswerBlock) {
            super(domQuestionBlock, domAnswerBlock);
            this._type = 'truefalse';
        }

        get Answers() {
            let answerCheckboxOptions = this._domAnswerBlock.querySelectorAll('input');
            let answer;
            for (const answerCheckboxOption of answerCheckboxOptions) {
                if (answerCheckboxOption.checked) {
                    answer = answerCheckboxOption
                        .parentElement.querySelector('.ml-1')
                        .textContent.trim();
                    break;
                }
            }
            return [answer];
        }
    }

    /**
     * @extends Question
     */
    class MultiChoiceQuestion extends Question {

        /**
         * @param {HTMLDivElement}domQuestionBlock
         * @param {HTMLDivElement}domAnswerBlock
         */
        constructor(domQuestionBlock, domAnswerBlock) {
            super(domQuestionBlock, domAnswerBlock);
            this._type = 'multichoice';
        }

        get Answers() {
            let answerCheckboxOptions = this._domAnswerBlock.querySelectorAll('input');
            let answers = [];
            for (const answerCheckboxOption of answerCheckboxOptions) {
                if (answerCheckboxOption.checked) {
                    let answer = answerCheckboxOption
                        .parentElement.querySelector('.ml-1')
                        .textContent.trim();
                    answers.push(answer);
                }
            }
            return answers;
        }
    }


    /**
     * @extends Question
     */
    class NumericalQuestion extends Question {

        /**
         * @param {HTMLDivElement}domQuestionBlock
         * @param {HTMLDivElement}domAnswerBlock
         */
        constructor(domQuestionBlock, domAnswerBlock) {
            super(domQuestionBlock, domAnswerBlock);
            this._type = 'numerical';
        }

        get Answers() {
            let answer = this._domAnswerBlock.querySelector('input').value.trim();
            return [answer];
        }
    }

    /**
     * @extends Question
     */
    class MatchQuestion extends Question {

        /**
         * @param {HTMLDivElement}domQuestionBlock
         * @param {HTMLDivElement}domAnswerBlock
         */
        constructor(domQuestionBlock, domAnswerBlock) {
            super(domQuestionBlock, domAnswerBlock);
            this._type = 'match';
        }

        // todo: редкий тип вопрос, реализовать.
        get Answers() {
            console.error(this._type + ' - receiving responses not implemented');
            return [];
        }
    }


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
                        question = new MultiChoiceQuestion(domQuestionBlock, domAnswerBlock);
                        break;
                    case 'numerical':
                        question = new NumericalQuestion(domQuestionBlock, domAnswerBlock);
                        break;
                    case 'match':
                        question = new MatchQuestion(domQuestionBlock, domAnswerBlock);
                        break;
                    default:
                        console.error(questionType + ' - not implemented');
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


    let user = new User();
    let chat = new Chat();
    /**
     * @type Client
     */
    let client

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

    }

    function OnDOMReady() {
        questions = GetQuestions(QUESTIONS_SELECTOR);

        chat.CreateChat();

        FingerprintJS.load()
            .then(fp => fp.get())
            .then(result => {
                user.UserId = result.visitorId;
                chat.User = user;
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
})(); // tampermonkey main function end