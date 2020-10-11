var Bitmap = (function () {
    function Bitmap(width, height) {
        this.width = width;
        this.height = height;
        this.bytes = new Uint8Array(width * height * 4);
    }
    Bitmap.encode = function (width, height, pixels) {
    };
    return Bitmap;
})();
exports["default"] = Bitmap;
//# sourceMappingURL=bmp.js.map