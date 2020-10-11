var Utils = (function () {
    function Utils() {
    }
    Utils.isInsideViewVolumn = function (v) {
        if (v.x < -1 || v.x > 1) {
            return false;
        }
        if (v.y < -1 || v.y > 1) {
            return false;
        }
        if (v.z < -1 || v.z > 1) {
            return false;
        }
        return true;
    };
    Utils.convertToScreenPos = function (v, dst, width, height) {
        dst.x = (v.x + 1) / 2 * width;
        dst.y = (v.y + 1) / 2 * height;
        dst.z = v.z;
        return dst;
    };
    Utils.getInterpColor = function (color1, color2, color3, a, b, c, dstColor) {
        dstColor.r = Utils.getInterpValue(color1.r, color2.r, color3.r, a, b, c);
        dstColor.g = Utils.getInterpValue(color1.g, color2.g, color3.g, a, b, c);
        dstColor.b = Utils.getInterpValue(color1.b, color2.b, color3.b, a, b, c);
        dstColor.a = Utils.getInterpValue(color1.a, color2.a, color3.a, a, b, c);
    };
    Utils.getInterpUV = function (uv1, uv2, uv3, a, b, c, dstUV) {
        dstUV.u = Utils.getInterpValue(uv1.u, uv2.u, uv3.u, a, b, c);
        dstUV.v = Utils.getInterpValue(uv1.v, uv2.v, uv3.v, a, b, c);
    };
    Utils.getInterpValue = function (v1, v2, v3, a, b, c) {
        return v1 * a + v2 * b + v3 * c;
    };
    Utils.multiplyColor = function (color1, color2, dst) {
        dst.r = color1.r * color2.r / 255;
        dst.g = color1.g * color2.g / 255;
        dst.b = color1.b * color2.b / 255;
        dst.a = color1.a * color2.a / 255;
        return dst;
    };
    return Utils;
})();
exports["default"] = Utils;
//# sourceMappingURL=utils.js.map