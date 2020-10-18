var vector4_1 = require("../core/math/vector4");
var color_1 = require("../core/shading/color");
var shader_1 = require("../core/shading/shader");
var texture_1 = require("../core/shading/texture");
var vector2_1 = require("../core/math/vector2");
var floor_diffuse_png_1 = require('../../res/floor_diffuse.png');
var input_handler_1 = require("../web/input-handler");
var math_utils_1 = require("../core/math/math-utils");
var matrix_1 = require("../core/math/matrix");
var DrawBox = (function () {
    function DrawBox(renderer) {
        this.fovy = Math.PI / 2;
        this.eye = new vector4_1.Vector4(1.5, 0, 2.5, 1);
        this.texture = this.createTexture();
        this.renderer = renderer;
        this.inputHandler = new input_handler_1["default"](this);
        this.init();
    }
    DrawBox.prototype.setCamera = function () {
        var at = new vector4_1.Vector4(0, 0, 0, 1);
        var up = new vector4_1.Vector4(0, 1, 0, 1);
        var aspect = this.renderer.width / this.renderer.height;
        var near = 1;
        var far = 500;
        this.renderer.setCamera(this.eye, at, up, this.fovy, aspect, near, far);
    };
    DrawBox.prototype.init = function () {
        this.setCamera();
        this.renderer.setBackgroundColor(color_1.Color.GRAY);
        var texture = this.texture;
        var shader = new shader_1["default"]({
            vertexShading: function (vertex, input) {
                vertex.posModel.transform(input.viewProject, vertex.context.posProject);
                vertex.context.varyingVec2Dict[shader_1.ShaderVarying.UV] = vertex.uv;
                return vertex.context.posProject;
            },
            fragmentShading: function (input) {
                var tex = texture.sample(input.varyingVec2Dict[shader_1.ShaderVarying.UV]);
                return color_1.Color.multiplyColor(tex, input.color, tex);
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
                { posModel: va[elements[e]], color: color_1.Color.WHITE, uv: uv00 },
                { posModel: va[elements[e + 1]], color: color_1.Color.WHITE, uv: uv10 },
                { posModel: va[elements[e + 2]], color: color_1.Color.WHITE, uv: uv11 },
            ]);
            this.renderer.drawTriangle([
                { posModel: va[elements[e + 3]], color: color_1.Color.WHITE, uv: uv11 },
                { posModel: va[elements[e + 4]], color: color_1.Color.WHITE, uv: uv01 },
                { posModel: va[elements[e + 5]], color: color_1.Color.WHITE, uv: uv00 },
            ]);
        }
    };
    DrawBox.prototype.createTexture = function () {
        return texture_1["default"].createTextureFromBmpBuffer(floor_diffuse_png_1["default"]);
    };
    DrawBox.prototype.onWheel = function (delta) {
        this.fovy = math_utils_1["default"].clamp(this.fovy + (delta > 0 ? 0.05 : -0.05), Math.PI / 6, Math.PI * 2 / 3);
        this.setCamera();
    };
    DrawBox.prototype.onMove = function (dx, dy) {
        var angleX = -dx / 30 * Math.PI / 180 * 10;
        var angleY = -dy / 30 * Math.PI / 180 * 10;
        var mat1 = new matrix_1.Matrix();
        mat1.setRotateY(angleX);
        var mat2 = new matrix_1.Matrix();
        mat2.setRotateX(angleY);
        this.eye.transform(mat1.multiply(mat2), this.eye);
        this.setCamera();
    };
    return DrawBox;
})();
exports["default"] = DrawBox;
//# sourceMappingURL=draw-box.js.map