var vector_1 = require("../core/math/vector");
var color_1 = require("../core/mesh/color");
var texture_1 = require("../core/mesh/texture");
var shader_1 = require("../core/mesh/shader");
var diablo3_pose_obj_1 = require('raw-loader!../../res/diablo3_pose.obj');
var diablo3_pose_diffuse_png_1 = require('../../res/diablo3_pose_diffuse.png');
var DrawMesh = (function () {
    function DrawMesh(renderer) {
        this.triangles = [];
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
        var shader = new shader_1["default"]({
            vertexShading: function (vertex, input) {
                vertex.posWorld.transform(input.viewProject, vertex.context.posProject);
                return vertex.context.posProject;
            },
            fragmentShading: function (context) {
                if (context.texture != null) {
                    var tex = context.texture.sample(context.uv);
                    return color_1.Colors.multiplyColor(tex, context.color, tex);
                }
                return context.color;
            }
        });
        this.renderer.setShader(shader);
        this.loadObj();
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
                var pos = (y * width + x) * 4;
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
    DrawMesh.prototype.loadObj = function () {
        this.diffuseTexture = this.createTextureFromBmpBuffer(diablo3_pose_diffuse_png_1["default"]);
        console.log(this.diffuseTexture);
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
                var vals = line.split(" ");
                var t = vals[0];
                if (t == "v" && vals.length >= 4) {
                    vList.push(vals);
                }
                else if (t == "vt" && vals.length >= 3) {
                    uvList.push(vals);
                }
                else if (t == "vn" && vals.length >= 4) {
                    normalList.push(vals);
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
        var vertextList = [];
        for (var _a = 0; _a < vList.length; _a++) {
            var v = vList[_a];
            vertextList.push(new vector_1.Vector(parseFloat(v[1]), parseFloat(v[2]), parseFloat(v[3])));
        }
        var vtest = {};
        for (var _b = 0; _b < faceList.length; _b++) {
            var f = faceList[_b];
            var v1s = f[0];
            var v2s = f[1];
            var v3s = f[2];
            var v1 = vertextList[parseInt(v1s[0]) - 1];
            var v2 = vertextList[parseInt(v2s[0]) - 1];
            var v3 = vertextList[parseInt(v3s[0]) - 1];
            this.triangles.push([
                { posWorld: v1, color: color_1.Colors.WHITE, uv: { u: 1, v: 1 } },
                { posWorld: v2, color: color_1.Colors.WHITE, uv: { u: 1, v: 0 } },
                { posWorld: v3, color: color_1.Colors.WHITE, uv: { u: 0, v: 0 } },
            ]);
        }
    };
    DrawMesh.prototype.draw = function () {
        var va = [
            new vector_1.Vector(-1, -1, 1),
            new vector_1.Vector(1, -1, 1),
            new vector_1.Vector(1, 1, 1),
            new vector_1.Vector(-1, 1, 1),
            new vector_1.Vector(-1, -1, -1),
            new vector_1.Vector(1, -1, -1),
            new vector_1.Vector(1, 1, -1),
            new vector_1.Vector(-1, 1, -1),
        ];
        var elements = [
            0, 1, 2,
            2, 3, 0,
        ];
        this.renderer.setActiveTexture(this.diffuseTexture);
        for (var e = 0; e < elements.length; e += 6) {
            this.renderer.drawTriangle([
                { posWorld: va[elements[e]], color: color_1.Colors.WHITE, uv: { u: 0, v: 0 } },
                { posWorld: va[elements[e + 1]], color: color_1.Colors.WHITE, uv: { u: 1, v: 0 } },
                { posWorld: va[elements[e + 2]], color: color_1.Colors.WHITE, uv: { u: 1, v: 1 } },
            ]);
            this.renderer.drawTriangle([
                { posWorld: va[elements[e + 3]], color: color_1.Colors.WHITE, uv: { u: 1, v: 1 } },
                { posWorld: va[elements[e + 4]], color: color_1.Colors.WHITE, uv: { u: 1, v: 0 } },
                { posWorld: va[elements[e + 5]], color: color_1.Colors.WHITE, uv: { u: 0, v: 0 } },
            ]);
        }
    };
    return DrawMesh;
})();
exports["default"] = DrawMesh;
//# sourceMappingURL=draw-mesh.js.map