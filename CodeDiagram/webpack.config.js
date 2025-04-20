const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const fs = require('fs');
const os = require('os');
const WebpackObfuscator = require('webpack-obfuscator');


module.exports = (env, argv) => {
    const WPMode = argv.mode;

    const config = {
        devServer: {
            hot: true,
            static: {
                directory: path.join(__dirname, 'src'),
            },
            compress: true
        },
        entry: {
            "main": ["@babel/polyfill", "./src/index.ts", "./src/index.css"],
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
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true // Mais rápido, remove checagens de tipo (use com eslint ou tsc separado se quiser manter tipo)
                        }
                    }
                },
                {
                    test: /\.html$/,
                    loader: 'html-loader'
                },
                {
                    test: /\.(png|jpe?g|gif|svg)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'images/[name][ext]', // Define a estrutura de saída dos arquivos
                    },
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
                    { from: './src/images', to: './images', force: true },
                    { from: './src/html', to: './html' },
                    {
                        from: './src/index.html',
                        to: 'index.html',
                        transform(content) {
                            let lineBreak = os.platform() == 'win32' ? "\r\n" : "\n"

                            let contentSplit = content.toString().split(lineBreak);

                            let contentSemImportsDev = contentSplit.filter(VALUE => !(VALUE.indexOf(`data-env="dev"`) > -1));

                            let contentHomolDescomentado = contentSemImportsDev.map(VALUE => {
                                let copyValue = VALUE;
                                if (copyValue.indexOf(`data-env="prod"`) > -1) {
                                    copyValue = copyValue.replace(`<!--`, "").replace(`-->`, "");
                                }
                                return copyValue;
                            });
                            return Buffer.from(contentHomolDescomentado.join(lineBreak));
                        }
                    },

                ]
            })
        ]
    };

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

    return config
};

//npx webpack --mode=production --progress -c .\webpack.config.js
//npx webpack --mode=development --progress -c .\webpack.config.js
