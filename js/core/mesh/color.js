var Colors = (function () {
    function Colors() {
    }
    Colors.clone = function (color) {
        return { r: color.r, g: color.g, b: color.b, a: color.a };
    };
    Colors.BLACK = { r: 0, g: 0, b: 0, a: 255 };
    Colors.WHITE = { r: 255, g: 255, b: 255, a: 255 };
    Colors.RED = { r: 255, g: 0, b: 0, a: 255 };
    Colors.BLUE = { r: 0, g: 0, b: 255, a: 255 };
    Colors.GREEN = { r: 0, g: 255, b: 0, a: 255 };
    Colors.ORANGE = { r: 255, g: 255, b: 0, a: 255 };
    return Colors;
})();
exports.Colors = Colors;
//# sourceMappingURL=color.js.map