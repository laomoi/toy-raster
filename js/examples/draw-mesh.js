var vector4_1 = require("../core/math/vector4");
var color_1 = require("../core/shading/color");
var texture_1 = require("../core/shading/texture");
var shader_1 = require("../core/shading/shader");
var matrix_1 = require("../core/math/matrix");
var math_utils_1 = require("../core/math/math-utils");
var model_1 = require("../core/shading/model");
var african_head_obj_1 = require('raw-loader!../../res/african_head.obj');
var african_head_diffuse_png_1 = require('../../res/african_head_diffuse.png');
var african_head_nm_png_1 = require('../../res/african_head_nm.png');
var african_head_spec_png_1 = require('../../res/african_head_spec.png');
var input_handler_1 = require("../web/input-handler");
var DrawMesh = (function () {
    function DrawMesh(renderer) {
        this.usingTangentNormal = true;
        this.fovy = Math.PI / 4;
        this.eye = new vector4_1.Vector4(1, 1, 3, 1);
        this.modelMatrix = new matrix_1.Matrix();
        this.renderer = renderer;
        this.inputHandler = new input_handler_1["default"](this);
        this.init();
    }
    DrawMesh.prototype.setCamera = function () {
        var at = new vector4_1.Vector4(0, 0, 0, 1);
        var up = new vector4_1.Vector4(0, 1, 0, 1);
        var aspect = this.renderer.width / this.renderer.height;
        var near = 1;
        var far = 500;
        this.renderer.setCamera(this.eye, at, up, this.fovy, aspect, near, far);
    };
    DrawMesh.prototype.init = function () {
        this.setCamera();
        this.renderer.setBackgroundColor(color_1.Color.GRAY);
        this.loadObj();
        this.loadTextures();
        var lightDir = (new vector4_1.Vector4(1, 1, 1)).normalize();
        var diffuseTexture = this.diffuseTexture;
        var normalTexture = this.normalTexture;
        var specTexture = this.specTexture;
        var fragColor = new color_1.Color();
        var eye = this.eye;
        var modelMatrix = this.modelMatrix;
        var shader = new shader_1["default"]({
            vertexShading: function (vertex, input) {
                var posWorld = vertex.posModel.transform(modelMatrix);
                vertex.context.posProject = posWorld.transform(input.viewProject);
                vertex.context.varyingVec2Dict[shader_1.ShaderVarying.UV] = vertex.uv;
                vertex.context.varyingVec4Dict[shader_1.ShaderVarying.WORLD_POS] = posWorld;
                return vertex.context.posProject;
            },
            fragmentShading: function (input) {
                var uv = input.varyingVec2Dict[shader_1.ShaderVarying.UV];
                var diffuseColor = diffuseTexture.sample(uv);
                var normal = normalTexture.sampleAsVector(uv);
                var specFactor = specTexture.sample(uv).b;
                var n = normal.normalize();
                var worldPos = input.varyingVec4Dict[shader_1.ShaderVarying.WORLD_POS];
                var diffuseIntense = math_utils_1["default"].saturate(n.dot(lightDir));
                var viewDir = eye.sub(worldPos).normalize();
                var halfDir = lightDir.add(viewDir).normalize();
                var specIntense = Math.pow(Math.max(0, n.dot(halfDir)), 5 * specFactor);
                var factor = diffuseIntense + specIntense;
                var ambient = 5;
                fragColor.set(diffuseColor).multiplyRGB(factor).add(ambient);
                fragColor.a = 255;
                return fragColor;
            }
        });
        this.renderer.setShader(shader);
    };
    DrawMesh.prototype.loadTextures = function () {
        this.diffuseTexture = texture_1["default"].createTextureFromBmpBuffer(african_head_diffuse_png_1["default"]);
        this.normalTexture = texture_1["default"].createTextureFromBmpBuffer(african_head_nm_png_1["default"]);
        this.specTexture = texture_1["default"].createTextureFromBmpBuffer(african_head_spec_png_1["default"]);
    };
    DrawMesh.prototype.loadObj = function () {
        this.model = new model_1["default"]();
        this.model.createFromObjBuffer(african_head_obj_1["default"]);
    };
    DrawMesh.prototype.draw = function () {
        var triangles = this.model.triangles;
        for (var _i = 0; _i < triangles.length; _i++) {
            var triangle = triangles[_i];
            this.renderer.drawTriangle(triangle);
        }
    };
    DrawMesh.prototype.onWheel = function (delta) {
        this.fovy = math_utils_1["default"].clamp(this.fovy + (delta > 0 ? 0.05 : -0.05), Math.PI / 6, Math.PI * 2 / 3);
        this.setCamera();
    };
    DrawMesh.prototype.onMove = function (dx, dy) {
        var angleX = -dx / 30 * Math.PI / 180 * 10;
        var angleY = -dy / 30 * Math.PI / 180 * 10;
        var mat1 = new matrix_1.Matrix();
        mat1.setRotateY(angleX);
        var mat2 = new matrix_1.Matrix();
        mat2.setRotateX(angleY);
        this.eye.transform(mat1.multiply(mat2), this.eye);
        this.setCamera();
    };
    return DrawMesh;
})();
exports["default"] = DrawMesh;
//# sourceMappingURL=draw-mesh.js.map