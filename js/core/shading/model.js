var vector2_1 = require("../math/vector2");
var vector4_1 = require("../math/vector4");
var color_1 = require("./color");
var Model = (function () {
    function Model() {
        this.triangles = [];
    }
    Model.prototype.createFromObjBuffer = function (objContent) {
        this.triangles = [];
        var lines = objContent.split(/\r\n|\n/);
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
                { posModel: v1, color: color_1.Color.WHITE, uv: uv1, normal: n1 },
                { posModel: v2, color: color_1.Color.WHITE, uv: uv2, normal: n2 },
                { posModel: v3, color: color_1.Color.WHITE, uv: uv3, normal: n3 },
            ]);
        }
    };
    return Model;
})();
exports["default"] = Model;
//# sourceMappingURL=model.js.map