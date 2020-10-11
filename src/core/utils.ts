import { Vector } from "./math/vector"
import { Color } from "./mesh/color"
import { UV } from "./mesh/texture"

export default class Utils {

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

    public static getInterpUV(uv1:UV, uv2:UV, uv3:UV, a:number, b:number, c:number, dstUV:UV) {
        dstUV.u = Utils.getInterpValue3(uv1.u, uv2.u, uv3.u, a, b, c)
        dstUV.v = Utils.getInterpValue3(uv1.v, uv2.v, uv3.v, a, b, c)
    }
    
    public static getInterpValue3(v1:number, v2:number, v3:number,  a:number, b:number, c:number) {
        return v1*a + v2*b + v3*c
    }

    public static getInterpValue4(v1:number, v2:number, v3:number, v4:number,  a:number, b:number, c:number, d:number) {
        return v1*a + v2*b + v3*c + v4*d
    }

}

