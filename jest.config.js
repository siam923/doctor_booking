module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.test.js', '**/*.test.cjs'],
  globalSetup: './src/tests/test-setup.js',
  globalTeardown: './src/tests/test-teardown.js',
};