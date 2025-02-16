const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const fs = require('fs');
const WebpackObfuscator = require('webpack-obfuscator');

module.exports = (a, args) => {
    const WPMode = args.mode;

    const config = {
        entry: {
            "main": ["./src/jsonSchemaLib/js/JS_Main.js", "./src/index.css"],
        },
        output: {
            filename: "index.js",
            path: path.resolve(__dirname, "./dist")
        },
        module: {
            rules: [{
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader, "css-loader"
                ]
            }]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: "index.css"
            }),
            new CopyWebpackPlugin({
                patterns: [
                    // { from: './lib/DevExtreme/Lib/js/localization/dx.messages.pt.js', to: 'dx/dx.messages.pt.js' },
                    // { from: './lib/DevExtreme/Lib/js/dx.all.js', to: 'dx/dx.all.js' },
                    { from: './src/JsonViewer', to: 'JsonViewer' },
                    //{ from: './lib/jquery/dist/jquery.min.js', to: 'jquery' },
                    {
                        from: './src/index.html',
                        to: 'index.html'
                        // transform(content) {

                        //     let contentSplit = content.toString().split("\r\n");

                        //     let contentSemImportsDev = contentSplit.filter(VALUE => !(VALUE.indexOf(`data-env="dev"`) > -1));

                        //     let contentHomolDescomentado = contentSemImportsDev.map(VALUE => {
                        //         let copyValue = VALUE;
                        //         if (copyValue.indexOf(`data-env="prod"`) > -1) {
                        //             copyValue = copyValue.replace(`<!--`, "").replace(`-->`, "");
                        //         }
                        //         return copyValue;
                        //     });

                        //     return Buffer.from(contentHomolDescomentado.join("\r\n"));
                        // }
                    },
                ]
            })
        ]
    }

    if (WPMode == "development") {
        config.devtool = 'inline-source-map';
        config.output.path = path.resolve(__dirname, "./src/dist");
    } else {
        config.output.path = path.resolve(__dirname, "./dist");
        config.plugins.push(
            new WebpackObfuscator({
                rotateStringArray: true
            }, [])
        )
    }

    return config;
}



//npx webpack --mode=production --progress -c .\webpack.config.js