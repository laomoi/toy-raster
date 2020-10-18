var vector4_1 = require("../math/vector4");
var color_1 = require("./color");
(function (TEXTURE_FILTER_MODE) {
    TEXTURE_FILTER_MODE[TEXTURE_FILTER_MODE["NEAREST"] = 1] = "NEAREST";
    TEXTURE_FILTER_MODE[TEXTURE_FILTER_MODE["BILINEAR"] = 2] = "BILINEAR";
})(exports.TEXTURE_FILTER_MODE || (exports.TEXTURE_FILTER_MODE = {}));
var TEXTURE_FILTER_MODE = exports.TEXTURE_FILTER_MODE;
var Texture = (function () {
    function Texture(width, height) {
        this.data = [];
        this.tmp = new color_1.Color();
        this.filterMode = TEXTURE_FILTER_MODE.BILINEAR;
        this.width = width;
        this.height = height;
    }
    Texture.createTextureFromBmpBuffer = function (bmp) {
        var buffer = this.base64ToArrayBuffer(bmp.data);
        var width = bmp.width;
        var height = bmp.height;
        var texture = new Texture(width, height);
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                var pos = ((height - y - 1) * width + x) * 4;
                var color = new color_1.Color(buffer[pos], buffer[pos + 1], buffer[pos + 2], buffer[pos + 3]);
                texture.setPixel(x, y, color);
            }
        }
        return texture;
    };
    Texture.base64ToArrayBuffer = function (base64) {
        var binary_string = window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes;
    };
    Texture.prototype.setPixel = function (x, y, color) {
        var pos = y * this.width + x;
        this.data[pos] = color;
    };
    Texture.prototype.sample = function (uv) {
        var x = uv.x * (this.width - 1);
        var y = uv.y * (this.height - 1);
        return this.samplePos(x + 0.5, y + 0.5);
    };
    Texture.prototype.sampleAsVector = function (uv) {
        var color = this.sample(uv);
        return new vector4_1.Vector4((color.r / 255) * 2 - 1, (color.g / 255) * 2 - 1, (color.b / 255) * 2 - 1, (color.a / 255) * 2 - 1);
    };
    Texture.prototype.clamp = function (value, min, max) {
        if (value > max) {
            return max;
        }
        if (value < min) {
            return min;
        }
        return value;
    };
    Texture.prototype.getPixel = function (x, y) {
        return this.data[y * this.width + x];
    };
    Texture.prototype.samplePos = function (x, y) {
        if (this.filterMode == TEXTURE_FILTER_MODE.NEAREST) {
            x = this.clamp(Math.floor(x), 0, this.width - 1);
            y = this.clamp(Math.floor(y), 0, this.height - 1);
            var color = this.getPixel(x, y);
            this.tmp.a = color.a;
            this.tmp.r = color.r;
            this.tmp.g = color.g;
            this.tmp.b = color.b;
            return this.tmp;
        }
        else if (this.filterMode == TEXTURE_FILTER_MODE.BILINEAR) {
            var x1 = this.clamp(Math.floor(x), 0, this.width - 1);
            var y1 = this.clamp(Math.floor(y), 0, this.height - 1);
            var x2 = this.clamp(Math.floor(x) + 1, 0, this.width - 1);
            var y2 = this.clamp(Math.floor(y) + 1, 0, this.height - 1);
            var c1 = this.getPixel(x1, y1);
            var c2 = this.getPixel(x2, y1);
            var c3 = this.getPixel(x1, y2);
            var c4 = this.getPixel(x2, y2);
            var dx = x - x1;
            var dy = y - y1;
            var w1 = (1 - dx) * (1 - dy);
            var w2 = dx * (1 - dy);
            var w3 = (1 - dx) * dy;
            var w4 = dx * dy;
            color_1.Color.getBilinearColor(c1, c2, c3, c4, w1, w2, w3, w4, this.tmp);
            return this.tmp;
        }
        return color_1.Color.BLACK;
    };
    return Texture;
})();
exports["default"] = Texture;
//# sourceMappingURL=texture.js.map