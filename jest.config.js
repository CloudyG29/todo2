const { createDefaultPreset } = require('ts-jest');

module.exports = {
  testEnvironment: 'node',
  transform: {
    ...createDefaultPreset().transform,
  },
  testMatch: ['**/tests/**/*.test.ts'],
};