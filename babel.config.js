// https://babeljs.io/docs/en/config-files#config-function-api
module.exports = () => {
  return {
    ignore: ['./node_modules'],
    presets: [['@babel/preset-env']],
    plugins: [
      // [
      //   '@babel/plugin-transform-react-jsx',
      //   {
      //     runtime: 'automatic',
      //   },
      // ],
      ['@babel/plugin-transform-typescript'],
    ],
  }
}
