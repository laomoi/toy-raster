var vector_1 = require("../core/math/vector");
var color_1 = require("../core/mesh/color");
var texture_1 = require("../core/mesh/texture");
var DrawMesh = (function () {
    function DrawMesh(renderer) {
        this.texture = this.createTexture();
        this.renderer = renderer;
        this.init();
    }
    DrawMesh.prototype.init = function () {
        var eye = new vector_1.Vector(1.5, 0, 2.5, 1);
        var at = new vector_1.Vector(0, 0, 0, 1);
        var up = new vector_1.Vector(0, 1, 0, 1);
        var fovy = Math.PI / 2;
        var aspect = this.renderer.width / this.renderer.height;
        var near = 1;
        var far = 500;
        this.renderer.setCamera(eye, at, up, fovy, aspect, near, far);
        this.renderer.setBackgroundColor(color_1.Colors.YELLOW);
        this.loadObj();
    };
    DrawMesh.prototype.loadObj = function () {
        var buffer = require('arraybuffer-loader!../../res/diablo3_pose.obj');
        var array = new Uint8Array(buffer);
        console.log(array);
    };
    DrawMesh.prototype.draw = function () {
        var va = [
            { posWorld: new vector_1.Vector(-1, -1, 1), color: color_1.Colors.WHITE, uv: { u: 0, v: 0 } },
            { posWorld: new vector_1.Vector(1, -1, 1), color: color_1.Colors.WHITE, uv: { u: 1, v: 0 } },
            { posWorld: new vector_1.Vector(1, 1, 1), color: color_1.Colors.WHITE, uv: { u: 1, v: 1 } },
            { posWorld: new vector_1.Vector(-1, 1, 1), color: color_1.Colors.WHITE, uv: { u: 0, v: 1 } },
            { posWorld: new vector_1.Vector(-1, -1, -1), color: color_1.Colors.WHITE, uv: { u: 0, v: 0 } },
            { posWorld: new vector_1.Vector(1, -1, -1), color: color_1.Colors.WHITE, uv: { u: 1, v: 0 } },
            { posWorld: new vector_1.Vector(1, 1, -1), color: color_1.Colors.WHITE, uv: { u: 1, v: 1 } },
            { posWorld: new vector_1.Vector(-1, 1, -1), color: color_1.Colors.WHITE, uv: { u: 0, v: 1 } },
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
        this.renderer.setActiveTexture(this.texture);
        this.renderer.drawElements(va, elements);
    };
    DrawMesh.prototype.createTexture = function () {
        var texture = new texture_1["default"](256, 256);
        for (var i = 0; i < 256; i++) {
            for (var j = 0; j < 256; j++) {
                var x = Math.floor(i / 32);
                var y = Math.floor(j / 32);
                if ((x + y) % 2 == 0) {
                    texture.setPixel(j, i, color_1.Colors.BLUE);
                }
                else {
                    texture.setPixel(j, i, color_1.Colors.WHITE);
                }
            }
        }
        return texture;
    };
    return DrawMesh;
})();
exports["default"] = DrawMesh;
//# sourceMappingURL=draw-mesh.js.map