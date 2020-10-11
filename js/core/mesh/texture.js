var Texture = (function () {
    function Texture(width, height) {
        this.data = [];
        this.tmp = { r: 0, g: 0, b: 0, a: 0 };
        this.width = width;
        this.height = height;
    }
    Texture.prototype.setPixel = function (x, y, color) {
        var pos = y * this.width + x;
        this.data[pos] = color;
    };
    Texture.prototype.sample = function (uv) {
        //clamp  sample
        //use nearest sampler
        var x = uv.u * (this.width - 1);
        var y = uv.v * (this.height - 1);
        x = Math.floor(x + 0.5);
        y = Math.floor(y + 0.5);
        if (x >= this.width) {
            x = this.width - 1;
        }
        if (y >= this.height) {
            y = this.height - 1;
        }
        var pos = y * this.width + x;
        var color = this.data[pos];
        this.tmp.a = color.a;
        this.tmp.r = color.r;
        this.tmp.g = color.g;
        this.tmp.b = color.b;
        return this.tmp;
    };
    return Texture;
})();
exports["default"] = Texture;
//# sourceMappingURL=texture.js.map