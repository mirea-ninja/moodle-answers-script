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
        constructor() {

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
        }

        CreateChat() {

        };
    }
    }

    let user = new User();

    document.addEventListener("DOMContentLoaded", OnDOMReady);

    function OnWindowLoad() {

    }

    function OnDOMReady() {

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