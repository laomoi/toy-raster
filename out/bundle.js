/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./js/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./js/blitter/webgl-blitter.js":
/*!*************************************!*\
  !*** ./js/blitter/webgl-blitter.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var WebGLBlitter = (function () {
    function WebGLBlitter(gl) {
        this.gl = gl;
        this.initShader();
        this.initTexture();
        this.initGeometry();
    }
    WebGLBlitter.prototype.initTexture = function () {
        var gl = this.gl;
        this.canvasTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.canvasTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, null);
    };
    WebGLBlitter.prototype.initShader = function () {
        var gl = this.gl;
        var vertexShaderSource = "attribute vec4 a_Position;" +
            "attribute vec2 a_TexCoord;" +
            "varying vec2 v_TexCoord;" +
            "void main(){" +
            "gl_Position = a_Position;" +
            "v_TexCoord = a_TexCoord;" +
            "}";
        var fragmentShaderSource = "precision mediump float;" +
            "    uniform sampler2D u_Sampler;" +
            "    varying vec2 v_TexCoord;" +
            "    void main(){" +
            "        gl_FragColor = texture2D(u_Sampler, v_TexCoord);" +
            "}";
        var vertShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertShader, vertexShaderSource);
        gl.compileShader(vertShader);
        var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragShader, fragmentShaderSource);
        gl.compileShader(fragShader);
        this.shaderProgram = gl.createProgram();
        gl.attachShader(this.shaderProgram, vertShader);
        gl.attachShader(this.shaderProgram, fragShader);
        gl.linkProgram(this.shaderProgram);
        this.u_Sampler = gl.getUniformLocation(this.shaderProgram, "u_Sampler");
    };
    WebGLBlitter.prototype.initGeometry = function () {
        var gl = this.gl;
        var vertexs = new Float32Array([
            -1, 1, 0.0, 0.0, 1.0,
            -1, -1, 0.0, 0.0, 0.0,
            1, 1, 0.0, 1.0, 1.0,
            1, -1, 0.0, 1.0, 0.0]);
        this.vertexsBuffer = gl.createBuffer();
        if (this.vertexsBuffer === null) {
            console.log("vertexsBuffer is null");
            return false;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertexs, gl.STATIC_DRAW);
        var a_Position = gl.getAttribLocation(this.shaderProgram, "a_Position");
        if (a_Position < 0) {
            console.log("a_Position < 0");
            return false;
        }
        var a_TexCoord = gl.getAttribLocation(this.shaderProgram, "a_TexCoord");
        if (a_TexCoord < 0) {
            console.log("a_TexCoord < 0");
            return false;
        }
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, vertexs.BYTES_PER_ELEMENT * 5, 0);
        gl.enableVertexAttribArray(a_Position);
        gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, vertexs.BYTES_PER_ELEMENT * 5, vertexs.BYTES_PER_ELEMENT * 3);
        gl.enableVertexAttribArray(a_TexCoord);
    };
    WebGLBlitter.prototype.renderCanvas = function () {
        var gl = this.gl;
        gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        gl.useProgram(this.shaderProgram);
        gl.uniform1i(this.u_Sampler, 0);
        gl.activeTexture(this.gl.TEXTURE0);
        gl.bindTexture(this.gl.TEXTURE_2D, this.canvasTexture);
        gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    };
    WebGLBlitter.prototype.blitPixels = function (width, height, pixels) {
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.canvasTexture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, width, height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, pixels);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        this.renderCanvas();
    };
    return WebGLBlitter;
})();
exports.WebGLBlitter = WebGLBlitter;
//# sourceMappingURL=webgl-blitter.js.map

/***/ }),

