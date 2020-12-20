"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Color = void 0;
const math_utils_1 = require("../math/math-utils");
class Color {
    constructor(r = 0, g = 0, b = 0, a = 0) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    set(color) {
        this.r = color.r;
        this.g = color.g;
        this.b = color.b;
        this.a = color.a;
        return this;
    }
    clone() {
        return new Color(this.r, this.g, this.b, this.a);
    }
    add(value) {
        this.r += value;
        this.g += value;
        this.b += value;
        this.a += value;
        this.clamp(0, 255);
        return this;
    }
    addRGB(color) {
        this.r += color.r;
        this.g += color.g;
        this.b += color.b;
        this.clamp(0, 255);
        return this;
    }
    multiplyRGB(factor) {
        this.r *= factor;
        this.g *= factor;
        this.b *= factor;
        this.clamp(0, 255);
        return this;
    }
    clamp(min, max) {
        this.r = math_utils_1.default.clamp(this.r, min, max);
        this.g = math_utils_1.default.clamp(this.g, min, max);
        this.b = math_utils_1.default.clamp(this.b, min, max);
        this.a = math_utils_1.default.clamp(this.a, min, max);
    }
    static getInterpColor(color1, color2, color3, a, b, c, dstColor) {
        dstColor.r = math_utils_1.default.getInterpValue3(color1.r, color2.r, color3.r, a, b, c);
        dstColor.g = math_utils_1.default.getInterpValue3(color1.g, color2.g, color3.g, a, b, c);
        dstColor.b = math_utils_1.default.getInterpValue3(color1.b, color2.b, color3.b, a, b, c);
        dstColor.a = math_utils_1.default.getInterpValue3(color1.a, color2.a, color3.a, a, b, c);
    }
    static getBilinearColor(c1, c2, c3, c4, w1, w2, w3, w4, dstColor) {
        dstColor.r = math_utils_1.default.getInterpValue4(c1.r, c2.r, c3.r, c4.r, w1, w2, w3, w4);
        dstColor.g = math_utils_1.default.getInterpValue4(c1.g, c2.g, c3.g, c4.g, w1, w2, w3, w4);
        dstColor.b = math_utils_1.default.getInterpValue4(c1.b, c2.b, c3.b, c4.b, w1, w2, w3, w4);
        dstColor.a = math_utils_1.default.getInterpValue4(c1.a, c2.a, c3.a, c4.a, w1, w2, w3, w4);
    }
    static multiplyColor(color1, color2, dst) {
        dst.r = color1.r * color2.r / 255;
        dst.g = color1.g * color2.g / 255;
        dst.b = color1.b * color2.b / 255;
        dst.a = color1.a * color2.a / 255;
        return dst;
    }
}
exports.Color = Color;
Color.BLACK = new Color(0, 0, 0, 255);
Color.WHITE = new Color(255, 255, 255, 255);
Color.RED = new Color(255, 0, 0, 255);
Color.BLUE = new Color(0, 0, 255, 255);
Color.GREEN = new Color(0, 255, 255, 255);
Color.YELLOW = new Color(255, 255, 0, 255);
Color.GRAY = new Color(100, 100, 100, 255);
