const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

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
	],
	mode: "development",
	devServer: {
		contentBase: path.join(__dirname, 'dist', 'samples'),
		port: 80
	}
};