/***/ "./js/core/math/matrix.js":
/*!********************************!*\
  !*** ./js/core/math/matrix.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var Matrix = (function () {
    function Matrix() {
        this.m = [];
        for (var i = 0; i < 4; i++) {
            var col = new Float32Array(4);
            this.m.push(col);
        }
        this.identify();
    }
    Matrix.prototype.identify = function () {
        this.setValue(0);
        this.m[0][0] = this.m[1][1] = this.m[2][2] = this.m[3][3] = 1;
    };
    Matrix.prototype.multiply = function (t, dst) {
        if (dst === void 0) { dst = null; }
        if (dst == null) {
            dst = new Matrix();
        }
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                dst.m[j][i] =
                    this.m[j][0] * t.m[0][i]
                        + this.m[j][1] * t.m[1][i]
                        + this.m[j][2] * t.m[2][i]
                        + this.m[j][3] * t.m[3][i];
            }
        }
        return dst;
    };
    Matrix.prototype.setValue = function (val) {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                this.m[j][i] = val;
            }
        }
    };
    Matrix.prototype.setPerspective = function (fovy, aspect, near, far) {
        this.setValue(0);
        var n = -near;
        var f = -far;
        var tn = -Math.tan(fovy / 2);
        var nt = 1 / tn;
        var nr = nt / aspect;
        this.m[0][0] = nr;
        this.m[1][1] = nt;
        this.m[2][2] = (n + f) / (n - f);
        this.m[3][2] = 2 * f * n / (f - n);
        this.m[2][3] = 1;
    };
    Matrix.prototype.setLookAt = function (eye, at, up) {
        var w = at.sub(eye).normalize().reverse();
        var u = up.cross(w).normalize();
        var v = w.cross(u);
        this.setValue(0);
        this.m[0][0] = u.x;
        this.m[1][0] = u.y;
        this.m[2][0] = u.z;
        this.m[0][1] = v.x;
        this.m[1][1] = v.y;
        this.m[2][1] = v.z;
        this.m[0][2] = w.x;
        this.m[1][2] = w.y;
        this.m[2][2] = w.z;
        this.m[3][3] = 1;
        var tEye = eye.reverse();
        this.m[3][0] = u.dot(tEye);
        this.m[3][1] = v.dot(tEye);
        this.m[3][2] = w.dot(tEye);
    };
    return Matrix;
})();
exports.Matrix = Matrix;
//# sourceMappingURL=matrix.js.map

/***/ }),

/***/ "./js/core/math/vector.js":
/*!********************************!*\
  !*** ./js/core/math/vector.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var Vector = (function () {
    function Vector(x, y, z, w) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (z === void 0) { z = 0; }
        if (w === void 0) { w = 1; }
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    Vector.prototype.getLength = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    };
    Vector.prototype.reverse = function (dst) {
        if (dst === void 0) { dst = null; }
        if (dst == null) {
            dst = new Vector();
        }
        dst.x = -this.x;
        dst.y = -this.y;
        dst.z = -this.z;
        return dst;
    };
    Vector.prototype.add = function (t, dst) {
        if (dst === void 0) { dst = null; }
        if (dst == null) {
            dst = new Vector();
        }
        dst.x = this.x + t.x;
        dst.y = this.y + t.y;
        dst.z = this.z + t.z;
        dst.w = 1.0;
        return dst;
    };
    Vector.prototype.sub = function (t, dst) {
        if (dst === void 0) { dst = null; }
        if (dst == null) {
            dst = new Vector();
        }
        dst.x = this.x - t.x;
        dst.y = this.y - t.y;
        dst.z = this.z - t.z;
        dst.w = 1.0;
        return dst;
    };
    Vector.prototype.dot = function (t) {
        return this.x * t.x + this.y * t.y + this.z * t.z;
    };
    Vector.prototype.cross = function (t, dst) {
        if (dst === void 0) { dst = null; }
        if (dst == null) {
            dst = new Vector();
        }
        var x = this.y * t.z - this.z * t.y;
        var y = this.z * t.x - this.x * t.z;
        var z = this.x * t.y - this.y * t.x;
        dst.x = x;
        dst.y = y;
        dst.z = z;
        dst.w = 1.0;
        return dst;
    };
    Vector.prototype.normalize = function (dst) {
        if (dst === void 0) { dst = null; }
        if (dst == null) {
            dst = new Vector();
        }
        var len = this.getLength();
        if (len > 0) {
            dst.x = this.x / len;
            dst.y = this.y / len;
            dst.z = this.z / len;
        }
        return dst;
    };
    Vector.prototype.transform = function (matrix, dst) {
        if (dst === void 0) { dst = null; }
        if (dst == null) {
            dst = new Vector();
        }
        var x = this.x, y = this.y, z = this.z, w = this.w;
        var m = matrix.m;
        dst.x = m[0][0] * x + m[1][0] * y + m[2][0] * z + m[3][0] * w;
        dst.y = m[0][1] * x + m[1][1] * y + m[2][1] * z + m[3][1] * w;
        dst.z = m[0][2] * x + m[1][2] * y + m[2][2] * z + m[3][2] * w;
        dst.w = m[0][3] * x + m[1][3] * y + m[2][3] * z + m[3][3] * w;
        return dst;
    };
    Vector.prototype.homogenenize = function () {
        if (this.w != 0) {
            this.x /= this.w;
            this.y /= this.w;
            this.z /= this.w;
            this.w = 1;
        }
    };
    return Vector;
})();
exports.Vector = Vector;
//# sourceMappingURL=vector.js.map

/***/ }),

