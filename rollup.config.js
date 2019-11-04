import commonjs from "rollup-plugin-commonjs"
import resolve from "rollup-plugin-node-resolve"
import { resolveTypescriptPaths } from "rollup-plugin-typescript-paths"
import typescript from "rollup-plugin-typescript"
import pkg from "./package.json"
import filesize from "rollup-plugin-filesize"
// import { terser } from "rollup-plugin-terser"

export default {
	input: "src/index.ts",
	output: [
		{
			name: "jil",
			file: pkg.main,
			format: "umd"
		},
		{
			file: pkg.module,
			format: "es"
		}
	],
	external: [...Object.keys(pkg.peerDependencies || {})],
	plugins: [
		typescript(),
		resolveTypescriptPaths(),
		resolve({ jsnext: true }),
		commonjs(),
		// terser(),
		filesize({
			showGzippedSize: false
		})
	]
}
