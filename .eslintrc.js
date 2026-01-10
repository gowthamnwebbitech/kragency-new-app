module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  extends: [
    '@react-native',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  plugins: ['@typescript-eslint', 'react'],
  rules: {
    /* ================= TypeScript ================= */
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/no-explicit-any': 'off',

    /* ================= React ================= */
    'react/react-in-jsx-scope': 'off', // React 17+
    'react-hooks/exhaustive-deps': 'warn',
    'react/no-unstable-nested-components': ['error', { allowAsProps: true }],

    /* ================= Console ================= */
    'no-console': ['warn', { allow: ['warn', 'error'] }],

    /* ================= React Native ================= */
    'react-native/no-inline-styles': 'warn',
  },
};
