module.exports.default = imageLoader;
module.exports.raw = true
function imageLoader(source) {
    let decode = require('image-decode')
    let {data, width, height} = decode(Buffer.from(source))   
    let buffer = Buffer.from(data).toString("base64")
    return `export default ${ JSON.stringify({width:width, height:height, data:buffer}) }`;
}
