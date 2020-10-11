import { Vector } from "./math/vector"
import { Color } from "./mesh/color"
import { UV } from "./mesh/texture"

export default class Utils {

    // public static linearInterpolateValue(value1:number, value2:number, t:number) {
    //     return (1-t) * value1 + t * value2
    // }

    public static isInsideViewVolumn(v:Vector){
        if (v.x < -1 || v.x > 1){
            return false
        }
        if (v.y < -1 || v.y > 1){
            return false
        }
        if (v.z < -1 || v.z > 1){
            return false
        }
        return true
    }

    public static convertToScreenPos(v:Vector, dst:Vector, width:number, height:number){
        dst.x = (v.x + 1)/2 * width
        dst.y = (v.y + 1)/2 * height
        dst.z = v.z
        return dst
    }

    public static getInterpColor(color1:Color, color2:Color, color3:Color, a:number, b:number, c:number, dstColor:Color) {
        dstColor.r = Utils.getInterpValue(color1.r, color2.r, color3.r, a, b, c)
        dstColor.g = Utils.getInterpValue(color1.g, color2.g, color3.g, a, b, c)
        dstColor.b = Utils.getInterpValue(color1.b, color2.b, color3.b, a, b, c)
        dstColor.a = Utils.getInterpValue(color1.a, color2.a, color3.a, a, b, c)
    }
    public static getInterpUV(uv1:UV, uv2:UV, uv3:UV, a:number, b:number, c:number, dstUV:UV) {
        dstUV.u = Utils.getInterpValue(uv1.u, uv2.u, uv3.u, a, b, c)
        dstUV.v = Utils.getInterpValue(uv1.v, uv2.v, uv3.v, a, b, c)
    }
    
    public static getInterpValue(v1:number, v2:number, v3:number,  a:number, b:number, c:number) {
        return v1*a + v2*b + v3*c
    }

    public static multiplyColor(color1:Color, color2:Color, dst:Color){
        dst.r = color1.r * color2.r / 255
        dst.g = color1.g * color2.g / 255
        dst.b = color1.b * color2.b / 255
        dst.a = color1.a * color2.a / 255
        return dst
    }
}

