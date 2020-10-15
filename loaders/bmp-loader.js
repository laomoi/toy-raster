exports.default = bmpLoader;

function bmpLoader(source) {
    const json = JSON.stringify(source).replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');

    let fpng = require('fast-png')
    var buffer = Buffer.from(json, "binary")

    console.log(buffer[0])
    console.log(buffer[1])

    let png = fpng.decode(buffer)
    // var bmp = require("bmp-js");
    // let bmpBuffer = Buffer.from(source)
    // var bmpData = bmp.decode(bmpBuffer);
    // console.log(bmpData.width, bmpData.height, bmpData.data)
    for (let x=0;x<4*4;x++) {
        console.log(png.data[x]) 
    }
    return `export default ${ JSON.stringify({width:png.width, height:png.height, data:Buffer.from(png.data).toString('base64')}) }`;
}
