import { WebGLBlitter } from "./blitter/webgl-blitter"
import { Vector } from "./core/math/vector"
import { Colors } from "./core/mesh/color"
import Texture from "./core/mesh/texture"
import { Vertex } from "./core/mesh/vertex"
import Raster from "./core/raster"
import DrawBox from "./examples/draw-box"
import DrawMesh from "./examples/draw-mesh"


export interface IExample {
    draw():void;
}

export default class App {
    protected blitter:WebGLBlitter = null
    protected renderer:Raster
    protected example:IExample 
    constructor(canvasWidth:number, canvasHeight:number, gl:any) {
        this.renderer = new Raster(canvasWidth, canvasHeight, true)
        this.blitter = new WebGLBlitter(gl)
        this.example = new DrawMesh(this.renderer)

        //loop
        let self = this
        let wrapMainLoop = function() {
            self.mainLoop()
            requestAnimationFrame(wrapMainLoop)
        }
        wrapMainLoop()
    }


    protected mainLoop() {
        this.renderer.clear()
        this.example.draw()
        this.flush()
    }

    protected flush() {
        this.blitter.blitPixels(this.renderer.width, this.renderer.height, this.renderer.getFrameBuffer())
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