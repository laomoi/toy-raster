import { Vector } from "../core/math/vector"
import { Color, Colors } from "../core/mesh/color"
import Texture, { UV } from "../core/mesh/texture"
import { Vertex } from "../core/mesh/vertex"
import Raster from "../core/raster"
import { IExample } from "../main"
import Shader, { VertexShaderInput, ShaderContext } from "../core/mesh/shader"



import objBuffer from 'raw-loader!../../res/diablo3_pose.obj'
import diffuseBuffer from '../../res/diablo3_pose_diffuse.png'
// import normalBuffer from 'raw-loader!../../res/diablo3_pose_nm.bmp'
// import specBuffer from 'raw-loader!../../res/diablo3_pose_spec.bmp'




export default class DrawMesh implements IExample{
    protected renderer:Raster

    protected triangles:Array<Array<Vertex>> = []
    protected diffuseTexture:Texture
    public constructor(renderer:Raster) {
        this.renderer = renderer
        this.init()
    }

    
    protected init() {
        let eye = new Vector(0.5, 0, 2.0, 1)
        let at = new Vector(0, 0, 0, 1)
        let up = new Vector(0, 1, 0, 1)
        let fovy = Math.PI / 2
        let aspect = this.renderer.width / this.renderer.height
        let near = 1
        let far = 500
        this.renderer.setCamera(eye, at, up, fovy, aspect, near, far)
        this.renderer.setBackgroundColor(Colors.GRAY)
        this.loadObj()
        this.loadTextures()


        //shader
        let lightDirNormalize:Vector = (new Vector(1, 1, 0.7)).normalize()
        let diffuseTexture = this.diffuseTexture
        let shader:Shader = new Shader(
            {
                vertexShading: function(vertex:Vertex, input:VertexShaderInput):Vector{
                    vertex.posWorld.transform(input.viewProject, vertex.context.posProject)
                    return vertex.context.posProject
                },
                fragmentShading: function(context:ShaderContext):Color {
                    let diffuse = diffuseTexture.sample(context.uv)
                    Colors.multiplyColor(diffuse, context.color, diffuse)

                    let intense = context.normal.normalize().dot(lightDirNormalize)
                    // diffuse.r *= intense
                    // diffuse.g *= intense
                    // diffuse.b *= intense
                    // diffuse.a *= intense
                    return diffuse
                }
            }
        )
        this.renderer.setShader(shader)
    }

    protected base64ToArrayBuffer(base64:string):Uint8Array {
        var binary_string = window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes;
    }
    protected createTextureFromBmpBuffer(bmp:any) {
        let buffer = this.base64ToArrayBuffer(bmp.data)
        let width = bmp.width
        let height = bmp.height
        let texture = new Texture(width, height)
        for (let y=0;y<height;y++) {
            for (let x=0;x<width;x++) {
                let pos = ((height-y-1)*width + x)*4  //webgl中 v坐标向下，把纹理上下反一下
                let color:Color = {
                    r: buffer[pos],
                    g: buffer[pos+1],
                    b: buffer[pos+2],
                    a: buffer[pos+3],
                }
                texture.setPixel(x, y, color)
            }
        }
        return texture
    }

    protected loadTextures() {
        this.diffuseTexture = this.createTextureFromBmpBuffer(diffuseBuffer)
    }

    protected loadObj() {
        
        let lines:Array<string> = objBuffer.split(/\r\n|\n/)
        let vList:Array<Vector> =[]
        let uvList:Array<UV> =[]
        let normalList:Array<Vector> =[]
        let faceList:Array<any> =[]

        for (let line of lines) {
            if (line != ""){
                if (line.charAt(0) == "#"){
                    continue
                }
                let vals = line.split(/\s+/)
                let t = vals[0]
                if (t == "v" && vals.length>=4) {
                    vList.push(new Vector(parseFloat(vals[1]),parseFloat(vals[2]), parseFloat(vals[3])))
                } else if (t == "vt" && vals.length>=3) {
                    uvList.push({ u: parseFloat(vals[1]), v:parseFloat(vals[2])})
                }else if (t == "vn" && vals.length>=4) {
                    normalList.push(new Vector(parseFloat(vals[1]),parseFloat(vals[2]), parseFloat(vals[3])))
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
       
        for (let f of faceList){
            let v1s = f[0]
            let v2s = f[1]
            let v3s = f[2]
            // vertex/uv/normal
            let v1 = vList[ parseInt(v1s[0]) -1 ]
            let v2 = vList[ parseInt(v2s[0]) -1 ]
            let v3 = vList[ parseInt(v3s[0]) -1 ]

            let uv1 = uvList[ parseInt(v1s[1]) -1 ]
            let uv2 = uvList[ parseInt(v2s[1]) -1 ]
            let uv3 = uvList[ parseInt(v3s[1]) -1 ]

            let n1 = normalList[ parseInt(v1s[2]) -1 ]
            let n2 = normalList[ parseInt(v2s[2]) -1 ]
            let n3 = normalList[ parseInt(v3s[2]) -1 ]


            this.triangles.push([
                {posWorld:v1, color:Colors.WHITE, uv:uv1, normal:n1}, 
                {posWorld:v2, color:Colors.WHITE, uv:uv2, normal:n2}, 
                {posWorld:v3, color:Colors.WHITE, uv:uv3, normal:n3}, 
            ])
        }
    }

    public draw() :void{
        for (let triangle of this.triangles) {
            this.renderer.drawTriangle(triangle)
        }
        
    }

}