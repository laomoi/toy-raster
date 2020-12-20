"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Matrix = void 0;
class Matrix {
    constructor() {
        this.m = [];
        for (let i = 0; i < 4; i++) {
            let col = new Float32Array(4);
            this.m.push(col);
        }
        this.identify();
    }
    identify() {
        this.setValue(0);
        this.m[0][0] = this.m[1][1] = this.m[2][2] = this.m[3][3] = 1;
    }
    multiply(t, dst = null) {
        if (dst == null) {
            dst = new Matrix();
        }
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                dst.m[j][i] =
                    this.m[j][0] * t.m[0][i]
                        + this.m[j][1] * t.m[1][i]
                        + this.m[j][2] * t.m[2][i]
                        + this.m[j][3] * t.m[3][i];
            }
        }
        return dst;
    }
    setValue(val) {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                this.m[j][i] = val;
            }
        }
    }
    setPerspective(fovy, aspect, near, far) {
        this.setValue(0);
        let n = -near;
        let f = -far;
        let tn = -Math.tan(fovy / 2);
        let nt = 1 / tn;
        let nr = nt / aspect;
        this.m[0][0] = nr;
        this.m[1][1] = nt;
        this.m[2][2] = (n + f) / (n - f);
        this.m[3][2] = 2 * f * n / (f - n);
        this.m[2][3] = 1;
    }
    setRotateX(angle) {
        this.identify();
        let cos = Math.cos(angle), sin = Math.sin(angle);
        this.m[1][1] = cos;
        this.m[1][2] = sin;
        this.m[2][1] = -sin;
        this.m[2][2] = cos;
    }
    setRotateY(angle) {
        this.identify();
        let cos = Math.cos(angle), sin = Math.sin(angle);
        this.m[0][0] = cos;
        this.m[0][2] = -sin;
        this.m[2][0] = sin;
        this.m[2][2] = cos;
    }
    setRotateZ(angle) {
        this.identify();
        let cos = Math.cos(angle), sin = Math.sin(angle);
        this.m[0][0] = cos;
        this.m[0][1] = sin;
        this.m[1][0] = -sin;
        this.m[1][1] = cos;
    }
    setLookAt(eye, at, up) {
        let w = at.sub(eye).normalize().reverse();
        let u = up.cross(w).normalize();
        let v = w.cross(u);
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
        let tEye = eye.reverse();
        this.m[3][0] = u.dot(tEye);
        this.m[3][1] = v.dot(tEye);
        this.m[3][2] = w.dot(tEye);
    }
}
exports.Matrix = Matrix;
