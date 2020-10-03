var Vector = (function () {
    function Vector() {
    }
    return Vector;
})();
var Matrix = (function () {
    function Matrix() {
    }
    return Matrix;
})();
var Raster = (function () {
    function Raster(canvasWidth, canvasHeight, printCallback) {
        var pixelsSize = canvasWidth * canvasHeight * 4;
        var pixels = new Uint8Array(pixelsSize);
        console.log("raster print");
        for (var i = 0; i < pixelsSize; i += 4) {
            pixels[i] = 255;
            pixels[i + 1] = i % 255;
            pixels[i + 2] = i % 255;
            pixels[i + 3] = 255;
        }
        printCallback(canvasWidth, canvasHeight, pixels);
    }
    return Raster;
})();
exports["default"] = Raster;
//# sourceMappingURL=raster.js.map