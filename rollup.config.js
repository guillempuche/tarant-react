// const babel = require('@rollup/plugin-babel');
// const commonjs = require('@rollup/plugin-commonjs');
// const nodeResolve = require('@rollup/plugin-node-resolve');
const typescript = require('@rollup/plugin-typescript');

const pkg = require('./package.json');

module.exports = (args) => [
	{
		input: 'src/index.ts',
		output: [
			// {
			// 	file: pkg.main,
			// 	format: 'cjs',
			// 	sourcemap: true,
			// },
			{
				file: pkg.module,
				format: 'esm',
				sourcemap: true,
			},
		],
		external: ['tarant', 'react', 'ts-results'],
		plugins: [
			// // Resolves node modules for external dependencies
			// nodeResolve(),
			// // Converts CommonJS modules to ES6
			// commonjs(),
			typescript(),
			// babel({
			// 	babelHelpers: 'bundled',
			// 	extensions: ['.ts'],
			// }),
		],
	},
];
