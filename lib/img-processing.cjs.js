'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

class Img {
    constructor(url) {
        this.aspectRation = 0;
        this.onloadlist = [];
        this.isLoad = false;
        this.img = document.createElement("img");
        this.img.src = url;
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.onloadlist.push(() => {
            this.aspectRation = this.img.width / this.img.height;
        });
        this.img.onload = () => {
            this.isLoad = true;
            this.doJobs();
        };
    }
    show(container, width, height) {
        let h = height || 0;
        let w = width || 0;
        container.appendChild(this.canvas);
        this.onloadlist.push(() => {
            var _a;
            if (!h && !w) {
                console.error(`Neither width nor height is provided, a minimum of one is provided`);
                return;
            }
            else {
                if (h) {
                    w = h * this.aspectRation;
                }
                else if (w) {
                    h = w / this.aspectRation;
                }
            }
            this.canvas.height = h;
            this.canvas.width = w;
            this.canvas.style.height = h + "px";
            this.canvas.style.width = w + "px";
            (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.drawImage(this.img, 0, 0, w, h);
        });
        if (this.isLoad) {
            this.doJobs();
        }
        return this;
    }
    toGray() {
        this.draw((imgData) => {
            const rgbData = imgData === null || imgData === void 0 ? void 0 : imgData.data;
            if (rgbData) {
                for (let i = 0; i < rgbData.length; i += 4) {
                    let gray = 0.299 * rgbData[i] + 0.587 * rgbData[i + 1] + 0.114 * rgbData[i + 2];
                    rgbData[i] = gray;
                    rgbData[i + 1] = gray;
                    rgbData[i + 2] = gray;
                }
            }
        });
        return this;
    }
    toInvert() {
        this.draw((imgData) => {
            const rgbData = imgData === null || imgData === void 0 ? void 0 : imgData.data;
            if (rgbData) {
                for (let i = 0; i < rgbData.length; i += 4) {
                    rgbData[i] = 255 - rgbData[i];
                    rgbData[i + 1] = 255 - rgbData[i + 1];
                    rgbData[i + 2] = 255 - rgbData[i + 2];
                }
            }
        });
        return this;
    }
    draw(callback) {
        this.onloadlist.push(() => {
            var _a, _b;
            const imgData = (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.getImageData(0, 0, this.canvas.width, this.canvas.height);
            if (imgData) {
                callback(imgData);
                (_b = this.ctx) === null || _b === void 0 ? void 0 : _b.putImageData(imgData, 0, 0);
            }
        });
        if (this.isLoad) {
            this.doJobs();
        }
    }
    doJobs() {
        while (this.onloadlist.length) {
            const fn = this.onloadlist.shift();
            fn && fn();
        }
    }
}

exports.Img = Img;
