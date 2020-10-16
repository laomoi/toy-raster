var ShaderVarying = (function () {
    function ShaderVarying() {
    }
    ShaderVarying.NORMAL = "normal";
    ShaderVarying.UV = "uv";
    return ShaderVarying;
})();
exports.ShaderVarying = ShaderVarying;
var Shader = (function () {
    function Shader(program) {
        this.program = program;
        this.vertexInput = { viewProject: null };
    }
    Shader.prototype.setViewProject = function (vp) {
        this.vertexInput.viewProject = vp;
    };
    Shader.prototype.vertexShading = function (vertex) {
        return this.program.vertexShading(vertex, this.vertexInput);
    };
    Shader.prototype.fragmentShading = function (input) {
        return this.program.fragmentShading(input);
    };
    return Shader;
})();
exports["default"] = Shader;
//# sourceMappingURL=shader.js.map