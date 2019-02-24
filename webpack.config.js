const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TypedocWebpackPlugin = require('typedoc-webpack-plugin');

module.exports = {
	entry: './src/library/index.ts',
	output: {
		filename: 'jil.js',
		path: path.resolve(__dirname, 'dist')
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js"]
	},
	module: {
		rules: [
			{ test: /\.tsx?$/, loader: "ts-loader" }
		]
	},
	plugins: [
		new HtmlWebpackPlugin({ filename: 'samples/index.html', template: 'src/samples/index.html' }),
		// new CopyPlugin([
		// 	{ from: 'src/samples/panel.html', to: 'samples' },
		// 	{ from: 'src/samples/scene.html', to: 'samples' }
		// ]),
		new TypedocWebpackPlugin({
			name: 'JIL',
			theme: 'minimal',
			out: './docs',
			mode: 'file',
			exclude: ['src/library/behaviours/*', 'src/library/helpers/*'],
			excludePrivate: true,
			excludeProtected: true
		}, './src/library')
	],
	mode: "development",
	devServer: {
		contentBase: path.join(__dirname, 'dist', 'samples'),
		port: 80
	}
};
