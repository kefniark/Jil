const fs = require('fs');

/**
 * Fix the default definition file generated by dts-generator
 *
 * Bug with `--main index`
 */
let def = fs.readFileSync('dist/jil.d.ts', 'utf8');
def = def.replace(new RegExp('src/library/', 'g'), '');
def = def.replace('declare module \'index\' {', '');
var index = def.lastIndexOf('}');
if (index !== -1) {
	def = def.substr(0, index);
}

fs.writeFileSync('dist/jil.d.ts', def);
console.log('Definition file Fixed !');