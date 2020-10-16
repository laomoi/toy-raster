import { Matrix } from "../math/matrix";
import { Vector } from "../math/vector";
import { Color } from "./color";
import Texture, { UV } from "./texture";
import { Vertex } from "./vertex";

export interface VertexShaderInput {
    viewProject:Matrix
}

export interface ShaderContext {
    x:number,
    y:number,
    color?:Color,
    uv?:UV,
    normal?:Vector,
}

export interface IShaderProgram {
    vertexShading(vertex:Vertex, input:VertexShaderInput):Vector;
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

    public vertexShading(vertex:Vertex):Vector {
        return this.program.vertexShading(vertex, this.vertexInput)
    }

    public fragmentShading(context:ShaderContext):Color{
        return this.program.fragmentShading(context)
    }
}
