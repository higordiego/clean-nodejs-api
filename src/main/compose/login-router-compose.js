const LoginRouter = require('../../presentation/routes/login-router')
const AuthUseCase = require('../../domains/usecases/auth-usecase')
const EmailValidator = require('../../utils/helpers/email-validator')
const LoadUserByEmailRepository = require('../../infra/repository/load-user-by-email-repository')
const UpdateAccessTokenRepository = require('../../infra/repository/update-access-token-repository')
const Encrypter = require('../../utils/helpers/encrypter')
const TokenGenerator = require('../../utils/helpers/token-generator')
const { tokenSecret } = require('../config/env')

module.exports = class LoginRouterCompose {
  static compose () {
    const loadUserByEmailRepository = new LoadUserByEmailRepository()
    const updateAccessTokenRepository = new UpdateAccessTokenRepository()
    const emailValidator = new EmailValidator()
    const encrypter = new Encrypter()
    const tokenGenerator = new TokenGenerator(tokenSecret)
    const authUseCase = new AuthUseCase({ loadUserByEmailRepository, updateAccessTokenRepository, encrypter, tokenGenerator })
    return new LoginRouter({ authUseCase, emailValidator })
  }
}
