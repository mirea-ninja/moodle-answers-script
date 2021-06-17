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
        constructor() {
            this._userId = undefined;
        }

        get UserId() {
            if (!this._userId){
                console.error('User Id not set.');
            }
            return this._userId;
        }

        set UserId(newId) {
            this._userId = newId;
        }

    }

})(); // tampermonkey main function end