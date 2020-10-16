var webgl_blitter_1 = require("./blitter/webgl-blitter");
var raster_1 = require("./core/raster");
var draw_mesh_1 = require("./examples/draw-mesh");
var App = (function () {
    function App(canvasWidth, canvasHeight, gl) {
        this.blitter = null;
        this.renderer = new raster_1["default"](canvasWidth, canvasHeight, false);
        this.blitter = new webgl_blitter_1.WebGLBlitter(gl);
        this.example = new draw_mesh_1["default"](this.renderer);
        var self = this;
        var wrapMainLoop = function () {
            self.mainLoop();
            requestAnimationFrame(wrapMainLoop);
        };
        wrapMainLoop();
    }
    App.prototype.mainLoop = function () {
        this.renderer.clear();
        this.example.draw();
        this.flush();
    };
    App.prototype.flush = function () {
        this.blitter.blitPixels(this.renderer.width, this.renderer.height, this.renderer.getFrameBuffer());
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
    window.app = new App(canvas.width, canvas.height, gl);
};
//# sourceMappingURL=main.js.map