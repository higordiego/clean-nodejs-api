
module.exports = {
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  collectCoverageFrom: ['**/src/**/*.js'],
  modulePathIgnorePatterns: ['src/main'],
  preset: '@shelf/jest-mongodb'
}
