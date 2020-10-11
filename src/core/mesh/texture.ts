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
        //clamp  sample
        //use nearest sampler

        let x = uv.u * (this.width - 1)
        let y = uv.v * (this.height - 1)
        x = Math.floor(x+0.5)
        y = Math.floor(y+0.5)
        if (x >= this.width) {
            x = this.width - 1
        }
        if (y >= this.height) {
            y = this.height - 1
        }
        let pos = y *this.width + x
        let color = this.data[pos]
     
        this.tmp.a = color.a
        this.tmp.r = color.r
        this.tmp.g = color.g
        this.tmp.b = color.b
  
        return this.tmp
    }
}
