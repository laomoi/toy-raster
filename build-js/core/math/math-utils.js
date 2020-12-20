"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MathUtils {
    static getInterpValue2(v1, v2, a, b) {
        return v1 * a + v2 * b;
    }
    static getInterpValue3(v1, v2, v3, a, b, c) {
        return v1 * a + v2 * b + v3 * c;
    }
    static getInterpValue4(v1, v2, v3, v4, a, b, c, d) {
        return v1 * a + v2 * b + v3 * c + v4 * d;
    }
    static clamp(value, min, max) {
        if (value < min) {
            return min;
        }
        if (value > max) {
            return max;
        }
        return value;
    }
    static saturate(value) {
        return MathUtils.clamp(value, 0, 1);
    }
}
exports.default = MathUtils;
