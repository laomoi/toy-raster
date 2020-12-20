"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vector2_1 = require("../math/vector2");
const vector4_1 = require("../math/vector4");
const color_1 = require("./color");
const fs = require("fs");
const path = require("path");
class Model {
    constructor() {
        this.triangles = [];
    }
    createFromFile(file) {
        let objContent = fs.readFileSync(path.join(__dirname, "../../../res/" + file), "utf8");
        this.triangles = [];
        let lines = objContent.split(/\r\n|\n/);
        let vList = [];
        let uvList = [];
        let normalList = [];
        let faceList = [];
        for (let line of lines) {
            if (line != "") {
                if (line.charAt(0) == "#") {
                    continue;
                }
                let vals = line.split(/\s+/);
                let t = vals[0];
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
                    let fvals = [
                        vals[1].split("/"),
                        vals[2].split("/"),
                        vals[3].split("/"),
                    ];
                    faceList.push(fvals);
                }
            }
        }
        for (let f of faceList) {
            let v1s = f[0];
            let v2s = f[1];
            let v3s = f[2];
            let v1 = vList[parseInt(v1s[0]) - 1];
            let v2 = vList[parseInt(v2s[0]) - 1];
            let v3 = vList[parseInt(v3s[0]) - 1];
            let uv1 = uvList[parseInt(v1s[1]) - 1];
            let uv2 = uvList[parseInt(v2s[1]) - 1];
            let uv3 = uvList[parseInt(v3s[1]) - 1];
            let n1 = normalList[parseInt(v1s[2]) - 1];
            let n2 = normalList[parseInt(v2s[2]) - 1];
            let n3 = normalList[parseInt(v3s[2]) - 1];
            this.triangles.push([
                { posModel: v1, color: color_1.Color.WHITE, uv: uv1, normal: n1 },
                { posModel: v2, color: color_1.Color.WHITE, uv: uv2, normal: n2 },
                { posModel: v3, color: color_1.Color.WHITE, uv: uv3, normal: n3 },
            ]);
        }
    }
}
exports.default = Model;
