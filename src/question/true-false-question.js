import MultiChoiceQuestion from "./multi-choice-question";

/**
 * @extends MultiChoiceQuestion
 */
export default class TrueFalseQuestion extends MultiChoiceQuestion {

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
