export default class Client {
    /**
     * @param {string}url
     * @param {User}user
     * @param {string}room
     */

    /**
     * @public
     * @callback
        * @param {[{userInfo: string, text: string, user: string}]} messages
     */
    callBackNewMessageReceived;

    callBackArrayUpdateAnswersInformation = [];

    callBackArrayUpdateViewersCounter = [];

    constructor(url, user, room) {
        this._socket = io(url, {transports: ['websocket', 'polling', 'flashsocket']});

        /**
         * @private
         * @type User
         */
        this._user = user;
        this._room = room;
    }

    /**
     * @param {Question[]}questions
     */
    RegisterConnectListenerAndSendQuestionData(questions) {
        this._socket.on('connect', () => {
            this._socket.emit('join', this._room);

            let textQuestions = [];
            for (const question of questions) {
                textQuestions.push(question.TextQuestion);
            }
            // отправка запроса для счётчика просмотров и создания нового вопроса
            this._socket.emit('view_question', {
                'data': {
                    'questions': textQuestions,
                    'user_info': this._user.UserId,
                    'room': this._room
                }
            });
            // получаем сообщения чата
            this._socket.emit('get_chat', this._room);
            // отправляем текущие ответы на сервер
            this.UpdateAnswersOnDocumentReady(questions);
        });
    }

    RegisterUpdateViewersListener() {
        // событие вызывается при обновлении счётчика просмотров у вопроса
        this._socket.on('update_viewers', (questionsInfo) => {
            if (questionsInfo === undefined) {
                return;
            }
            for (const callBackUpdateViewersCounter of this.callBackArrayUpdateViewersCounter) {
                for (let i = 0; i < questionsInfo['data'].length; i++) {
                    let questionViewerInfo = {
                        question: questionsInfo['data'][i]['question'],
                        viewers: questionsInfo['data'][i]['viewers'].length
                    }
                    callBackUpdateViewersCounter(questionViewerInfo);
                }
            }
        });
    }

    RegisterUpdateAnswersListener() {
        // событие вызывается при обновлении каких-то ответов на сервере
        this._socket.on('update_answers', (allQuestionInfo) => {
            if (allQuestionInfo === undefined) {
                return;
            }
            for (const callBackUpdateAnswersInformation of this.callBackArrayUpdateAnswersInformation) {
                let questionInfo = {
                    question: allQuestionInfo['question'],
                    answers: allQuestionInfo['answers']
                };
                callBackUpdateAnswersInformation(questionInfo);
            }
        });
    }

    SendNewApprovalAnswers(message) {
        this._socket.emit('add_approve', {
            'user_info': this._user.UserId,
            'question': message['question'],
            'is_correct': message['buttonValue'],
            'answer': message['answer'],
            'room': this._room
        });
    }

    GetUserTypeByUserId(userId) {
        if (this._user.UserId === userId) {
            return 'our';
        } else {
            return 'other';
        }
    }


    RegisterAddChatMessagesListener(question) {
        // событие вызывается при получении нового сообщения в чате

        this._socket.on('add_chat_messages', (messages) => {
            if (messages === undefined) {
                return;
            }
            let processedMessages = [];

            for (const message of messages) {
                processedMessages.push(
                    {
                        text: message['text'],
                        senderType: this.GetUserTypeByUserId(message['user_info']),
                        userName: message['user']
                    }
                );
            }

            this.callBackNewMessageReceived(processedMessages);
        });
    }

    SendChatMessage(message) {
        this._socket.emit('chat', {
            'room': this._room,
            'message': {
                'user': this._user.UserName,
                'user_info': this._user.UserId,
                'text': message.text
            }
        });
    }

    /**
     * @param {{answers: *[], text: string, type: string}}newAnswerData
     */
    SendNewAnswerToQuestion(newAnswerData) {
        for (const answer of newAnswerData['answers']) {
            this._socket.emit('add_answer', {
                'user_info': this._user.UserId,
                'question': newAnswerData['text'],
                'question_type': newAnswerData['type'],
                'answer': answer,
                'room': this._room
            });
        }
    }

    /**
     * @param {Question[]}questions
     */
    UpdateAnswersOnDocumentReady(questions) {
        for (const question of questions) {
            const text = question.TextQuestion;
            const type = question.Type;
            const answers = question.Answers;
            for (const answer of answers) {
                this._socket.emit('add_answer', {
                    'user_info': this._user.UserId,
                    'question': text,
                    'question_type': type,
                    'answer': answer,
                    'room': this._room
                });
            }
        }
    }

}