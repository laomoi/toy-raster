import { Vector } from "../core/math/vector"
import { Color, Colors } from "../core/mesh/color"
import Texture from "../core/mesh/texture"
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

    protected triangles:Array<any> = []
    protected diffuseTexture:Texture
    public constructor(renderer:Raster) {
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
                let pos = (y*width + x)*4
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
    protected loadObj() {
        this.diffuseTexture = this.createTextureFromBmpBuffer(diffuseBuffer)
        console.log(this.diffuseTexture)
        
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
        // for (let triangle of this.triangles) {
        //     this.renderer.drawTriangle(triangle)
        // }
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
            // 7, 6, 5,  //back
            // 5, 4, 7, 
            // 0, 4, 5,  //bottom
            // 5, 1, 0, 
            // 1, 5, 6, //right
            // 6, 2, 1, 
            // 2, 6, 7,  //top
            // 7, 3, 2, 
            // 3, 7, 4,   //left
            // 4, 0, 3,  

        ] //24个三角形,立方体外表面

        this.renderer.setActiveTexture(this.diffuseTexture)

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

}