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
        if (!this.usingMSAA) {
            this.setFrameBufferPixel(x, y, color);
        }
        else {
            var pstart = (this.width * y + x) * 4 * 4 + index * 4;
            this.msaaColorBuffer[pstart] = color.r;
            this.msaaColorBuffer[pstart + 1] = color.g;
            this.msaaColorBuffer[pstart + 2] = color.b;
            this.msaaColorBuffer[pstart + 3] = color.a;
        }
    };
    Buffer.prototype.setFrameBufferPixel = function (x, y, color) {
        var pstart = (this.width * y + x) * 4;
        var a = color.a / 255;
        this.frameBuffer[pstart] = color.r * a + this.frameBuffer[pstart] * (1 - a);
        this.frameBuffer[pstart + 1] = color.g * a + this.frameBuffer[pstart + 1] * (1 - a);
        this.frameBuffer[pstart + 2] = color.b * a + this.frameBuffer[pstart + 2] * (1 - a);
        this.frameBuffer[pstart + 3] = 255;
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
            for (var l = 0; l < this.msaaColorBuffer.length; l += 4) {
                this.msaaColorBuffer[l] = backgroundColor.r;
                this.msaaColorBuffer[l + 1] = backgroundColor.g;
                this.msaaColorBuffer[l + 2] = backgroundColor.b;
                this.msaaColorBuffer[l + 3] = backgroundColor.a;
            }
        }
    };
    Buffer.prototype.applyMSAAFilter = function (x, y) {
        if (this.msaaColorBuffer == null) {
            return;
        }
        var pstart = (this.width * y + x) * 4 * 4;
        var color = { r: 0, g: 0, b: 0, a: 0 };
        for (var i = 0; i < 4; i++) {
            var colorStart = pstart + i * 4;
            var r = this.msaaColorBuffer[colorStart];
            var g = this.msaaColorBuffer[colorStart + 1];
            var b = this.msaaColorBuffer[colorStart + 2];
            var a = this.msaaColorBuffer[colorStart + 3];
            color.r += 0.25 * r;
            color.g += 0.25 * g;
            color.b += 0.25 * b;
            color.a += 0.25 * a;
        }
        this.setFrameBufferPixel(x, y, color);
    };
    return Buffer;
})();
exports["default"] = Buffer;
//# sourceMappingURL=buffer.js.map