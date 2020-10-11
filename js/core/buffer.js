var Buffer = (function () {
    function Buffer(width, height, usingMSAA) {
        this.usingMSAA = true;
        this.zbuf = null;
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
    Buffer.prototype.ztest = function (x, y, rhw) {
        var zPos = this.width * y + x;
        if (isNaN(this.zbuf[zPos]) || this.zbuf[zPos] > rhw) {
            return true;
        }
        return false;
    };
    Buffer.prototype.setZ = function (x, y, rhw) {
        var zPos = this.width * y + x;
        this.zbuf[zPos] = rhw;
    };
    Buffer.prototype.setColor = function (x, y, color) {
        var pstart = (this.width * y + x) * 4;
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
    };
    return Buffer;
})();
exports["default"] = Buffer;
//# sourceMappingURL=buffer.js.map