import { WebGLBlitter } from "./blitter/webgl-blitter"
import { Vector } from "./core/math/vector"
import { Colors } from "./core/mesh/color"
import Texture from "./core/mesh/texture"
import { Vertex } from "./core/mesh/vertex"
import Raster from "./core/raster"

export default class App {
    protected blitter:WebGLBlitter = null
    protected renderder:Raster
    constructor(canvasWidth:number, canvasHeight:number, gl:any) {
        this.renderder = new Raster(canvasWidth, canvasHeight)
        this.blitter = new WebGLBlitter(gl)
        this.init()

        //loop
        let self = this
        let wrapMainLoop = function() {
            self.mainLoop()
            requestAnimationFrame(wrapMainLoop)
        }
        wrapMainLoop()
    }

    protected init() {
        let eye = new Vector(1.5, 1.5, 3, 1)
        let at = new Vector(0, 0, 0, 1)
        let up = new Vector(0, 1, 0, 1)
        let fovy = Math.PI / 2
        let aspect = this.renderder.width / this.renderder.height
        let near = 1
        let far = 500
        this.renderder.setCamera(eye, at, up, fovy, aspect, near, far)
        // this.renderder.setBackgroundColor(Colors.WHITE)
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
            {posWorld:new Vector(-1,-1,1), color:Colors.GREEN, uv:{u:0, v:0}}, 
            {posWorld:new Vector(1,-1,1), color:Colors.BLUE, uv:{u:1, v:0}}, 
            {posWorld:new Vector(1,1,1), color:Colors.RED, uv:{u:1, v:1}}, 
            {posWorld:new Vector(-1,1,1), color:Colors.ORANGE, uv:{u:0, v:1}}, 

            {posWorld:new Vector(-1,-1,-1), color:Colors.GREEN, uv:{u:0, v:0}}, 
            {posWorld:new Vector(1,-1,-1), color:Colors.BLUE, uv:{u:1, v:0}}, 
            {posWorld:new Vector(1,1,-1), color:Colors.RED, uv:{u:1, v:1}}, 
            {posWorld:new Vector(-1,1,-1), color:Colors.ORANGE, uv:{u:0, v:1}}, 

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
                    texture.setPixel(j, i, Colors.BLUE)
                } else {
                    texture.setPixel(j, i, Colors.WHITE)
                }
            }
        }
        return texture
    }


    protected flush() {
        this.blitter.blitPixels(this.renderder.width, this.renderder.height, this.renderder.frameBuffer)
    }

}


window.onload = function () {
    var canvas:any = document.getElementById('canvas')
    var gl = canvas.getContext('webgl');
    if (!gl) {
        console.log("WEBGL FAILED");
        return;
    }

    window.app = new App(canvas.width, canvas.height, gl);
}