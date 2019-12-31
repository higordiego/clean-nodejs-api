module.exports = class InvalidParamError extends Error {
  constructor (paramName) {
    super('Internal Error')
    this.name = 'InvalidParamError'
  }
}
