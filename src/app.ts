import { WebGLBlitter } from "./web/webgl-blitter"
import Raster from "./core/raster"
import DrawBox from "./examples/draw-box"
import DrawMesh from "./examples/draw-mesh"


export interface IExample {
    draw():void;
    onWheel?(delta:number):void;
    onMove?(x:number, y:number):void;
}


export default class App {

    protected gl:WebGLRenderingContext

    protected showFPSCallback:any = null

    protected width:number
    protected height:number
    protected blitter:WebGLBlitter = null
    protected renderer:Raster
    protected example:IExample 
    public setGL(gl:WebGLRenderingContext, width:number, height:number) {
        this.gl = gl
        this.width = width
        this.height = height
    }

    public run() {
        this.renderer = new Raster(this.width, this.height, true)
        this.blitter = new WebGLBlitter(this.gl)
        // this.example = new DrawBox(this.renderer)
        this.example = new DrawMesh(this.renderer)


        let then = 0
        let lastShowFPS = 0
        let loopWrap = (now:number) => {
            now *= 0.001                        
            const deltaTime = now - then    
            if (then > 0 && deltaTime > 0 && this.showFPSCallback != null) {
                if (now - lastShowFPS > 0.3) {
                    const fps = 1 / deltaTime  
                    this.showFPSCallback(fps)
                    lastShowFPS = now
                }
                
            }      
            then = now     
            this.loop()
            requestAnimationFrame(loopWrap)
        }

        loopWrap(0)
    }

    public setShowFPSCallback(callback:any) {
        this.showFPSCallback = callback
    }

    protected loop() {
        this.renderer.clear()
        this.example.draw()
        this.flush()
    }

    protected flush() {
        this.blitter.blitPixels(this.renderer.width, this.renderer.height, this.renderer.getFrameBuffer())
    }

}