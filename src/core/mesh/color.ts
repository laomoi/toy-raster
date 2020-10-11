import Utils from "../utils"

export interface Color {
    r:number,
    g:number,
    b:number,
    a:number
}

export class Colors {
    public static BLACK:Color = {r:0, g:0, b:0, a:255}
    public static WHITE:Color = {r:255, g:255, b:255, a:255}
    public static RED:Color =  {r:255, g:0, b:0, a:255}
    public static BLUE:Color =  {r:0, g:0, b:255, a:255}
    public static GREEN:Color =  {r:0, g:255, b:0, a:255}
    public static ORANGE:Color =  {r:255, g:255, b:0, a:255}

    public static clone(color:Color):Color{
        return {r:color.r, g:color.g, b:color.b, a:color.a}
    }

    public static getInterpColor(color1:Color, color2:Color, color3:Color, a:number, b:number, c:number, dstColor:Color) {
        dstColor.r = Utils.getInterpValue3(color1.r, color2.r, color3.r, a, b, c)
        dstColor.g = Utils.getInterpValue3(color1.g, color2.g, color3.g, a, b, c)
        dstColor.b = Utils.getInterpValue3(color1.b, color2.b, color3.b, a, b, c)
        dstColor.a = Utils.getInterpValue3(color1.a, color2.a, color3.a, a, b, c)
    }

    public static getBilinearColor(c1:Color, c2:Color, c3:Color, c4:Color, w1:number, w2:number, w3:number, w4:number, dstColor:Color){
        dstColor.r = Utils.getInterpValue4(c1.r, c2.r, c3.r, c4.r, w1, w2, w3, w4)
        dstColor.g = Utils.getInterpValue4(c1.g, c2.g, c3.g, c4.g, w1, w2, w3, w4)
        dstColor.b = Utils.getInterpValue4(c1.b, c2.b, c3.b, c4.b, w1, w2, w3, w4)
        dstColor.a = Utils.getInterpValue4(c1.a, c2.a, c3.a, c4.a, w1, w2, w3, w4)
    }

    public static multiplyColor(color1:Color, color2:Color, dst:Color){
        dst.r = color1.r * color2.r / 255
        dst.g = color1.g * color2.g / 255
        dst.b = color1.b * color2.b / 255
        dst.a = color1.a * color2.a / 255
        return dst
    }
}
