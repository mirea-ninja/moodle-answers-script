import Hint from "./hint";

/**
 * @extends Hint
 */
export default class TextHint extends Hint {


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