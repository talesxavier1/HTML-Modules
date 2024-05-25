const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const fs = require('fs');

module.exports = {
    entry: {
        "main": ["./src/index.ts", "./src/index.css"],
    },
    output: {
        filename: "content.js",
        path: path.resolve(__dirname, "./dist")
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: [
                MiniCssExtractPlugin.loader, "css-loader"
            ]
        }, {
            test: /\.ts?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        },]
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "content.css"
        }),
        /*
        new CopyWebpackPlugin({
            patterns: [
                { from: './lib/DevExtreme/Lib/js/localization/dx.messages.pt.js', to: 'dx/dx.messages.pt.js' },
                { from: './lib/DevExtreme/Lib/js/dx.all.js', to: 'dx/dx.all.js' },
                { from: './JsonViewer', to: 'JsonViewer' },
                { from: './lib/jquery/dist/jquery.min.js', to: 'jquery' },
                {
                    from: './index.html',
                    to: 'index.html',
                    transform(content) {

                        let contentSplit = content.toString().split("\r\n");

                        let contentSemImportsDev = contentSplit.filter(VALUE => !(VALUE.indexOf(`data-env="dev"`) > -1));

                        let contentHomolDescomentado = contentSemImportsDev.map(VALUE => {
                            let copyValue = VALUE;
                            if (copyValue.indexOf(`data-env="prod"`) > -1) {
                                copyValue = copyValue.replace(`<!--`, "").replace(`-->`, "");
                            }
                            return copyValue;
                        });

                        return Buffer.from(contentHomolDescomentado.join("\r\n"));
                    }
                },
            ]
        })
        */
    ]
}

//npx webpack --mode=production --progress -c .\webpack.config.js