// import sass from 'rollup-plugin-sass';
// import { uglify } from 'rollup-plugin-uglify';
// import typescript from 'rollup-plugin-typescript2';

// import pkg from './package.json';

// export default {
//   input: 'src/index.ts',
//   output: [
//     {
//       file: pkg.main,
//       format: 'cjs',
//       exports: 'named',
//       sourcemap: true,
//       strict: false,
//     },
//   ],
//   plugins: [sass({ insert: true }), typescript(), uglify()],
//   external: ['react', 'react-dom'],
// };

const babel = require('@rollup/plugin-babel');
const commonjs = require('@rollup/plugin-commonjs');
const resolve = require('@rollup/plugin-node-resolve');
const typescript = require('@rollup/plugin-typescript');
const peerDepsExternal = require('rollup-plugin-peer-deps-external');
const path = require('path');

const createBabelConfig = require('./babel.config');
const package = require('./package.json');

const extensions = ['.js', '.ts', '.tsx', '.json'];

// function getBabelOptions(targets) {
//   return { ...createBabelConfig({}), extensions, babelHelpers: 'bundled' };
// }

module.exports = function (args) {
  return [
    // // Browser-friendly UMD.
    // {
    //   input: 'src/index.ts',
    //   output: [
    //     {
    //       name: package.name,
    //       file: package.browser,
    //       format: 'umd',
    //       exports: 'named',
    //       globals: {
    //         react: 'React',
    //         // 'use-sync-external-store/shim': 'useSyncExternalStoreShim',
    //       },
    //     },
    //   ],
    //   plugins: [
    //     peerDepsExternal(),
    //     resolve({ extensions, browser: true }),
    //     typescript(),
    //     commonjs({ extensions }),
    //   ],
    // },
    // // CommonJS (for Node) and ES module (for bundlers).
    // {
    //   input: 'src/index.ts',
    //   output: [
    //     // {
    //     //   file: package.main,
    //     //   format: 'esm',
    //     //   // globals: {
    //     //   //   react: 'React',
    //     //   // },
    //     // },
    //     // {
    //     //   file: `dist/index.cjs`,
    //     //   format: 'cjs',
    //     //   exports: 'named',
    //     //   sourcemap: true,
    //     // },
    //     {
    //       file: package.module,
    //       format: 'es',
    //       exports: 'named',
    //       sourcemap: true,
    //     },
    //   ],
    //   plugins: [
    //     peerDepsExternal(),
    //     resolve({ extensions }),
    //     typescript(),
    //     commonjs({ extensions }),
    //     // babel({
    //     //   include: 'src/**/*',
    //     //   exclude: '**/node_modules/**',
    //     //   babelHelpers: 'runtime',
    //     //   extensions,
    //     // }),
    //     babel.getBabelOutputPlugin({
    //       configFile: path.resolve(__dirname, 'babel.config.js'),
    //       // exclude: 'node_modules/**',
    //     }),
    //   ],
    // },
    {
      input: 'src/index.ts',
      output: [
        {
          file: package.main,
          format: 'cjs',
          sourcemap: true,
        },
        {
          file: package.module,
          format: 'esm',
          sourcemap: true,
        },
      ],
      plugins: [
        peerDepsExternal(),
        resolve(),
        commonjs(),
        typescript(),
        babel({
          babelHelpers: 'bundled',
          extensions: ['.ts'],
        }),
        // // Minifies the output
        // terser(),
      ],
    },
  ];
};
