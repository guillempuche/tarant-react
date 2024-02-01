module.exports = (api) => {
	// Required by rollup.
	api.cache(true);

	return {
		presets: ["@babel/preset-env", "@babel/preset-react"],
		plugins: ["@babel/plugin-transform-typescript"],
	};
};
