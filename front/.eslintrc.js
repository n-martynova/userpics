module.exports = {
  root: true,
  plugins: ['vue', 'simple-import-sort'],
  extends: ['plugin:vue/vue3-recommended', 'plugin:jsonc/recommended-with-jsonc'],
  rules: {
    // @NOTE: Disabled because it breaks when importing types.
    //        But typescript does this better anyway, so it does not matter.
    'import/named': ['off'],

    'vue/no-multiple-template-root': 0,
    'vue/no-setup-props-destructure': 0,

    // @NOTE: We can rely on hoisting
    'no-use-before-define': ['off'],
    'vue/no-v-html': 0,
    'vue/valid-template-root': 0,

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

    // @NOTE: Vue
    'vue/attribute-hyphenation': 0,
    'vue/max-attributes-per-line': 1,
    'vue/html-closing-bracket-newline': [
      'error',
      {
        singleline: 'never',
        multiline: 'always',
      },
    ],
    'vue/html-indent': [
      'error',
      2,
      {
        attribute: 1,
        baseIndent: 1,
        closeBracket: 0,
        alignAttributesVertically: true,
        ignores: [],
      },
    ],

    'vue/script-indent': [
      'error',
      2,
      {
        baseIndent: 0,
        switchCase: 1,
        ignores: [],
      },
    ],
    'vue/require-default-prop': 0,
    'vue/v-slot-style': 0,
    'vue/multi-word-component-names': 0,
    'vue/v-on-event-hyphenation': [
      'error',
      'always',
      {
        autofix: false,
        ignore: [],
      },
    ],

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
}
