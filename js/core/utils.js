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
    Utils.getInterpUV = function (uv1, uv2, uv3, a, b, c, dstUV) {
        dstUV.u = Utils.getInterpValue3(uv1.u, uv2.u, uv3.u, a, b, c);
        dstUV.v = Utils.getInterpValue3(uv1.v, uv2.v, uv3.v, a, b, c);
    };
    Utils.getInterpVector = function (v1, v2, v3, a, b, c, dst) {
        dst.x = Utils.getInterpValue3(v1.x, v2.x, v3.x, a, b, c);
        dst.y = Utils.getInterpValue3(v1.y, v2.y, v3.y, a, b, c);
        dst.z = Utils.getInterpValue3(v1.z, v2.z, v3.z, a, b, c);
    };
    Utils.getInterpValue3 = function (v1, v2, v3, a, b, c) {
        return v1 * a + v2 * b + v3 * c;
    };
    Utils.getInterpValue4 = function (v1, v2, v3, v4, a, b, c, d) {
        return v1 * a + v2 * b + v3 * c + v4 * d;
    };
    return Utils;
})();
exports["default"] = Utils;
//# sourceMappingURL=utils.js.map