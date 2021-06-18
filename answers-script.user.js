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