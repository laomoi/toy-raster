var gl
var shaderProgram
var u_Sampler
var canvasTexture
var pixels
var vertexsBuffer
var canvasWidth = 1024
var canvasHeight = 768

function initTexture() {
    canvasTexture = gl.createTexture();
    var sTextureSize = canvasWidth * canvasHeight * 4;    // r, g, b, a
    pixels = new Uint8Array( sTextureSize );
    for( var i=0 ; i<sTextureSize ; i+=4 )
    {
        pixels[i] = pixels[i+1] = pixels[i+2] = i / sTextureSize *255;
        pixels[i+3] = 255;
    }
    gl.bindTexture(gl.TEXTURE_2D, canvasTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvasWidth, canvasHeight, 0,
        gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    gl.bindTexture(gl.TEXTURE_2D, null);
}

function initShader() {
    var vertexShaderSource = 
    "attribute vec4 a_Position;" + 
    "attribute vec2 a_TexCoord;" + 
    "varying vec2 v_TexCoord;" + 
    "void main(){" + 
     "gl_Position = a_Position;" + 
     "v_TexCoord = a_TexCoord;" + 
    "}";

    var fragmentShaderSource = 
     "precision mediump float;" + 
     "    uniform sampler2D u_Sampler;" + 
     "    varying vec2 v_TexCoord;" + 
     "    void main(){" + 
     "        gl_FragColor = texture2D(u_Sampler, v_TexCoord);" + 
     "}"
    //编译着色器
    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, vertexShaderSource);
    gl.compileShader(vertShader);

    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fragmentShaderSource);
    gl.compileShader(fragShader);
    //合并程序
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);

    u_Sampler = gl.getUniformLocation(shaderProgram, "u_Sampler");
}

function initGeometry() {
    var vertexs =  new Float32Array([
        -1, 1, 0.0, 0.0, 1.0,
        -1, -1, 0.0, 0.0, 0.0,
        1, 1, 0.0, 1.0, 1.0,
        1, -1, 0.0, 1.0, 0.0]);

    vertexsBuffer = gl.createBuffer();

    if (vertexsBuffer === null) {
        console.log("vertexsBuffer is null");
        return false;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexsBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, vertexs, gl.STATIC_DRAW);

    let a_Position = gl.getAttribLocation(shaderProgram, "a_Position");
    if (a_Position < 0) {
        console.log("a_Position < 0");
        return false;
    }

    let a_TexCoord = gl.getAttribLocation(shaderProgram, "a_TexCoord");
    if (a_TexCoord < 0) {
        console.log("a_TexCoord < 0");
        return false;
    }

    //将顶点坐标的位置赋值
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, vertexs.BYTES_PER_ELEMENT * 5, 0);
    gl.enableVertexAttribArray(a_Position);

    //将纹理坐标赋值
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, vertexs.BYTES_PER_ELEMENT * 5, vertexs.BYTES_PER_ELEMENT * 3);
    gl.enableVertexAttribArray(a_TexCoord);
}



function renderCanvas() {
    updateTexture()
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(shaderProgram);
    gl.uniform1i(u_Sampler, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, canvasTexture);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function renderLoop() {
    renderCanvas();
    requestAnimationFrame(renderLoop);
	//window.setTimeout(renderLoop, 1000 / 30);
}

function updateTexture(){
    gl.bindTexture(gl.TEXTURE_2D, canvasTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvasWidth, canvasHeight, 0,
        gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    gl.bindTexture(gl.TEXTURE_2D, null);
}

window.onload = function () {
    var canvas = document.getElementById('canvas');
    canvasWidth = canvas.width
    canvasHeight = canvasHeight
    gl = canvas.getContext('webgl');
    if (!gl) {
        console.log("WEBGL FAILED");
        return;
    }

    initShader();
    initTexture();
    initGeometry();
    renderLoop();
}