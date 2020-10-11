import { Matrix } from "./matrix"

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