module.exports = (api) => {
  // Required by rollup.
  api.cache(true);

  return {
    // ignore: ['node_modules/**'],
    presets: ['@babel/preset-env', '@babel/preset-react'],
    plugins: [
      // [
      //   '@babel/plugin-transform-react-jsx',
      //   {
      //     runtime: 'automatic',
      //   },
      // ],
      '@babel/plugin-transform-typescript',
    ],
  };
};
