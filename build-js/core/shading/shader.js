"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShaderVarying = void 0;
class ShaderVarying {
}
exports.ShaderVarying = ShaderVarying;
ShaderVarying.NORMAL = "normal";
ShaderVarying.UV = "uv";
ShaderVarying.EYE = "eye";
ShaderVarying.WORLD_POS = "world_pos";
class Shader {
    constructor(program) {
        this.program = program;
        this.vertexInput = { viewProject: null };
    }
    setViewProject(vp) {
        this.vertexInput.viewProject = vp;
    }
    vertexShading(vertex) {
        return this.program.vertexShading(vertex, this.vertexInput);
    }
    fragmentShading(input) {
        return this.program.fragmentShading(input);
    }
}
exports.default = Shader;
