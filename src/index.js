import App from './app';

let app;

document.addEventListener('DOMContentLoaded', OnDOMReady);

function OnDOMReady() {
    app = new App();
    app.SearchQuestions();

    if (app.Questions.length === 0) {
        app = null;
    } else {
        // eslint-disable-next-line no-undef
        FingerprintJS.load()
            .then(fp => fp.get())
            .then(result => {
                app.UserId = result.visitorId;
                switch (document.readyState) {
                case 'loading':
                case 'interactive':
                    window.addEventListener('load', app.Start);
                    break;
                case 'complete':
                    app.Start();
                    break;
                }
            });
    }

}