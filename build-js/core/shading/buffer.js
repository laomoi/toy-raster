"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const color_1 = require("./color");
class Buffer {
    constructor(width, height, usingMSAA) {
        this.usingMSAA = true;
        this.zbuf = null;
        this.msaaColorBuffer = null;
        this.usingMSAA = usingMSAA;
        this.width = width;
        this.height = height;
        this.frameBuffer = new Uint8Array(width * height * 4);
        if (!this.usingMSAA) {
            this.zbuf = new Float32Array(width * height);
        }
        else {
            this.zbuf = new Float32Array(width * height * 4);
            this.msaaColorBuffer = new Uint8Array(width * height * 4 * 4);
        }
    }
    getZPos(x, y, index) {
        if (!this.usingMSAA) {
            return this.width * y + x;
        }
        else {
            return (this.width * y + x) * 4 + index;
        }
    }
    ztest(x, y, rhw, index = 0) {
        let zPos = this.getZPos(x, y, index);
        if (isNaN(this.zbuf[zPos]) || this.zbuf[zPos] > rhw) {
            return true;
        }
        return false;
    }
    setZ(x, y, rhw, index = 0) {
        let zPos = this.getZPos(x, y, index);
        this.zbuf[zPos] = rhw;
    }
    setColor(x, y, color, index = 0) {
        if (!this.usingMSAA) {
            this.setFrameBufferPixel(x, y, color);
        }
        else {
            let pstart = (this.width * y + x) * 4 * 4 + index * 4;
            this.msaaColorBuffer[pstart] = color.r;
            this.msaaColorBuffer[pstart + 1] = color.g;
            this.msaaColorBuffer[pstart + 2] = color.b;
            this.msaaColorBuffer[pstart + 3] = color.a;
        }
    }
    setFrameBufferPixel(x, y, color) {
        let pstart = (this.width * y + x) * 4;
        this.frameBuffer[pstart] = color.r;
        this.frameBuffer[pstart + 1] = color.g;
        this.frameBuffer[pstart + 2] = color.b;
        this.frameBuffer[pstart + 3] = 255;
    }
    clear(backgroundColor) {
        for (let l = 0; l < this.frameBuffer.length; l += 4) {
            this.frameBuffer[l] = backgroundColor.r;
            this.frameBuffer[l + 1] = backgroundColor.g;
            this.frameBuffer[l + 2] = backgroundColor.b;
            this.frameBuffer[l + 3] = backgroundColor.a;
        }
        for (let l = 0; l < this.zbuf.length; l++) {
            this.zbuf[l] = NaN;
        }
        if (this.msaaColorBuffer != null) {
            for (let l = 0; l < this.msaaColorBuffer.length; l += 4) {
                this.msaaColorBuffer[l] = backgroundColor.r;
                this.msaaColorBuffer[l + 1] = backgroundColor.g;
                this.msaaColorBuffer[l + 2] = backgroundColor.b;
                this.msaaColorBuffer[l + 3] = backgroundColor.a;
            }
        }
    }
    applyMSAAFilter(x, y) {
        if (this.msaaColorBuffer == null) {
            return;
        }
        let pstart = (this.width * y + x) * 4 * 4;
        let color = new color_1.Color();
        for (let i = 0; i < 4; i++) {
            let colorStart = pstart + i * 4;
            let r = this.msaaColorBuffer[colorStart];
            let g = this.msaaColorBuffer[colorStart + 1];
            let b = this.msaaColorBuffer[colorStart + 2];
            let a = this.msaaColorBuffer[colorStart + 3];
            color.r += 0.25 * r;
            color.g += 0.25 * g;
            color.b += 0.25 * b;
            color.a += 0.25 * a;
        }
        this.setFrameBufferPixel(x, y, color);
    }
}
exports.default = Buffer;
