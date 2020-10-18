import { Vector4 } from "./vector4"

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

    public setRotateX(angle:number){
        this.identify()
        let cos = Math.cos(angle), sin=Math.sin(angle)
        this.m[1][1] = cos
        this.m[1][2] = sin
        this.m[2][1] = -sin
        this.m[2][2] = cos
    }

    public setRotateY(angle:number){
        this.identify()
        let cos = Math.cos(angle), sin=Math.sin(angle)
        this.m[0][0] = cos
        this.m[0][2] = -sin
        this.m[2][0] = sin
        this.m[2][2] = cos
    }

    public setRotateZ(angle:number){
        this.identify()
        let cos = Math.cos(angle), sin=Math.sin(angle)
        this.m[0][0] = cos
        this.m[0][1] = sin
        this.m[1][0] = -sin
        this.m[1][1] = cos
    }

    public setLookAt(eye:Vector4, at:Vector4, up:Vector4) {
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