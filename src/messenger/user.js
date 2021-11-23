export default class User {

    listName = ['Крофос',
        'Соми',
        'Афионаполис',
        'Костолом',
        'Райнор',
        'Фэктори',
        'Фокос',
        'Чармондер',
        'Самордер',
        'Рока',
        'Зонт',
        'Кустик',
        'Хромус',
        'Харивер',
        'Шильма',
        'Нискофор',
        'Разор',
        'Миру',
        'Кросун',
        'Сивилиус',
        'Протон',
        'Слардар',
        'Дум'];

    /**
     * @private
     * @type {string}
     */
    _userId = undefined;

    /**
     * @return string
     */
    get UserId() {
        if (!this._userId) {
            console.error('User Id not set.');
        }
        return this._userId;
    }

    set UserId(newId) {
        this._userId = newId;
    }

    get UserName() {
        let codeLastSymbolUserId = this._userId.charCodeAt(this.UserId.length - 1);
        return (this.listName)[codeLastSymbolUserId % (this.listName.length - 1)];
    }
}
