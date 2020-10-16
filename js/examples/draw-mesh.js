var vector4_1 = require("../core/math/vector4");
var color_1 = require("../core/shading/color");
var texture_1 = require("../core/shading/texture");
var shader_1 = require("../core/shading/shader");
var vector2_1 = require("../core/math/vector2");
var diablo3_pose_obj_1 = require('raw-loader!../../res/diablo3_pose.obj');
var diablo3_pose_diffuse_png_1 = require('../../res/diablo3_pose_diffuse.png');
var math_utils_1 = require("../core/math/math-utils");
var DrawMesh = (function () {
    function DrawMesh(renderer) {
        this.triangles = [];
        this.renderer = renderer;
        this.init();
    }
    DrawMesh.prototype.init = function () {
        var eye = new vector4_1.Vector4(0.5, 0, 2.0, 1);
        var at = new vector4_1.Vector4(0, 0, 0, 1);
        var up = new vector4_1.Vector4(0, 1, 0, 1);
        var fovy = Math.PI / 2;
        var aspect = this.renderer.width / this.renderer.height;
        var near = 1;
        var far = 500;
        this.renderer.setCamera(eye, at, up, fovy, aspect, near, far);
        this.renderer.setBackgroundColor(color_1.Colors.GRAY);
        this.loadObj();
        this.loadTextures();
        var lightDirNormalize = (new vector4_1.Vector4(1, 1, 0.7)).normalize();
        var diffuseTexture = this.diffuseTexture;
        var shader = new shader_1["default"]({
            vertexShading: function (vertex, input) {
                vertex.posWorld.transform(input.viewProject, vertex.context.posProject);
                return vertex.context.posProject;
            },
            fragmentShading: function (context) {
                var diffuse = diffuseTexture.sample(context.uv);
                color_1.Colors.multiplyColor(diffuse, context.color, diffuse);
                var c = context.normal.normalize().dot(lightDirNormalize);
                c = math_utils_1["default"].clamp(c, 0, 1);
                diffuse.r *= c;
                diffuse.g *= c;
                diffuse.b *= c;
                return diffuse;
            }
        });
        this.renderer.setShader(shader);
    };
    DrawMesh.prototype.base64ToArrayBuffer = function (base64) {
        var binary_string = window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes;
    };
    DrawMesh.prototype.createTextureFromBmpBuffer = function (bmp) {
        var buffer = this.base64ToArrayBuffer(bmp.data);
        var width = bmp.width;
        var height = bmp.height;
        var texture = new texture_1["default"](width, height);
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                var pos = ((height - y - 1) * width + x) * 4;
                var color = {
                    r: buffer[pos],
                    g: buffer[pos + 1],
                    b: buffer[pos + 2],
                    a: buffer[pos + 3]
                };
                texture.setPixel(x, y, color);
            }
        }
        return texture;
    };
    DrawMesh.prototype.loadTextures = function () {
        this.diffuseTexture = this.createTextureFromBmpBuffer(diablo3_pose_diffuse_png_1["default"]);
    };
    DrawMesh.prototype.loadObj = function () {
        var lines = diablo3_pose_obj_1["default"].split(/\r\n|\n/);
        var vList = [];
        var uvList = [];
        var normalList = [];
        var faceList = [];
        for (var _i = 0; _i < lines.length; _i++) {
            var line = lines[_i];
            if (line != "") {
                if (line.charAt(0) == "#") {
                    continue;
                }
                var vals = line.split(/\s+/);
                var t = vals[0];
                if (t == "v" && vals.length >= 4) {
                    vList.push(new vector4_1.Vector4(parseFloat(vals[1]), parseFloat(vals[2]), parseFloat(vals[3])));
                }
                else if (t == "vt" && vals.length >= 3) {
                    uvList.push(new vector2_1.Vector2(parseFloat(vals[1]), parseFloat(vals[2])));
                }
                else if (t == "vn" && vals.length >= 4) {
                    normalList.push(new vector4_1.Vector4(parseFloat(vals[1]), parseFloat(vals[2]), parseFloat(vals[3])));
                }
                else if (t == "f" && vals.length >= 4) {
                    var fvals = [
                        vals[1].split("/"),
                        vals[2].split("/"),
                        vals[3].split("/"),
                    ];
                    faceList.push(fvals);
                }
            }
        }
        for (var _a = 0; _a < faceList.length; _a++) {
            var f = faceList[_a];
            var v1s = f[0];
            var v2s = f[1];
            var v3s = f[2];
            var v1 = vList[parseInt(v1s[0]) - 1];
            var v2 = vList[parseInt(v2s[0]) - 1];
            var v3 = vList[parseInt(v3s[0]) - 1];
            var uv1 = uvList[parseInt(v1s[1]) - 1];
            var uv2 = uvList[parseInt(v2s[1]) - 1];
            var uv3 = uvList[parseInt(v3s[1]) - 1];
            var n1 = normalList[parseInt(v1s[2]) - 1];
            var n2 = normalList[parseInt(v2s[2]) - 1];
            var n3 = normalList[parseInt(v3s[2]) - 1];
            this.triangles.push([
                { posWorld: v1, color: color_1.Colors.WHITE, uv: uv1, normal: n1 },
                { posWorld: v2, color: color_1.Colors.WHITE, uv: uv2, normal: n2 },
                { posWorld: v3, color: color_1.Colors.WHITE, uv: uv3, normal: n3 },
            ]);
        }
    };
    DrawMesh.prototype.draw = function () {
        for (var _i = 0, _a = this.triangles; _i < _a.length; _i++) {
            var triangle = _a[_i];
            this.renderer.drawTriangle(triangle);
        }
    };
    return DrawMesh;
})();
exports["default"] = DrawMesh;
//# sourceMappingURL=draw-mesh.js.map