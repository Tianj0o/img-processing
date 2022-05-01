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
    }
    doJobs() {
        while (this.onloadlist.length) {
            const fn = this.onloadlist.shift();
            fn && fn();
        }
    }
}

export { Img };
