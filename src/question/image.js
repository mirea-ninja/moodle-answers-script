export default class Image {
    /**
     * @protected
     * @type HTMLImageElement
     */
    _imgElement;

    /**
     * @param {HTMLImageElement} img
     * @constructor
     */
    constructor(img) {
        this._imgElement = img;
    }

    get CheckLoad() {
        return this._imgElement.complete;
    }

    get Base64() {
        if (!this.CheckLoad) {
            console.error('Image not loaded, failed to get Base64.');
            return '';
        }
        let canvas = document.createElement("canvas");
        canvas.width = this._imgElement.naturalWidth;
        canvas.height = this._imgElement.naturalHeight;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(this._imgElement, 0, 0);
        let dataURL = canvas.toDataURL("image/png");
        return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    }

    /**
     * @return {string}
     */
    get SHA256() {
        if (!this.CheckLoad) {
            console.error('Image not loaded, failed to get SHA256.');
            return '';
        }
        return CryptoJS.SHA256(this.Base64).toString();
    }
}