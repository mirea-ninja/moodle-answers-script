export default class Chat {

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
                }`;

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
        // eslint-disable-next-line no-undef
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