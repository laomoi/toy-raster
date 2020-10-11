import { Color, Colors } from "./mesh/color"

export default class Buffer {
    public usingMSAA:boolean = true
    protected width:number
    protected height:number
    protected zbuf:Float32Array = null
    public frameBuffer:Uint8Array
    protected msaaColorBuffer:Uint8Array
    public constructor(width:number, height:number, usingMSAA:boolean) {
        this.usingMSAA = usingMSAA
        this.width = width
        this.height = height

        this.frameBuffer = new Uint8Array(width*height*4)

        if (!this.usingMSAA){
            this.zbuf = new Float32Array(width*height)
        } else {
            this.zbuf = new Float32Array(width*height*4)
            this.msaaColorBuffer = new Uint8Array(width*height*4*4)
        }
    }

    public ztest(x:number, y:number, rhw:number):boolean{
        let zPos = this.width * y + x
        if (isNaN(this.zbuf[zPos]) || this.zbuf[zPos] > rhw) {
            return true
        }
        return false
    }

    public setZ(x:number, y:number, rhw:number){
        let zPos = this.width * y + x
        this.zbuf[zPos] = rhw
    }

    public setColor(x:number, y:number, color:Color){
        let pstart = (this.width*y + x)*4
        this.frameBuffer[pstart] = color.r
        this.frameBuffer[pstart+1] = color.g
        this.frameBuffer[pstart+2] = color.b
        this.frameBuffer[pstart+3] = color.a
    }

    public clear(backgroundColor:Color) {
        for (let l=0;l<this.frameBuffer.length;l+=4){
            this.frameBuffer[l] = backgroundColor.r
            this.frameBuffer[l+1] = backgroundColor.g
            this.frameBuffer[l+2] = backgroundColor.b
            this.frameBuffer[l+3] = backgroundColor.a
        }
        for (let l=0;l<this.zbuf.length;l++){
            this.zbuf[l] = NaN
        }
    }
}