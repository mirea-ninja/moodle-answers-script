export default class Hint {

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