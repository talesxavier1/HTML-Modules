const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const fs = require('fs');


module.exports = (env, argv) => {
    const WPMode = argv.mode;

    const config = {
        entry: {
            "main": ["./src/index.ts", "./src/index.css"],
        },
        output: {
            filename: "index.js",
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader, "css-loader"
                    ]
                },
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
            extensions: ['.ts', '.js']
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
                            console.log("content", content.toString());

                            let contentSplit = content.toString().split("\r\n");
                            console.log("contentSplit", contentSplit.join("\r\n"));

                            let contentSemImportsDev = contentSplit.filter(VALUE => !(VALUE.indexOf(`data-env="dev"`) > -1));
                            console.log("contentSemImportsDev", contentSemImportsDev.join("\r\n"));

                            let contentHomolDescomentado = contentSemImportsDev.map(VALUE => {
                                let copyValue = VALUE;
                                if (copyValue.indexOf(`data-env="prod"`) > -1) {
                                    copyValue = copyValue.replace(`<!--`, "").replace(`-->`, "");
                                }
                                return copyValue;
                            });
                            console.log("contentHomolDescomentado", contentHomolDescomentado.join("\r\n"));
                            return Buffer.from(contentHomolDescomentado.join("\r\n"));
                        }
                    },

                ]
            })
        ]
    };

    if (WPMode == "development") {
        config.devtool = 'source-map';
        config.output.path = path.resolve(__dirname, "./src/dist");
    } else {
        config.output.path = path.resolve(__dirname, "./dist");
    }

    return config
};

//npx webpack --mode=production --progress -c .\webpack.config.js
//npx webpack --mode=development --progress -c .\webpack.config.js
