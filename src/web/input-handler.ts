import { IExample } from "../main";

export default class InputHandler {
    protected example:IExample
    protected isMouseDown:boolean = false
    protected lastMouseX:number 
    protected lastMouseY:number
    public constructor(example:IExample) {
        let self = this
        this.example = example

        
        window.onmousedown = function(e:MouseEvent){
            self.onMouseDown(e.clientX, e.clientY)
        }

        window.onmousemove = function(e:MouseEvent){
            self.onMouseMove(e.clientX, e.clientY)
        }

        window.onmouseup = function(e:MouseEvent){
            self.onMouseUp(e.clientX, e.clientY)
        }

        window.onmousewheel = function(e:any){
            self.onMouseWheel(e.deltaY)
        }
    }

    protected onMouseDown(x:number, y:number){
        this.isMouseDown = true
        this.lastMouseX = x
        this.lastMouseY = y
    }

    protected onMouseMove(x:number, y:number){
        if (this.isMouseDown) {
            let deltaX = x - this.lastMouseX
            let deltaY = y - this.lastMouseY
            this.example.onMove(deltaX, deltaY)
            this.lastMouseY = y
            this.lastMouseX = x
        }
        
    }

    protected onMouseUp(x:number, y:number){
        this.isMouseDown = false
    }

    protected onMouseWheel(delta:number){
        if (this.example.onWheel) {
            this.example.onWheel(delta)
        }
    }
    
}


