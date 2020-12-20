"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vector4_1 = require("../core/math/vector4");
const color_1 = require("../core/shading/color");
const texture_1 = require("../core/shading/texture");
const shader_1 = require("../core/shading/shader");
const matrix_1 = require("../core/math/matrix");
const math_utils_1 = require("../core/math/math-utils");
const model_1 = require("../core/shading/model");
const input_handler_1 = require("../web/input-handler");
class DrawMesh {
    constructor(renderer) {
        this.fovy = Math.PI / 4;
        this.eye = new vector4_1.Vector4(1, 1, 3, 1);
        this.modelMatrix = new matrix_1.Matrix();
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
        this.loadObj();
        this.loadTextures();
        let lightDir = (new vector4_1.Vector4(1, 1, 1)).normalize();
        let diffuseTexture = this.diffuseTexture;
        let normalTexture = this.normalTexture;
        let specTexture = this.specTexture;
        let fragColor = new color_1.Color();
        let eye = this.eye;
        let modelMatrix = this.modelMatrix;
        let shader = new shader_1.default({
            vertexShading: function (vertex, input) {
                let posWorld = vertex.posModel.transform(modelMatrix);
                vertex.context.posProject = posWorld.transform(input.viewProject);
                vertex.context.varyingVec2Dict[shader_1.ShaderVarying.UV] = vertex.uv;
                vertex.context.varyingVec4Dict[shader_1.ShaderVarying.WORLD_POS] = posWorld;
                return vertex.context.posProject;
            },
            fragmentShading: function (input) {
                let uv = input.varyingVec2Dict[shader_1.ShaderVarying.UV];
                let diffuseColor = diffuseTexture.sample(uv);
                let normal = normalTexture.sampleAsVector(uv);
                let specFactor = specTexture.sample(uv).b;
                let n = normal.normalize();
                let worldPos = input.varyingVec4Dict[shader_1.ShaderVarying.WORLD_POS];
                let diffuseIntense = math_utils_1.default.saturate(n.dot(lightDir));
                let viewDir = eye.sub(worldPos).normalize();
                let halfDir = lightDir.add(viewDir).normalize();
                let specIntense = Math.pow(Math.max(0, n.dot(halfDir)), 5 * specFactor);
                let factor = diffuseIntense + specIntense;
                let ambient = 5;
                fragColor.set(diffuseColor).multiplyRGB(factor).add(ambient);
                fragColor.a = 255;
                return fragColor;
            }
        });
        this.renderer.setShader(shader);
    }
    loadTextures() {
        this.diffuseTexture = texture_1.default.createTextureFromFile("african_head_diffuse.png");
        this.normalTexture = texture_1.default.createTextureFromFile("african_head_nm.png");
        this.specTexture = texture_1.default.createTextureFromFile("african_head_spec.png");
    }
    loadObj() {
        this.model = new model_1.default();
        this.model.createFromFile("african_head.obj");
    }
    draw() {
        let triangles = this.model.triangles;
        for (let triangle of triangles) {
            this.renderer.drawTriangle(triangle);
        }
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
exports.default = DrawMesh;
