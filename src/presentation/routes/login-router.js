const httpResponse = require('../helpers/http-response')
const { MissingParamError, InvalidParamError } = require('../../utils/errors')
module.exports = class LoginRouter {
  constructor (authUseCase, emailValidator) {
    this.authUseCase = authUseCase
    this.emailValidator = emailValidator
  }

  async route (httpRequest) {
    try {
      const { body: { email, password } } = httpRequest
      if (!email) return httpResponse.badRequest(new MissingParamError('email'))
      if (!this.emailValidator.isValid(email)) return httpResponse.badRequest(new InvalidParamError('email'))
      if (!password) return httpResponse.badRequest(new MissingParamError('password'))
      const acessToken = await this.authUseCase.auth(email, password)
      if (!acessToken) return httpResponse.unauthorizedError()
      return httpResponse.ok({ acessToken })
    } catch (err) {
      return httpResponse.serverError()
    }
  }
}
