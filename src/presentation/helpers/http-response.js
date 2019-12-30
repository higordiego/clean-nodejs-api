
const MissingParamError = require('./missing-param-error')
const UnauthorizedError = require('./unauthorized-error')

module.exports = class httpResponse {
  static success (paramName) {
    return {
      statusCode: 200,
      body: ''
    }
  }

  static badRequest (paramName) {
    return {
      statusCode: 400,
      body: new MissingParamError(paramName)
    }
  }

  static serverError (paramName) {
    return { statusCode: 500, body: new MissingParamError(paramName) }
  }

  static unauthorizedError () {
    return {
      statusCode: 401,
      body: new UnauthorizedError()
    }
  }
}
