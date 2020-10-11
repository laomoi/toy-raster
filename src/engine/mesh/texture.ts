import { Color } from "./color"

export interface UV {
    u:number,
    v:number,
}
export default class Texture {
    public width:number
    public height:number
    public data:Array<Color> = []
    protected tmp:Color = {r:0, g:0, b:0, a:0}
    constructor(width:number, height:number) {
        this.width = width
        this.height = height
    }
    public setPixel(x:number, y:number, color:Color) {
        let pos = y *this.width + x
        this.data[pos] = color
    }
    public sample(uv:UV):Color {
        //repeat sample
        //use nearest sampler
        let x = uv.u * this.width
        let y = uv.v * this.height
        x = Math.floor(x+0.5)
        y = Math.floor(y+0.5)
        if (x >= this.width) {
            x = x % this.width
        }
        if (y >= this.height) {
            y = y % this.height
        }
        let pos = y *this.width + x
        let color = this.data[pos]
        // if (color == null){
        //     console.log(uv, pos, x, y)
        // }
        this.tmp.a = color.a
        this.tmp.r = color.r
        this.tmp.g = color.g
        this.tmp.b = color.b
        return this.tmp
    }
}
