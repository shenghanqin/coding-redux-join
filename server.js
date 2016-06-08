import express from 'express';
import webpack from 'webpack';
import config from './webpack.config.clientDev.js';
import path from 'path';

import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

const app = express();
const compiler = webpack(config);

var port = 5555;

app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(webpackHotMiddleware(compiler));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'app/index.html'));
});

app.listen(port, 'localhost', error => {
  if (error) {
    console.log(error);
    return;
  }

  console.log('Listening at http://localhost:' + port);
});
