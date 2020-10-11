import { Vector } from "../math/vector";
import { Color } from "./color";
import { UV } from "./texture";

export interface Vertex {
    posWorld?:Vector,
    color?:Color,//default White
    uv?:UV,
    posProject?:Vector//冗余字段, 投影坐标, 变换计算时不要修改pos的值, 结果都存储在posTransform里
    posScreen?:Vector//冗余字段, 屏幕坐标
    rhw?:number // 1/w
}
