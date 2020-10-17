import MathUtils from "./math-utils"

export class Vector2{
    public x:number
    public y:number
   
    public constructor(x:number=0, y:number=0) {
        this.x = x
        this.y = y
    }

    public getLength():number{
        return Math.sqrt( this.x*this.x + this.y*this.y)
    }

    public static getInterpValue3(v1:Vector2, v2:Vector2, v3:Vector2, a:number, b:number, c:number, dst:Vector2=null) {
        if (dst == null) {
            dst = new Vector2()
        }
        dst.x = MathUtils.getInterpValue3(v1.x, v2.x, v3.x, a, b, c)
        dst.y = MathUtils.getInterpValue3(v1.y, v2.y, v3.y, a, b, c)
        return dst
    }
}