/***/ "./js/core/mesh/color.js":
/*!*******************************!*\
  !*** ./js/core/mesh/color.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var utils_1 = __webpack_require__(/*! ../utils */ "./js/core/utils.js");
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
    Colors.ORANGE = { r: 255, g: 255, b: 0, a: 255 };
    return Colors;
})();
exports.Colors = Colors;
//# sourceMappingURL=color.js.map

/***/ }),

/***/ "./js/core/mesh/texture.js":
/*!*********************************!*\
  !*** ./js/core/mesh/texture.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var color_1 = __webpack_require__(/*! ./color */ "./js/core/mesh/color.js");
(function (TEXTURE_FILTER_MODE) {
    TEXTURE_FILTER_MODE[TEXTURE_FILTER_MODE["NEAREST"] = 1] = "NEAREST";
    TEXTURE_FILTER_MODE[TEXTURE_FILTER_MODE["BILINEAR"] = 2] = "BILINEAR";
})(exports.TEXTURE_FILTER_MODE || (exports.TEXTURE_FILTER_MODE = {}));
var TEXTURE_FILTER_MODE = exports.TEXTURE_FILTER_MODE;
var Texture = (function () {
    function Texture(width, height) {
        this.data = [];
        this.tmp = { r: 0, g: 0, b: 0, a: 0 };
        this.filterMode = TEXTURE_FILTER_MODE.NEAREST;
        this.width = width;
        this.height = height;
    }
    Texture.prototype.setPixel = function (x, y, color) {
        var pos = y * this.width + x;
        this.data[pos] = color;
    };
    Texture.prototype.sample = function (uv) {
        var x = uv.u * (this.width - 1);
        var y = uv.v * (this.height - 1);
        return this.samplePos(x + 0.5, y + 0.5);
    };
    Texture.prototype.clamp = function (value, min, max) {
        if (value > max) {
            return max;
        }
        if (value < min) {
            return min;
        }
        return value;
    };
    Texture.prototype.getPixel = function (x, y) {
        return this.data[y * this.width + x];
    };
    Texture.prototype.samplePos = function (x, y) {
        if (this.filterMode == TEXTURE_FILTER_MODE.NEAREST) {
            x = this.clamp(Math.floor(x), 0, this.width - 1);
            y = this.clamp(Math.floor(y), 0, this.height - 1);
            var color = this.getPixel(x, y);
            this.tmp.a = color.a;
            this.tmp.r = color.r;
            this.tmp.g = color.g;
            this.tmp.b = color.b;
            return this.tmp;
        }
        else if (this.filterMode == TEXTURE_FILTER_MODE.BILINEAR) {
            var x1 = this.clamp(Math.floor(x), 0, this.width - 1);
            var y1 = this.clamp(Math.floor(y), 0, this.height - 1);
            var x2 = this.clamp(Math.floor(x) + 1, 0, this.width - 1);
            var y2 = this.clamp(Math.floor(y) + 1, 0, this.height - 1);
            var c1 = this.getPixel(x1, y1);
            var c2 = this.getPixel(x2, y1);
            var c3 = this.getPixel(x1, y2);
            var c4 = this.getPixel(x2, y2);
            var dx = x - x1;
            var dy = y - y1;
            var w1 = (1 - dx) * (1 - dy);
            var w2 = dx * (1 - dy);
            var w3 = (1 - dx) * dy;
            var w4 = dx * dy;
            color_1.Colors.getBilinearColor(c1, c2, c3, c4, w1, w2, w3, w4, this.tmp);
            return this.tmp;
        }
        return color_1.Colors.BLACK;
    };
    return Texture;
})();
exports["default"] = Texture;
//# sourceMappingURL=texture.js.map

