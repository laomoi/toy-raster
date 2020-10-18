import { Vector4 } from "../core/math/vector4"
import { Color} from "../core/shading/color"
import Shader, { FragmentInput, ShaderVarying, VertexInput } from "../core/shading/shader"
import Texture from "../core/shading/texture"
import { Vertex } from "../core/shading/vertex"
import Raster from "../core/raster"
import { IExample } from "../main"
import { Vector2 } from "../core/math/vector2"

import floorPngBuffer from '../../res/floor_diffuse.png'

export default class DrawBox implements IExample{
    protected texture:Texture
    protected renderer:Raster
    public constructor(renderer:Raster) {
        this.texture = this.createTexture()
        this.renderer = renderer
        this.init()
    }
    
    
    protected init() {
        let eye = new Vector4(1.5, 0, 2.5, 1)
        let at = new Vector4(0, 0, 0, 1)
        let up = new Vector4(0, 1, 0, 1)
        let fovy = Math.PI / 2
        let aspect = this.renderer.width / this.renderer.height
        let near = 1
        let far = 500
        this.renderer.setCamera(eye, at, up, fovy, aspect, near, far)
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
        return Texture.createTextureFromBmpBuffer(floorPngBuffer)
    }
}