// ==UserScript==
// @name         Mirea Ninja Answers
// @namespace    https://mirea.ninja/
// @version      2.1.0
// @description  online test answers!
// @author       admin and SyntOwl
// @match        *://online-edu.mirea.ru/*
// @match        *://oniel.beget.tech/*
// @updateURL    https://raw.githubusercontent.com/Ninja-Official/moodle-answers-script/main/answers-script.meta.js
// @downloadURL  https://raw.githubusercontent.com/Ninja-Official/moodle-answers-script/main/answers-script.user.js
// @supportURL   https://mirea.ninja/t/novaya-versiya-skripta-dlya-obmena-otvetami-v-testirovaniya-v-sdo/486
// @require      https://cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs@3/dist/fp.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
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
         * @const
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
         * @public
         * @callback
            * @param {string} message
         */
        callBackSendMessage;

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
                        text: textMessage
                    };
                    if (_this.callBackSendMessage) {
                        _this.InputTextBox.value = '';
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
         * @param {[{senderType: string, text: string, userName: string}]} messages
         */
        AddChatMessage(messages) {
            for (const message of messages) {
                let messageHtml;
                if (message['senderType'] !== 'our') {
                    messageHtml = `<div class="chat-message another-chat-message">
                                    <p class="chat-message-user-type other-chat-message-type">${message['userName']}</p>
                                    <p class="chat-message-text chat-message-text-other">${message['text']}</p>
                                </div>`;
                } else {
                    messageHtml = `<div class="chat-message your-chat-message">
                            <p class="chat-message-text chat-message-text-your">${message['text']}</p>
                            <p class="chat-message-user-type your-chat-message-type your-chat-message">${message['userName']}(ВЫ)</p>
                        </div>`;
                }

                this.ChatMessages.insertAdjacentHTML('beforeend', messageHtml);

            }
            this.ChatMessages.scrollTo(0, this.ChatMessages.scrollHeight);
        }
    }

    class Client {
        /**
         * @param {string}url
         * @param {User}user
         * @param {string}room
         */

        /**
         * @public
         * @callback
            * @param {[{userInfo: string, text: string, user: string}]} messages
         */
        callBackNewMessageReceived;

        callBackArrayUpdateAnswersInformation = [];

        callBackArrayUpdateViewersCounter = [];

        constructor(url, user, room) {
            this._socket = io(url);

            /**
             * @private
             * @type User
             */
            this._user = user;
            this._room = room;
        }

        /**
         * @param {Question[]}questions
         */
        RegisterConnectListenerAndSendQuestionData(questions) {
            this._socket.on('connect', () => {
                this._socket.emit('join', this._room);

                let textQuestions = [];
                for (const question of questions) {
                    textQuestions.push(question.TextQuestion);
                }
                // отправка запроса для счётчика просмотров и создания нового вопроса
                this._socket.emit('view_question', {
                    'data': {
                        'questions': textQuestions,
                        'user_info': this._user.UserId,
                        'room': this._room
                    }
                });
                // получаем сообщения чата
                this._socket.emit('get_chat', this._room);
                // отправляем текущие ответы на сервер
                this.UpdateAnswersOnDocumentReady(questions);
            });
        }

        RegisterUpdateViewersListener() {
            // событие вызывается при обновлении счётчика просмотров у вопроса
            this._socket.on('update_viewers', (questionsInfo) => {
                if(questionsInfo === undefined){
                    return;
                }
                for (const callBackUpdateViewersCounter of this.callBackArrayUpdateViewersCounter) {
                    for (let i = 0; i < questionsInfo['data'].length; i++) {
                        let questionViewerInfo = {
                            question: questionsInfo['data'][i]['question'],
                            viewers: questionsInfo['data'][i]['viewers'].length
                        }
                        callBackUpdateViewersCounter(questionViewerInfo);
                    }
                }
            });
        }

        RegisterUpdateAnswersListener() {
            // событие вызывается при обновлении каких-то ответов на сервере
            this._socket.on('update_answers', (allQuestionInfo) => {
                if(allQuestionInfo === undefined){
                    return;
                }
                for (const callBackUpdateAnswersInformation of this.callBackArrayUpdateAnswersInformation) {
                    let questionInfo = {
                        question: allQuestionInfo['question'],
                        answers: allQuestionInfo['answers']
                    };
                    callBackUpdateAnswersInformation(questionInfo);
                }
            });
        }

        SendNewApprovalAnswers(message) {
            this._socket.emit('add_approve', {
                'user_info': this._user.UserId,
                'question': message['question'],
                'is_correct': message['buttonValue'],
                'answer': message['answer'],
                'room': this._room
            });
        }

        GetUserTypeByUserId(userId) {
            if (this._user.UserId === userId) {
                return 'our';
            } else {
                return 'other';
            }
        }


        RegisterAddChatMessagesListener(question) {
            // событие вызывается при получении нового сообщения в чате

            this._socket.on('add_chat_messages', (messages) => {
                if(messages === undefined){
                    return;
                }
                let processedMessages = [];

                for (const message of messages) {
                    processedMessages.push(
                        {
                            text: message['text'],
                            senderType: this.GetUserTypeByUserId(message['user_info']),
                            userName: message['user']
                        }
                    );
                }

                this.callBackNewMessageReceived(processedMessages);
            });
        }

        SendChatMessage(message) {
            this._socket.emit('chat', {
                'room': this._room,
                'message': {
                    'user': this._user.UserName,
                    'user_info': this._user.UserId,
                    'text': message.text
                }
            });
        }

        /**
         * @param {{answers: *[], text: string, type: string}}newAnswerData
         */
        SendNewAnswerToQuestion(newAnswerData) {
            for (const answer of newAnswerData['answers']) {
                this._socket.emit('add_answer', {
                    'user_info': this._user.UserId,
                    'question': newAnswerData['text'],
                    'question_type': newAnswerData['type'],
                    'answer': answer,
                    'room': this._room
                });
            }
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
                    this._socket.emit('add_answer', {
                        'user_info': this._user.UserId,
                        'question': text,
                        'question_type': type,
                        'answer': answer,
                        'room': this._room
                    });
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
            canvas.width = this._imgElement.naturalWidth;
            canvas.height = this._imgElement.naturalHeight;
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

    class Hint {

        _domHintBlock;

        /**
         * @callback
            */
        callBackPressApprovalButton;

        /**
         * @param {HTMLElement}answerBlock
         * @param {function}callBackGetAnswer
         * @param {function}callBackGetQuestion
         */
        constructor(answerBlock, callBackGetAnswer, callBackGetQuestion) {
            this._domAnswerBlock = answerBlock;
            this._callBackGetAnswer = callBackGetAnswer;
            this._callBackGetQuestion = callBackGetQuestion;
        }

        /**
         * @abstract
         */
        set HintInfo(info) {

        }

        /**
         * @abstract
         */
        CreateHint() {
        }
    }

    /**
     * @extends Hint
     */
    class TextHint extends Hint {


        /**
         * @param {HTMLElement}answerBlock
         * @param {function}callBackGetAnswer
         * @param {function}callBackGetQuestion
         */
        constructor(answerBlock, callBackGetAnswer, callBackGetQuestion) {
            super(answerBlock, callBackGetAnswer, callBackGetQuestion);
        }

        set HintInfo(info) {
            let hintAnswers = '';
            for (const userAnswer of info) {
                let hintHtml = `<div><span style="color: black;" style="margin: 0px 5px;">${userAnswer['users'].length} - ответили так</span> |<span class="user-text-answer" style="color: black; margin: 0px 5px;">${userAnswer['answer']}</span></div>`;
                hintAnswers += hintHtml;
            }
            this._domHintBlock.innerHTML = hintAnswers;
        }

        /**
         * @private
         */
        CreateHintDomBlock() {
            let answerParentBlock = this._domAnswerBlock.parentNode;
            const hintHtml = '<div class="script-answers" style="color: red;' +
                ' padding-left: 5px; position: relative; background: rgb(0 0 0 / 6%);' +
                ' border-radius: 4px;">';
            answerParentBlock.insertAdjacentHTML('beforeend', hintHtml);
            this._domHintBlock = answerParentBlock.querySelector('.script-answers');
        }

        CreateHint() {
            this.CreateHintDomBlock();
        }
    }

    /**
     * @extends Hint
     */
    class CheckBoxHint extends Hint {


        /**
         * @param {HTMLElement}answerBlock
         * @param {function}callBackGetAnswer
         * @param {function}callBackGetQuestion
         */
        constructor(answerBlock, callBackGetAnswer, callBackGetQuestion) {
            super(answerBlock, callBackGetAnswer, callBackGetQuestion);
        }

        set HintInfo(info) {
            /**
             * @type {NodeListOf<HTMLSpanElement>}
             */
            let stats = this._domHintBlock.querySelectorAll('span');
            stats[0].textContent = info['check'];
            stats[1].textContent = info['correct'];
            stats[2].textContent = info['notCorrect'];
        }

        /**
         * @private
         */
        CreateHintDomBlock() {
            let answerParentBlock = this._domAnswerBlock.parentNode;
            let hintHtml = `
                        <div class="script-answers" style="padding-left: 5px; position: relative; display: inline-flex; background: rgb(0 0 (0 / 6%)); border-radius: 4px; font-size: 15px; max-height: 25px;">
                            ответы: <span title="Выбрали этот ответ" style="margin: 0px 5px;">0</span> | <span style="color: green; margin: 0px 5px;" title="Уверены, что этот ответ правильный">0</span> | <span style="color: red; margin: 0px 5px;" title="Уверены, что этот ответ неправильный">0</span>
                        </div>`;
            answerParentBlock.insertAdjacentHTML('beforeend', hintHtml);
            this._domHintBlock = answerParentBlock.querySelector('.script-answers');
        }

        CreateApprovalButtons() {
            let buttonsCss = `
                  .approval-btn-group {
                    display: flex;
                    margin-right: 5px;
                    float: right;
                    clear: both;
                  }
                  .approval-span-btn {
                    font-size: 15px;
                  }
                  .approval-span-btn:hover {
                    cursor: pointer;
                  }
                  .que.multichoice .answer div.r0, .que.multichoice .answer div.r1 {
                    border-bottom: 1px solid #dee2e6 !important;
                  }
                  .que.truefalse .answer div.r0, .que.truefalse .answer div.r1 {
                    border-bottom: 1px solid #dee2e6 !important;
                  }
                `;

            GM_addStyle(buttonsCss);

            let inputElements = this._domHintBlock;

            let buttonsHtml = `
                <div class="approval-btn-group" ">
                    <span class="approval-span-btn" title="Я уверен(а), что этот ответ правильный">✔</span>
                    <span class="approval-span-btn" title="Я уверен(а), что этот ответ неправильный">❌</span>
                </div>
                `
            inputElements.insertAdjacentHTML('beforeend', buttonsHtml);
            let clickElements = inputElements.querySelectorAll('.approval-span-btn');

            for (const clickElement of clickElements) {
                let _this = this;
                clickElement.addEventListener('click', function () {


                    let message = {
                        answer: _this._callBackGetAnswer(),
                        question: _this._callBackGetQuestion(),
                        buttonValue: undefined
                    }

                    if (this.textContent === '✔') {
                        message.buttonValue = true;
                    } else if (this.textContent === '❌') {
                        message.buttonValue = false;
                    }

                    _this.callBackPressApprovalButton(message);
                })
            }
        }


        CreateHint() {
            this.CreateHintDomBlock();
            this.CreateApprovalButtons();
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
         * @class {Hint}
         */
        _protoHint;
        /**
         * @protected
         * @type Hint[]
         */
        _hints = [];
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
         * @protected
         * @type {HTMLDivElement}
         */
        _domHintViewersBlock;

        /**
         * @param {HTMLDivElement}domQuestionBlock
         * @param {HTMLDivElement}domAnswerBlock
         */
        constructor(domQuestionBlock, domAnswerBlock) {
            this._domQuestionBlock = domQuestionBlock;
            this._domAnswerBlock = domAnswerBlock;
            this.RegisterButtonListener();
        }

        /**
         * @return string
         */
        get Type() {
            return this._type;
        }

        /**
         * @return {NodeListOf<Element>}
         * @abstract
         */
        get OptionsAnswer() {

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
            text = this._domQuestionBlock.textContent;

            const imagesElements = this._domQuestionBlock.querySelectorAll('.qtext img');
            for (const imageElement of imagesElements) {
                let img = new Image(imageElement);
                let imgData = img.SHA256;
                if (imgData.length === 0) {
                    console.error('Image not loaded, perhaps the question will not be identified correctly.');
                }
                text += " img:" + imgData;
            }

            return text;
        }

        set ViewerCounter(viewerCounter) {
            if (this._domHintViewersBlock) {
                this._domHintViewersBlock.innerText = viewerCounter;
            }
        }

        /**
         * @abstract
         */
        set HintAnswers(answers) {

        }

        /**
         * @param {function}callback
         */
        set CallBackApprovalButton(callback) {
            for (const hint of this._hints) {
                hint.callBackPressApprovalButton = callback;
            }
        }

        /**
         * @abstract
         */
        GetAnswerByInput(inputElement) {

        }

        /**
         * @private
         */
        RegisterButtonListener() {
            let _this = this;

            for (const optionAnswer of this.OptionsAnswer) {

                optionAnswer.addEventListener('change', function () {
                    let newAnswerData = {
                        text: _this.TextQuestion,
                        type: _this.Type,
                        answers: _this.Answers,
                    }
                    if (_this.callBackAnswerChange) {
                        _this.callBackAnswerChange(newAnswerData);
                    }
                });
            }
        }

        /**
         * @private
         */
        CreateViewersInformation() {
            let answerParentBlock = this._domAnswerBlock.parentNode;
            let viewersHtml = '<div class="script-answer-viewers" style="color: red;' +
                ' padding-left: 5px; position: relative; background: rgb(0 0 0 / 6%);' +
                ' border-radius: 4px;">Просмотров со скриптом:' +
                ' <div class="script-answer-viewers-counter" style="display: contents;">??</div>' +
                '</div>';
            answerParentBlock.insertAdjacentHTML('beforeend', viewersHtml);
            this._domHintViewersBlock = answerParentBlock.querySelector('.script-answer-viewers-counter');
        }

        CreateHints() {
            if (this._protoHint === undefined) {
                console.warn('In answer proto hint not assigned');
                return;
            }
            for (const optionAnswer of this.OptionsAnswer) {
                /**
                 * @type {Hint}
                 */
                let hint = new this._protoHint(optionAnswer, () => {
                    return this.GetAnswerByInput(optionAnswer)
                }, () => {
                    return this.TextQuestion;
                });
                this._hints.push(hint);
            }

            for (const hint of this._hints) {
                hint.CreateHint();
            }

            this.CreateViewersInformation();
        }

        /**
         * @param {HTMLInputElement}checkBox
         * @return {string}
         */
        GetCheckBoxAnswer(checkBox) {
            return checkBox
                .parentElement.querySelector('.ml-1')
                .textContent.trim();
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
            this._protoHint = CheckBoxHint;
            this._type = 'multichoice';
        }

        get Answers() {
            let answerCheckboxOptions = this.OptionsAnswer;
            let answer;
            for (const answerCheckboxOption of answerCheckboxOptions) {
                if (answerCheckboxOption.checked) {
                    answer = this.GetCheckBoxAnswer(answerCheckboxOption);
                    break;
                }

            }
            return [answer];
        }

        get OptionsAnswer() {
            return this._domAnswerBlock.querySelectorAll('input[type=radio]');
        }

        set HintAnswers(answers) {
            let optionsAnswer = this.OptionsAnswer;
            for (let i = 0; i < optionsAnswer.length; i++) {
                this._hints[i].HintInfo = {
                    check: 0,
                    correct: 0,
                    notCorrect: 0
                };
                for (const userAnswer of answers) {
                    if (userAnswer['answer'] === this.GetAnswerByInput(optionsAnswer[i])) {
                        this._hints[i].HintInfo = {
                            check: userAnswer['users'].length,
                            correct: userAnswer['correct'].length,
                            notCorrect: userAnswer['not_correct'].length
                        };
                        break;
                    }
                }
            }
        }

        GetAnswerByInput(inputElement) {
            return this.GetCheckBoxAnswer(inputElement);
        }
    }

    /**
     * @extends Question
     */
    class MultiChoiceCheckBoxQuestion extends Question {

        /**
         * @param {HTMLDivElement}domQuestionBlock
         * @param {HTMLDivElement}domAnswerBlock
         */
        constructor(domQuestionBlock, domAnswerBlock) {
            super(domQuestionBlock, domAnswerBlock);
            this._protoHint = CheckBoxHint;
            this._type = 'multichoice_checkbox';
        }

        get Answers() {
            let answerCheckboxOptions = this.OptionsAnswer;
            let answers = [];
            for (const answerCheckboxOption of answerCheckboxOptions) {
                let answer = [this.GetCheckBoxAnswer(answerCheckboxOption), answerCheckboxOption.checked];
                answers.push(answer);
            }
            return answers;
        }

        get OptionsAnswer() {
            return this._domAnswerBlock.querySelectorAll('input[type=checkbox]');
        }

        set HintAnswers(answers) {
            let optionsAnswer = this.OptionsAnswer;
            for (let i = 0; i < optionsAnswer.length; i++) {
                this._hints[i].HintInfo = {
                    check: 0,
                    correct: 0,
                    notCorrect: 0
                };
                for (const userAnswer of answers) {
                    if (userAnswer['answer'] === this.GetAnswerByInput(optionsAnswer[i])) {
                        this._hints[i].HintInfo = {
                            check: userAnswer['users'].length,
                            correct: userAnswer['correct'].length,
                            notCorrect: userAnswer['not_correct'].length
                        };
                        break;
                    }
                }
            }
        }

        GetAnswerByInput(inputElement) {
            return this.GetCheckBoxAnswer(inputElement);
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
            this._protoHint = TextHint;
            this._type = 'shortanswer';
        }

        get Answers() {
            let answer = this.GetAnswerByInput(this._domAnswerBlock.querySelector('input'));
            if (answer === ''){
                return [];
            }
            return [answer];
        }

        get OptionsAnswer() {
            let optionAnswer = this._domAnswerBlock.querySelector('input');
            return [optionAnswer];
        }

        set HintAnswers(answers) {
            this._hints[0].HintInfo = answers;
        }

        GetAnswerByInput(inputElement) {
            return inputElement.value.trim();
        }
    }

    /**
     * @extends MultiChoiceQuestion
     */
    class TrueFalseQuestion extends MultiChoiceQuestion {

        /**
         * @param {HTMLDivElement}domQuestionBlock
         * @param {HTMLDivElement}domAnswerBlock
         */
        constructor(domQuestionBlock, domAnswerBlock) {
            super(domQuestionBlock, domAnswerBlock);
            this._type = 'truefalse';
        }

        /**
         * @override
         */
        get Answers() {
            let answerCheckboxOptions = this.OptionsAnswer;
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

        /**
         * @override
         */
        get OptionsAnswer() {
            return this._domAnswerBlock.querySelectorAll('input[type=radio]');
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
            this._protoHint = TextHint;
            this._type = 'numerical';
        }

        get Answers() {
            let answer = this.GetAnswerByInput(this._domAnswerBlock.querySelector('input'));
            if (answer === ''){
                return [];
            }
            return [answer];
        }

        get OptionsAnswer() {
            let optionAnswer = this._domAnswerBlock.querySelector('input');
            return [optionAnswer];
        }

        set HintAnswers(answers) {
            this._hints[0].HintInfo = answers;
        }

        GetAnswerByInput(inputElement) {
            return inputElement.value.trim();
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
            this._protoHint = TextHint;
            this._type = 'match';
        }

        get Answers() {
            /**
             * @type {NodeListOf<HTMLSelectElement>}
             */
            let optionsAnswer = this.OptionsAnswer;
            let answers = [];
            for (const optionAnswer of optionsAnswer) {
                let answer = [this.GetAnswerByInput(optionAnswer)];
                let selectedOption = optionAnswer.selectedOptions[0];
                if (selectedOption.index === 0) {
                    answer.push('none');
                } else {
                    answer.push(selectedOption.text);
                }
                answers.push(answer);
            }
            return answers;
        }

        get OptionsAnswer() {
            return this._domAnswerBlock.querySelectorAll('select');
        }

        set HintAnswers(answers) {

            let optionsAnswer = this.OptionsAnswer;
            for (let i = 0; i < optionsAnswer.length; i++) {
                let optionAnswers = []
                for (const userAnswer of answers) {
                    if (userAnswer['subquestion'] === this.GetAnswerByInput(optionsAnswer[i])) {
                        optionAnswers.push(userAnswer)
                    }
                }
                this._hints[i].HintInfo = optionAnswers;
            }
            
            for (const hint of this._hints) {
                for (const answer of answers) {
                    if (answer['subquestion'] === '') {
                        hint.HintInfo = [answer];
                    }
                }
            }
        }

        /**
         * @param {HTMLSelectElement}inputElement
         */
        GetAnswerByInput(inputElement) {
            return inputElement
                .parentElement.parentElement
                .querySelector('.text')
                .textContent.trim();

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
})(); // tampermonkey main function end
