import { Matrix } from "../math/matrix";
import { Vector2 } from "../math/vector2";
import { Vector4 } from "../math/vector4";
import { Color } from "./color";
import { Vertex } from "./vertex";

export interface VertexShaderInput {
    viewProject:Matrix
}

export interface ShaderContext {
    x:number,
    y:number,
    color?:Color,
    uv?:Vector2,
    normal?:Vector4,
}

export interface IShaderProgram {
    vertexShading(vertex:Vertex, input:VertexShaderInput):Vector4;
    fragmentShading(context:ShaderContext):Color;
}

export default class Shader  {

    protected program:IShaderProgram
    protected vertexInput: VertexShaderInput
    public constructor(program:IShaderProgram){
        this.program = program
        this.vertexInput = {viewProject:null}
    }

    public setViewProject(vp:Matrix) {
        this.vertexInput.viewProject = vp
    }

    public vertexShading(vertex:Vertex):Vector4 {
        return this.program.vertexShading(vertex, this.vertexInput)
    }

    public fragmentShading(context:ShaderContext):Color{
        return this.program.fragmentShading(context)
    }
}
