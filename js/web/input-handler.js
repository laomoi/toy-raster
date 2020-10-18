var InputHandler = (function () {
    function InputHandler(example) {
        this.isMouseDown = false;
        var self = this;
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
    InputHandler.prototype.onMouseDown = function (x, y) {
        this.isMouseDown = true;
        this.lastMouseX = x;
        this.lastMouseY = y;
    };
    InputHandler.prototype.onMouseMove = function (x, y) {
        if (this.isMouseDown) {
            var deltaX = x - this.lastMouseX;
            var deltaY = y - this.lastMouseY;
            this.example.onMove(deltaX, deltaY);
            this.lastMouseY = y;
            this.lastMouseX = x;
        }
    };
    InputHandler.prototype.onMouseUp = function (x, y) {
        this.isMouseDown = false;
    };
    InputHandler.prototype.onMouseWheel = function (delta) {
        if (this.example.onWheel) {
            this.example.onWheel(delta);
        }
    };
    return InputHandler;
})();
exports["default"] = InputHandler;
//# sourceMappingURL=input-handler.js.map