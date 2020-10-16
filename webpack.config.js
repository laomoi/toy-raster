const path = require('path');

module.exports = {
    devtool: 'source-map',
    entry: './js/main.js',        // 告诉 webpack 你要编译哪个文件
    output: {                       // 告诉 webpack 你要把编译后生成的文件放在哪
        filename: 'bundle.js',
        path: path.join(__dirname, './out/')
    },
    mode: "development",
    module: {
        rules: [
            {
            test: /\.bmp|\.png$/,
            use: [
                {
                    loader: path.resolve('loaders/image-loader.js'),
                    options: {}
                }
            ]
            }
        ]
    }
};
 