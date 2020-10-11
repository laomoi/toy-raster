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
//# sourceMappingURL=matrix.js.map