class Img {
  aspectRation: number = 0;
  img: HTMLImageElement;
  canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null;
  onloadlist: Function[] = [];
  isLoad = false;
  constructor(url: string) {
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

  show(container: HTMLElement, width?: number, height?: number) {
    let h = height || 0;
    let w = width || 0;
    container.appendChild(this.canvas);
    this.onloadlist.push(() => {
      if (!h && !w) {
        console.error(
          `Neither width nor height is provided, a minimum of one is provided`
        );
        return;
      } else {
        if (h) {
          w = h * this.aspectRation;
        } else if (w) {
          h = w / this.aspectRation;
        }
      }
      this.canvas.height = h;
      this.canvas.width = w;
      this.canvas.style.height = h + "px";
      this.canvas.style.width = w + "px";
      this.ctx?.drawImage(this.img, 0, 0, w, h);
    });
    if (this.isLoad) {
      this.doJobs();
    }
    return this
  }
  toGray() {
    this.draw((imgData) => {
      const rgbData = imgData?.data
      if (rgbData) {
        for (let i = 0; i < rgbData.length; i += 4) {
          let gray = 0.299 * rgbData[i] + 0.587 * rgbData[i + 1] + 0.114 * rgbData[i + 2];
          rgbData[i] = gray;
          rgbData[i + 1] = gray;
          rgbData[i + 2] = gray;
        }
      }
    })
    return this
  }
  toInvert() {
    this.draw((imgData) => {
      const rgbData = imgData?.data
      if (rgbData) {
        for (let i = 0; i < rgbData.length; i += 4) {
          rgbData[i] = 255 - rgbData[i];
          rgbData[i + 1] = 255 - rgbData[i + 1];
          rgbData[i + 2] = 255 - rgbData[i + 2];
        }
      }
    })
    return this
  }

  private draw(callback: (imgData: ImageData) => void) {
    this.onloadlist.push(() => {
      const imgData = this.ctx?.getImageData(0, 0, this.canvas.width, this.canvas.height);

      if (imgData) {
        callback(imgData)
        this.ctx?.putImageData(imgData, 0, 0)
      }
    })
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
