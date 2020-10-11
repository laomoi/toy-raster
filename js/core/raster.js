var buffer_1 = require("./buffer");
var matrix_1 = require("./math/matrix");
var vector_1 = require("./math/vector");
var color_1 = require("./mesh/color");
var utils_1 = require("./utils");
var Raster = (function () {
    function Raster(width, height, usingMSAA) {
        if (usingMSAA === void 0) { usingMSAA = false; }
        this.buffer = null;
        this.backgroundColor = color_1.Colors.clone(color_1.Colors.BLACK);
        this.activeTexture = null;
        this.usingMSAA = true;
        this.camera = {
            view: new matrix_1.Matrix(),
            projection: new matrix_1.Matrix(),
            vp: new matrix_1.Matrix()
        };
        this.width = width;
        this.height = height;
        this.usingMSAA = usingMSAA;
        this.buffer = new buffer_1["default"](width, height, usingMSAA);
        this.setDefaultCamera();
    }
    Raster.prototype.clear = function () {
        this.buffer.clear(this.backgroundColor);
    };
    Raster.prototype.drawLine = function (x0, y0, x1, y1, color) {
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
    Raster.prototype.barycentricFunc = function (vs, a, b, x, y) {
        return ((vs[a].y - vs[b].y) * x + (vs[b].x - vs[a].x) * y + vs[a].x * vs[b].y - vs[b].x * vs[a].y);
    };
    Raster.prototype.getBarycentricInTriangle = function (x, y, vs, fAlpha, fBelta, fGama, fAlphaTest, fBeltaTest, fGamaTest) {
        var belta = this.barycentricFunc(vs, 2, 0, x, y) / fBelta;
        var gama = this.barycentricFunc(vs, 0, 1, x, y) / fGama;
        var alpha = 1 - belta - gama;
        if (alpha >= 0 && belta >= 0 && gama >= 0) {
            if ((alpha > 0 || fAlpha * fAlphaTest > 0)
                && (belta > 0 || fBelta * fBeltaTest > 0)
                && (gama > 0 || fGama * fGamaTest > 0)) {
                return [alpha, belta, gama];
            }
        }
        return null;
    };
    Raster.prototype.drawTriangle2D = function (v0, v1, v2) {
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
        var fAlphaTest = this.barycentricFunc(vs, 1, 2, offScreenPointX, offScreenPointY);
        var fGamaTest = this.barycentricFunc(vs, 0, 1, offScreenPointX, offScreenPointY);
        var fBeltaTest = this.barycentricFunc(vs, 2, 0, offScreenPointX, offScreenPointY);
        var tempColor = color_1.Colors.clone(color_1.Colors.WHITE);
        var uv = { u: 0, v: 0 };
        for (var x = minX; x <= maxX; x++) {
            for (var y = minY; y <= maxY; y++) {
                var barycentric = this.getBarycentricInTriangle(x, y, vs, fAlpha, fBelta, fGama, fAlphaTest, fBeltaTest, fGamaTest);
                if (barycentric == null) {
                    continue;
                }
                var alpha = barycentric[0];
                var belta = barycentric[1];
                var gama = barycentric[2];
                var rhw = utils_1["default"].getInterpValue3(v0.rhw, v1.rhw, v2.rhw, alpha, belta, gama);
                if (this.buffer.ztest(x, y, rhw)) {
                    var w = 1 / (rhw != 0 ? rhw : 1);
                    var a = alpha * w * v0.rhw;
                    var b = belta * w * v1.rhw;
                    var c = gama * w * v2.rhw;
                    color_1.Colors.getInterpColor(v0.color, v1.color, v2.color, a, b, c, tempColor);
                    utils_1["default"].getInterpUV(v0.uv, v1.uv, v2.uv, a, b, c, uv);
                    var finalColor = this.fragmentShading(x, y, tempColor, uv);
                    if (finalColor.a > 0) {
                        this.setPixel(x, y, finalColor);
                        this.buffer.setZ(x, y, rhw);
                    }
                }
            }
        }
    };
    Raster.prototype.fragmentShading = function (x, y, color, uv) {
        if (this.activeTexture != null) {
            var tex = this.activeTexture.sample(uv);
            return color_1.Colors.multiplyColor(tex, color, tex);
        }
        return color;
    };
    Raster.prototype.setActiveTexture = function (texture) {
        this.activeTexture = texture;
    };
    Raster.prototype.setBackgroundColor = function (color) {
        this.backgroundColor = color_1.Colors.clone(color);
    };
    Raster.prototype.setPixel = function (x, y, color) {
        if (x < this.width && y < this.height && x >= 0 && y >= 0) {
            this.buffer.setColor(x, y, color);
        }
    };
    Raster.prototype.drawElements = function (va, elements) {
        if (elements.length % 3 != 0) {
            return;
        }
        var cameraTransform = this.camera.vp;
        for (var _i = 0; _i < va.length; _i++) {
            var vert = va[_i];
            if (vert.posProject == null) {
                vert.posProject = new vector_1.Vector();
            }
            vert.posWorld.transform(cameraTransform, vert.posProject);
            vert.rhw = 1 / vert.posProject.w;
            vert.posProject.homogenenize();
            if (utils_1["default"].isInsideViewVolumn(vert.posProject)) {
                if (vert.posScreen == null) {
                    vert.posScreen = new vector_1.Vector();
                }
                utils_1["default"].convertToScreenPos(vert.posProject, vert.posScreen, this.width, this.height);
            }
        }
        for (var i = 0; i < elements.length; i += 3) {
            var trianglePoints = [va[elements[i]], va[elements[i + 1]], va[elements[i + 2]]];
            var culling = false;
            for (var _a = 0; _a < trianglePoints.length; _a++) {
                var p = trianglePoints[_a];
                if (!utils_1["default"].isInsideViewVolumn(p.posProject)) {
                    culling = true;
                    break;
                }
            }
            if (!culling) {
                this.drawTriangle2D(trianglePoints[0], trianglePoints[1], trianglePoints[2]);
            }
        }
    };
    Raster.prototype.setDefaultCamera = function () {
        var eye = new vector_1.Vector(1.5, 0, 3, 1);
        var at = new vector_1.Vector(0, 0, 0, 1);
        var up = new vector_1.Vector(0, 1, 0, 1);
        var fovy = Math.PI / 2;
        var aspect = this.width / this.height;
        var near = 1;
        var far = 500;
        this.setCamera(eye, at, up, fovy, aspect, near, far);
    };
    Raster.prototype.setCamera = function (eye, lookAt, up, fovy, aspect, near, far) {
        this.camera.view.setLookAt(eye, lookAt, up);
        this.camera.projection.setPerspective(fovy, aspect, near, far);
        this.camera.vp = this.camera.view.multiply(this.camera.projection);
    };
    Raster.prototype.getFrameBuffer = function () {
        return this.buffer.frameBuffer;
    };
    return Raster;
})();
exports["default"] = Raster;
//# sourceMappingURL=raster.js.map