import MathUtils from "../math/math-utils"

export class Color {
    public r:number
    public g:number
    public b:number
    public a:number

    public static BLACK:Color = new Color(0,0,0,255)
    public static WHITE:Color = new Color(255,255,255,255)
    public static RED:Color =  new Color(255,0,0,255)
    public static BLUE:Color =  new Color(0,0,255,255)
    public static GREEN:Color =  new Color(0,255,255,255)
    public static YELLOW:Color =  new Color(255,255,0,255)
    public static GRAY:Color =  new Color(100,100,100,255)

    public constructor(r:number=0, g:number=0, b:number=0, a:number=0) {
       this.r = r
       this.g = g
       this.b = b
       this.a = a
    }

    public set(color:Color) {
        this.r = color.r
        this.g = color.g
        this.b = color.b
        this.a = color.a
        return this
    }

    public clone():Color{
        return new Color(this.r, this.g, this.b, this.a)
    }

    public add(value:number){
        this.r += value
        this.g += value
        this.b += value
        this.a += value
        this.clamp(0, 255)
        return this
    }

    public addRGB(color:Color) {
        this.r += color.r
        this.g += color.g
        this.b += color.b
        this.clamp(0, 255)
        return this
    }

    public multiplyRGB(factor:number){
        this.r *= factor
        this.g *= factor
        this.b *= factor
        this.clamp(0, 255)
        return this
    }

    protected clamp(min:number, max:number) {
        this.r = MathUtils.clamp(this.r, min, max)
        this.g = MathUtils.clamp(this.g, min, max)
        this.b = MathUtils.clamp(this.b, min, max)
        this.a = MathUtils.clamp(this.a, min, max)
    }

    public static getInterpColor(color1:Color, color2:Color, color3:Color, a:number, b:number, c:number, dstColor:Color) {
        dstColor.r = MathUtils.getInterpValue3(color1.r, color2.r, color3.r, a, b, c)
        dstColor.g = MathUtils.getInterpValue3(color1.g, color2.g, color3.g, a, b, c)
        dstColor.b = MathUtils.getInterpValue3(color1.b, color2.b, color3.b, a, b, c)
        dstColor.a = MathUtils.getInterpValue3(color1.a, color2.a, color3.a, a, b, c)
    }

    public static getBilinearColor(c1:Color, c2:Color, c3:Color, c4:Color, w1:number, w2:number, w3:number, w4:number, dstColor:Color){
        dstColor.r = MathUtils.getInterpValue4(c1.r, c2.r, c3.r, c4.r, w1, w2, w3, w4)
        dstColor.g = MathUtils.getInterpValue4(c1.g, c2.g, c3.g, c4.g, w1, w2, w3, w4)
        dstColor.b = MathUtils.getInterpValue4(c1.b, c2.b, c3.b, c4.b, w1, w2, w3, w4)
        dstColor.a = MathUtils.getInterpValue4(c1.a, c2.a, c3.a, c4.a, w1, w2, w3, w4)
    }

    public static multiplyColor(color1:Color, color2:Color, dst:Color){
        dst.r = color1.r * color2.r / 255
        dst.g = color1.g * color2.g / 255
        dst.b = color1.b * color2.b / 255
        dst.a = color1.a * color2.a / 255
        return dst
    }
}
