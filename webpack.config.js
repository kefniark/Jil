const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TypedocWebpackPlugin = require('typedoc-webpack-plugin');

module.exports = (env, argv) => {

	const plugins = [
		new HtmlWebpackPlugin({ filename: 'samples/index.html', template: 'src/samples/index.html' })
	];

	// generate the doc only during build (not in dev)
	if (argv.mode === 'production') {
		plugins.push(new TypedocWebpackPlugin({
			name: 'Jil',
			theme: 'minimal',
			out: './docs',
			mode: 'file',
			exclude: ['src/library/behaviours/**/*', 'src/library/helpers/*'],
			excludePrivate: true,
			excludeProtected: true
		}, './src/library'));
	}

	// normal webpack config
	return {
		entry: './src/library/index.ts',
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: 'jil.min.js',
			library: 'jil',
			libraryTarget: 'umd',
			umdNamedDefine: true
		},
		resolve: {
			extensions: [".ts", ".tsx", ".js"]
		},
		module: {
			rules: [
				{ test: /\.tsx?$/, loader: "ts-loader" }
			]
		},
		plugins,
		mode: "development",
		devServer: {
			contentBase: path.join(__dirname, 'dist', 'samples'),
			port: 80
		}
	};
}
