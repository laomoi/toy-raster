var vector_1 = require("../core/math/vector");
var color_1 = require("../core/mesh/color");
var texture_1 = require("../core/mesh/texture");
var diablo3_pose_obj_1 = require('raw-loader!../../res/diablo3_pose.obj');
var DrawMesh = (function () {
    function DrawMesh(renderer) {
        this.va = null;
        this.elements = null;
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
        var elements = [];
        for (var _a = 0; _a < vList.length; _a++) {
            var v = vList[_a];
            vertextList.push({
                posWorld: new vector_1.Vector(parseFloat(v[1]), parseFloat(v[2]), parseFloat(v[3])), color: color_1.Colors.WHITE, uv: { u: 0, v: 0 }
            });
        }
        for (var _b = 0; _b < faceList.length; _b++) {
            var f = faceList[_b];
            var v1 = f[0];
            var v2 = f[1];
            var v3 = f[2];
            elements.push(parseInt(v1[0]) - 1, parseInt(v2[0]) - 1, parseInt(v3[0]) - 1);
            if (elements[-1] > vertextList.length) {
                console.log("obj error, has wrong element", elements[-1], vertextList.length);
                return;
            }
        }
        this.va = vertextList;
        this.elements = elements;
        console.log(vertextList);
    };
    DrawMesh.prototype.draw = function () {
        if (this.va == null) {
            return;
        }
        this.renderer.drawElements(this.va, this.elements);
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