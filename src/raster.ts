
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
    posWorld?:Vector,
    color?:Color,//default White
    uv?:UV,
    posProject?:Vector//冗余字段, 投影坐标, 变换计算时不要修改pos的值, 结果都存储在posTransform里
    posScreen?:Vector//冗余字段, 屏幕坐标
    rhw?:number // 1/w
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
    public static ORANGE:Color =  {r:255, g:255, b:0, a:255}

    public static clone(color:Color):Color{
        return {r:color.r, g:color.g, b:color.b, a:color.a}
    }
}

class Vector{
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

    public setLookAt(eye:Vector, at:Vector, up:Vector,) {
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

class Texture {
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

class MathUtils {

    // public static linearInterpolateValue(value1:number, value2:number, t:number) {
    //     return (1-t) * value1 + t * value2
    // }

    public static isInsideViewVolumn(v:Vector){
        if (v.x < -1 || v.x > 1){
            return false
        }
        if (v.y < -1 || v.y > 1){
            return false
        }
        if (v.z < -1 || v.z > 1){
            return false
        }
        return true
    }

    public static convertToScreenPos(v:Vector, dst:Vector, width:number, height:number){
        dst.x = (v.x + 1)/2 * width
        dst.y = (v.y + 1)/2 * height
        dst.z = v.z
        return dst
    }

    public static getInterpColor(color1:Color, color2:Color, color3:Color, a:number, b:number, c:number, dstColor:Color) {
        dstColor.r = MathUtils.getInterpValue(color1.r, color2.r, color3.r, a, b, c)
        dstColor.g = MathUtils.getInterpValue(color1.g, color2.g, color3.g, a, b, c)
        dstColor.b = MathUtils.getInterpValue(color1.b, color2.b, color3.b, a, b, c)
        dstColor.a = MathUtils.getInterpValue(color1.a, color2.a, color3.a, a, b, c)
    }
    public static getInterpUV(uv1:UV, uv2:UV, uv3:UV, a:number, b:number, c:number, dstUV:UV) {
        dstUV.u = MathUtils.getInterpValue(uv1.u, uv2.u, uv3.u, a, b, c)
        dstUV.v = MathUtils.getInterpValue(uv1.v, uv2.v, uv3.v, a, b, c)
    }
    
    public static getInterpValue(v1:number, v2:number, v3:number,  a:number, b:number, c:number) {
        return v1*a + v2*b + v3*c
    }

    public static multiplyColor(color1:Color, color2:Color, dst:Color){
        dst.r = color1.r * color2.r / 255
        dst.g = color1.g * color2.g / 255
        dst.b = color1.b * color2.b / 255
        dst.a = color1.a * color2.a / 255
        return dst
    }
}



class Renderer {
    public width:number 
    public height:number
    public frameBuffer:Uint8Array = null
    protected zBuffer:Float32Array = null
    protected backgroundColor:Color = ColorEnums.clone(ColorEnums.BLACK)
    protected activeTexture:Texture = null

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

    protected barycentricFunc(vs:Array<Vector>, a:number, b:number, x:number, y:number):number{
        return ((vs[a].y - vs[b].y)*x + (vs[b].x - vs[a].x)*y + vs[a].x*vs[b].y - vs[b].x*vs[a].y)
    }
// protected printed:boolean = false
    public drawTriangle2D(v0:Vertex, v1:Vertex, v2:Vertex) {
        //使用重心坐标的算法(barycentric coordinates)对三角形进行光栅化
        //使用AABB来优化性能
        //对于三角形边(edge case)上的点, 使用的是<CG 4th>上的算法， 使用一个Off-screen point(-1, -1) 来判断是否在同一边
        let vs = [v0.posScreen, v1.posScreen, v2.posScreen]
        let x0 = vs[0].x, x1 = vs[1].x, x2 = vs[2].x, y0 = vs[0].y, y1=vs[1].y, y2=vs[2].y
        let minX = Math.floor( Math.min(x0, x1, x2) )
        let maxX = Math.ceil( Math.max(x0, x1, x2) )
        let minY = Math.floor( Math.min(y0, y1, y2) )
        let maxY = Math.ceil( Math.max(y0, y1, y2) )
        let fBelta = this.barycentricFunc(vs, 2, 0, x1, y1)
        let fGama = this.barycentricFunc(vs, 0, 1, x2, y2)
        let fAlpha =  this.barycentricFunc(vs, 1, 2, x0, y0)
        let offScreenPointX = -1, offScreenPointY = -1
        
        let tempColor:Color = ColorEnums.clone(ColorEnums.WHITE)
        let uv:UV = {u:0, v:0}

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
                        //在三角形内，边上的点也属于三角形
                        //注意不能直接使用屏幕空间三角形的3个顶点属性直接插值，
                        //在3D空间中顶点属性可以通过重心坐标线性插值，但是屏幕空间中已经不是线性插值，需要做透视矫正
                        let rhw = MathUtils.getInterpValue(v0.rhw, v1.rhw, v2.rhw, alpha, belta, gama) //1/z
                        //这里使用rhw=1/w作为深度缓冲的值，非线性的zbuffer在近处有更高的精度
                        let zPos = this.width * y + x
                        if (isNaN(this.zBuffer[zPos]) || this.zBuffer[zPos] > rhw) {
                            let w = 1 / (rhw != 0 ? rhw : 1)
                            //反推3D空间中的重心坐标  a, b, c
                            let a = alpha*w*v0.rhw
                            let b = belta*w*v1.rhw
                            let c = gama*w*v2.rhw
                            
                            MathUtils.getInterpColor(v0.color, v1.color, v2.color, a, b, c, tempColor)
                            MathUtils.getInterpUV(v0.uv, v1.uv, v2.uv, a, b, c, uv)
                            // if (!this.printed){
                            //     console.log("uv=",  uv.u,uv.v)
                            // }
                            // console.log("inter uv", v0.uv, v1.uv, v2.uv, a, b, c, uv)
                            let finalColor = this.fragmentShading(x, y, tempColor, uv)
                            if (finalColor.a > 0) {
                                this.setPixel(x, y, finalColor)
                                this.zBuffer[zPos] = rhw
                            }
                        }
                    }
                }
            }
        }
        // this.printed = true

    }

    //片元着色
    protected fragmentShading(x:number, y:number, color:Color, uv:UV) {
        if (this.activeTexture != null) {
            let tex = this.activeTexture.sample(uv)
            return MathUtils.multiplyColor(tex, color, tex)
        } 
        return color
    }

    public setActiveTexture(texture:Texture) {
        this.activeTexture = texture
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
        //根据当前的view和project, 对所有三角形进行投影计算
        //对每一个三角形进行光栅化， 然后进行着色，zbuffer和framebuffer赋值
        //没做backface culling, 只做了view volumn culling
        //三角形细分的clip没做
        if (elements.length % 3 != 0){
            return
        }
        let cameraTransform = this.camera.vp
        for (let vert of va) {
            if (vert.posProject == null) {
                vert.posProject = new Vector()
            }
            vert.posWorld.transform(cameraTransform, vert.posProject)
            vert.rhw = 1/vert.posProject.w //w等同于投影前的视图坐标的z
            vert.posProject.homogenenize()
            if (MathUtils.isInsideViewVolumn(vert.posProject)){
                if (vert.posScreen == null){
                    vert.posScreen = new Vector()
                }
                MathUtils.convertToScreenPos(vert.posProject, vert.posScreen, this.width, this.height)
            }
        }
        for (let i=0;i<elements.length;i+=3) {
            let trianglePoints = [va[elements[i]], va[elements[i+1]], va[elements[i+2]]]
            let culling = false
            for (let p of trianglePoints) {
                //view volumn culling
                if (!MathUtils.isInsideViewVolumn(p.posProject) ) {
                    culling = true
                    break;
                }
            }
            if (!culling) {
                this.drawTriangle2D(trianglePoints[0], trianglePoints[1], trianglePoints[2])
            }
        }
    }

    protected setDefaultCamera() {
        let eye = new Vector(1.5, 0, 3, 1)
        let at = new Vector(0, 0, 0, 1)
        let up = new Vector(0, 1, 0, 1)
        let fovy = Math.PI / 2
        let aspect = this.width / this.height
        let near = 1
        let far = 500
        this.setCamera(eye, at, up, fovy, aspect, near, far)
    }

    public setCamera(eye:Vector, lookAt:Vector, up:Vector, fovy:number, aspect:number, near:number, far:number) {
        this.camera.view.setLookAt(eye, lookAt, up)
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
   
        // this.renderder.drawTriangle2D({posScreen:new Vector(100,200), color:ColorEnums.RED}, {posScreen:new Vector(200,250), color:ColorEnums.BLUE},{posScreen:new Vector(150,350), color:ColorEnums.GREEN})
        // this.renderder.drawTriangle2D({posScreen:new Vector(100,200), color:ColorEnums.GREEN}, {posScreen:new Vector(500,100), color:ColorEnums.BLUE}, {posScreen:new Vector(200,250), color:ColorEnums.RED})

        
        let va:Array<Vertex> = [
            {posWorld:new Vector(-1,-1,1), color:ColorEnums.GREEN, uv:{u:0, v:0}}, 
            {posWorld:new Vector(1,-1,1), color:ColorEnums.BLUE, uv:{u:1, v:0}}, 
            {posWorld:new Vector(1,1,1), color:ColorEnums.RED, uv:{u:1, v:1}}, 
            {posWorld:new Vector(-1,1,1), color:ColorEnums.ORANGE, uv:{u:0, v:1}}, 

            {posWorld:new Vector(-1,-1,-1), color:ColorEnums.GREEN, uv:{u:0, v:0}}, 
            {posWorld:new Vector(1,-1,-1), color:ColorEnums.BLUE, uv:{u:1, v:0}}, 
            {posWorld:new Vector(1,1,-1), color:ColorEnums.RED, uv:{u:1, v:1}}, 
            {posWorld:new Vector(-1,1,-1), color:ColorEnums.ORANGE, uv:{u:0, v:1}}, 

        ] //立方体8个顶点
        let elements = [
            0, 1, 2,  //front
            2, 3, 0,
            7, 6, 5,  //back
            5, 4, 7,
            0, 4, 5, //bottom
            5, 1, 0,
            1, 5, 6, //right
            6, 2, 1,
            2, 6, 7,  //top
            7, 3, 2,
            3, 7, 4,  //left
            4, 0, 3

        ] //24个三角形,立方体外表面

        this.renderder.setActiveTexture(this.createTexture())
        this.renderder.drawElements(va, elements)

        this.flush()
    }

    protected createTexture(){
        let texture = new Texture(256, 256)
        for (let i=0;i<256;i++) {
            for (let j=0;j<256;j++) {
                let x = Math.floor(i/32)
                let y = Math.floor(j/32)
                if ((x+y) % 2 == 0) {
                    texture.setPixel(j, i, ColorEnums.BLUE)
                } else {
                    texture.setPixel(j, i, ColorEnums.WHITE)
                }
            }
        }
 
        return texture
    }


    protected flush() {
        this.bitBlit(this.renderder.width, this.renderder.height, this.renderder.frameBuffer)
    }
}