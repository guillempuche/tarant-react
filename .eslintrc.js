module.exports = {
  env: {
    browser: true,
    'shared-node-browser': true,
    node: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
    'plugin:react-hooks/recommended',
    // "plugin:import/errors",
    // "plugin:import/warnings"
  ],
  plugins: [
    '@typescript-eslint',
    'prettier',
    'react-hooks',
    // "import",
    'simple-import-sort',
    // "jest"
  ],
  parser: '@typescript-eslint/parser',
  // parse: '@babel/eslint-parser',
  parserOptions: {
    // "ecmaVersion": 2018,
    sourceType: 'module',
    // "ecmaFeatures": {
    //   "jsx": true
    // }
  },
  rules: {
    eqeqeq: 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    // "import/no-unresolved": ["error", { "commonjs": true, "amd": true }],
    // "import/export": "error",
    '@typescript-eslint/no-duplicate-imports': ['error'],
    '@typescript-eslint/no-unused-vars': ['warn'],
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'simple-import-sort/sort': ['error', { allowSeparatedGroups: false }],
    // "@typescript-eslint/no-use-before-define": "off",
    // "@typescript-eslint/no-empty-function": "off",
    // "jest/consistent-test-it": [
    //   "error",
    //   { "fn": "it", "withinDescribe": "it" }
    // ],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  // "settings": {
  //   "react": {
  //     "version": "detect"
  //   },
  //   "import/extensions": [".js", ".ts" ],
  //   "import/parsers": {
  //     "@typescript-eslint/parser": [".js", ".ts"]
  //   },
  //   "import/resolver": {
  //     "node": {
  //       "extensions": [".js",  ".ts", ".json"],
  //       "paths": ["src"]
  //     },
  //     "alias": {
  //       "extensions": [".js", ".ts", ".json"],
  //       "map": [
  //         ["^zustand$", "./src/index.ts"],
  //         ["zustand", "./src"]
  //       ]
  //     }
  //   }
  // "overrides": [
  //   {
  //     "files": ["src"],
  //     "parserOptions": {
  //       "project": "./tsconfig.json"
  //     }
  //   },
  //   {
  //     "files": ["./*.js"],
  //     "rules": {
  //       "@typescript-eslint/no-var-requires": "off"
  //     }
  //   }
  // ]
};
