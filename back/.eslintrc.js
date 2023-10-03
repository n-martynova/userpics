module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 'latest'
  },
  env: {
    es6: true
  },
  plugins: ['simple-import-sort'],
  extends: ['plugin:jsonc/recommended-with-jsonc'],
  rules: {
    // @NOTE: some of logs are okay
    'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
    // @NOTE: eslint fucks up with similar namespace and interface declarations
    'no-redeclare': 'off',
    'no-useless-concat': 'error',
    'no-useless-constructor': 0,

    'no-multiple-empty-lines': 'error',
    'no-multi-spaces': 'error',

    camelcase: 'off',

    quotes: ['error', 'single', { avoidEscape: true }],
    'eol-last': ['error', 'always'],
    'object-curly-spacing': ['error', 'always'],
    'comma-spacing': ['error', { before: false, after: true }],
    'brace-style': ['error', '1tbs', { allowSingleLine: true }],
    'max-len': [
      'error',
      {
        code: 1000,
        ignoreStrings: true,
      },
    ],
    'no-extra-parens': 'error',
    semi: 'off',
    // @NOTE: simple-import-sort requires to turn off other import-related sorting rules
    'sort-imports': 'off',
    'import/order': 'off',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },
  overrides: [
    {
      extends: ['plugin:jsonc/recommended-with-jsonc'],
      files: ['*.json'],
      parser: 'jsonc-eslint-parser',
      rules: {
        'jsonc/sort-keys': [
          'error',
          {
            pathPattern: '.*',
            order: { type: 'asc' },
          },
        ],
      },
    },
  ]
};
