var Vector = (function () {
    function Vector(x, y, z, w) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (z === void 0) { z = 0; }
        if (w === void 0) { w = 1; }
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    Vector.prototype.getLength = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    };
    Vector.prototype.reverse = function (dst) {
        if (dst === void 0) { dst = null; }
        if (dst == null) {
            dst = new Vector();
        }
        dst.x = -this.x;
        dst.y = -this.y;
        dst.z = -this.z;
        return dst;
    };
    Vector.prototype.add = function (t, dst) {
        if (dst === void 0) { dst = null; }
        if (dst == null) {
            dst = new Vector();
        }
        dst.x = this.x + t.x;
        dst.y = this.y + t.y;
        dst.z = this.z + t.z;
        dst.w = 1.0;
        return dst;
    };
    Vector.prototype.sub = function (t, dst) {
        if (dst === void 0) { dst = null; }
        if (dst == null) {
            dst = new Vector();
        }
        dst.x = this.x - t.x;
        dst.y = this.y - t.y;
        dst.z = this.z - t.z;
        dst.w = 1.0;
        return dst;
    };
    Vector.prototype.dot = function (t) {
        return this.x * t.x + this.y * t.y + this.z * t.z;
    };
    Vector.prototype.cross = function (t, dst) {
        if (dst === void 0) { dst = null; }
        if (dst == null) {
            dst = new Vector();
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
    Vector.prototype.normalize = function (dst) {
        if (dst === void 0) { dst = null; }
        if (dst == null) {
            dst = new Vector();
        }
        var len = this.getLength();
        if (len > 0) {
            dst.x = this.x / len;
            dst.y = this.y / len;
            dst.z = this.z / len;
        }
        return dst;
    };
    Vector.prototype.transform = function (matrix, dst) {
        if (dst === void 0) { dst = null; }
        if (dst == null) {
            dst = new Vector();
        }
        var x = this.x, y = this.y, z = this.z, w = this.w;
        var m = matrix.m;
        dst.x = m[0][0] * x + m[1][0] * y + m[2][0] * z + m[3][0] * w;
        dst.y = m[0][1] * x + m[1][1] * y + m[2][1] * z + m[3][1] * w;
        dst.z = m[0][2] * x + m[1][2] * y + m[2][2] * z + m[3][2] * w;
        dst.w = m[0][3] * x + m[1][3] * y + m[2][3] * z + m[3][3] * w;
        return dst;
    };
    Vector.prototype.homogenenize = function () {
        if (this.w != 0) {
            this.x /= this.w;
            this.y /= this.w;
            this.z /= this.w;
            this.w = 1;
        }
    };
    return Vector;
})();
exports.Vector = Vector;
//# sourceMappingURL=vector.js.map