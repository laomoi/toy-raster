"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webgl_blitter_1 = require("./web/webgl-blitter");
const raster_1 = require("./core/raster");
const draw_mesh_1 = require("./examples/draw-mesh");
class App {
    constructor() {
        this.showFPSCallback = null;
        this.blitter = null;
    }
    setGL(gl, width, height) {
        this.gl = gl;
        this.width = width;
        this.height = height;
    }
    run() {
        this.renderer = new raster_1.default(this.width, this.height, true);
        this.blitter = new webgl_blitter_1.WebGLBlitter(this.gl);
        this.example = new draw_mesh_1.default(this.renderer);
        let then = 0;
        let lastShowFPS = 0;
        let loopWrap = (now) => {
            now *= 0.001;
            const deltaTime = now - then;
            if (then > 0 && deltaTime > 0 && this.showFPSCallback != null) {
                if (now - lastShowFPS > 0.3) {
                    const fps = 1 / deltaTime;
                    this.showFPSCallback(fps);
                    lastShowFPS = now;
                }
            }
            then = now;
            this.loop();
            requestAnimationFrame(loopWrap);
        };
        loopWrap(0);
    }
    setShowFPSCallback(callback) {
        this.showFPSCallback = callback;
    }
    loop() {
        this.renderer.clear();
        this.example.draw();
        this.flush();
    }
    flush() {
        this.blitter.blitPixels(this.renderer.width, this.renderer.height, this.renderer.getFrameBuffer());
    }
}
exports.default = App;