/***/ }),

/***/ "./js/core/raster.js":
/*!***************************!*\
  !*** ./js/core/raster.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var matrix_1 = __webpack_require__(/*! ./math/matrix */ "./js/core/math/matrix.js");
var vector_1 = __webpack_require__(/*! ./math/vector */ "./js/core/math/vector.js");
var color_1 = __webpack_require__(/*! ./mesh/color */ "./js/core/mesh/color.js");
var utils_1 = __webpack_require__(/*! ./utils */ "./js/core/utils.js");
var Raster = (function () {
    function Raster(width, height) {
        this.frameBuffer = null;
        this.zBuffer = null;
        this.backgroundColor = color_1.Colors.clone(color_1.Colors.BLACK);
        this.activeTexture = null;
        this.camera = {
            view: new matrix_1.Matrix(),
            projection: new matrix_1.Matrix(),
            vp: new matrix_1.Matrix()
        };
        this.width = width;
        this.height = height;
        this.frameBuffer = new Uint8Array(width * height * 4);
        this.zBuffer = new Float32Array(width * height);
        this.setDefaultCamera();
    }
    Raster.prototype.clear = function () {
        for (var l = 0; l < this.frameBuffer.length; l += 4) {
            this.frameBuffer[l] = this.backgroundColor.r;
            this.frameBuffer[l + 1] = this.backgroundColor.g;
            this.frameBuffer[l + 2] = this.backgroundColor.b;
            this.frameBuffer[l + 3] = this.backgroundColor.a;
        }
        for (var l = 0; l < this.zBuffer.length; l++) {
            this.zBuffer[l] = NaN;
        }
    };
    Raster.prototype.drawLine = function (x0, y0, x1, y1, color) {
        if (x0 == x1) {
            var dir = y0 < y1 ? 1 : -1;
            for (var y = y0; y != y1; y += dir) {
                this.setPixel(x0, y, color);
            }
            this.setPixel(x1, y1, color);
        }
        else if (y0 == y1) {
            var dir = x0 < x1 ? 1 : -1;
            for (var x = x0; x != x1; x += dir) {
                this.setPixel(x, y0, color);
            }
            this.setPixel(x1, y1, color);
        }
        else {
            var dx = Math.abs(x1 - x0);
            var dy = Math.abs(y1 - y0);
            if (dx > dy) {
                if (x0 > x1) {
                    var tx = x0, ty = y0;
                    x0 = x1, y0 = y1;
                    x1 = tx, y1 = ty;
                }
                var dir = y1 > y0 ? 1 : -1;
                var y = y0;
                var d = (y0 - y1) * (x0 + 1) + (x1 - x0) * (y0 + 0.5 * dir) + x0 * y1 - x1 * y0;
                for (var x = x0; x <= x1; x++) {
                    this.setPixel(x, y, color);
                    if (d * dir < 0) {
                        y += dir;
                        d += (x1 - x0) * dir + (y0 - y1);
                    }
                    else {
                        d += y0 - y1;
                    }
                }
            }
            else {
                if (y0 > y1) {
                    var tx = x0, ty = y0;
                    x0 = x1, y0 = y1;
                    x1 = tx, y1 = ty;
                }
                var dir = x1 > x0 ? 1 : -1;
                var x = x0;
                var d = (y0 - y1) * (x0 + 0.5 * dir) + (x1 - x0) * (y0 + 1) + x0 * y1 - x1 * y0;
                for (var y = y0; y <= y1; y++) {
                    this.setPixel(x, y, color);
                    if (d * dir > 0) {
                        x += dir;
                        d += (x1 - x0) + (y0 - y1) * dir;
                    }
                    else {
                        d += x1 - x0;
                    }
                }
            }
        }
    };
    Raster.prototype.barycentricFunc = function (vs, a, b, x, y) {
        return ((vs[a].y - vs[b].y) * x + (vs[b].x - vs[a].x) * y + vs[a].x * vs[b].y - vs[b].x * vs[a].y);
    };
    Raster.prototype.drawTriangle2D = function (v0, v1, v2) {
        var vs = [v0.posScreen, v1.posScreen, v2.posScreen];
        var x0 = vs[0].x, x1 = vs[1].x, x2 = vs[2].x, y0 = vs[0].y, y1 = vs[1].y, y2 = vs[2].y;
        var minX = Math.floor(Math.min(x0, x1, x2));
        var maxX = Math.ceil(Math.max(x0, x1, x2));
        var minY = Math.floor(Math.min(y0, y1, y2));
        var maxY = Math.ceil(Math.max(y0, y1, y2));
        var fBelta = this.barycentricFunc(vs, 2, 0, x1, y1);
        var fGama = this.barycentricFunc(vs, 0, 1, x2, y2);
        var fAlpha = this.barycentricFunc(vs, 1, 2, x0, y0);
        var offScreenPointX = -1, offScreenPointY = -1;
        var tempColor = color_1.Colors.clone(color_1.Colors.WHITE);
        var uv = { u: 0, v: 0 };
        for (var x = minX; x <= maxX; x++) {
            for (var y = minY; y <= maxY; y++) {
                var belta = this.barycentricFunc(vs, 2, 0, x, y) / fBelta;
                var gama = this.barycentricFunc(vs, 0, 1, x, y) / fGama;
                var alpha = 1 - belta - gama;
                if (alpha >= 0 && belta >= 0 && gama >= 0) {
                    if ((alpha > 0 || fAlpha * this.barycentricFunc(vs, 1, 2, offScreenPointX, offScreenPointY) > 0)
                        && (belta > 0 || fBelta * this.barycentricFunc(vs, 2, 0, offScreenPointX, offScreenPointY) > 0)
                        && (gama > 0 || fGama * this.barycentricFunc(vs, 0, 1, offScreenPointX, offScreenPointY) > 0)) {
                        var rhw = utils_1["default"].getInterpValue3(v0.rhw, v1.rhw, v2.rhw, alpha, belta, gama);
                        var zPos = this.width * y + x;
                        if (isNaN(this.zBuffer[zPos]) || this.zBuffer[zPos] > rhw) {
                            var w = 1 / (rhw != 0 ? rhw : 1);
                            var a = alpha * w * v0.rhw;
                            var b = belta * w * v1.rhw;
                            var c = gama * w * v2.rhw;
                            color_1.Colors.getInterpColor(v0.color, v1.color, v2.color, a, b, c, tempColor);
                            utils_1["default"].getInterpUV(v0.uv, v1.uv, v2.uv, a, b, c, uv);
                            var finalColor = this.fragmentShading(x, y, tempColor, uv);
                            if (finalColor.a > 0) {
                                this.setPixel(x, y, finalColor);
                                this.zBuffer[zPos] = rhw;
                            }
                        }
                    }
                }
            }
        }
    };
    Raster.prototype.fragmentShading = function (x, y, color, uv) {
        if (this.activeTexture != null) {
            var tex = this.activeTexture.sample(uv);
            return color_1.Colors.multiplyColor(tex, color, tex);
        }
        return color;
    };
    Raster.prototype.setActiveTexture = function (texture) {
        this.activeTexture = texture;
    };
    Raster.prototype.setBackgroundColor = function (color) {
        this.backgroundColor = color_1.Colors.clone(color);
    };
    Raster.prototype.setPixel = function (x, y, color) {
        if (x < this.width && y < this.height && x >= 0 && y >= 0) {
            var pstart = (this.width * y + x) * 4;
            this.frameBuffer[pstart] = color.r;
            this.frameBuffer[pstart + 1] = color.g;
            this.frameBuffer[pstart + 2] = color.b;
            this.frameBuffer[pstart + 3] = color.a;
        }
    };
    Raster.prototype.drawElements = function (va, elements) {
        if (elements.length % 3 != 0) {
            return;
        }
        var cameraTransform = this.camera.vp;
        for (var _i = 0; _i < va.length; _i++) {
            var vert = va[_i];
            if (vert.posProject == null) {
                vert.posProject = new vector_1.Vector();
            }
            vert.posWorld.transform(cameraTransform, vert.posProject);
            vert.rhw = 1 / vert.posProject.w;
            vert.posProject.homogenenize();
            if (utils_1["default"].isInsideViewVolumn(vert.posProject)) {
                if (vert.posScreen == null) {
                    vert.posScreen = new vector_1.Vector();
                }
                utils_1["default"].convertToScreenPos(vert.posProject, vert.posScreen, this.width, this.height);
            }
        }
        for (var i = 0; i < elements.length; i += 3) {
            var trianglePoints = [va[elements[i]], va[elements[i + 1]], va[elements[i + 2]]];
            var culling = false;
            for (var _a = 0; _a < trianglePoints.length; _a++) {
                var p = trianglePoints[_a];
                if (!utils_1["default"].isInsideViewVolumn(p.posProject)) {
                    culling = true;
                    break;
                }
            }
            if (!culling) {
                this.drawTriangle2D(trianglePoints[0], trianglePoints[1], trianglePoints[2]);
            }
        }
    };
    Raster.prototype.setDefaultCamera = function () {
        var eye = new vector_1.Vector(1.5, 0, 3, 1);
        var at = new vector_1.Vector(0, 0, 0, 1);
        var up = new vector_1.Vector(0, 1, 0, 1);
        var fovy = Math.PI / 2;
        var aspect = this.width / this.height;
        var near = 1;
        var far = 500;
        this.setCamera(eye, at, up, fovy, aspect, near, far);
    };
    Raster.prototype.setCamera = function (eye, lookAt, up, fovy, aspect, near, far) {
        this.camera.view.setLookAt(eye, lookAt, up);
        this.camera.projection.setPerspective(fovy, aspect, near, far);
        this.camera.vp = this.camera.view.multiply(this.camera.projection);
    };
    return Raster;
})();
exports["default"] = Raster;
//# sourceMappingURL=raster.js.map

