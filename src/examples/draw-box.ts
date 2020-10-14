import { Vector } from "../core/math/vector"
import { Color, Colors } from "../core/mesh/color"
import Shader, { ShaderContext, VertexShaderInput } from "../core/mesh/shader"
import Texture from "../core/mesh/texture"
import { Vertex } from "../core/mesh/vertex"
import Raster from "../core/raster"
import { IExample } from "../main"

export default class DrawBox implements IExample{
    protected texture:Texture
    protected renderer:Raster
    public constructor(renderer:Raster) {
        this.texture = this.createTexture()
        this.renderer = renderer
        this.init()
    }

    
    protected init() {
        let eye = new Vector(1.5, 0, 2.5, 1)
        let at = new Vector(0, 0, 0, 1)
        let up = new Vector(0, 1, 0, 1)
        let fovy = Math.PI / 2
        let aspect = this.renderer.width / this.renderer.height
        let near = 1
        let far = 500
        this.renderer.setCamera(eye, at, up, fovy, aspect, near, far)
        this.renderer.setBackgroundColor(Colors.YELLOW)

        let shader:Shader = new Shader(
            {
                vertexShading: function(vertex:Vertex, input:VertexShaderInput):Vector{
                    
                    vertex.posWorld.transform(input.viewProject, vertex.context.posProject)
                    return vertex.context.posProject
                },
                fragmentShading: function(context:ShaderContext):Color {
                    if (context.texture != null) {
                        let tex = context.texture.sample(context.uv)
                        return Colors.multiplyColor(tex, context.color, tex)
                    } 
                    return context.color
                }
            }
        )
        this.renderer.setShader(shader)
    }

    public draw() :void{

        let va:Array<Vector> = [
            new Vector(-1,-1,1),
            new Vector(1,-1,1), 
            new Vector(1,1,1),
            new Vector(-1,1,1), 
            new Vector(-1,-1,-1), 
            new Vector(1,-1,-1),
            new Vector(1,1,-1),
            new Vector(-1,1,-1),
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

        this.renderer.setActiveTexture(this.texture)

        for (let e=0;e<elements.length;e+=6) {
            this.renderer.drawTriangle([
                {posWorld:va[ elements[e] ], color:Colors.WHITE, uv:{u:0, v:0}}, 
                {posWorld:va[ elements[e+1] ], color:Colors.WHITE, uv:{u:1, v:0}}, 
                {posWorld:va[ elements[e+2] ], color:Colors.WHITE, uv:{u:1, v:1}}, 
            ])
            this.renderer.drawTriangle([
                {posWorld:va[ elements[e+3] ], color:Colors.WHITE, uv:{u:1, v:1}}, 
                {posWorld:va[ elements[e+4] ], color:Colors.WHITE, uv:{u:1, v:0}}, 
                {posWorld:va[ elements[e+5] ], color:Colors.WHITE, uv:{u:0, v:0}}, 
            ])
        }
       
    }

    protected createTexture(){
        let texture = new Texture(256, 256)
        for (let i=0;i<256;i++) {
            for (let j=0;j<256;j++) {
                let x = Math.floor(i/32)
                let y = Math.floor(j/32)
                if ((x+y) % 2 == 0) {
                    texture.setPixel(j, i, Colors.BLUE)
                } else {
                    texture.setPixel(j, i, Colors.WHITE)
                }
            }
        }
        return texture
    }
}