import { Vector2 } from "../math/vector2";
import { Vector4 } from "../math/vector4";
import { Color } from "./color";

export interface VertexContext {
    posProject:Vector4//冗余字段, 投影坐标, 变换计算时不要修改pos的值, 结果都存储在posTransform里
    posScreen:Vector4//冗余字段, 屏幕坐标
    rhw:number // 1/w
    varyingVec2Dict:{[k:string]:Vector2}, //需要插值的所有vec2
    varyingVec4Dict:{[k:string]:Vector4} //需要插值的所有vec4
}

export interface Vertex {
    posModel?:Vector4,
    color?:Color,//default White
    uv?:Vector2,
    normal?:Vector4,
    context?:VertexContext
}
