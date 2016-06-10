var path = require('path');
var webpack = require('webpack');

// custom
var fs = require('fs');

console.log('webpack---', 123425)

const PROJECT_SRC = path.resolve(__dirname, './src');

var HtmlWebpackPlugin = require('html-webpack-plugin');

//const babelrc = fs.readFileSync(path.join('.', '.babelrc'));
var babelLoaderQuery = {};
//
//
//try {
//  babelLoaderQuery = JSON.parse(babelrc);
//} catch (err) {
//  console.error('Error parsing .babelrc.');
//  console.error(err);
//}
babelLoaderQuery.plugins = babelLoaderQuery.plugins || [];
babelLoaderQuery.plugins.push('react-transform');
babelLoaderQuery.extra = babelLoaderQuery.extra || {};
babelLoaderQuery.extra['react-transform'] = {
    transforms: [{
        transform: 'react-transform-hmr',
        imports: ['react'],
        locals: ['module']
    }]
};

babelLoaderQuery.env = {
        // for react hot module replacement
        development: {
            plugins: [
                [require.resolve('babel-plugin-react-transform'), {
                transforms: [{
                    transform: 'react-transform-hmr',
                    imports: ['react'],
                    locals: ['module']
                }, {
                    transform: 'react-transform-catch-errors',
                    imports: ['react', 'redbox-react']
                }]
                }]
            ]
        }
    }


module.exports = {
    //entry: {
    //  app:path.join(__dirname, 'app'),
    //  vendors: ['react','redux', 'redux-router']
    //},
    entry: [path.join(__dirname, 'app')],
    output: {
        path: path.join(__dirname, 'static'),
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test:/\.js?$/,
                exclude:/node_modules/,
                loader:'babel',
                // query: {
                //  presets:[
                //      'react', 'es2015'
                //      // // not use 'react, es2015' because of importing third-party folder: public
                //      // require.resolve('babel-preset-es2015'),
                //      // require.resolve('babel-preset-react'),
                //  ],
                //  env: {
                //      // for react hot module replacement
                //      development: {
                //      plugins: [
                //          [require.resolve('babel-plugin-react-transform'), {
                //          transforms: [{
                //              transform: 'react-transform-hmr',
                //              imports: ['react'],
                //              locals: ['module']
                //          }, {
                //              transform: 'react-transform-catch-errors',
                //              imports: ['react', 'redbox-react']
                //          }]
                //          }]
                //      ]
                //      }
                //  }
                // }
                query: babelLoaderQuery
            },
            {test: /\.css$/, loader: 'style!css'}
        ]
    },
    //module: {
    //  loaders: [{
    //      test: /\.js$/,
    //      loader: 'babel',
    //      query: babelLoaderQuery,
    //      exclude: path.resolve(__dirname, 'node_modules'),
    //      include: [
    //          path.resolve(__dirname),
    //          PROJECT_SRC
    //      ]
    //  }]
    //},
    plugins: [
        // kills the compilation upon an error.
        // this keeps the outputed bundle **always** valid
        new webpack.NoErrorsPlugin(),
        //这个使用uglifyJs压缩你的js代码
        //new webpack.optimize.UglifyJsPlugin({minimize: true}),
        //new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
        new HtmlWebpackPlugin({
            //title: 'My App',
            filename: '../index.html',
            template: 'app/index.html',
            inject: false
        })
    ]
};

