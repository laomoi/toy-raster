var math_utils_1 = require("./math-utils");
var Vector4 = (function () {
    function Vector4(x, y, z, w) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (z === void 0) { z = 0; }
        if (w === void 0) { w = 1; }
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    Vector4.prototype.getLength = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    };
    Vector4.prototype.reverse = function (dst) {
        if (dst === void 0) { dst = null; }
        if (dst == null) {
            dst = new Vector4();
        }
        dst.x = -this.x;
        dst.y = -this.y;
        dst.z = -this.z;
        return dst;
    };
    Vector4.prototype.add = function (t, dst) {
        if (dst === void 0) { dst = null; }
        if (dst == null) {
            dst = new Vector4();
        }
        dst.x = this.x + t.x;
        dst.y = this.y + t.y;
        dst.z = this.z + t.z;
        dst.w = 1.0;
        return dst;
    };
    Vector4.prototype.sub = function (t, dst) {
        if (dst === void 0) { dst = null; }
        if (dst == null) {
            dst = new Vector4();
        }
        dst.x = this.x - t.x;
        dst.y = this.y - t.y;
        dst.z = this.z - t.z;
        dst.w = 1.0;
        return dst;
    };
    Vector4.prototype.dot = function (t) {
        return this.x * t.x + this.y * t.y + this.z * t.z;
    };
    Vector4.prototype.cross = function (t, dst) {
        if (dst === void 0) { dst = null; }
        if (dst == null) {
            dst = new Vector4();
        }
        var x = this.y * t.z - this.z * t.y;
        var y = this.z * t.x - this.x * t.z;
        var z = this.x * t.y - this.y * t.x;
        dst.x = x;
        dst.y = y;
        dst.z = z;
        dst.w = 1.0;
        return dst;
    };
    Vector4.prototype.normalize = function (dst) {
        if (dst === void 0) { dst = null; }
        if (dst == null) {
            dst = new Vector4();
        }
        var len = this.getLength();
        if (len > 0) {
            dst.x = this.x / len;
            dst.y = this.y / len;
            dst.z = this.z / len;
        }
        return dst;
    };
    Vector4.prototype.transform = function (matrix, dst) {
        if (dst === void 0) { dst = null; }
        if (dst == null) {
            dst = new Vector4();
        }
        var x = this.x, y = this.y, z = this.z, w = this.w;
        var m = matrix.m;
        dst.x = m[0][0] * x + m[1][0] * y + m[2][0] * z + m[3][0] * w;
        dst.y = m[0][1] * x + m[1][1] * y + m[2][1] * z + m[3][1] * w;
        dst.z = m[0][2] * x + m[1][2] * y + m[2][2] * z + m[3][2] * w;
        dst.w = m[0][3] * x + m[1][3] * y + m[2][3] * z + m[3][3] * w;
        return dst;
    };
    Vector4.prototype.homogenenize = function () {
        if (this.w != 0) {
            this.x /= this.w;
            this.y /= this.w;
            this.z /= this.w;
            this.w = 1;
        }
    };
    Vector4.getInterpValue3 = function (v1, v2, v3, a, b, c, dst) {
        if (dst === void 0) { dst = null; }
        if (dst == null) {
            dst = new Vector4();
        }
        dst.x = math_utils_1["default"].getInterpValue3(v1.x, v2.x, v3.x, a, b, c);
        dst.y = math_utils_1["default"].getInterpValue3(v1.y, v2.y, v3.y, a, b, c);
        dst.z = math_utils_1["default"].getInterpValue3(v1.z, v2.z, v3.z, a, b, c);
        return dst;
    };
    return Vector4;
})();
exports.Vector4 = Vector4;
//# sourceMappingURL=vector4.js.map