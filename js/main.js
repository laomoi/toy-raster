var webgl_blitter_1 = require("./blitter/webgl-blitter");
var raster_1 = require("./core/raster");
var draw_mesh_1 = require("./examples/draw-mesh");
var App = (function () {
    function App(canvasWidth, canvasHeight, gl) {
        this.blitter = null;
        this.renderer = new raster_1["default"](canvasWidth, canvasHeight, true);
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
    App.prototype.onMouseDown = function (x, y) {
        console.log("down", x, y);
    };
    App.prototype.onMouseMove = function (x, y) {
    };
    App.prototype.onMouseUp = function (x, y) {
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
window.onmousedown = function (e) {
    window.app.onMouseDown(e.clientX, e.clientY);
    var canvas = document.getElementById('canvas');
    var rect = canvas.getBoundingClientRect();
};
window.onmousemove = function (e) {
    window.app.onMouseMove(e.clientX, e.clientY);
};
window.onmouseup = function (e) {
    window.app.onMouseUp(e.clientX, e.clientY);
};
//# sourceMappingURL=main.js.map