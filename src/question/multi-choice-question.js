import Question from './question';
import CheckBoxHint from './hint/check-box-hint';

/**
 * @extends Question
 */
export default class MultiChoiceQuestion extends Question {

    /**
     * @param {HTMLDivElement}domQuestionBlock
     * @param {HTMLDivElement}domAnswerBlock
     */
    constructor(domQuestionBlock, domAnswerBlock) {
        super(domQuestionBlock, domAnswerBlock);
        this._protoHint = CheckBoxHint;
        this._type = 'multichoice';
    }

    get Answers() {
        let answerCheckboxOptions = this.OptionsAnswer;
        let answer;
        for (const answerCheckboxOption of answerCheckboxOptions) {
            if (answerCheckboxOption.checked) {
                answer = this.GetCheckBoxAnswer(answerCheckboxOption);
                break;
            }

        }
        return [answer];
    }

    get OptionsAnswer() {
        return this._domAnswerBlock.querySelectorAll('input[type=radio]');
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
