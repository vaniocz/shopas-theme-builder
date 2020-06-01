'use strict';

const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const IconfontPlugin = require('iconfont-webpack-plugin');
const autoprefixer = require('autoprefixer');
const CopyPlugin = require('copy-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const NotifierPlugin = require('webpack-notifier');

const script = process.env.npm_lifecycle_event;

const templates = fs.readdirSync('src').filter((file) => {
    return (file.endsWith('.html') || file.endsWith('.twig')) && !file.startsWith('_');
});

module.exports = {
    name: 'shopas-theme',
    entry: {
        index: `./src`,
        invoice: `./src/invoice`,
        emails: `./src/emails`,
    },
    output: {
        path: path.resolve(__dirname, 'build/shopas_theme'),
        filename: '[name].js',
        chunkFilename: '[name].js',
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            '@app': path.resolve(__dirname, 'src/js'),
        },
    },
    mode: script === 'start' ? 'development' : 'production',
    devtool: script === 'start' ? 'eval-cheap-module-source-map' : false,
    module: {
        rules: [
            {
                test: /\.tsx?$/i,
                use: 'awesome-typescript-loader',
            }, {
                test: /\.html$/i,
                loader: 'html-loader',
                options: {interpolate: true},
            }, {
                test: /\.html.twig$/i,
                use: [
                    {
                        loader: '@jfrk/twig-loader',
                        options: {
                            extender: JSON.stringify(require.resolve('./twig_extension.js')).slice(1, -1),
                        },
                    },
                    'extract-loader',
                    'html-loader?interpolate',
                ],
            }, {
                test: /\.(css|less|scss)$/i,
                use: [
                    script === 'start' ? 'style-loader' : MiniCssExtractPlugin.loader,
                    script === 'start' ? 'css-loader?sourceMap' : 'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: script === 'start',
                            plugins: (loader) => [autoprefixer, new IconfontPlugin(loader)],
                        },
                    },
                ],
            }, {
                test: /\.(scss|sass)$/i,
                use: [
                    'resolve-url-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                            sassOptions: {outputStyle: 'nested'},
                        },
                    },
                ],
            }, {
                test: /[/\\]src[/\\].*\.(gif|png|jpe?g|svg|webp)(\?.*)?$/i,
                exclude: [
                    /[/\\]images[/\\]content[/\\]/i,
                    /[/\\]src[/\\]fonts[/\\]/i,
                ],
                loader: 'url-loader',
                options: {
                    name: 'images/[name].[ext]?[hash]',
                    limit: 8192,
                    esModule: false,
                },
            }, {
                test: /[/\\]images[/\\]content[/\\].*\.(gif|png|jpe?g|svg|webp)(\?.*)?$/i,
                loader: 'file-loader',
                options: {
                    name: 'images/content/[name].[ext]',
                    esModule: false,
                },
            }, {
                test: /[/\\]src[/\\]fonts[/\\].*\.(eot|svg|ttf|otf|woff|woff2)$/i,
                loader: 'file-loader',
                options: {
                    name: 'fonts/[name].[ext]?[hash]',
                    esModule: false,
                },
            }, {
                test: require.resolve('jquery'),
                use: 'imports-loader?define=>false,module=>false',
            }, {
                test: require.resolve('jquery-ui-sortable'),
                use: 'imports-loader?define=>false',
            },
        ],
    },
    devServer: {stats: 'minimal'},
    plugins: [
            new CopyPlugin([{from: 'src/favicon', to: 'favicon'}]),
            new ZipPlugin({
                path: '..',
                filename: 'shopas_theme',
                exclude: [/\.js$/i, /^images[/\\]content[/\\]/i],
                pathMapper: (path) => path.replace(/\?.*$/, ''),
            }),
        ]
        .concat(templates.map((file) => new HtmlPlugin({
            filename: file.replace(/\.twig/i, ''),
            template: `src/${file}`,
            chunks: (() => {
                if (file === 'invoice.html' || file === 'invoice.html.twig') {
                    return ['invoice'];
                } else if (file.startsWith('email-')) {
                    return ['emails'];
                }

                return ['index'];
            })(),
        })))
        .concat(script === 'start'
            ? [new NotifierPlugin({alwaysNotify: true})]
            : [
                new CleanWebpackPlugin({
                    cleanOnceBeforeBuildPatterns: ['**/*', '../shopas_theme.zip'],
                    dangerouslyAllowCleanPatternsOutsideProject: true,
                    dry: false,
                }),
                new MiniCssExtractPlugin,
            ]
        ),
};
