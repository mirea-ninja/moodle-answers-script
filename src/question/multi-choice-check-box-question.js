import Question from './question';
import CheckBoxHint from './hint/check-box-hint';

/**
 * @extends Question
 */
export default class MultiChoiceCheckBoxQuestion extends Question {

    /**
     * @param {HTMLDivElement}domQuestionBlock
     * @param {HTMLDivElement}domAnswerBlock
     */
    constructor(domQuestionBlock, domAnswerBlock) {
        super(domQuestionBlock, domAnswerBlock);
        this._protoHint = CheckBoxHint;
        this._type = 'multichoice_checkbox';
    }

    get Answers() {
        let answerCheckboxOptions = this.OptionsAnswer;
        let answers = [];
        for (const answerCheckboxOption of answerCheckboxOptions) {
            let answer = [this.GetCheckBoxAnswer(answerCheckboxOption), answerCheckboxOption.checked];
            answers.push(answer);
        }
        return answers;
    }

    get OptionsAnswer() {
        return this._domAnswerBlock.querySelectorAll('input[type=checkbox]');
    }

    set HintAnswers(answers) {
        let optionsAnswer = this.OptionsAnswer;
        for (let i = 0; i < optionsAnswer.length; i++) {
            this._hints[i].HintInfo = {
                check: 0,
                correct: 0,
                notCorrect: 0
            };
            for (const userAnswer of answers) {
                if (userAnswer['answer'] === this.GetAnswerByInput(optionsAnswer[i])) {
                    this._hints[i].HintInfo = {
                        check: userAnswer['users'].length,
                        correct: userAnswer['correct'].length,
                        notCorrect: userAnswer['not_correct'].length
                    };
                    break;
                }
            }
        }
    }

    GetAnswerByInput(inputElement) {
        return this.GetCheckBoxAnswer(inputElement);
    }
}
