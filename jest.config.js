
module.exports = {
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  collectCoverageFrom: ['**/src/**/*.js'],
  // collectCoverageFrom: ['**/src/**/*.js', '!**/src/main/**'],
  modulePathIgnorePatterns: ['src/main'],
  preset: '@shelf/jest-mongodb'
}
