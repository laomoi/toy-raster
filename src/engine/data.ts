export interface Color {
    r:number,
    g:number,
    b:number,
    a:number,
}

export interface UV {
    u:number,
    v:number,
}

export interface Vertex {
    posWorld?:Vector,
    color?:Color,//default White
    uv?:UV,
    posProject?:Vector//冗余字段, 投影坐标, 变换计算时不要修改pos的值, 结果都存储在posTransform里
    posScreen?:Vector//冗余字段, 屏幕坐标
    rhw?:number // 1/w
}

export interface Camera {
    view: Matrix,
    projection:Matrix,
    vp:Matrix //projection*view
}



export class Vector{
    public x:number
    public y:number
    public z:number
    public w:number
    public constructor(x:number=0, y:number=0, z:number=0, w:number=1) {
        this.x = x
        this.y = y
        this.z = z
        this.w = w
    }
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

    public transform(matrix:Matrix, dst:Vector=null) {
        if (dst == null){
            dst = new Vector()
        }
        let x = this.x, y = this.y, z = this.z, w = this.w
        let m = matrix.m
        dst.x = m[0][0]*x + m[1][0]*y + m[2][0]*z + m[3][0]*w
        dst.y = m[0][1]*x + m[1][1]*y + m[2][1]*z + m[3][1]*w
        dst.z = m[0][2]*x + m[1][2]*y + m[2][2]*z + m[3][2]*w
        dst.w = m[0][3]*x + m[1][3]*y + m[2][3]*z + m[3][3]*w
        return dst
    }

    //齐次坐标归一
    public homogenenize(){
        if (this.w != 0) {
            this.x /= this.w
            this.y /= this.w
            this.z /= this.w
            this.w = 1
        }
    }


}

// 4x4 列向量矩阵 , 右手坐标系
export class Matrix {
    public m:Array<Float32Array>
    constructor() {
        this.m = []
        for (let i=0;i<4;i++) {
            let col = new Float32Array(4)
            this.m.push(col)
        } 
        this.identify()
    } 

    public identify(){
        this.setValue(0)
        this.m[0][0] = this.m[1][1]= this.m[2][2]= this.m[3][3] = 1
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

    //near far should be > 0
    public setPerspective(fovy:number, aspect:number, near:number, far:number){
        this.setValue(0)  
      
        let n = -near
        let f = -far      
        let tn = -Math.tan(fovy/2) // t/n, aspect = r/t
        let nt = 1 / tn  // = n/t
        let nr = nt / aspect // = n/r

        this.m[0][0] = nr  
        this.m[1][1] = nt
        this.m[2][2] = (n+f)/(n-f)
        this.m[3][2] = 2*f*n/(f-n)
        this.m[2][3] = 1
    }

    public setLookAt(eye:Vector, at:Vector, up:Vector) {
        //w is reverse of look at direction, wuv is the axises of the camera, 
        //The equation is from <fundamentals of CG> 4th. 7.1
        let w = at.sub(eye).normalize().reverse()
        let u = up.cross(w).normalize()
        let v = w.cross(u)
        this.setValue(0)

        this.m[0][0] = u.x
        this.m[1][0] = u.y
        this.m[2][0] = u.z

        this.m[0][1] = v.x
        this.m[1][1] = v.y
        this.m[2][1] = v.z

        this.m[0][2] = w.x
        this.m[1][2] = w.y
        this.m[2][2] = w.z

        this.m[3][3] = 1

        //translate
        let tEye = eye.reverse()
        this.m[3][0] = u.dot(tEye)
        this.m[3][1] = v.dot(tEye)
        this.m[3][2] = w.dot(tEye)
    }
}



export class ColorEnums {
    public static BLACK:Color = {r:0, g:0, b:0, a:255}
    public static WHITE:Color = {r:255, g:255, b:255, a:255}
    public static RED:Color =  {r:255, g:0, b:0, a:255}
    public static BLUE:Color =  {r:0, g:0, b:255, a:255}
    public static GREEN:Color =  {r:0, g:255, b:0, a:255}
    public static ORANGE:Color =  {r:255, g:255, b:0, a:255}

    public static clone(color:Color):Color{
        return {r:color.r, g:color.g, b:color.b, a:color.a}
    }
}

export class Texture {
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