/***/ }),

/***/ "./js/core/utils.js":
/*!**************************!*\
  !*** ./js/core/utils.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

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

/***/ }),

/***/ "./js/main.js":
/*!********************!*\
  !*** ./js/main.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var webgl_blitter_1 = __webpack_require__(/*! ./blitter/webgl-blitter */ "./js/blitter/webgl-blitter.js");
var vector_1 = __webpack_require__(/*! ./core/math/vector */ "./js/core/math/vector.js");
var color_1 = __webpack_require__(/*! ./core/mesh/color */ "./js/core/mesh/color.js");
var texture_1 = __webpack_require__(/*! ./core/mesh/texture */ "./js/core/mesh/texture.js");
var raster_1 = __webpack_require__(/*! ./core/raster */ "./js/core/raster.js");
var App = (function () {
    function App(canvasWidth, canvasHeight, gl) {
        this.blitter = null;
        this.renderder = new raster_1["default"](canvasWidth, canvasHeight);
        this.blitter = new webgl_blitter_1.WebGLBlitter(gl);
        this.init();
        var self = this;
        var wrapMainLoop = function () {
            self.mainLoop();
            requestAnimationFrame(wrapMainLoop);
        };
        wrapMainLoop();
    }
    App.prototype.init = function () {
        var eye = new vector_1.Vector(1.5, 1.5, 3, 1);
        var at = new vector_1.Vector(0, 0, 0, 1);
        var up = new vector_1.Vector(0, 1, 0, 1);
        var fovy = Math.PI / 2;
        var aspect = this.renderder.width / this.renderder.height;
        var near = 1;
        var far = 500;
        this.renderder.setCamera(eye, at, up, fovy, aspect, near, far);
    };
    App.prototype.mainLoop = function () {
        this.renderder.clear();
        var va = [
            { posWorld: new vector_1.Vector(-1, -1, 1), color: color_1.Colors.GREEN, uv: { u: 0, v: 0 } },
            { posWorld: new vector_1.Vector(1, -1, 1), color: color_1.Colors.BLUE, uv: { u: 1, v: 0 } },
            { posWorld: new vector_1.Vector(1, 1, 1), color: color_1.Colors.RED, uv: { u: 1, v: 1 } },
            { posWorld: new vector_1.Vector(-1, 1, 1), color: color_1.Colors.ORANGE, uv: { u: 0, v: 1 } },
            { posWorld: new vector_1.Vector(-1, -1, -1), color: color_1.Colors.GREEN, uv: { u: 0, v: 0 } },
            { posWorld: new vector_1.Vector(1, -1, -1), color: color_1.Colors.BLUE, uv: { u: 1, v: 0 } },
            { posWorld: new vector_1.Vector(1, 1, -1), color: color_1.Colors.RED, uv: { u: 1, v: 1 } },
            { posWorld: new vector_1.Vector(-1, 1, -1), color: color_1.Colors.ORANGE, uv: { u: 0, v: 1 } },
        ];
        var elements = [
            0, 1, 2,
            2, 3, 0,
            7, 6, 5,
            5, 4, 7,
            0, 4, 5,
            5, 1, 0,
            1, 5, 6,
            6, 2, 1,
            2, 6, 7,
            7, 3, 2,
            3, 7, 4,
            4, 0, 3
        ];
        this.renderder.setActiveTexture(this.createTexture());
        this.renderder.drawElements(va, elements);
        this.flush();
    };
    App.prototype.createTexture = function () {
        var texture = new texture_1["default"](256, 256);
        for (var i = 0; i < 256; i++) {
            for (var j = 0; j < 256; j++) {
                var x = Math.floor(i / 32);
                var y = Math.floor(j / 32);
                if ((x + y) % 2 == 0) {
                    texture.setPixel(j, i, color_1.Colors.BLUE);
                }
                else {
                    texture.setPixel(j, i, color_1.Colors.WHITE);
                }
            }
        }
        return texture;
    };
    App.prototype.flush = function () {
        this.blitter.blitPixels(this.renderder.width, this.renderder.height, this.renderder.frameBuffer);
    };
    return App;
})();
exports["default"] = App;
window.onload = function () {
    var canvas = document.getElementById('canvas');
    var gl = canvas.getContext('webgl');
    if (!gl) {
        console.log("WEBGL FAILED");
        return;
    }
    window.app = new App(canvas.width, canvas.height, gl);
};
//# sourceMappingURL=main.js.map

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map