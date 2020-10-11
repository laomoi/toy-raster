import { Color, Colors } from "./mesh/color"

export default class Buffer {
    public usingMSAA:boolean = true
    protected width:number
    protected height:number
    protected zbuf:Float32Array = null
    public frameBuffer:Uint8Array
    protected msaaColorBuffer:Uint8Array = null
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


    protected getZPos(x:number, y:number, index:number) {
        if (!this.usingMSAA) {
            return this.width * y + x
        } else {
            return (this.width * y + x)*4 + index
        }
    }
    public ztest(x:number, y:number, rhw:number, index:number=0):boolean{
        let zPos = this.getZPos(x, y, index)
        if (isNaN(this.zbuf[zPos]) || this.zbuf[zPos] > rhw) {
            return true
        }
        return false
    }

    public setZ(x:number, y:number, rhw:number, index:number=0){
        let zPos = this.getZPos(x, y, index)
        this.zbuf[zPos] = rhw
    }

    public setColor(x:number, y:number, color:Color, index:number=0){
        let pstart = 0 
        if (!this.usingMSAA) {
            pstart = (this.width*y + x)*4
        }else {
            pstart = (this.width*y + x)*4*4 + index*4
        }
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
        if (this.msaaColorBuffer != null){
            for (let l=0;l<this.msaaColorBuffer.length;l++){
                this.msaaColorBuffer[l] = NaN
            }
        }
    }

    //应用模糊滤波，对2x2的msaaColorBuffer 计算出最终颜色值填入framebuffer
    public applyMSAAFilter() {
        if (this.msaaColorBuffer == null){
            return
        }
    }
}