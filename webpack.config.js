var webpack = require('webpack')

var path = require('path');
var node_modules_dir = path.join(__dirname, 'node_modules');

var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './app/index',
  output: {
    path: path.join(__dirname, 'build'),
    // publicPath: path.join(__dirname, 'build222223'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.js?$/,
        exclude: [node_modules_dir],
        loader: 'babel',
        query: {
          // presets:[
          //   // not use 'react, es2015' because of importing third-party folder: public
          //   require.resolve('babel-preset-es2015'),
          //   require.resolve('babel-preset-react'),
          // ],
          presets:['react','es2015'],
          env: {
            // for react hot module replacement
            development: {
              plugins: [
                [require.resolve('babel-plugin-react-transform'), {
                  transforms: [{
                    transform: 'react-transform-hmr',
                    imports: ['react'],
                    locals: ['module']
                  }
                  // , {
                  //   transform: 'react-transform-catch-errors',
                  //   imports: ['react', 'redbox-react']
                  // }
                  ]
                }]
              ]
            }
          }
        }
      },
      {test: /\.css$/, loader: 'style!css'}
    ]
  },
  plugins: [
    new webpack.BannerPlugin('小溪里今天很想念小牙！'),
    // kills the compilation upon an error.
      // this keeps the outputed bundle **always** valid
      // new webpack.NoErrorsPlugin(),
      //这个使用uglifyJs压缩你的js代码
      //new webpack.optimize.UglifyJsPlugin({minimize: true}),
      //new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
      new HtmlWebpackPlugin({
          //title: 'My App',
          filename: 'index.html',
          template: 'app/index.html',
          inject: true
      })
  ],
  resolve: {
        extensions: ['', '.js', '.jsx', '.css']
    },
  resolveLoader: {
      modulesDirectories: [
          node_modules_dir
      ]
  }
}