import { WebGLBlitter } from "./blitter/webgl-blitter"
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


    protected onMouseDown(x:number, y:number){
        console.log("down",x, y)
    }

    protected onMouseMove(x:number, y:number){
        
    }

    protected onMouseUp(x:number, y:number){
        
    }
}


window.onload = function () {
    let canvas:any = document.getElementById('canvas')
    let gl = canvas.getContext('webgl');
    if (!gl) {
        console.log("WEBGL FAILED");
        return;
    }

    window.app = new App(canvas.width, canvas.height, gl);
}



window.onmousedown = function(e:MouseEvent){
    window.app.onMouseDown(e.clientX, e.clientY)
    let canvas:any = document.getElementById('canvas')
    let rect = canvas.getBoundingClientRect()
}

window.onmousemove = function(e:MouseEvent){
    window.app.onMouseMove(e.clientX, e.clientY)
}

window.onmouseup = function(e:MouseEvent){
    window.app.onMouseUp(e.clientX, e.clientY)
}