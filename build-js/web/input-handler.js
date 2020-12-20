"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InputHandler {
    constructor(example) {
        this.isMouseDown = false;
        let self = this;
        this.example = example;
        window.onmousedown = function (e) {
            self.onMouseDown(e.clientX, e.clientY);
        };
        window.onmousemove = function (e) {
            self.onMouseMove(e.clientX, e.clientY);
        };
        window.onmouseup = function (e) {
            self.onMouseUp(e.clientX, e.clientY);
        };
        window.onmousewheel = function (e) {
            self.onMouseWheel(e.deltaY);
        };
    }
    onMouseDown(x, y) {
        this.isMouseDown = true;
        this.lastMouseX = x;
        this.lastMouseY = y;
    }
    onMouseMove(x, y) {
        if (this.isMouseDown) {
            let deltaX = x - this.lastMouseX;
            let deltaY = y - this.lastMouseY;
            this.example.onMove(deltaX, deltaY);
            this.lastMouseY = y;
            this.lastMouseX = x;
        }
    }
    onMouseUp(x, y) {
        this.isMouseDown = false;
    }
    onMouseWheel(delta) {
        if (this.example.onWheel) {
            this.example.onWheel(delta);
        }
    }
}
exports.default = InputHandler;
