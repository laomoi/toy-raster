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
var DrawMesh = (function () {
    function DrawMesh(renderer) {
        this.renderer = renderer;
        this.init();
    }
    DrawMesh.prototype.init = function () {
        var eye = new vector4_1.Vector4(1, 1, 3, 1);
        var at = new vector4_1.Vector4(0, 0, 0, 1);
        var up = new vector4_1.Vector4(0, 1, 0, 1);
        var fovy = Math.PI / 4;
        var aspect = this.renderer.width / this.renderer.height;
        var near = 1;
        var far = 500;
        this.renderer.setCamera(eye, at, up, fovy, aspect, near, far);
        this.renderer.setBackgroundColor(color_1.Colors.GRAY);
        this.loadObj();
        this.loadTextures();
        var lightDir = (new vector4_1.Vector4(1, 1, 1)).normalize();
        var diffuseTexture = this.diffuseTexture;
        var normalTexture = this.normalTexture;
        var specTexture = this.specTexture;
        var modelMatrix = new matrix_1.Matrix();
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
                var specIntense = Math.pow(Math.max(0, n.dot(halfDir)), specFactor) * 0.6;
                var factor = diffuseIntense + specIntense;
                diffuseColor.r *= factor;
                diffuseColor.g *= factor;
                diffuseColor.b *= factor;
                return diffuseColor;
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
    return DrawMesh;
})();
exports["default"] = DrawMesh;
//# sourceMappingURL=draw-mesh.js.map