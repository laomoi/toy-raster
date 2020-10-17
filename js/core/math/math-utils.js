var MathUtils = (function () {
    function MathUtils() {
    }
    MathUtils.getInterpValue2 = function (v1, v2, a, b) {
        return v1 * a + v2 * b;
    };
    MathUtils.getInterpValue3 = function (v1, v2, v3, a, b, c) {
        return v1 * a + v2 * b + v3 * c;
    };
    MathUtils.getInterpValue4 = function (v1, v2, v3, v4, a, b, c, d) {
        return v1 * a + v2 * b + v3 * c + v4 * d;
    };
    MathUtils.clamp = function (value, min, max) {
        if (value < min) {
            return min;
        }
        if (value > max) {
            return max;
        }
        return value;
    };
    MathUtils.saturate = function (value) {
        return MathUtils.clamp(value, 0, 1);
    };
    return MathUtils;
})();
exports["default"] = MathUtils;
//# sourceMappingURL=math-utils.js.map