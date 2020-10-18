var buffer_1 = require("./shading/buffer");
var matrix_1 = require("./math/matrix");
var vector4_1 = require("./math/vector4");
var color_1 = require("./shading/color");
var math_utils_1 = require("./math/math-utils");
var vector2_1 = require("./math/vector2");
var Raster = (function () {
    function Raster(width, height, usingMSAA) {
        if (usingMSAA === void 0) { usingMSAA = true; }
        this.buffer = null;
        this.backgroundColor = color_1.Color.BLACK.clone();
        this.usingMSAA = true;
        this.currentShader = null;
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
        var vs = [v0.context.posScreen, v1.context.posScreen, v2.context.posScreen];
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
        for (var x = minX; x <= maxX; x++) {
            for (var y = minY; y <= maxY; y++) {
                if (!this.usingMSAA) {
                    this.rasterizePixelInTriangle(x, y, vs, v0, v1, v2, fAlpha, fBelta, fGama, fAlphaTest, fBeltaTest, fGamaTest);
                }
                else {
                    this.rasterizePixelInTriangleMSAA(x, y, vs, v0, v1, v2, fAlpha, fBelta, fGama, fAlphaTest, fBeltaTest, fGamaTest);
                }
            }
        }
    };
    Raster.prototype.createFragmentInput = function (x, y, v0, v1, v2, a, b, c) {
        var context = {
            x: x,
            y: y,
            color: color_1.Color.WHITE.clone(),
            varyingVec2Dict: {},
            varyingVec4Dict: {}
        };
        color_1.Color.getInterpColor(v0.color, v1.color, v2.color, a, b, c, context.color);
        for (var k in v0.context.varyingVec2Dict) {
            context.varyingVec2Dict[k] = vector2_1.Vector2.getInterpValue3(v0.context.varyingVec2Dict[k], v1.context.varyingVec2Dict[k], v2.context.varyingVec2Dict[k], a, b, c);
        }
        for (var k in v0.context.varyingVec4Dict) {
            context.varyingVec4Dict[k] = vector4_1.Vector4.getInterpValue3(v0.context.varyingVec4Dict[k], v1.context.varyingVec4Dict[k], v2.context.varyingVec4Dict[k], a, b, c);
        }
        return context;
    };
    Raster.prototype.rasterizePixelInTriangle = function (x, y, vs, v0, v1, v2, fAlpha, fBelta, fGama, fAlphaTest, fBeltaTest, fGamaTest) {
        var barycentric = this.getBarycentricInTriangle(x, y, vs, fAlpha, fBelta, fGama, fAlphaTest, fBeltaTest, fGamaTest);
        if (barycentric == null) {
            return;
        }
        var rhw = math_utils_1["default"].getInterpValue3(v0.context.rhw, v1.context.rhw, v2.context.rhw, barycentric[0], barycentric[1], barycentric[2]);
        if (this.buffer.ztest(x, y, rhw)) {
            var w = 1 / (rhw != 0 ? rhw : 1);
            var a = barycentric[0] * w * v0.context.rhw;
            var b = barycentric[1] * w * v1.context.rhw;
            var c = barycentric[2] * w * v2.context.rhw;
            var input = this.createFragmentInput(x, y, v0, v1, v2, a, b, c);
            var finalColor = this.currentShader.fragmentShading(input);
            if (finalColor.a > 0) {
                this.setPixel(x, y, finalColor);
                this.buffer.setZ(x, y, rhw);
            }
        }
    };
    Raster.prototype.rasterizePixelInTriangleMSAA = function (x, y, vs, v0, v1, v2, fAlpha, fBelta, fGama, fAlphaTest, fBeltaTest, fGamaTest) {
        var points = [[x - 0.325, y + 0.125], [x + 0.125, y + 0.325], [x - 0.125, y - 0.325], [x + 0.325, y - 0.125]];
        var testResults = [];
        for (var i = 0; i < points.length; i++) {
            var p = points[i];
            var px = p[0], py = p[1];
            var barycentric = this.getBarycentricInTriangle(px, py, vs, fAlpha, fBelta, fGama, fAlphaTest, fBeltaTest, fGamaTest);
            if (barycentric != null) {
                var rhw = math_utils_1["default"].getInterpValue3(v0.context.rhw, v1.context.rhw, v2.context.rhw, barycentric[0], barycentric[1], barycentric[2]);
                if (this.buffer.ztest(x, y, rhw, i)) {
                    testResults.push({
                        barycentric: barycentric,
                        index: i,
                        x: x,
                        y: y,
                        rhw: rhw
                    });
                }
            }
        }
        if (testResults.length > 0) {
            var fx = x, fy = y;
            var barycentric = this.getBarycentricInTriangle(x, y, vs, fAlpha, fBelta, fGama, fAlphaTest, fBeltaTest, fGamaTest);
            if (barycentric == null) {
                barycentric = testResults[0].barycentric;
                fx = testResults[0].x;
                fy = testResults[0].y;
            }
            var rhw = math_utils_1["default"].getInterpValue3(v0.context.rhw, v1.context.rhw, v2.context.rhw, barycentric[0], barycentric[1], barycentric[2]);
            var w = 1 / (rhw != 0 ? rhw : 1);
            var a = barycentric[0] * w * v0.context.rhw;
            var b = barycentric[1] * w * v1.context.rhw;
            var c = barycentric[2] * w * v2.context.rhw;
            var input = this.createFragmentInput(fx, fy, v0, v1, v2, a, b, c);
            var finalColor = this.currentShader.fragmentShading(input);
            if (finalColor.a > 0) {
                for (var _i = 0; _i < testResults.length; _i++) {
                    var result = testResults[_i];
                    var index = result.index;
                    var rhw_1 = result.rhw;
                    this.setPixel(x, y, finalColor, index);
                    this.buffer.setZ(x, y, rhw_1, index);
                }
                this.buffer.applyMSAAFilter(x, y);
            }
        }
    };
    Raster.prototype.setBackgroundColor = function (color) {
        this.backgroundColor = color.clone();
    };
    Raster.prototype.setPixel = function (x, y, color, index) {
        if (index === void 0) { index = 0; }
        if (x < this.width && y < this.height && x >= 0 && y >= 0) {
            this.buffer.setColor(x, y, color, index);
        }
    };
    Raster.prototype.drawTriangle = function (va) {
        if (va.length % 3 != 0) {
            return;
        }
        this.currentShader.setViewProject(this.camera.vp);
        for (var _i = 0; _i < va.length; _i++) {
            var vertex = va[_i];
            vertex.context = {
                posProject: new vector4_1.Vector4(),
                posScreen: new vector4_1.Vector4(),
                rhw: 1,
                varyingVec2Dict: {},
                varyingVec4Dict: {}
            };
            this.currentShader.vertexShading(vertex);
            vertex.context.rhw = 1 / vertex.context.posProject.w;
            vertex.context.posProject.homogenenize();
        }
        var culling = false;
        for (var _a = 0; _a < va.length; _a++) {
            var p = va[_a];
            if (!this.isInsideViewVolumn(p.context.posProject)) {
                culling = true;
                break;
            }
        }
        if (!culling) {
            for (var _b = 0; _b < va.length; _b++) {
                var p = va[_b];
                this.convertToScreenPos(p.context.posProject, p.context.posScreen, this.width, this.height);
            }
            this.drawTriangle2D(va[0], va[1], va[2]);
        }
    };
    Raster.prototype.setDefaultCamera = function () {
        var eye = new vector4_1.Vector4(1.5, 0, 3, 1);
        var at = new vector4_1.Vector4(0, 0, 0, 1);
        var up = new vector4_1.Vector4(0, 1, 0, 1);
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
    Raster.prototype.setShader = function (shader) {
        this.currentShader = shader;
    };
    Raster.prototype.isInsideViewVolumn = function (v) {
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
    Raster.prototype.convertToScreenPos = function (v, dst, width, height) {
        dst.x = (v.x + 1) / 2 * width;
        dst.y = (v.y + 1) / 2 * height;
        dst.z = v.z;
        return dst;
    };
    return Raster;
})();
exports["default"] = Raster;
//# sourceMappingURL=raster.js.map