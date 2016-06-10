import {
  HotModuleReplacementPlugin,
  NoErrorsPlugin
} from 'webpack';

import baseConfig from './webpack.config.base';
import mergeConfig from './mergeConfig';
import path from 'path';

const clientDevConfig = mergeConfig(baseConfig, {
  // 入口文件
  entry: [
    'webpack-hot-middleware/client',
    './app/index'
  ],
  // 出口文件
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  // 插件？
  plugins: [
    new HotModuleReplacementPlugin(),
    new NoErrorsPlugin()
  ],
  // 开发工具
  devtool: 'eval'
});

export default clientDevConfig;
