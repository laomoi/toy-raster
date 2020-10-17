import Buffer from "./shading/buffer"
import { Matrix } from "./math/matrix"
import { Vector4 } from "./math/vector4"
import { Color, Colors } from "./shading/color"
import Shader, { IShaderProgram, FragmentInput } from "./shading/shader"
import { Vertex } from "./shading/vertex"
import MathUtils from "./math/math-utils"
import { Vector2 } from "./math/vector2"


export interface Camera {
    view: Matrix,
    projection:Matrix,
    vp:Matrix //projection*view
}


export default class Raster {
    public width:number 
    public height:number
    // public frameBuffer:Uint8Array = null
    protected buffer:Buffer = null
    protected backgroundColor:Color = Colors.clone(Colors.BLACK)
    protected usingMSAA:boolean = true //使用2x2 grid的MSAA抗锯齿
    protected currentShader:Shader = null

    protected camera:Camera = {
        view: new Matrix(),
        projection: new Matrix(),
        vp: new Matrix()
    }

    constructor(width:number, height:number, usingMSAA:boolean=true) {
        this.width = width
        this.height = height
        this.usingMSAA = usingMSAA

        this.buffer = new Buffer(width, height, usingMSAA)

        this.setDefaultCamera()
    }

    public clear() {
        this.buffer.clear(this.backgroundColor)
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

    protected barycentricFunc(vs:Array<Vector4>, a:number, b:number, x:number, y:number):number{
        return ((vs[a].y - vs[b].y)*x + (vs[b].x - vs[a].x)*y + vs[a].x*vs[b].y - vs[b].x*vs[a].y)
    }

    //如果在三角形内，返回[3个重心坐标], 否则返回null
    protected getBarycentricInTriangle(x:number, y:number, vs:Array<Vector4>, fAlpha:number, fBelta:number, fGama:number,
        fAlphaTest:number, fBeltaTest:number, fGamaTest:number) {
        //F(a,b, x,y) = (ya-yb)*x + (xb-xa)*y + xa*yb - xb*ya, 
        //a,b is [0,1,2], belta= F(2,0,x,y) / F(2, 0, x1,y1)
        let belta = this.barycentricFunc(vs, 2, 0, x, y) / fBelta
        let gama = this.barycentricFunc(vs, 0, 1, x, y) / fGama
        let alpha = 1 - belta - gama
        if (alpha>=0 && belta >=0 && gama >=0) {
            if (  (alpha > 0 || fAlpha*fAlphaTest > 0) 
            &&  (belta > 0 || fBelta*fBeltaTest > 0) 
            &&  (gama > 0 || fGama*fGamaTest > 0) 
                ){
                return [ alpha, belta, gama]
            }
        }
        return null
    }

    public drawTriangle2D(v0:Vertex, v1:Vertex, v2:Vertex) {
        //使用重心坐标的算法(barycentric coordinates)对三角形进行光栅化
        //使用AABB来优化性能
        //对于三角形边(edge case)上的点, 使用的是<CG 4th>上的算法， 使用一个Off-screen point(-1, -1) 来判断是否在同一边
        let vs = [v0.context.posScreen, v1.context.posScreen, v2.context.posScreen]
        let x0 = vs[0].x, x1 = vs[1].x, x2 = vs[2].x, y0 = vs[0].y, y1=vs[1].y, y2=vs[2].y
        let minX = Math.floor( Math.min(x0, x1, x2) )
        let maxX = Math.ceil( Math.max(x0, x1, x2) )
        let minY = Math.floor( Math.min(y0, y1, y2) )
        let maxY = Math.ceil( Math.max(y0, y1, y2) )
        let fBelta = this.barycentricFunc(vs, 2, 0, x1, y1)
        let fGama = this.barycentricFunc(vs, 0, 1, x2, y2)
        let fAlpha =  this.barycentricFunc(vs, 1, 2, x0, y0)

        let offScreenPointX = -1, offScreenPointY = -1
        let fAlphaTest = this.barycentricFunc(vs, 1, 2, offScreenPointX, offScreenPointY)
        let fGamaTest = this.barycentricFunc(vs, 0, 1, offScreenPointX, offScreenPointY)
        let fBeltaTest = this.barycentricFunc(vs, 2, 0, offScreenPointX, offScreenPointY)

        for (let x=minX;x<=maxX;x++) {
            for (let y=minY;y<=maxY;y++) {
                if (!this.usingMSAA) {
                    this.rasterizePixelInTriangle(x, y, vs, v0, v1, v2, fAlpha, fBelta, fGama, fAlphaTest, fBeltaTest, fGamaTest)
                } else {
                    this.rasterizePixelInTriangleMSAA(x, y, vs, v0, v1, v2, fAlpha, fBelta, fGama, fAlphaTest, fBeltaTest, fGamaTest)
                }
            }
        }
    }

    protected createFragmentInput(x:number, y:number, v0:Vertex, v1:Vertex, v2:Vertex, a:number, b:number, c:number) {
        let context:FragmentInput = {
            x:x,
            y:y, 
            color:Colors.clone(Colors.WHITE),
            varyingVec2Dict:{},
            varyingVec4Dict:{},
        }
        //插值
        Colors.getInterpColor(v0.color, v1.color, v2.color, a, b, c, context.color)
        for (let k in v0.context.varyingVec2Dict) {
            context.varyingVec2Dict[k] = Vector2.getInterpValue3(v0.context.varyingVec2Dict[k], 
                v1.context.varyingVec2Dict[k], v2.context.varyingVec2Dict[k], a, b, c)
        }
        for (let k in v0.context.varyingVec4Dict) {
            context.varyingVec4Dict[k] = Vector4.getInterpValue3(v0.context.varyingVec4Dict[k], 
                v1.context.varyingVec4Dict[k], v2.context.varyingVec4Dict[k], a, b, c)
        }
        return context
    }

    protected rasterizePixelInTriangle(x:number, y:number, vs:Array<Vector4>, v0:Vertex, v1:Vertex, v2:Vertex,
        fAlpha:number, fBelta:number, fGama:number, fAlphaTest:number, fBeltaTest:number, fGamaTest:number) {
        let barycentric = this.getBarycentricInTriangle(x, y, vs, fAlpha, fBelta, fGama, fAlphaTest, fBeltaTest, fGamaTest)
        if (barycentric == null) {
            return
        }
        let rhw = MathUtils.getInterpValue3(v0.context.rhw, v1.context.rhw, v2.context.rhw, barycentric[0], barycentric[1], barycentric[2]) //1/z
        //这里使用rhw=1/w作为深度缓冲的值，非线性的zbuffer在近处有更高的精度
        if (this.buffer.ztest(x, y, rhw)) {
            let w = 1 / (rhw != 0 ? rhw : 1)
            //反推3D空间中的重心坐标  a, b, c
            let a = barycentric[0]*w*v0.context.rhw
            let b = barycentric[1]*w*v1.context.rhw
            let c = barycentric[2]*w*v2.context.rhw

            let input:FragmentInput = this.createFragmentInput(x, y, v0, v1, v2, a, b, c) 
            let finalColor = this.currentShader.fragmentShading(input)
            if (finalColor.a > 0) {
                this.setPixel(x, y, finalColor)
                this.buffer.setZ(x, y, rhw)
            }
        }
    }

    protected rasterizePixelInTriangleMSAA(x:number, y:number, vs:Array<Vector4>, v0:Vertex, v1:Vertex, v2:Vertex,
        fAlpha:number, fBelta:number, fGama:number, fAlphaTest:number, fBeltaTest:number, fGamaTest:number) {
        //4个子采样点, 2x2 RGSS GRID  
        let points = [[x-0.325,y+0.125],[x+0.125, y+0.325],[x-0.125, y-0.325],[x+0.325,y-0.125]] 
        let testResults:Array<{barycentric:number[],index:number,x:number,y:number,rhw:number}> = []  
        for (let i=0;i<points.length;i++) {
            let p = points[i]
            let px:number = p[0], py:number=p[1]
            let barycentric = this.getBarycentricInTriangle(px, py, vs, fAlpha, fBelta, fGama, fAlphaTest, fBeltaTest, fGamaTest)
            if (barycentric != null) {
                let rhw = MathUtils.getInterpValue3(v0.context.rhw, v1.context.rhw, v2.context.rhw, barycentric[0], barycentric[1], barycentric[2]) //1/z
                if (this.buffer.ztest(x, y, rhw, i)) {
                    testResults.push({
                            barycentric: barycentric, 
                            index:i, 
                            x: x, 
                            y: y, 
                            rhw:rhw
                        }
                    )
                }
            }
        } 
        if (testResults.length > 0) {
            //对像素中心点进行一次frag着色,如果取不到，则使用第一个采样点进行着色
            let fx = x, fy = y
            let barycentric = this.getBarycentricInTriangle(x, y, vs, fAlpha, fBelta, fGama, fAlphaTest, fBeltaTest, fGamaTest)
            if (barycentric == null) {
                barycentric = testResults[0].barycentric
                fx = testResults[0].x
                fy = testResults[0].y
            }
            let rhw = MathUtils.getInterpValue3(v0.context.rhw, v1.context.rhw, v2.context.rhw, barycentric[0], barycentric[1], barycentric[2]) //1/z
            let w = 1 / (rhw != 0 ? rhw : 1)
            let a = barycentric[0]*w*v0.context.rhw
            let b = barycentric[1]*w*v1.context.rhw
            let c = barycentric[2]*w*v2.context.rhw
            let input:FragmentInput = this.createFragmentInput(fx, fy, v0, v1, v2, a, b, c) 
            let finalColor = this.currentShader.fragmentShading(input)
            if (finalColor.a > 0) {
                for (let result of testResults) {
                    let index = result.index
                    let rhw = result.rhw
                    this.setPixel(x, y, finalColor, index)
                    this.buffer.setZ(x, y, rhw, index)
                }
                this.buffer.applyMSAAFilter(x, y)
            }
        }
    }


    public setBackgroundColor(color:Color) {
        this.backgroundColor = Colors.clone(color)
    }

    public setPixel(x:number, y:number, color:Color, index:number=0) {
        if (x < this.width && y < this.height && x>=0 && y>=0) {
            this.buffer.setColor(x, y, color, index) 
        }        
    }

    public drawTriangle(va:Array<Vertex>){
        if (va.length % 3 != 0){
            return
        }
        //执行顶点着色器，得到真正的投影坐标，输出到 context, 作为片元着色器的输入
        this.currentShader.setViewProject(this.camera.vp)
        for (let vertex of va) {
            vertex.context = {
                posProject: new Vector4(),
                posScreen: new Vector4(),
                rhw: 1,
                varyingVec2Dict: {},
                varyingVec4Dict: {},
            }
            this.currentShader.vertexShading(vertex)      
            vertex.context.rhw = 1/vertex.context.posProject.w //w等同于投影前的视图坐标的z
            vertex.context.posProject.homogenenize()      
        }

        //没做backface culling, 只做了view volumn culling
        //三角形细分的clip没做
        //计算到屏幕坐标，执行片元着色器
        let culling = false
        for (let p of va) {
            //view volumn culling
            if (!this.isInsideViewVolumn(p.context.posProject) ) {
                culling = true
                break;
            }
        }
        
        if (!culling) {
            for (let p of va) {
                this.convertToScreenPos(p.context.posProject, p.context.posScreen, this.width, this.height)
            } 
            this.drawTriangle2D(va[0], va[1], va[2])
        }
    }

    protected setDefaultCamera() {
        let eye = new Vector4(1.5, 0, 3, 1)
        let at = new Vector4(0, 0, 0, 1)
        let up = new Vector4(0, 1, 0, 1)
        let fovy = Math.PI / 2
        let aspect = this.width / this.height
        let near = 1
        let far = 500
        this.setCamera(eye, at, up, fovy, aspect, near, far)
    }

    public setCamera(eye:Vector4, lookAt:Vector4, up:Vector4, fovy:number, aspect:number, near:number, far:number) {
        this.camera.view.setLookAt(eye, lookAt, up)
        this.camera.projection.setPerspective(fovy, aspect, near, far)
        this.camera.vp = this.camera.view.multiply(this.camera.projection)
    }

    public getFrameBuffer() {
        return this.buffer.frameBuffer
    }

    public setShader(shader:Shader){
        this.currentShader = shader
    }

    protected isInsideViewVolumn(v:Vector4){
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

    protected convertToScreenPos(v:Vector4, dst:Vector4, width:number, height:number){
        dst.x = (v.x + 1)/2 * width
        dst.y = (v.y + 1)/2 * height
        dst.z = v.z
        return dst
    }
}

