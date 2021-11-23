import Question from "./question";
import TextHint from "./hint/text-hint";

/**
 * @extends Question
 */
export default class MatchQuestion extends Question {

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
