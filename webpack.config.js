const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const fs = require('fs');

module.exports = {
    devtool: 'source-map',
    entry: {
        "main": ["./src/index.ts", "./src/index.css"],
    },
    output: {
        chunkFilename: '[name].js',
        filename: '[name].js',
        path: path.resolve(__dirname, "./dist"),
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader, "css-loader"
                ]
            },
            // {
            //     test: /\.ts$/,
            //     exclude: [/node_modules/],
            //     loader: 'ts-loader'
            // }
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-typescript'
                        ]
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.ts']
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "index.css"
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: './src/lib/jquery', to: './lib/jquery' },
                { from: './src/lib/DevExtreme/js', to: './lib/DevExtreme/js' },
                { from: './src/lib/DevExtreme/css', to: './lib/DevExtreme/css' },
                {
                    from: './src/index.html',
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
    ]
}

//npx webpack --mode=production --progress -c .\webpack.config.js