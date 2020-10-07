
interface Color {
    r:number,
    g:number,
    b:number,
    a:number,
}

interface UV {
    u:number,
    v:number,
}

interface Vertex {
    x:number,
    y:number,
    z?:number, //z is optional
    color?:Color,//default White
    uv?:UV,
}

interface Camera {
    view: Matrix,
    projection:Matrix,
    vp:Matrix //projection*view
}

class ColorEnums {
    public static BLACK:Color = {r:0, g:0, b:0, a:255}
    public static WHITE:Color = {r:255, g:255, b:255, a:255}
    public static RED:Color =  {r:255, g:0, b:0, a:255}
    public static BLUE:Color =  {r:0, g:0, b:255, a:255}
    public static GREEN:Color =  {r:0, g:255, b:0, a:255}
    public static clone(color:Color):Color{
        return {r:color.r, g:color.g, b:color.b, a:color.a}
    }
}

class Vector{
    public x:number
    public y:number
    public z:number
    public w:number = 1.0
    public constructor(x:number, y:number, z:number, w:number) {
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
}

// 4x4 列向量矩阵 , 右手坐标系
class Matrix {
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

    public setPerspective(fovy:number, aspect:number, near:number, far:number){
        this.setValue(0)  
        let tan = Math.tan(fovy/2) // tan =t/n, aspect = r/t
        let nt = 1 / tan  // = n/t
        let nr = nt / aspect // = n/r
        let n = Math.abs(near)
        let f = Math.abs(far)
        this.m[0][0] = nr  
        this.m[1][1] = nt
        this.m[2][2] = (n+f)/(n-f)
        this.m[3][2] = 2*f*n/(f-n)
        this.m[2][3] = 1
    }

