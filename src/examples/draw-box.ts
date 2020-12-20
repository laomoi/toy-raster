import { Vector4 } from "../core/math/vector4"
import { Color} from "../core/shading/color"
import Shader, { FragmentInput, ShaderVarying, VertexInput } from "../core/shading/shader"
import Texture from "../core/shading/texture"
import { Vertex } from "../core/shading/vertex"
import Raster from "../core/raster"
import { IExample } from "../app"
import { Vector2 } from "../core/math/vector2"

import InputHandler from "../web/input-handler"
import MathUtils from "../core/math/math-utils"
import { Matrix } from "../core/math/matrix"

export default class DrawBox implements IExample{
    protected texture:Texture
    protected renderer:Raster

    protected fovy:number = Math.PI / 2
    protected eye:Vector4 = new Vector4(1.5, 0, 2.5, 1)
    protected inputHandler:InputHandler

    public constructor(renderer:Raster) {
        this.texture = this.createTexture()
        this.renderer = renderer
        this.inputHandler = new InputHandler(this)
        this.init()
    }
    
    protected setCamera() {
        let at = new Vector4(0, 0, 0, 1)
        let up = new Vector4(0, 1, 0, 1)
        let aspect = this.renderer.width / this.renderer.height
        let near = 1
        let far = 500
        this.renderer.setCamera(this.eye, at, up, this.fovy, aspect, near, far)
    }

    protected init() {
        this.setCamera()

        this.renderer.setBackgroundColor(Color.GRAY)
        let texture = this.texture
        let shader:Shader = new Shader(
            {
                vertexShading: function(vertex:Vertex, input:VertexInput):Vector4{
                    vertex.posModel.transform(input.viewProject, vertex.context.posProject)
                    vertex.context.varyingVec2Dict[ShaderVarying.UV] = vertex.uv
                    return vertex.context.posProject
                },
                fragmentShading: function(input:FragmentInput):Color {
                    let tex = texture.sample(input.varyingVec2Dict[ShaderVarying.UV])
                    return Color.multiplyColor(tex, input.color, tex)
                }
            }
        )
        this.renderer.setShader(shader)
    }

    public draw() :void{
        let va:Array<Vector4> = [
            new Vector4(-1,-1,1),
            new Vector4(1,-1,1), 
            new Vector4(1,1,1),
            new Vector4(-1,1,1), 
            new Vector4(-1,-1,-1), 
            new Vector4(1,-1,-1),
            new Vector4(1,1,-1),
            new Vector4(-1,1,-1),
        ] //立方体8个顶点

        let elements = [
            0, 1, 2, //front
            2, 3, 0, 
            7, 6, 5,  //back
            5, 4, 7, 
            0, 4, 5,  //bottom
            5, 1, 0, 
            1, 5, 6, //right
            6, 2, 1, 
            2, 6, 7,  //top
            7, 3, 2, 
            3, 7, 4,   //left
            4, 0, 3,  
        ] //24个三角形,立方体外表面

        let uv00 = new Vector2(0, 0)
        let uv10 = new Vector2(1, 0)
        let uv11 = new Vector2(1, 1)
        let uv01 = new Vector2(0, 1)
        for (let e=0;e<elements.length;e+=6) {
            this.renderer.drawTriangle([
                {posModel:va[ elements[e] ], color:Color.WHITE, uv:uv00}, 
                {posModel:va[ elements[e+1] ], color:Color.WHITE, uv:uv10}, 
                {posModel:va[ elements[e+2] ], color:Color.WHITE, uv:uv11}, 
            ])
            this.renderer.drawTriangle([
                {posModel:va[ elements[e+3] ], color:Color.WHITE, uv:uv11}, 
                {posModel:va[ elements[e+4] ], color:Color.WHITE, uv:uv01}, 
                {posModel:va[ elements[e+5] ], color:Color.WHITE, uv:uv00}, 
            ])
        }
    }

    protected createTexture(){
        return Texture.createTextureFromFile("floor_diffuse.png")
    }

    public onWheel(delta:number){
        this.fovy = MathUtils.clamp(this.fovy + (delta >0 ?0.05:-0.05), Math.PI/6, Math.PI*2/3)
        this.setCamera()
    }

    public onMove(dx:number, dy:number) {
        let angleX = -dx/30 * Math.PI/180*10
        let angleY = -dy/30 * Math.PI/180*10

        let mat1 = new Matrix()
        mat1.setRotateY(angleX)

        let mat2 = new Matrix()
        mat2.setRotateX(angleY)
        this.eye.transform(mat1.multiply(mat2), this.eye)

        this.setCamera()
    }
}