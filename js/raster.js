var Vector = (function () {
    function Vector() {
        this.w = 1.0;
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
    return Vector;
})();
var Matrix = (function () {
    function Matrix() {
        this.m = [];
        for (var i = 0; i < 4; i++) {
            var col = new Float32Array(4);
            for (var j = 0; j < 4; j++) {
                col[j] = j == i ? 1 : 0;
            }
            this.m.push(col);
        }
    }
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
    Matrix.setPerspective = function (dst, fovy, aspect, near, far) {
        dst.setValue(0);
        var tan = Math.tan(fovy / 2);
        var nt = 1 / tan;
        var nr = nt / aspect;
        var n = Math.abs(near);
        var f = Math.abs(far);
        dst.m[0][0] = nr;
        dst.m[1][1] = nt;
        dst.m[2][2] = (n + f) / (n - f);
        dst.m[3][2] = 2 * f * n / (f - n);
        dst.m[2][3] = 1;
    };
    Matrix.setLookAt = function (dst, eye, up, at) {
        var w = at.sub(eye).normalize().reverse();
        var u = up.cross(w).normalize();
        var v = w.cross(u);
        dst.setValue(0);
        dst.m[0][0] = u.x;
        dst.m[1][0] = u.y;
        dst.m[2][0] = u.z;
        dst.m[0][1] = v.x;
        dst.m[1][1] = v.y;
        dst.m[2][1] = v.z;
        dst.m[0][2] = w.x;
        dst.m[1][2] = w.y;
        dst.m[2][2] = w.z;
        dst.m[3][3] = 1;
        var tEye = eye.reverse();
        dst.m[3][0] = u.dot(tEye);
        dst.m[3][1] = v.dot(tEye);
        dst.m[3][2] = w.dot(tEye);
    };
    return Matrix;
})();
var MathUtils = (function () {
    function MathUtils() {
    }
    MathUtils.linearInterpolateValue = function (value1, value2, t) {
        return (1 - t) * value1 + t * value2;
    };
    MathUtils.linearInterpolateVector = function (vec1, vec2, t, dst) {
        if (dst === void 0) { dst = null; }
        if (dst == null) {
            dst = new Vector();
        }
        dst.x = MathUtils.linearInterpolateValue(vec1.x, vec2.x, t);
        dst.y = MathUtils.linearInterpolateValue(vec1.y, vec2.y, t);
        dst.z = MathUtils.linearInterpolateValue(vec1.z, vec2.z, t);
        return dst;
    };
    return MathUtils;
})();
var Device = (function () {
    function Device(width, height) {
        this.frameBuffer = null;
        this.zBuffer = null;
        this.width = width;
        this.height = height;
        this.frameBuffer = new Uint8Array(width * height * 4);
        this.zBuffer = new Float32Array(width * height);
    }
    Device.prototype.clear = function () {
        for (var l = 0; l < this.frameBuffer.length; l++) {
            this.frameBuffer[l] = 0;
        }
        for (var l = 0; l < this.zBuffer.length; l++) {
            this.zBuffer[l] = NaN;
        }
    };
    Device.prototype.drawBox = function () {
        var pixelsSize = this.width * this.height * 4;
        for (var i = 0; i < pixelsSize; i += 4) {
            this.frameBuffer[i] = 255;
            this.frameBuffer[i + 1] = i % 255;
            this.frameBuffer[i + 2] = i % 255;
            this.frameBuffer[i + 3] = 255;
        }
    };
    return Device;
})();
var Raster = (function () {
    function Raster(canvasWidth, canvasHeight, printCallback) {
        this.bitBlit = null;
        this.device = null;
        this.bitBlit = printCallback;
        this.device = new Device(canvasWidth, canvasHeight);
        var self = this;
        var wrapMainLoop = function () {
            self.mainLoop();
            requestAnimationFrame(wrapMainLoop);
        };
        wrapMainLoop();
    }
    Raster.prototype.mainLoop = function () {
        this.device.clear();
        this.device.drawBox();
        this.bitBlit(this.device.width, this.device.height, this.device.frameBuffer);
    };
    Raster.prototype.setModel = function () {
    };
    return Raster;
})();
exports["default"] = Raster;
//# sourceMappingURL=raster.js.map