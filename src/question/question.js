import Image from "./image";

/**
 * @abstract
 */
export default class Question {

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
