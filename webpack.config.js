var path = require('path');
var webpack = require('webpack');

var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	//entry: {
	//	app:path.join(__dirname, 'app'),
	//	vendors: ['react','redux', 'redux-router']
	//},
	entry: ['react','redux', 'redux-router', path.join(__dirname, 'app')],
	output: {
		path: path.join(__dirname, 'static'),
		filename: 'bundle.js'
	},
	module: {
		loaders: [
			{
				test:/\.js?$/,
				exclude:/node_modules/,
				loader:'babel'
				//,
				//query:{
				//	presets:['react','es2015']
				//}
			}
		]
	},
	plugins: [
		// kills the compilation upon an error.
		// this keeps the outputed bundle **always** valid
		new webpack.NoErrorsPlugin(),
		//这个使用uglifyJs压缩你的js代码
		//new webpack.optimize.UglifyJsPlugin({minimize: true}),
		//new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
		new HtmlWebpackPlugin({
			title: 'My App',
			filename: '../index.html',
			template: 'app/index.html',
			inject: false
		})
	]
};

