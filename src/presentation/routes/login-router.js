const httpResponse = require('../helpers/http-response')
const MissingParamError = require('../helpers/missing-param-error')
module.exports = class LoginRouter {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  async route (httpRequest) {
    try {
      const { body: { email, password } } = httpRequest
      if (!email) return httpResponse.badRequest(new MissingParamError('email'))
      if (!password) return httpResponse.badRequest(new MissingParamError('password'))
      const acessToken = await this.authUseCase.auth(email, password)
      if (!acessToken) return httpResponse.unauthorizedError()
      return httpResponse.ok({ acessToken })
    } catch (err) {
      return httpResponse.serverError()
    }
  }
}
