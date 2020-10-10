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
var Matrix = (function () {
    function Matrix() {
        this.m = [];
        for (var i = 0; i < 4; i++) {
            var col = new Float32Array(4);
            this.m.push(col);
        }
        this.identify();
    }
    Matrix.prototype.identify = function () {
        this.setValue(0);
        this.m[0][0] = this.m[1][1] = this.m[2][2] = this.m[3][3] = 1;
    };
    Matrix.prototype.multiply = function (t, dst) {
        if (dst === void 0) { dst = null; }
        if (dst == null) {
            dst = new Matrix();
        }
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                dst.m[j][i] =
                    this.m[j][0] * t.m[0][i]
                        + this.m[j][1] * t.m[1][i]
                        + this.m[j][2] * t.m[2][i]
                        + this.m[j][3] * t.m[3][i];
            }
        }
        return dst;
    };
    Matrix.prototype.setValue = function (val) {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                this.m[j][i] = val;
            }
        }
    };
    Matrix.prototype.setPerspective = function (fovy, aspect, near, far) {
        this.setValue(0);
        var n = -near;
        var f = -far;
        var tn = -Math.tan(fovy / 2);
        var nt = 1 / tn;
        var nr = nt / aspect;
        this.m[0][0] = nr;
        this.m[1][1] = nt;
        this.m[2][2] = (n + f) / (n - f);
        this.m[3][2] = 2 * f * n / (f - n);
        this.m[2][3] = 1;
    };
    Matrix.prototype.setLookAt = function (eye, at, up) {
        var w = at.sub(eye).normalize().reverse();
        var u = up.cross(w).normalize();
        var v = w.cross(u);
        this.setValue(0);
        this.m[0][0] = u.x;
        this.m[1][0] = u.y;
        this.m[2][0] = u.z;
        this.m[0][1] = v.x;
        this.m[1][1] = v.y;
        this.m[2][1] = v.z;
        this.m[0][2] = w.x;
        this.m[1][2] = w.y;
        this.m[2][2] = w.z;
        this.m[3][3] = 1;
        var tEye = eye.reverse();
        this.m[3][0] = u.dot(tEye);
        this.m[3][1] = v.dot(tEye);
        this.m[3][2] = w.dot(tEye);
    };
    return Matrix;
})();
exports.Matrix = Matrix;
var ColorEnums = (function () {
    function ColorEnums() {
    }
    ColorEnums.clone = function (color) {
        return { r: color.r, g: color.g, b: color.b, a: color.a };
    };
    ColorEnums.BLACK = { r: 0, g: 0, b: 0, a: 255 };
    ColorEnums.WHITE = { r: 255, g: 255, b: 255, a: 255 };
    ColorEnums.RED = { r: 255, g: 0, b: 0, a: 255 };
    ColorEnums.BLUE = { r: 0, g: 0, b: 255, a: 255 };
    ColorEnums.GREEN = { r: 0, g: 255, b: 0, a: 255 };
    ColorEnums.ORANGE = { r: 255, g: 255, b: 0, a: 255 };
    return ColorEnums;
})();
exports.ColorEnums = ColorEnums;
var Texture = (function () {
    function Texture(width, height) {
        this.data = [];
        this.tmp = { r: 0, g: 0, b: 0, a: 0 };
        this.width = width;
        this.height = height;
    }
    Texture.prototype.setPixel = function (x, y, color) {
        var pos = y * this.width + x;
        this.data[pos] = color;
    };
    Texture.prototype.sample = function (uv) {
        var x = uv.u * this.width;
        var y = uv.v * this.height;
        x = Math.floor(x + 0.5);
        y = Math.floor(y + 0.5);
        if (x >= this.width) {
            x = x % this.width;
        }
        if (y >= this.height) {
            y = y % this.height;
        }
        var pos = y * this.width + x;
        var color = this.data[pos];
        this.tmp.a = color.a;
        this.tmp.r = color.r;
        this.tmp.g = color.g;
        this.tmp.b = color.b;
        return this.tmp;
    };
    return Texture;
})();
exports.Texture = Texture;
//# sourceMappingURL=data.js.map