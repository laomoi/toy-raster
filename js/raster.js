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
var MathUtils = (function () {
    function MathUtils() {
    }
    MathUtils.isInsideViewVolumn = function (v) {
        if (v.x < -1 || v.x > 1) {
            return false;
        }
        if (v.y < -1 || v.y > 1) {
            return false;
        }
        if (v.z < -1 || v.z > 1) {
            return false;
        }
        return true;
    };
    MathUtils.convertToScreenPos = function (v, dst, width, height) {
        dst.x = (v.x + 1) / 2 * width;
        dst.y = (v.y + 1) / 2 * height;
        dst.z = v.z;
        return dst;
    };
    MathUtils.getInterpColor = function (color1, color2, color3, a, b, c, dstColor) {
        dstColor.r = MathUtils.getInterpValue(color1.r, color2.r, color3.r, a, b, c);
        dstColor.g = MathUtils.getInterpValue(color1.g, color2.g, color3.g, a, b, c);
        dstColor.b = MathUtils.getInterpValue(color1.b, color2.b, color3.b, a, b, c);
        dstColor.a = MathUtils.getInterpValue(color1.a, color2.a, color3.a, a, b, c);
    };
    MathUtils.getInterpUV = function (uv1, uv2, uv3, a, b, c, dstUV) {
        dstUV.u = MathUtils.getInterpValue(uv1.u, uv2.u, uv3.u, a, b, c);
        dstUV.v = MathUtils.getInterpValue(uv1.v, uv2.v, uv3.v, a, b, c);
    };
    MathUtils.getInterpValue = function (v1, v2, v3, a, b, c) {
        return v1 * a + v2 * b + v3 * c;
    };
    MathUtils.multiplyColor = function (color1, color2, dst) {
        dst.r = color1.r * color2.r / 255;
        dst.g = color1.g * color2.g / 255;
        dst.b = color1.b * color2.b / 255;
        dst.a = color1.a * color2.a / 255;
        return dst;
    };
    return MathUtils;
})();
var Renderer = (function () {
    function Renderer(width, height) {
        this.frameBuffer = null;
        this.zBuffer = null;
        this.backgroundColor = ColorEnums.clone(ColorEnums.BLACK);
        this.activeTexture = null;
        this.camera = {
            view: new Matrix(),
            projection: new Matrix(),
            vp: new Matrix()
        };
        this.width = width;
        this.height = height;
        this.frameBuffer = new Uint8Array(width * height * 4);
        this.zBuffer = new Float32Array(width * height);
        this.setDefaultCamera();
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
    Renderer.prototype.barycentricFunc = function (vs, a, b, x, y) {
        return ((vs[a].y - vs[b].y) * x + (vs[b].x - vs[a].x) * y + vs[a].x * vs[b].y - vs[b].x * vs[a].y);
    };
    Renderer.prototype.drawTriangle2D = function (v0, v1, v2) {
        var vs = [v0.posScreen, v1.posScreen, v2.posScreen];
        var x0 = vs[0].x, x1 = vs[1].x, x2 = vs[2].x, y0 = vs[0].y, y1 = vs[1].y, y2 = vs[2].y;
        var minX = Math.floor(Math.min(x0, x1, x2));
        var maxX = Math.ceil(Math.max(x0, x1, x2));
        var minY = Math.floor(Math.min(y0, y1, y2));
        var maxY = Math.ceil(Math.max(y0, y1, y2));
        var fBelta = this.barycentricFunc(vs, 2, 0, x1, y1);
        var fGama = this.barycentricFunc(vs, 0, 1, x2, y2);
        var fAlpha = this.barycentricFunc(vs, 1, 2, x0, y0);
        var offScreenPointX = -1, offScreenPointY = -1;
        var tempColor = ColorEnums.clone(ColorEnums.WHITE);
        var uv = { u: 0, v: 0 };
        for (var x = minX; x <= maxX; x++) {
            for (var y = minY; y <= maxY; y++) {
                var belta = this.barycentricFunc(vs, 2, 0, x, y) / fBelta;
                var gama = this.barycentricFunc(vs, 0, 1, x, y) / fGama;
                var alpha = 1 - belta - gama;
                if (alpha >= 0 && belta >= 0 && gama >= 0) {
                    if ((alpha > 0 || fAlpha * this.barycentricFunc(vs, 1, 2, offScreenPointX, offScreenPointY) > 0)
                        && (belta > 0 || fBelta * this.barycentricFunc(vs, 2, 0, offScreenPointX, offScreenPointY) > 0)
                        && (gama > 0 || fGama * this.barycentricFunc(vs, 0, 1, offScreenPointX, offScreenPointY) > 0)) {
                        var rhw = MathUtils.getInterpValue(v0.rhw, v1.rhw, v2.rhw, alpha, belta, gama);
                        var zPos = this.width * y + x;
                        if (isNaN(this.zBuffer[zPos]) || this.zBuffer[zPos] > rhw) {
                            var w = 1 / (rhw != 0 ? rhw : 1);
                            var a = alpha * w * v0.rhw;
                            var b = belta * w * v1.rhw;
                            var c = gama * w * v2.rhw;
                            MathUtils.getInterpColor(v0.color, v1.color, v2.color, a, b, c, tempColor);
                            MathUtils.getInterpUV(v0.uv, v1.uv, v2.uv, a, b, c, uv);
                            var finalColor = this.fragmentShading(x, y, tempColor, uv);
                            if (finalColor.a > 0) {
                                this.setPixel(x, y, finalColor);
                                this.zBuffer[zPos] = rhw;
                            }
                        }
                    }
                }
            }
        }
    };
    Renderer.prototype.fragmentShading = function (x, y, color, uv) {
        if (this.activeTexture != null) {
            var tex = this.activeTexture.sample(uv);
            return MathUtils.multiplyColor(tex, color, tex);
        }
        return color;
    };
    Renderer.prototype.setActiveTexture = function (texture) {
        this.activeTexture = texture;
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
    Renderer.prototype.drawElements = function (va, elements) {
        if (elements.length % 3 != 0) {
            return;
        }
        var cameraTransform = this.camera.vp;
        for (var _i = 0; _i < va.length; _i++) {
            var vert = va[_i];
            if (vert.posProject == null) {
                vert.posProject = new Vector();
            }
            vert.posWorld.transform(cameraTransform, vert.posProject);
            vert.rhw = 1 / vert.posProject.w;
            vert.posProject.homogenenize();
            if (MathUtils.isInsideViewVolumn(vert.posProject)) {
                if (vert.posScreen == null) {
                    vert.posScreen = new Vector();
                }
                MathUtils.convertToScreenPos(vert.posProject, vert.posScreen, this.width, this.height);
            }
        }
        for (var i = 0; i < elements.length; i += 3) {
            var trianglePoints = [va[elements[i]], va[elements[i + 1]], va[elements[i + 2]]];
            var culling = false;
            for (var _a = 0; _a < trianglePoints.length; _a++) {
                var p = trianglePoints[_a];
                if (!MathUtils.isInsideViewVolumn(p.posProject)) {
                    culling = true;
                    break;
                }
            }
            if (!culling) {
                this.drawTriangle2D(trianglePoints[0], trianglePoints[1], trianglePoints[2]);
            }
        }
    };
    Renderer.prototype.setDefaultCamera = function () {
        var eye = new Vector(1.5, 0, 3, 1);
        var at = new Vector(0, 0, 0, 1);
        var up = new Vector(0, 1, 0, 1);
        var fovy = Math.PI / 2;
        var aspect = this.width / this.height;
        var near = 1;
        var far = 500;
        this.setCamera(eye, at, up, fovy, aspect, near, far);
    };
    Renderer.prototype.setCamera = function (eye, lookAt, up, fovy, aspect, near, far) {
        this.camera.view.setLookAt(eye, lookAt, up);
        this.camera.projection.setPerspective(fovy, aspect, near, far);
        this.camera.vp = this.camera.view.multiply(this.camera.projection);
    };
    return Renderer;
})();
var App = (function () {
    function App(canvasWidth, canvasHeight, blitCallback) {
        this.bitBlit = null;
        this.renderder = new Renderer(canvasWidth, canvasHeight);
        this.bitBlit = blitCallback;
        var self = this;
        var wrapMainLoop = function () {
            self.mainLoop();
            requestAnimationFrame(wrapMainLoop);
        };
        wrapMainLoop();
    }
    App.prototype.mainLoop = function () {
        this.renderder.clear();
        var va = [
            { posWorld: new Vector(-1, -1, 1), color: ColorEnums.GREEN, uv: { u: 0, v: 0 } },
            { posWorld: new Vector(1, -1, 1), color: ColorEnums.BLUE, uv: { u: 1, v: 0 } },
            { posWorld: new Vector(1, 1, 1), color: ColorEnums.RED, uv: { u: 1, v: 1 } },
            { posWorld: new Vector(-1, 1, 1), color: ColorEnums.ORANGE, uv: { u: 0, v: 1 } },
            { posWorld: new Vector(-1, -1, -1), color: ColorEnums.GREEN, uv: { u: 0, v: 0 } },
            { posWorld: new Vector(1, -1, -1), color: ColorEnums.BLUE, uv: { u: 1, v: 0 } },
            { posWorld: new Vector(1, 1, -1), color: ColorEnums.RED, uv: { u: 1, v: 1 } },
            { posWorld: new Vector(-1, 1, -1), color: ColorEnums.ORANGE, uv: { u: 0, v: 1 } },
        ];
        var elements = [
            0, 1, 2,
            2, 3, 0,
            7, 6, 5,
            5, 4, 7,
            0, 4, 5,
            5, 1, 0,
            1, 5, 6,
            6, 2, 1,
            2, 6, 7,
            7, 3, 2,
            3, 7, 4,
            4, 0, 3
        ];
        this.renderder.setActiveTexture(this.createTexture());
        this.renderder.drawElements(va, elements);
        this.flush();
    };
    App.prototype.createTexture = function () {
        var texture = new Texture(256, 256);
        for (var i = 0; i < 256; i++) {
            for (var j = 0; j < 256; j++) {
                var x = Math.floor(i / 32);
                var y = Math.floor(j / 32);
                if ((x + y) % 2 == 0) {
                    texture.setPixel(j, i, ColorEnums.BLUE);
                }
                else {
                    texture.setPixel(j, i, ColorEnums.WHITE);
                }
            }
        }
        return texture;
    };
    App.prototype.flush = function () {
        this.bitBlit(this.renderder.width, this.renderder.height, this.renderder.frameBuffer);
    };
    return App;
})();
exports["default"] = App;
//# sourceMappingURL=raster.js.map