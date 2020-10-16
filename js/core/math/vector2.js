var math_utils_1 = require("./math-utils");
var Vector2 = (function () {
    function Vector2(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    Vector2.prototype.getLength = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    Vector2.getInterpValue3 = function (v1, v2, v3, a, b, c, dst) {
        if (dst === void 0) { dst = null; }
        if (dst == null) {
            dst = new Vector2();
        }
        dst.x = math_utils_1["default"].getInterpValue3(v1.x, v2.x, v3.x, a, b, c);
        dst.y = math_utils_1["default"].getInterpValue3(v2.y, v2.y, v3.y, a, b, c);
        return dst;
    };
    return Vector2;
})();
exports.Vector2 = Vector2;
//# sourceMappingURL=vector2.js.map