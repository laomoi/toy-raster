var vector4_1 = require("../core/math/vector4");
var color_1 = require("../core/shading/color");
var shader_1 = require("../core/shading/shader");
var texture_1 = require("../core/shading/texture");
var vector2_1 = require("../core/math/vector2");
var floor_diffuse_png_1 = require('../../res/floor_diffuse.png');
var DrawBox = (function () {
    function DrawBox(renderer) {
        this.texture = this.createTexture();
        this.renderer = renderer;
        this.init();
    }
    DrawBox.prototype.init = function () {
        var eye = new vector4_1.Vector4(1.5, 0, 2.5, 1);
        var at = new vector4_1.Vector4(0, 0, 0, 1);
        var up = new vector4_1.Vector4(0, 1, 0, 1);
        var fovy = Math.PI / 2;
        var aspect = this.renderer.width / this.renderer.height;
        var near = 1;
        var far = 500;
        this.renderer.setCamera(eye, at, up, fovy, aspect, near, far);
        this.renderer.setBackgroundColor(color_1.Colors.GRAY);
        var texture = this.texture;
        var shader = new shader_1["default"]({
            vertexShading: function (vertex, input) {
                vertex.posModel.transform(input.viewProject, vertex.context.posProject);
                vertex.context.varyingVec2Dict[shader_1.ShaderVarying.UV] = vertex.uv;
                return vertex.context.posProject;
            },
            fragmentShading: function (input) {
                var tex = texture.sample(input.varyingVec2Dict[shader_1.ShaderVarying.UV]);
                return color_1.Colors.multiplyColor(tex, input.color, tex);
            }
        });
        this.renderer.setShader(shader);
    };
    DrawBox.prototype.draw = function () {
        var va = [
            new vector4_1.Vector4(-1, -1, 1),
            new vector4_1.Vector4(1, -1, 1),
            new vector4_1.Vector4(1, 1, 1),
            new vector4_1.Vector4(-1, 1, 1),
            new vector4_1.Vector4(-1, -1, -1),
            new vector4_1.Vector4(1, -1, -1),
            new vector4_1.Vector4(1, 1, -1),
            new vector4_1.Vector4(-1, 1, -1),
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
            4, 0, 3,
        ];
        var uv00 = new vector2_1.Vector2(0, 0);
        var uv10 = new vector2_1.Vector2(1, 0);
        var uv11 = new vector2_1.Vector2(1, 1);
        var uv01 = new vector2_1.Vector2(0, 1);
        for (var e = 0; e < elements.length; e += 6) {
            this.renderer.drawTriangle([
                { posModel: va[elements[e]], color: color_1.Colors.WHITE, uv: uv00 },
                { posModel: va[elements[e + 1]], color: color_1.Colors.WHITE, uv: uv10 },
                { posModel: va[elements[e + 2]], color: color_1.Colors.WHITE, uv: uv11 },
            ]);
            this.renderer.drawTriangle([
                { posModel: va[elements[e + 3]], color: color_1.Colors.WHITE, uv: uv11 },
                { posModel: va[elements[e + 4]], color: color_1.Colors.WHITE, uv: uv01 },
                { posModel: va[elements[e + 5]], color: color_1.Colors.WHITE, uv: uv00 },
            ]);
        }
    };
    DrawBox.prototype.createTexture = function () {
        return texture_1["default"].createTextureFromBmpBuffer(floor_diffuse_png_1["default"]);
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
    return DrawBox;
})();
exports["default"] = DrawBox;
//# sourceMappingURL=draw-box.js.map