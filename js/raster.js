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
var Color = (function () {
    function Color(r, g, b, a) {
        this.a = a;
        this.r = r;
        this.g = g;
        this.b = b;
    }
    Color.BLACK = new Color(0, 0, 0, 255);
    Color.WHITE = new Color(255, 255, 255, 255);
    return Color;
})();
var Renderer = (function () {
    function Renderer(width, height, blitCallback) {
        this.bitBlit = null;
        this.frameBuffer = null;
        this.zBuffer = null;
        this.backgroundColor = Color.BLACK;
        this.width = width;
        this.height = height;
        this.bitBlit = blitCallback;
        this.frameBuffer = new Uint8Array(width * height * 4);
        this.zBuffer = new Float32Array(width * height);
    }
    Renderer.prototype.clear = function () {
        for (var l = 0; l < this.frameBuffer.length; l += 4) {
            this.frameBuffer[l] = this.backgroundColor.r;
            this.frameBuffer[l + 1] = this.backgroundColor.g;
            this.frameBuffer[l + 2] = this.backgroundColor.b;
            this.frameBuffer[l + 3] = this.backgroundColor.a;
        }
        for (var l = 0; l < this.zBuffer.length; l++) {
            this.zBuffer[l] = NaN;
        }
    };
    Renderer.prototype.drawBox = function () {
        var pixelsSize = this.width * this.height * 4;
        for (var i = 0; i < pixelsSize; i += 4) {
            this.frameBuffer[i] = 255;
            this.frameBuffer[i + 1] = i % 255;
            this.frameBuffer[i + 2] = i % 255;
            this.frameBuffer[i + 3] = 255;
        }
    };
    Renderer.prototype.drawLine = function (x0, y0, x1, y1, color) {
        if (x0 == x1) {
            var dir = y0 < y1 ? 1 : -1;
            for (var y = y0; y != y1; y += dir) {
                this.setPixel(x0, y, color);
            }
            this.setPixel(x1, y1, color);
        }
        else if (y0 == y1) {
            var dir = x0 < x1 ? 1 : -1;
            for (var x = x0; x != x1; x += dir) {
                this.setPixel(x, y0, color);
            }
            this.setPixel(x1, y1, color);
        }
        else {
            var dx = Math.abs(x1 - x0);
            var dy = Math.abs(y1 - y0);
            if (dx > dy) {
                if (x0 > x1) {
                    var tx = x0, ty = y0;
                    x0 = x1, y0 = y1;
                    x1 = tx, y1 = ty;
                }
                var dir = y1 > y0 ? 1 : -1;
                var y = y0;
                var d = (y0 - y1) * (x0 + 1) + (x1 - x0) * (y0 + 0.5 * dir) + x0 * y1 - x1 * y0;
                for (var x = x0; x <= x1; x++) {
                    this.setPixel(x, y, color);
                    if (d * dir < 0) {
                        y += dir;
                        d += (x1 - x0) * dir + (y0 - y1);
                    }
                    else {
                        d += y0 - y1;
                    }
                }
            }
            else {
                if (y0 > y1) {
                    var tx = x0, ty = y0;
                    x0 = x1, y0 = y1;
                    x1 = tx, y1 = ty;
                }
                var dir = x1 > x0 ? 1 : -1;
                var x = x0;
                var d = (y0 - y1) * (x0 + 0.5 * dir) + (x1 - x0) * (y0 + 1) + x0 * y1 - x1 * y0;
                for (var y = y0; y <= y1; y++) {
                    this.setPixel(x, y, color);
                    if (d * dir > 0) {
                        x += dir;
                        d += (x1 - x0) + (y0 - y1) * dir;
                    }
                    else {
                        d += x1 - x0;
                    }
                }
            }
        }
    };
    Renderer.prototype.setPixel = function (x, y, color) {
        if (x < this.width && y < this.height && x >= 0 && y >= 0) {
            var pstart = (this.width * y + x) * 4;
            this.frameBuffer[pstart] = color.r;
            this.frameBuffer[pstart + 1] = color.g;
            this.frameBuffer[pstart + 2] = color.b;
            this.frameBuffer[pstart + 3] = color.a;
        }
    };
    Renderer.prototype.flush = function () {
        this.bitBlit(this.width, this.height, this.frameBuffer);
    };
    return Renderer;
})();
var App = (function () {
    function App(canvasWidth, canvasHeight, blitCallback) {
        this.bitBlit = null;
        this.renderder = new Renderer(canvasWidth, canvasHeight, blitCallback);
        var self = this;
        var wrapMainLoop = function () {
            self.mainLoop();
            requestAnimationFrame(wrapMainLoop);
        };
        wrapMainLoop();
    }
    App.prototype.mainLoop = function () {
        this.renderder.clear();
        this.renderder.drawLine(200, 300, 2000, 300, Color.WHITE);
        this.renderder.drawLine(200, 300, 900, 200, Color.WHITE);
        this.renderder.drawLine(200, 300, 900, 500, Color.WHITE);
        this.renderder.drawLine(200, 300, 150, 700, Color.WHITE);
        this.renderder.drawLine(200, 300, 450, 700, Color.WHITE);
        this.renderder.drawLine(200, 300, 150, 100, Color.WHITE);
        this.renderder.flush();
    };
    return App;
})();
exports["default"] = App;
//# sourceMappingURL=raster.js.map