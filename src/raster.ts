class Vector{
    public x:number
    public y:number
    public z:number
    public w:number = 1.0
    
    public getLength():number{
        return Math.sqrt( this.x*this.x + this.y*this.y + this.z*this.z )
    }

    public reverse(dst:Vector=null):Vector{
        if (dst == null) {
            dst = new Vector()
        }
        dst.x = - this.x
        dst.y = - this.y
        dst.z = - this.z
        return dst
    }

    public add(t:Vector, dst:Vector=null):Vector {
        if (dst == null){
            dst = new Vector()
        }
        dst.x = this.x + t.x
        dst.y = this.y + t.y
        dst.z = this.z + t.z
        dst.w = 1.0
        return dst
    }

    public sub(t:Vector, dst:Vector=null):Vector {
        if (dst == null){
            dst = new Vector()
        }
        dst.x = this.x - t.x
        dst.y = this.y - t.y
        dst.z = this.z - t.z
        dst.w = 1.0
        return dst
    }

    public dot(t:Vector):number {
        return this.x * t.x + this.y * t.y + this.z * t.z;
    }

    public cross(t:Vector, dst:Vector=null):Vector {
        if (dst == null){
            dst = new Vector()
        }
        let x = this.y * t.z - this.z * t.y
        let y = this.z * t.x - this.x * t.z
        let z = this.x * t.y - this.y * t.x
        dst.x = x
        dst.y = y
        dst.z = z
        dst.w = 1.0
        return dst
    }

    public normalize(dst:Vector=null):Vector{
        if (dst == null){
            dst = new Vector()
        }
        let len = this.getLength()
        if (len > 0) {
            dst.x = this.x / len
            dst.y = this.y / len
            dst.z = this.z / len
        }
        return dst
    }
}

// 4x4 列向量矩阵 , 右手坐标系
class Matrix {
    public m:Array<Float32Array>
    constructor() {
        this.m = []
        for (let i=0;i<4;i++) {
            let col = new Float32Array(4)
            for (let j=0;j<4;j++){
                col[j] = j == i ? 1: 0 //初始化成单位矩阵
            }
            this.m.push(col)
        } 
    } 

    public multiply(t:Matrix, dst:Matrix=null):Matrix{
        if (dst == null){
            dst = new Matrix()
        }
        for (let i=0;i<4;i++) {
            for (let j=0;j<4;j++) {
                dst.m[j][i] =  
                  this.m[j][0] * t.m[0][i] 
                + this.m[j][1] * t.m[1][i] 
                + this.m[j][2] * t.m[2][i] 
                + this.m[j][3] * t.m[3][i]
            }
        }
        return dst
    }

    public setValue(val:number){
        for (let i=0;i<4;i++) {
            for (let j=0;j<4;j++) {
                this.m[j][i] = val
            }
        }
    }

    public static setPerspective(dst:Matrix, fovy:number, aspect:number, near:number, far:number){
        dst.setValue(0)  
        let tan = Math.tan(fovy/2) // tan =t/n, aspect = r/t
        let nt = 1 / tan  // = n/t
        let nr = nt / aspect // = n/r
        let n = Math.abs(near)
        let f = Math.abs(far)
        dst.m[0][0] = nr  
        dst.m[1][1] = nt
        dst.m[2][2] = (n+f)/(n-f)
        dst.m[3][2] = 2*f*n/(f-n)
        dst.m[2][3] = 1
    }

    public static setLookAt(dst:Matrix, eye:Vector, up:Vector, at:Vector) {
        //w is reverse of look at direction
        let w = at.sub(eye).normalize().reverse()
        let u = up.cross(w).normalize()
        let v = w.cross(u)
        dst.setValue(0)

        dst.m[0][0] = u.x
        dst.m[1][0] = u.y
        dst.m[2][0] = u.z

        dst.m[0][1] = v.x
        dst.m[1][1] = v.y
        dst.m[2][1] = v.z

        dst.m[0][2] = w.x
        dst.m[1][2] = w.y
        dst.m[2][2] = w.z

        dst.m[3][3] = 1

        //translate
        let tEye = eye.reverse()
        dst.m[3][0] = u.dot(tEye)
        dst.m[3][1] = v.dot(tEye)
        dst.m[3][2] = w.dot(tEye)
    }
}

class MathUtils {

    public static linearInterpolateValue(value1:number, value2:number, t:number) {
        return (1-t) * value1 + t * value2
    }

    public static linearInterpolateVector(vec1:Vector, vec2:Vector, t:number, dst:Vector=null) {
        if (dst == null){
            dst = new Vector()
        }
        dst.x = MathUtils.linearInterpolateValue(vec1.x, vec2.x, t)
        dst.y = MathUtils.linearInterpolateValue(vec1.y, vec2.y, t)
        dst.z = MathUtils.linearInterpolateValue(vec1.z, vec2.z, t)
        return dst
    }
}

class Device {
    public width:number 
    public height:number
    public frameBuffer:Uint8Array = null
    public zBuffer:Float32Array = null
    constructor(width:number, height:number) {
        this.width = width
        this.height = height
        this.frameBuffer = new Uint8Array(width*height*4)
        this.zBuffer = new Float32Array(width*height)
     
    }

    public clear() {
        for (let l=0;l<this.frameBuffer.length;l++){
            this.frameBuffer[l] = 0
        }
        for (let l=0;l<this.zBuffer.length;l++){
            this.zBuffer[l] = NaN
        }
    }

    public drawBox() {
        let pixelsSize = this.width*this.height*4
        for (let i=0;i<pixelsSize;i+=4) {
            this.frameBuffer[i] = 255
            this.frameBuffer[i+1] = i % 255
            this.frameBuffer[i+2] = i % 255
            this.frameBuffer[i+3] = 255
        }
    }
}




export default class Raster {
    
    protected bitBlit:any = null
    protected device:Device = null
    constructor(canvasWidth:number, canvasHeight:number, printCallback:any) {
        this.bitBlit = printCallback
        this.device = new Device(canvasWidth, canvasHeight)


        let self = this
        let wrapMainLoop = function() {
            self.mainLoop()
            requestAnimationFrame(wrapMainLoop)
        }
        wrapMainLoop()
    }

    protected mainLoop() {
        this.device.clear()
        this.device.drawBox()

        this.bitBlit(this.device.width, this.device.height, this.device.frameBuffer)
    }



    public setModel() {

    }


}