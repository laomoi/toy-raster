import { Matrix } from "../math/matrix";
import { Vector2 } from "../math/vector2";
import { Vector4 } from "../math/vector4";
import { Color } from "./color";
import { Vertex } from "./vertex";

export interface VertexInput {
    viewProject:Matrix
}

export interface FragmentInput {
    x:number, //屏幕坐标
    y:number,
    color?:Color,
    varyingVec2Dict?:{[k:string]:Vector2}, //需要插值的所有vec2
    varyingVec4Dict?:{[k:string]:Vector4} //需要插值的所有vec4
}

export interface IShaderProgram {
    vertexShading(vertex:Vertex, input:VertexInput):Vector4;
    fragmentShading(context:FragmentInput):Color;
}

export class ShaderVarying {
    public static NORMAL = "normal"
    public static UV = "uv"
    public static EYE = "eye"
    public static WORLD_POS = "world_pos"

}

export default class Shader  {
    protected program:IShaderProgram
    protected vertexInput: VertexInput
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

    public fragmentShading(input:FragmentInput):Color{
        return this.program.fragmentShading(input)
    }
}
