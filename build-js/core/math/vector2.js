"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector2 = void 0;
const math_utils_1 = require("./math-utils");
class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    getLength() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    static getInterpValue3(v1, v2, v3, a, b, c, dst = null) {
        if (dst == null) {
            dst = new Vector2();
        }
        dst.x = math_utils_1.default.getInterpValue3(v1.x, v2.x, v3.x, a, b, c);
        dst.y = math_utils_1.default.getInterpValue3(v1.y, v2.y, v3.y, a, b, c);
        return dst;
    }
}
exports.Vector2 = Vector2;
