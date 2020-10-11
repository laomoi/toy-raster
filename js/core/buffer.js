var Buffer = (function () {
    function Buffer(width, height, usingMSAA) {
        this.usingMSAA = true;
        this.zbuf = null;
        this.msaaColorBuffer = null;
        this.usingMSAA = usingMSAA;
        this.width = width;
        this.height = height;
        this.frameBuffer = new Uint8Array(width * height * 4);
        if (!this.usingMSAA) {
            this.zbuf = new Float32Array(width * height);
        }
        else {
            this.zbuf = new Float32Array(width * height * 4);
            this.msaaColorBuffer = new Uint8Array(width * height * 4 * 4);
        }
    }
    Buffer.prototype.getZPos = function (x, y, index) {
        if (!this.usingMSAA) {
            return this.width * y + x;
        }
        else {
            return (this.width * y + x) * 4 + index;
        }
    };
    Buffer.prototype.ztest = function (x, y, rhw, index) {
        if (index === void 0) { index = 0; }
        var zPos = this.getZPos(x, y, index);
        if (isNaN(this.zbuf[zPos]) || this.zbuf[zPos] > rhw) {
            return true;
        }
        return false;
    };
    Buffer.prototype.setZ = function (x, y, rhw, index) {
        if (index === void 0) { index = 0; }
        var zPos = this.getZPos(x, y, index);
        this.zbuf[zPos] = rhw;
    };
    Buffer.prototype.setColor = function (x, y, color, index) {
        if (index === void 0) { index = 0; }
        var pstart = 0;
        if (!this.usingMSAA) {
            pstart = (this.width * y + x) * 4;
        }
        else {
            pstart = (this.width * y + x) * 4 * 4 + index * 4;
        }
        this.frameBuffer[pstart] = color.r;
        this.frameBuffer[pstart + 1] = color.g;
        this.frameBuffer[pstart + 2] = color.b;
        this.frameBuffer[pstart + 3] = color.a;
    };
    Buffer.prototype.clear = function (backgroundColor) {
        for (var l = 0; l < this.frameBuffer.length; l += 4) {
            this.frameBuffer[l] = backgroundColor.r;
            this.frameBuffer[l + 1] = backgroundColor.g;
            this.frameBuffer[l + 2] = backgroundColor.b;
            this.frameBuffer[l + 3] = backgroundColor.a;
        }
        for (var l = 0; l < this.zbuf.length; l++) {
            this.zbuf[l] = NaN;
        }
        if (this.msaaColorBuffer != null) {
            for (var l = 0; l < this.msaaColorBuffer.length; l++) {
                this.msaaColorBuffer[l] = NaN;
            }
        }
    };
    Buffer.prototype.applyMSAAFilter = function () {
        if (this.msaaColorBuffer == null) {
            return;
        }
    };
    return Buffer;
})();
exports["default"] = Buffer;
//# sourceMappingURL=buffer.js.map