import Question from './question';
import TextHint from './hint/text-hint';

/**
 * @extends Question
 */
export default class ShortAnswerQuestion extends Question {

    /**
     * @param {HTMLDivElement}domQuestionBlock
     * @param {HTMLDivElement}domAnswerBlock
     */
    constructor(domQuestionBlock, domAnswerBlock) {
        super(domQuestionBlock, domAnswerBlock);
        this._protoHint = TextHint;
        this._type = 'shortanswer';
    }

    get Answers() {
        let answer = this.GetAnswerByInput(this._domAnswerBlock.querySelector('input'));
        if (answer === '') {
            return [];
        }
        return [answer];
    }

    get OptionsAnswer() {
        let optionAnswer = this._domAnswerBlock.querySelector('input');
        return [optionAnswer];
    }

    set HintAnswers(answers) {
        this._hints[0].HintInfo = answers;
    }

    GetAnswerByInput(inputElement) {
        return inputElement.value.trim();
    }
}