    public  setLookAt(eye:Vector, up:Vector, at:Vector) {
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

class MathUtils {

    // public static linearInterpolateValue(value1:number, value2:number, t:number) {
    //     return (1-t) * value1 + t * value2
    // }

    // public static linearInterpolateVector(vec1:Vector, vec2:Vector, t:number, dst:Vector=null) {
    //     if (dst == null){
    //         dst = new Vector()
    //     }
    //     dst.x = MathUtils.linearInterpolateValue(vec1.x, vec2.x, t)
    //     dst.y = MathUtils.linearInterpolateValue(vec1.y, vec2.y, t)
    //     dst.z = MathUtils.linearInterpolateValue(vec1.z, vec2.z, t)
    //     return dst
    // }

    public static getInterpColor(color1:Color, color2:Color, color3:Color, a:number, b:number, c:number, dstColor:Color) {
        dstColor.r = color1.r*a + color2.r*b + color3.r*c
        dstColor.g = color1.g*a + color2.g*b + color3.g*c
        dstColor.b = color1.b*a + color2.b*b + color3.b*c
        dstColor.a = color1.a*a + color2.a*b + color3.a*c
    }
}



class Renderer {
    public width:number 
    public height:number
    public frameBuffer:Uint8Array = null
    public zBuffer:Float32Array = null
    public backgroundColor:Color = ColorEnums.clone(ColorEnums.BLACK)
    protected camera:Camera = {
        view: new Matrix(),
        projection: new Matrix(),
        vp: new Matrix()
    }

    constructor(width:number, height:number) {
        this.width = width
        this.height = height

        this.frameBuffer = new Uint8Array(width*height*4)
        this.zBuffer = new Float32Array(width*height)

        this.setDefaultCamera()
    }

    public clear() {
        for (let l=0;l<this.frameBuffer.length;l+=4){
            this.frameBuffer[l] = this.backgroundColor.r
            this.frameBuffer[l+1] = this.backgroundColor.g
            this.frameBuffer[l+2] = this.backgroundColor.b
            this.frameBuffer[l+3] = this.backgroundColor.a
        }
        for (let l=0;l<this.zBuffer.length;l++){
            this.zBuffer[l] = NaN
        }
    }


    public drawLine(x0:number, y0:number, x1:number, y1:number, color:Color){
        if (x0 == x1) {
            let dir = y0 < y1 ? 1 : -1
            for (let y=y0; y!=y1; y+=dir) {
                this.setPixel(x0, y, color)
            }
            this.setPixel(x1, y1, color)
        } else if (y0 == y1) {
            let dir = x0 < x1 ? 1 : -1
            for (let x=x0; x!=x1; x+=dir) {
                this.setPixel(x, y0, color)
            }
            this.setPixel(x1, y1, color)
        } else {
            //use mid-point algorithm to draw line, <CG> 4th, Setion 8.1
            let dx = Math.abs(x1 - x0)
            let dy = Math.abs(y1 - y0)
            if (dx > dy) {
                //more horizontal line
                if (x0 > x1) {
                    let tx = x0, ty = y0
                    x0 = x1, y0 = y1
                    x1 = tx, y1 = ty
                }
                let dir = y1 > y0 ? 1: -1
                let y = y0
                let d = (y0-y1)*(x0+1) + (x1-x0)*(y0+0.5*dir) + x0*y1 - x1*y0
                for (let x=x0;x<=x1;x++) {
                    this.setPixel(x, y, color)
                    if (d*dir < 0){
                        y += dir
                        d += (x1-x0)*dir + (y0-y1)
                    } else {
                        d += y0 - y1
                    }
                }
            } else {
                //more vertical line
                if (y0 > y1) {
                    let tx = x0, ty = y0
                    x0 = x1, y0 = y1
                    x1 = tx, y1 = ty
                }
                let dir = x1 > x0 ? 1: -1
                let x = x0
                let d = (y0-y1)*(x0+0.5*dir) + (x1-x0)*(y0+1) + x0*y1 - x1*y0
                for (let y=y0;y<=y1;y++) {
                    this.setPixel(x, y, color)
                    if (d*dir > 0){
                        x += dir
                        d += (x1-x0)+ (y0-y1)*dir 
                    } else {
                        d += x1 - x0
                    }
                }
            }
        }
    }

    protected barycentricFunc(vs:Array<Vertex>, a:number, b:number, x:number, y:number):number{
        return ((vs[a].y - vs[b].y)*x + (vs[b].x - vs[a].x)*y + vs[a].x*vs[b].y - vs[b].x*vs[a].y)
    }

    public drawTriangle(v0:Vertex, v1:Vertex, v2:Vertex) {
        //使用重心坐标的算法(barycentric coordinates)对三角形进行光栅化
        //使用AABB来优化性能
        //对于三角形边(edge case)上的点, 使用的是<CG 4th>上的算法， 使用一个Off-screen point(-1, -1) 来判断是否在同一边
        let x0 = v0.x, x1 =v1.x, x2 = v2.x, y0 = v0.x, y1=v1.y, y2=v2.y
        let minX = Math.floor( Math.min(x0, x1, x2) )
        let maxX = Math.ceil( Math.max(x0, x1, x2) )
        let minY = Math.floor( Math.min(y0, y1, y2) )
        let maxY = Math.ceil( Math.max(y0, y1, y2) )
        let c:Color = ColorEnums.clone(ColorEnums.WHITE)
        let vs = [v0, v1, v2]
        let fBelta = this.barycentricFunc(vs, 2, 0, x1, y1)
        let fGama = this.barycentricFunc(vs, 0, 1, x2, y2)
        let fAlpha =  this.barycentricFunc(vs, 1, 2, x0, y0)
        let offScreenPointX = -1, offScreenPointY = -1
        for (let x=minX;x<=maxX;x++) {
            for (let y=minY;y<=maxY;y++) {
                //F(a,b, x,y) = (ya-yb)*x + (xb-xa)*y + xa*yb - xb*ya, 
                //a,b is [0,1,2], belta= F(2,0,x,y) / F(2, 0, x1,y1)
                let belta = this.barycentricFunc(vs, 2, 0, x, y) / fBelta
                let gama = this.barycentricFunc(vs, 0, 1, x, y) / fGama
                let alpha = 1 - belta - gama
                if (alpha>=0 && belta >=0 && gama >=0) {
                    if (  (alpha > 0 || fAlpha*this.barycentricFunc(vs, 1, 2, offScreenPointX, offScreenPointY) >0) 
                    &&  (belta > 0 || fBelta*this.barycentricFunc(vs, 2, 0, offScreenPointX, offScreenPointY) >0) 
                    &&  (gama > 0 || fGama*this.barycentricFunc(vs, 0, 1, offScreenPointX, offScreenPointY) >0) 
                      ){
                        //inside the triangle , and the edge belongs to the triangle
                        MathUtils.getInterpColor(v0.color, v1.color, v2.color, alpha, belta, gama, c)
                        this.setPixel(x, y, c)
                    }
                }
            }
        }
    }

    public setPixel(x:number, y:number, color:Color) {
        if (x < this.width && y < this.height && x>=0 && y>=0) {
            let pstart = (this.width*y + x)*4
            this.frameBuffer[pstart] = color.r
            this.frameBuffer[pstart+1] = color.g
            this.frameBuffer[pstart+2] = color.b
            this.frameBuffer[pstart+3] = color.a
        }
    }

    //va is array of vertex, elements is triangles using vertex index in va
    public drawElements(va:Array<Vertex>, elements:Array<number>) {
        //根据当前的view和project, 对所有三角形进行投影计算， clip, 
        //对每一個三角形进行光栅化， 然后进行着色，zbuffer覆盖, blend上framebuffer

    }

    protected setDefaultCamera() {
        let eye = new Vector(0, 1, 2, 1)
        let at = new Vector(0, 0, 0, 1)
        let up = new Vector(0, 1, 0, 1)
        let fovy = Math.PI / 2
        let aspect = this.width / this.height
        let near = 1
        let far = 500
        this.setCamera(eye, at, up, fovy, aspect, near, far)
    }

    public setCamera(eye:Vector, up:Vector, lookAt:Vector, fovy:number, aspect:number, near:number, far:number) {
        this.camera.view.setLookAt(eye, up, lookAt)
        this.camera.projection.setPerspective(fovy, aspect, near, far)
        this.camera.vp = this.camera.view.multiply(this.camera.projection)
    }
}


export default class App {
    protected bitBlit:any = null
    protected renderder:Renderer
    constructor(canvasWidth:number, canvasHeight:number, blitCallback:any) {
        this.renderder = new Renderer(canvasWidth, canvasHeight)
        this.bitBlit = blitCallback
        
        let self = this
        let wrapMainLoop = function() {
            self.mainLoop()
            requestAnimationFrame(wrapMainLoop)
        }
        wrapMainLoop()
    }

    protected mainLoop() {
        this.renderder.clear()
        // this.renderder.drawBox()
        // this.renderder.drawLine(100,200, 300, 200, Color.WHITE)
        // this.renderder.drawLine(200,300, 2000, 300, Color.WHITE)
        // this.renderder.drawLine(200,300, 900, 100, Color.WHITE)
        // this.renderder.drawLine(200,300, 900, 500, Color.WHITE)
        // this.renderder.drawLine(200,300, 150, 700, Color.WHITE)
        // this.renderder.drawLine(200,300, 450, 700, Color.WHITE)
        // this.renderder.drawLine(200,300, 150, 100, Color.WHITE)

        // this.renderder.drawLine(100,300, 100, 400, Color.WHITE)
        // this.renderder.drawTriangle({x:100, y:100, color:Color.RED}, {x:200, y:100, color:Color.BLUE},{x:150, y:150, color:Color.GREEN})
        
        this.renderder.drawTriangle({x:100, y:200, color:ColorEnums.RED}, {x:200, y:250, color:ColorEnums.BLUE},{x:150, y:350, color:ColorEnums.GREEN})
        this.renderder.drawTriangle({x:100, y:200, color:ColorEnums.GREEN}, {x:500, y:100, color:ColorEnums.BLUE}, {x:200, y:250, color:ColorEnums.RED})


        let va = [
            {x:-1, y:-1, z:1, color:ColorEnums.GREEN}, 
            {x:1,  y:-1, z:1, color:ColorEnums.GREEN}, 
            {x:1,  y:1, z:1, color:ColorEnums.GREEN}, 
            {x:-1,  y:1, z:1, color:ColorEnums.GREEN}, 

            {x:-1, y:-1, z:-1, color:ColorEnums.GREEN}, 
            {x:1,  y:-1, z:-1, color:ColorEnums.GREEN}, 
            {x:1,  y:1, z:-1, color:ColorEnums.GREEN}, 
            {x:-1,  y:1, z:-1, color:ColorEnums.GREEN}, 

        ] //立方体8个顶点
        let elements = [
            0, 1, 2,  //front
            2, 3, 1,

            7, 6, 5,  //back
            5, 4, 7,

            0, 4, 5,
            5, 1, 0,

            1, 5, 6,
            6, 2, 1,
            
            2, 6, 7,
            7, 3, 2,

            3, 7, 4,
            4, 0, 3

        ] //24个三角形,立方体外表面
        this.renderder.drawElements(va, elements)

        this.flush()
    }


    protected flush() {
        this.bitBlit(this.renderder.width, this.renderder.height, this.renderder.frameBuffer)
    }
}