var data_1 = require("./data");
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
var Raster = (function () {
    function Raster(width, height) {
        this.frameBuffer = null;
        this.zBuffer = null;
        this.backgroundColor = data_1.ColorEnums.clone(data_1.ColorEnums.BLACK);
        this.activeTexture = null;
        this.camera = {
            view: new data_1.Matrix(),
            projection: new data_1.Matrix(),
            vp: new data_1.Matrix()
        };
        this.width = width;
        this.height = height;
        this.frameBuffer = new Uint8Array(width * height * 4);
        this.zBuffer = new Float32Array(width * height);
        this.setDefaultCamera();
    }
    Raster.prototype.clear = function () {
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
        var tempColor = data_1.ColorEnums.clone(data_1.ColorEnums.WHITE);
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
    Raster.prototype.fragmentShading = function (x, y, color, uv) {
        if (this.activeTexture != null) {
            var tex = this.activeTexture.sample(uv);
            return MathUtils.multiplyColor(tex, color, tex);
        }
        return color;
    };
    Raster.prototype.setActiveTexture = function (texture) {
        this.activeTexture = texture;
    };
    Raster.prototype.setPixel = function (x, y, color) {
        if (x < this.width && y < this.height && x >= 0 && y >= 0) {
            var pstart = (this.width * y + x) * 4;
            this.frameBuffer[pstart] = color.r;
            this.frameBuffer[pstart + 1] = color.g;
            this.frameBuffer[pstart + 2] = color.b;
            this.frameBuffer[pstart + 3] = color.a;
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
                vert.posProject = new data_1.Vector();
            }
            vert.posWorld.transform(cameraTransform, vert.posProject);
            vert.rhw = 1 / vert.posProject.w;
            vert.posProject.homogenenize();
            if (MathUtils.isInsideViewVolumn(vert.posProject)) {
                if (vert.posScreen == null) {
                    vert.posScreen = new data_1.Vector();
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
    Raster.prototype.setDefaultCamera = function () {
        var eye = new data_1.Vector(1.5, 0, 3, 1);
        var at = new data_1.Vector(0, 0, 0, 1);
        var up = new data_1.Vector(0, 1, 0, 1);
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
    return Raster;
})();
exports["default"] = Raster;
//# sourceMappingURL=raster.js.map