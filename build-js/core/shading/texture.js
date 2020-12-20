"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEXTURE_FILTER_MODE = void 0;
const vector4_1 = require("../math/vector4");
const color_1 = require("./color");
const fs = require("fs");
const path = require("path");
let decode = require('image-decode');
var TEXTURE_FILTER_MODE;
(function (TEXTURE_FILTER_MODE) {
    TEXTURE_FILTER_MODE[TEXTURE_FILTER_MODE["NEAREST"] = 1] = "NEAREST";
    TEXTURE_FILTER_MODE[TEXTURE_FILTER_MODE["BILINEAR"] = 2] = "BILINEAR";
})(TEXTURE_FILTER_MODE = exports.TEXTURE_FILTER_MODE || (exports.TEXTURE_FILTER_MODE = {}));
class Texture {
    constructor(width, height) {
        this.data = [];
        this.tmp = new color_1.Color();
        this.filterMode = TEXTURE_FILTER_MODE.BILINEAR;
        this.width = width;
        this.height = height;
    }
    static createTextureFromFile(file) {
        let { data, width, height } = decode(fs.readFileSync(path.join(__dirname, "../../../res/" + file)));
        let texture = new Texture(width, height);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let pos = ((height - y - 1) * width + x) * 4;
                let color = new color_1.Color(data[pos], data[pos + 1], data[pos + 2], data[pos + 3]);
                texture.setPixel(x, y, color);
            }
        }
        return texture;
    }
    setPixel(x, y, color) {
        let pos = y * this.width + x;
        this.data[pos] = color;
    }
    sample(uv) {
        let x = uv.x * (this.width - 1);
        let y = uv.y * (this.height - 1);
        return this.samplePos(x + 0.5, y + 0.5);
    }
    sampleAsVector(uv) {
        let color = this.sample(uv);
        return new vector4_1.Vector4((color.r / 255) * 2 - 1, (color.g / 255) * 2 - 1, (color.b / 255) * 2 - 1, (color.a / 255) * 2 - 1);
    }
    clamp(value, min, max) {
        if (value > max) {
            return max;
        }
        if (value < min) {
            return min;
        }
        return value;
    }
    getPixel(x, y) {
        return this.data[y * this.width + x];
    }
    samplePos(x, y) {
        if (this.filterMode == TEXTURE_FILTER_MODE.NEAREST) {
            x = this.clamp(Math.floor(x), 0, this.width - 1);
            y = this.clamp(Math.floor(y), 0, this.height - 1);
            let color = this.getPixel(x, y);
            this.tmp.a = color.a;
            this.tmp.r = color.r;
            this.tmp.g = color.g;
            this.tmp.b = color.b;
            return this.tmp;
        }
        else if (this.filterMode == TEXTURE_FILTER_MODE.BILINEAR) {
            let x1 = this.clamp(Math.floor(x), 0, this.width - 1);
            let y1 = this.clamp(Math.floor(y), 0, this.height - 1);
            let x2 = this.clamp(Math.floor(x) + 1, 0, this.width - 1);
            let y2 = this.clamp(Math.floor(y) + 1, 0, this.height - 1);
            let c1 = this.getPixel(x1, y1);
            let c2 = this.getPixel(x2, y1);
            let c3 = this.getPixel(x1, y2);
            let c4 = this.getPixel(x2, y2);
            let dx = x - x1;
            let dy = y - y1;
            let w1 = (1 - dx) * (1 - dy);
            let w2 = dx * (1 - dy);
            let w3 = (1 - dx) * dy;
            let w4 = dx * dy;
            color_1.Color.getBilinearColor(c1, c2, c3, c4, w1, w2, w3, w4, this.tmp);
            return this.tmp;
        }
        return color_1.Color.BLACK;
    }
}
exports.default = Texture;
