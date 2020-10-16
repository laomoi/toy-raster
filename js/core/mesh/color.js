var utils_1 = require("../utils");
var Colors = (function () {
    function Colors() {
    }
    Colors.clone = function (color) {
        return { r: color.r, g: color.g, b: color.b, a: color.a };
    };
    Colors.getInterpColor = function (color1, color2, color3, a, b, c, dstColor) {
        dstColor.r = utils_1["default"].getInterpValue3(color1.r, color2.r, color3.r, a, b, c);
        dstColor.g = utils_1["default"].getInterpValue3(color1.g, color2.g, color3.g, a, b, c);
        dstColor.b = utils_1["default"].getInterpValue3(color1.b, color2.b, color3.b, a, b, c);
        dstColor.a = utils_1["default"].getInterpValue3(color1.a, color2.a, color3.a, a, b, c);
    };
    Colors.getBilinearColor = function (c1, c2, c3, c4, w1, w2, w3, w4, dstColor) {
        dstColor.r = utils_1["default"].getInterpValue4(c1.r, c2.r, c3.r, c4.r, w1, w2, w3, w4);
        dstColor.g = utils_1["default"].getInterpValue4(c1.g, c2.g, c3.g, c4.g, w1, w2, w3, w4);
        dstColor.b = utils_1["default"].getInterpValue4(c1.b, c2.b, c3.b, c4.b, w1, w2, w3, w4);
        dstColor.a = utils_1["default"].getInterpValue4(c1.a, c2.a, c3.a, c4.a, w1, w2, w3, w4);
    };
    Colors.multiplyColor = function (color1, color2, dst) {
        dst.r = color1.r * color2.r / 255;
        dst.g = color1.g * color2.g / 255;
        dst.b = color1.b * color2.b / 255;
        dst.a = color1.a * color2.a / 255;
        return dst;
    };
    Colors.BLACK = { r: 0, g: 0, b: 0, a: 255 };
    Colors.WHITE = { r: 255, g: 255, b: 255, a: 255 };
    Colors.RED = { r: 255, g: 0, b: 0, a: 255 };
    Colors.BLUE = { r: 0, g: 0, b: 255, a: 255 };
    Colors.GREEN = { r: 0, g: 255, b: 0, a: 255 };
    Colors.YELLOW = { r: 255, g: 255, b: 0, a: 255 };
    Colors.GRAY = { r: 100, g: 100, b: 100, a: 255 };
    return Colors;
})();
exports.Colors = Colors;
//# sourceMappingURL=color.js.map