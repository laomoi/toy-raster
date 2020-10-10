var webgl_blitter_1 = require("./blitter/webgl-blitter");
var data_1 = require("./engine/data");
var raster_1 = require("./engine/raster");
var App = (function () {
    function App(canvasWidth, canvasHeight, gl) {
        this.blitter = null;
        this.renderder = new raster_1["default"](canvasWidth, canvasHeight);
        this.blitter = new webgl_blitter_1.WebGLBlitter(gl);
        var self = this;
        var wrapMainLoop = function () {
            self.mainLoop();
            requestAnimationFrame(wrapMainLoop);
        };
        wrapMainLoop();
    }
    App.prototype.mainLoop = function () {
        this.renderder.clear();
        var va = [
            { posWorld: new data_1.Vector(-1, -1, 1), color: data_1.ColorEnums.GREEN, uv: { u: 0, v: 0 } },
            { posWorld: new data_1.Vector(1, -1, 1), color: data_1.ColorEnums.BLUE, uv: { u: 1, v: 0 } },
            { posWorld: new data_1.Vector(1, 1, 1), color: data_1.ColorEnums.RED, uv: { u: 1, v: 1 } },
            { posWorld: new data_1.Vector(-1, 1, 1), color: data_1.ColorEnums.ORANGE, uv: { u: 0, v: 1 } },
            { posWorld: new data_1.Vector(-1, -1, -1), color: data_1.ColorEnums.GREEN, uv: { u: 0, v: 0 } },
            { posWorld: new data_1.Vector(1, -1, -1), color: data_1.ColorEnums.BLUE, uv: { u: 1, v: 0 } },
            { posWorld: new data_1.Vector(1, 1, -1), color: data_1.ColorEnums.RED, uv: { u: 1, v: 1 } },
            { posWorld: new data_1.Vector(-1, 1, -1), color: data_1.ColorEnums.ORANGE, uv: { u: 0, v: 1 } },
        ];
        var elements = [
            0, 1, 2,
            2, 3, 0,
            7, 6, 5,
            5, 4, 7,
            0, 4, 5,
            5, 1, 0,
            1, 5, 6,
            6, 2, 1,
            2, 6, 7,
            7, 3, 2,
            3, 7, 4,
            4, 0, 3
        ];
        this.renderder.setActiveTexture(this.createTexture());
        this.renderder.drawElements(va, elements);
        this.flush();
    };
    App.prototype.createTexture = function () {
        var texture = new data_1.Texture(256, 256);
        for (var i = 0; i < 256; i++) {
            for (var j = 0; j < 256; j++) {
                var x = Math.floor(i / 32);
                var y = Math.floor(j / 32);
                if ((x + y) % 2 == 0) {
                    texture.setPixel(j, i, data_1.ColorEnums.BLUE);
                }
                else {
                    texture.setPixel(j, i, data_1.ColorEnums.WHITE);
                }
            }
        }
        return texture;
    };
    App.prototype.flush = function () {
        this.blitter.blitPixels(this.renderder.width, this.renderder.height, this.renderder.frameBuffer);
    };
    return App;
})();
exports["default"] = App;
window.onload = function () {
    var canvas = document.getElementById('canvas');
    var gl = canvas.getContext('webgl');
    if (!gl) {
        console.log("WEBGL FAILED");
        return;
    }
    var app = new App(canvas.width, canvas.height, gl);
};
//# sourceMappingURL=main.js.map