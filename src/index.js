import App from './app';

/**
 * Create keyboard hotkeys
 * @param {Array} shortcut 
 * @param {Function} handler 
 */
HTMLElement.prototype.onshortcut = function(shortcut, handler) {
    var currentKeys = [];
    
    function reset() {
        currentKeys = [];
    }

    function shortcutMatches() {
        currentKeys.sort();
        shortcut.sort();

        return (
            JSON.stringify(currentKeys) ==
            JSON.stringify(shortcut)
        );
    }

    this.onkeydown = function(ev) {
        currentKeys.push(ev.key);

        if (shortcutMatches()) {
            ev.preventDefault();
            reset();
            handler(this);
        }

    };

    this.onkeyup = reset;
};


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
                    window.addEventListener('load', function () {
                        app.Start();
                    });
                    break;
                case 'complete':
                    app.Start();
                    break;
                }
            });
    }

}