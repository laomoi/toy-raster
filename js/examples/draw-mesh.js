var vector_1 = require("../core/math/vector");
var color_1 = require("../core/mesh/color");
var texture_1 = require("../core/mesh/texture");
var shader_1 = require("../core/mesh/shader");
var diablo3_pose_obj_1 = require('raw-loader!../../res/diablo3_pose.obj');
var DrawMesh = (function () {
    function DrawMesh(renderer) {
        this.triangles = [];
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
        for (var _i = 0, _a = this.triangles; _i < _a.length; _i++) {
            var triangle = _a[_i];
            this.renderer.drawTriangle(triangle);
        }
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