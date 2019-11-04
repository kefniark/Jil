import commonjs from "rollup-plugin-commonjs"
import resolve from "rollup-plugin-node-resolve"
import { resolveTypescriptPaths } from "rollup-plugin-typescript-paths"
import typescript from "rollup-plugin-typescript"
import pkg from "./package.json"
import serve from "rollup-plugin-serve"

export default {
	input: "src/index.ts",
	output: [
		{
			name: "jil",
			file: pkg.main,
			format: "umd"
		}
	],
	external: [...Object.keys(pkg.peerDependencies || {})],
	plugins: [
		typescript(),
		resolveTypescriptPaths(),
		resolve({ jsnext: true }),
		commonjs(),
		serve({
			open: true,
			openPage: "/samples/",
			contentBase: ["."],
			port: 8080,
			verbose: true
		})
	]
}
