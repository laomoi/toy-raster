import { Vector } from "../core/math/vector"
import { Colors } from "../core/mesh/color"
import Texture from "../core/mesh/texture"
import { Vertex } from "../core/mesh/vertex"
import Raster from "../core/raster"
import { IExample } from "../main"



import objBuffer from 'raw-loader!../../res/diablo3_pose.obj'



export default class DrawMesh implements IExample{
    protected texture:Texture
    protected renderer:Raster

    protected va:Array<Vertex> = null
    protected elements:Array<number> = null
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


        this.loadObj()
    }

    protected loadObj() {

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
        let vertextList:Array<Vertex> = []
        let elements:Array<number> = []
        for (let v of vList){
            vertextList.push({
                posWorld:new Vector(parseFloat(v[1]),parseFloat(v[2]), parseFloat(v[3])), color:Colors.WHITE, uv:{u:0, v:0}
            })
        }
        let vtest:any = {}
        for (let f of faceList){
            let v1 = f[0]
            let v2 = f[1]
            let v3 = f[2]
            elements.push(parseInt(v1[0]) -1, parseInt(v2[0]) -1, parseInt(v3[0]) -1)
            // if (vtest[ v1[0] ] ==null) {
            //     vtest[ v1[0] ] = {uv: v1[1], n:v1[2]}
            // } else if (vtest[ v1[0] ].uv != v1[1]  ) {
            //     console.log("uv not same",v1[0], vtest[ v1[0] ].uv, v1[1])
            // }
            // if (vtest[ v2[0] ] ==null) {
            //     vtest[ v2[0] ] = {uv: v2[1], n:v2[2]}
            // }else if (vtest[ v2[0] ].uv != v2[1]  ) {
            //     console.log("uv not same",v2[0], vtest[ v2[0] ].uv, v2[1])
            // }
            // if (vtest[ v3[0] ] ==null) {
            //     vtest[ v3[0] ] = {uv: v3[1], n:v3[2]}
            // }else if (vtest[ v3[0] ].uv != v3[1]  ) {
            //     console.log("uv not same",v3[0], vtest[ v3[0] ].uv, v3[1])
            // }
            
            if (elements[-1] > vertextList.length) {
                console.log("obj error, has wrong element", elements[-1], vertextList.length)
                return
            }
        }

        this.va = vertextList
        this.elements = elements
        console.log(vertextList)
    }

    public draw() :void{
        if (this.va == null) {
            return
        }
        this.renderer.drawElements(this.va, this.elements)
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