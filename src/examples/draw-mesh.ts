import { Vector } from "../core/math/vector"
import { Color, Colors } from "../core/mesh/color"
import Texture from "../core/mesh/texture"
import { Vertex } from "../core/mesh/vertex"
import Raster from "../core/raster"
import { IExample } from "../main"
import Shader, { VertexShaderInput, ShaderContext } from "../core/mesh/shader"



import objBuffer from 'raw-loader!../../res/diablo3_pose.obj'
import diffuseBuffer from 'raw-loader!../../res/diablo3_pose_diffuse.bmp'
import normalBuffer from 'raw-loader!../../res/diablo3_pose_nm.bmp'
import specBuffer from 'raw-loader!../../res/diablo3_pose_spec.bmp'




export default class DrawMesh implements IExample{
    protected texture:Texture
    protected renderer:Raster

    protected triangles:Array<any> = []
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

        this.loadObj()
    }

    protected loadObj() {
      // let result = new BmpDecoder(diffuseBuffer)
       // console.log(result)
        // let buffer = require('arraybuffer-loader!../../res/diablo3_pose.obj')
        // let array = new Uint8Array(buffer)
        // array.toString
        let lines:Array<string> = objBuffer.split(/\r\n|\n/)
        let vList:Array<any> =[]
        let uvList:Array<any> =[]
        let normalList:Array<any> =[]
        let faceList:Array<any> =[]

        for (let line of lines) {
            if (line != ""){
                if (line.charAt(0) == "#"){
                    continue
                }
                let vals = line.split(" ")
                let t = vals[0]
                if (t == "v" && vals.length>=4) {
                    vList.push(vals)
                } else if (t == "vt" && vals.length>=3) {
                    uvList.push(vals)
                }else if (t == "vn" && vals.length>=4) {
                    normalList.push(vals)
                }else if (t == "f" && vals.length>=4) {
                    let fvals = [
                        vals[1].split("/"),
                        vals[2].split("/"),
                        vals[3].split("/"),
                    ]
                    faceList.push(fvals)  //v/vt/vn index
                }
            }
        }
        //mesh 
        let vertextList:Array<Vector> = []
        for (let v of vList){
            vertextList.push(new Vector(parseFloat(v[1]),parseFloat(v[2]), parseFloat(v[3])))
        }
        let vtest:any = {}
        for (let f of faceList){
            let v1s = f[0]
            let v2s = f[1]
            let v3s = f[2]
            // vertex/uv/normal
            let v1 = vertextList[ parseInt(v1s[0]) -1 ]
            let v2 = vertextList[ parseInt(v2s[0]) -1 ]
            let v3 = vertextList[ parseInt(v3s[0]) -1 ]

            this.triangles.push([
                {posWorld:v1, color:Colors.WHITE, uv:{u:1, v:1}}, 
                {posWorld:v2, color:Colors.WHITE, uv:{u:1, v:0}}, 
                {posWorld:v3, color:Colors.WHITE, uv:{u:0, v:0}}, 
            ])
        }
    }

    public draw() :void{
        for (let triangle of this.triangles) {
            this.renderer.drawTriangle(triangle)
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