"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const buffer_1 = require("./shading/buffer");
const matrix_1 = require("./math/matrix");
const vector4_1 = require("./math/vector4");
const color_1 = require("./shading/color");
const math_utils_1 = require("./math/math-utils");
const vector2_1 = require("./math/vector2");
class Raster {
    constructor(width, height, usingMSAA = true) {
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
        this.buffer = new buffer_1.default(width, height, usingMSAA);
        this.setDefaultCamera();
    }
    clear() {
        this.buffer.clear(this.backgroundColor);
    }
    drawLine(x0, y0, x1, y1, color) {
        if (x0 == x1) {
            let dir = y0 < y1 ? 1 : -1;
            for (let y = y0; y != y1; y += dir) {
                this.setPixel(x0, y, color);
            }
            this.setPixel(x1, y1, color);
        }
        else if (y0 == y1) {
            let dir = x0 < x1 ? 1 : -1;
            for (let x = x0; x != x1; x += dir) {
                this.setPixel(x, y0, color);
            }
            this.setPixel(x1, y1, color);
        }
        else {
            let dx = Math.abs(x1 - x0);
            let dy = Math.abs(y1 - y0);
            if (dx > dy) {
                if (x0 > x1) {
                    let tx = x0, ty = y0;
                    x0 = x1, y0 = y1;
                    x1 = tx, y1 = ty;
                }
                let dir = y1 > y0 ? 1 : -1;
                let y = y0;
                let d = (y0 - y1) * (x0 + 1) + (x1 - x0) * (y0 + 0.5 * dir) + x0 * y1 - x1 * y0;
                for (let x = x0; x <= x1; x++) {
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
                    let tx = x0, ty = y0;
                    x0 = x1, y0 = y1;
                    x1 = tx, y1 = ty;
                }
                let dir = x1 > x0 ? 1 : -1;
                let x = x0;
                let d = (y0 - y1) * (x0 + 0.5 * dir) + (x1 - x0) * (y0 + 1) + x0 * y1 - x1 * y0;
                for (let y = y0; y <= y1; y++) {
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
    }
    barycentricFunc(vs, a, b, x, y) {
        return ((vs[a].y - vs[b].y) * x + (vs[b].x - vs[a].x) * y + vs[a].x * vs[b].y - vs[b].x * vs[a].y);
    }
    getBarycentricInTriangle(x, y, vs, fAlpha, fBelta, fGama, fAlphaTest, fBeltaTest, fGamaTest) {
        let belta = this.barycentricFunc(vs, 2, 0, x, y) / fBelta;
        let gama = this.barycentricFunc(vs, 0, 1, x, y) / fGama;
        let alpha = 1 - belta - gama;
        if (alpha >= 0 && belta >= 0 && gama >= 0) {
            if ((alpha > 0 || fAlpha * fAlphaTest > 0)
                && (belta > 0 || fBelta * fBeltaTest > 0)
                && (gama > 0 || fGama * fGamaTest > 0)) {
                return [alpha, belta, gama];
            }
        }
        return null;
    }
    drawTriangle2D(v0, v1, v2) {
        let vs = [v0.context.posScreen, v1.context.posScreen, v2.context.posScreen];
        let x0 = vs[0].x, x1 = vs[1].x, x2 = vs[2].x, y0 = vs[0].y, y1 = vs[1].y, y2 = vs[2].y;
        let minX = Math.floor(Math.min(x0, x1, x2));
        let maxX = Math.ceil(Math.max(x0, x1, x2));
        let minY = Math.floor(Math.min(y0, y1, y2));
        let maxY = Math.ceil(Math.max(y0, y1, y2));
        let fBelta = this.barycentricFunc(vs, 2, 0, x1, y1);
        let fGama = this.barycentricFunc(vs, 0, 1, x2, y2);
        let fAlpha = this.barycentricFunc(vs, 1, 2, x0, y0);
        let offScreenPointX = -1, offScreenPointY = -1;
        let fAlphaTest = this.barycentricFunc(vs, 1, 2, offScreenPointX, offScreenPointY);
        let fGamaTest = this.barycentricFunc(vs, 0, 1, offScreenPointX, offScreenPointY);
        let fBeltaTest = this.barycentricFunc(vs, 2, 0, offScreenPointX, offScreenPointY);
        for (let x = minX; x <= maxX; x++) {
            for (let y = minY; y <= maxY; y++) {
                if (!this.usingMSAA) {
                    this.rasterizePixelInTriangle(x, y, vs, v0, v1, v2, fAlpha, fBelta, fGama, fAlphaTest, fBeltaTest, fGamaTest);
                }
                else {
                    this.rasterizePixelInTriangleMSAA(x, y, vs, v0, v1, v2, fAlpha, fBelta, fGama, fAlphaTest, fBeltaTest, fGamaTest);
                }
            }
        }
    }
    createFragmentInput(x, y, v0, v1, v2, a, b, c) {
        let context = {
            x: x,
            y: y,
            color: color_1.Color.WHITE.clone(),
            varyingVec2Dict: {},
            varyingVec4Dict: {},
        };
        color_1.Color.getInterpColor(v0.color, v1.color, v2.color, a, b, c, context.color);
        for (let k in v0.context.varyingVec2Dict) {
            context.varyingVec2Dict[k] = vector2_1.Vector2.getInterpValue3(v0.context.varyingVec2Dict[k], v1.context.varyingVec2Dict[k], v2.context.varyingVec2Dict[k], a, b, c);
        }
        for (let k in v0.context.varyingVec4Dict) {
            context.varyingVec4Dict[k] = vector4_1.Vector4.getInterpValue3(v0.context.varyingVec4Dict[k], v1.context.varyingVec4Dict[k], v2.context.varyingVec4Dict[k], a, b, c);
        }
        return context;
    }
    rasterizePixelInTriangle(x, y, vs, v0, v1, v2, fAlpha, fBelta, fGama, fAlphaTest, fBeltaTest, fGamaTest) {
        let barycentric = this.getBarycentricInTriangle(x, y, vs, fAlpha, fBelta, fGama, fAlphaTest, fBeltaTest, fGamaTest);
        if (barycentric == null) {
            return;
        }
        let rhw = math_utils_1.default.getInterpValue3(v0.context.rhw, v1.context.rhw, v2.context.rhw, barycentric[0], barycentric[1], barycentric[2]);
        if (this.buffer.ztest(x, y, rhw)) {
            let w = 1 / (rhw != 0 ? rhw : 1);
            let a = barycentric[0] * w * v0.context.rhw;
            let b = barycentric[1] * w * v1.context.rhw;
            let c = barycentric[2] * w * v2.context.rhw;
            let input = this.createFragmentInput(x, y, v0, v1, v2, a, b, c);
            let finalColor = this.currentShader.fragmentShading(input);
            if (finalColor.a > 0) {
                this.setPixel(x, y, finalColor);
                this.buffer.setZ(x, y, rhw);
            }
        }
    }
    rasterizePixelInTriangleMSAA(x, y, vs, v0, v1, v2, fAlpha, fBelta, fGama, fAlphaTest, fBeltaTest, fGamaTest) {
        let points = [[x - 0.325, y + 0.125], [x + 0.125, y + 0.325], [x - 0.125, y - 0.325], [x + 0.325, y - 0.125]];
        let testResults = [];
        for (let i = 0; i < points.length; i++) {
            let p = points[i];
            let px = p[0], py = p[1];
            let barycentric = this.getBarycentricInTriangle(px, py, vs, fAlpha, fBelta, fGama, fAlphaTest, fBeltaTest, fGamaTest);
            if (barycentric != null) {
                let rhw = math_utils_1.default.getInterpValue3(v0.context.rhw, v1.context.rhw, v2.context.rhw, barycentric[0], barycentric[1], barycentric[2]);
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
            let fx = x, fy = y;
            let barycentric = this.getBarycentricInTriangle(x, y, vs, fAlpha, fBelta, fGama, fAlphaTest, fBeltaTest, fGamaTest);
            if (barycentric == null) {
                barycentric = testResults[0].barycentric;
                fx = testResults[0].x;
                fy = testResults[0].y;
            }
            let rhw = math_utils_1.default.getInterpValue3(v0.context.rhw, v1.context.rhw, v2.context.rhw, barycentric[0], barycentric[1], barycentric[2]);
            let w = 1 / (rhw != 0 ? rhw : 1);
            let a = barycentric[0] * w * v0.context.rhw;
            let b = barycentric[1] * w * v1.context.rhw;
            let c = barycentric[2] * w * v2.context.rhw;
            let input = this.createFragmentInput(fx, fy, v0, v1, v2, a, b, c);
            let finalColor = this.currentShader.fragmentShading(input);
            if (finalColor.a > 0) {
                for (let result of testResults) {
                    let index = result.index;
                    let rhw = result.rhw;
                    this.setPixel(x, y, finalColor, index);
                    this.buffer.setZ(x, y, rhw, index);
                }
                this.buffer.applyMSAAFilter(x, y);
            }
        }
    }
    setBackgroundColor(color) {
        this.backgroundColor = color.clone();
    }
    setPixel(x, y, color, index = 0) {
        if (x < this.width && y < this.height && x >= 0 && y >= 0) {
            this.buffer.setColor(x, y, color, index);
        }
    }
    drawTriangle(va) {
        if (va.length % 3 != 0) {
            return;
        }
        this.currentShader.setViewProject(this.camera.vp);
        for (let vertex of va) {
            vertex.context = {
                posProject: new vector4_1.Vector4(),
                posScreen: new vector4_1.Vector4(),
                rhw: 1,
                varyingVec2Dict: {},
                varyingVec4Dict: {},
            };
            this.currentShader.vertexShading(vertex);
            vertex.context.rhw = 1 / vertex.context.posProject.w;
            vertex.context.posProject.homogenenize();
        }
        let culling = false;
        for (let p of va) {
            if (!this.isInsideViewVolumn(p.context.posProject)) {
                culling = true;
                break;
            }
        }
        if (!culling) {
            for (let p of va) {
                this.convertToScreenPos(p.context.posProject, p.context.posScreen, this.width, this.height);
            }
            this.drawTriangle2D(va[0], va[1], va[2]);
        }
    }
    setDefaultCamera() {
        let eye = new vector4_1.Vector4(1.5, 0, 3, 1);
        let at = new vector4_1.Vector4(0, 0, 0, 1);
        let up = new vector4_1.Vector4(0, 1, 0, 1);
        let fovy = Math.PI / 2;
        let aspect = this.width / this.height;
        let near = 1;
        let far = 500;
        this.setCamera(eye, at, up, fovy, aspect, near, far);
    }
    setCamera(eye, lookAt, up, fovy, aspect, near, far) {
        this.camera.view.setLookAt(eye, lookAt, up);
        this.camera.projection.setPerspective(fovy, aspect, near, far);
        this.camera.vp = this.camera.view.multiply(this.camera.projection);
    }
    getFrameBuffer() {
        return this.buffer.frameBuffer;
    }
    setShader(shader) {
        this.currentShader = shader;
    }
    isInsideViewVolumn(v) {
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
    }
    convertToScreenPos(v, dst, width, height) {
        dst.x = (v.x + 1) / 2 * width;
        dst.y = (v.y + 1) / 2 * height;
        dst.z = v.z;
        return dst;
    }
}
exports.default = Raster;
