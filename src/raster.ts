class Vector{

}

class Matrix {

}






export default class Raster {
    constructor(canvasWidth:number, canvasHeight:number, printCallback:any) {
        
        let pixelsSize = canvasWidth * canvasHeight * 4
        let pixels = new Uint8Array(pixelsSize)
        console.log("raster print")
        for (let i=0;i<pixelsSize;i+=4) {
            pixels[i] = 255
            pixels[i+1] = i % 255
            pixels[i+2] = i % 255
            pixels[i+3] = 255
        }
        printCallback(canvasWidth, canvasHeight, pixels)
    }


    // function renderLoop() {
//     renderCanvas();
//     // requestAnimationFrame(renderLoop);
// 	//window.setTimeout(renderLoop, 1000 / 30);
// }


}