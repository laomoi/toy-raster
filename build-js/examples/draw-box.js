"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vector4_1 = require("../core/math/vector4");
const color_1 = require("../core/shading/color");
const shader_1 = require("../core/shading/shader");
const texture_1 = require("../core/shading/texture");
const vector2_1 = require("../core/math/vector2");
const input_handler_1 = require("../web/input-handler");
const math_utils_1 = require("../core/math/math-utils");
const matrix_1 = require("../core/math/matrix");
class DrawBox {
    constructor(renderer) {
        this.fovy = Math.PI / 2;
        this.eye = new vector4_1.Vector4(1.5, 0, 2.5, 1);
        this.texture = this.createTexture();
        this.renderer = renderer;
        this.inputHandler = new input_handler_1.default(this);
        this.init();
    }
    setCamera() {
        let at = new vector4_1.Vector4(0, 0, 0, 1);
        let up = new vector4_1.Vector4(0, 1, 0, 1);
        let aspect = this.renderer.width / this.renderer.height;
        let near = 1;
        let far = 500;
        this.renderer.setCamera(this.eye, at, up, this.fovy, aspect, near, far);
    }
    init() {
        this.setCamera();
        this.renderer.setBackgroundColor(color_1.Color.GRAY);
        let texture = this.texture;
        let shader = new shader_1.default({
            vertexShading: function (vertex, input) {
                vertex.posModel.transform(input.viewProject, vertex.context.posProject);
                vertex.context.varyingVec2Dict[shader_1.ShaderVarying.UV] = vertex.uv;
                return vertex.context.posProject;
            },
            fragmentShading: function (input) {
                let tex = texture.sample(input.varyingVec2Dict[shader_1.ShaderVarying.UV]);
                return color_1.Color.multiplyColor(tex, input.color, tex);
            }
        });
        this.renderer.setShader(shader);
    }
    draw() {
        let va = [
            new vector4_1.Vector4(-1, -1, 1),
            new vector4_1.Vector4(1, -1, 1),
            new vector4_1.Vector4(1, 1, 1),
            new vector4_1.Vector4(-1, 1, 1),
            new vector4_1.Vector4(-1, -1, -1),
            new vector4_1.Vector4(1, -1, -1),
            new vector4_1.Vector4(1, 1, -1),
            new vector4_1.Vector4(-1, 1, -1),
        ];
        let elements = [
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
        let uv00 = new vector2_1.Vector2(0, 0);
        let uv10 = new vector2_1.Vector2(1, 0);
        let uv11 = new vector2_1.Vector2(1, 1);
        let uv01 = new vector2_1.Vector2(0, 1);
        for (let e = 0; e < elements.length; e += 6) {
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
    }
    createTexture() {
        return texture_1.default.createTextureFromFile("floor_diffuse.png");
    }
    onWheel(delta) {
        this.fovy = math_utils_1.default.clamp(this.fovy + (delta > 0 ? 0.05 : -0.05), Math.PI / 6, Math.PI * 2 / 3);
        this.setCamera();
    }
    onMove(dx, dy) {
        let angleX = -dx / 30 * Math.PI / 180 * 10;
        let angleY = -dy / 30 * Math.PI / 180 * 10;
        let mat1 = new matrix_1.Matrix();
        mat1.setRotateY(angleX);
        let mat2 = new matrix_1.Matrix();
        mat2.setRotateX(angleY);
        this.eye.transform(mat1.multiply(mat2), this.eye);
        this.setCamera();
    }
}
exports.default = DrawBox;
