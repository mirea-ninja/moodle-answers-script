import Hint from './hint';

/**
 * @extends Hint
 */
export default class CheckBoxHint extends Hint {


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
                    <div class="script-answers" style="padding-left: 5px; position: relative; display: none; background: rgb(0 0 (0 / 6%)); border-radius: 4px; font-size: 15px; max-height: 25px;">
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

        // eslint-disable-next-line no-undef
        GM_addStyle(buttonsCss);

        let inputElements = this._domHintBlock;

        let buttonsHtml = `
            <div class="approval-btn-group" ">
                <span class="approval-span-btn" title="Я уверен(а), что этот ответ правильный">✔</span>
                <span class="approval-span-btn" title="Я уверен(а), что этот ответ неправильный">❌</span>
            </div>
            `;
        inputElements.insertAdjacentHTML('beforeend', buttonsHtml);
        let clickElements = inputElements.querySelectorAll('.approval-span-btn');

        for (const clickElement of clickElements) {
            let _this = this;
            clickElement.addEventListener('click', function () {


                let message = {
                    answer: _this._callBackGetAnswer(),
                    question: _this._callBackGetQuestion(),
                    buttonValue: undefined
                };

                if (this.textContent === '✔') {
                    message.buttonValue = true;
                } else if (this.textContent === '❌') {
                    message.buttonValue = false;
                }

                _this.callBackPressApprovalButton(message);
            });
        }
    }


    CreateHint() {
        this.CreateHintDomBlock();
        this.CreateApprovalButtons();
    }
}