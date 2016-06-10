var webpack = require('webpack')

var path = require('path');
var node_modules_dir = path.join(__dirname, 'node_modules');
module.exports = {
  entry: './app/index',
  output: {
    path: __dirname,
    // publicPath: __dirname,
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
    new webpack.BannerPlugin('小溪里今天很想念小牙！')
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