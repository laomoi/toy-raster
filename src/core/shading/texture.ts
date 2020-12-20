import { Vector2 } from "../math/vector2"
import { Vector4 } from "../math/vector4"
import { Color } from "./color"
import fs = require("fs")
import path = require("path")
let decode = require('image-decode')

export enum TEXTURE_FILTER_MODE {
    NEAREST = 1,
    BILINEAR = 2,
}
export default class Texture {
    public width:number
    public height:number
    public data:Array<Color> = []
    protected tmp:Color = new Color()

    public filterMode:TEXTURE_FILTER_MODE = TEXTURE_FILTER_MODE.BILINEAR

    public static createTextureFromFile(file:string) {
        let {data, width, height} = decode(fs.readFileSync(path.join(__dirname, "../../../res/" + file)))
        let texture = new Texture(width, height)
        for (let y=0;y<height;y++) {
            for (let x=0;x<width;x++) {
                let pos = ((height-y-1)*width + x)*4  //webgl中 v坐标向下，把纹理上下反一下
                let color:Color = new Color(data[pos], data[pos+1], data[pos+2],data[pos+3])
                texture.setPixel(x, y, color)
            }
        }
        return texture
    }

    
    constructor(width:number, height:number) {
        this.width = width
        this.height = height
    }

    public setPixel(x:number, y:number, color:Color) {
        let pos = y *this.width + x
        this.data[pos] = color
    }

    public sample(uv:Vector2):Color {
        let x = uv.x * (this.width - 1)
        let y = uv.y * (this.height - 1)
        return this.samplePos(x+0.5, y+0.5)
    }

    public sampleAsVector(uv:Vector2):Vector4 {
        let color = this.sample(uv)
        return new Vector4((color.r/255)*2 -1, (color.g/255)*2 -1, (color.b/255)*2 -1, (color.a/255)*2 -1)
    }

    protected clamp(value:number, min:number, max:number):number{
        if (value > max){
            return max
        }
        if (value < min) {
            return min
        }
        return value
    }

    protected getPixel(x:number, y:number){
        return this.data[y *this.width + x]
    }

    protected samplePos(x:number, y:number):Color{
        if (this.filterMode == TEXTURE_FILTER_MODE.NEAREST) {
            x = this.clamp(Math.floor(x), 0, this.width-1)
            y = this.clamp(Math.floor(y), 0, this.height-1)
            let color = this.getPixel(x, y)
            this.tmp.a = color.a
            this.tmp.r = color.r
            this.tmp.g = color.g
            this.tmp.b = color.b
            return this.tmp
        } else if (this.filterMode == TEXTURE_FILTER_MODE.BILINEAR) {
            //双线性插值有大量的浮点运算，在opencv这些框架中会使用整数乘法来优化浮点数运算，我们这里仍旧使用浮点运算
            let x1 = this.clamp(Math.floor(x), 0, this.width-1)
            let y1 = this.clamp(Math.floor(y), 0, this.height-1)
            let x2 = this.clamp(Math.floor(x)+1, 0, this.width-1)
            let y2 = this.clamp(Math.floor(y)+1, 0, this.height-1)
            let c1 = this.getPixel(x1, y1)
            let c2 = this.getPixel(x2, y1)
            let c3 = this.getPixel(x1, y2)
            let c4 = this.getPixel(x2, y2)
            let dx = x - x1
            let dy = y - y1
            //先在X方向上做2次线性插值，然后在y方向上做一次线性插值
            //求得公式 (c1*(1-dx) + c2*dx)(1-dy) + (c3*(1-dx) + c4*dx)*dy
            //c1*(1-dx)*(1-dy) + c2* (dx)*(1-dy) +  c3* (1-dx)*dy + c4* (dx)*dy
            //正好是四个权重w1, w2, w3, w4
            let w1 = (1-dx)*(1-dy)
            let w2 = dx*(1-dy)
            let w3 = (1-dx)*dy
            let w4 = dx*dy
            Color.getBilinearColor(c1, c2, c3, c4, w1, w2, w3, w4, this.tmp)
            return this.tmp
        }

        return Color.BLACK
    }

    
}
