const { MissingParamError } = require('../../utils/errors')
module.exports = class AuthUseCase {
  constructor ({ loadUserByEmailRepository, encrypter, tokenGenerator, updateAcessTokenRepository }) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
    this.encrypter = encrypter
    this.tokenGenerator = tokenGenerator
    this.updateAcessTokenRepository = updateAcessTokenRepository
  }

  async auth (email, password) {
    if (!email) throw new MissingParamError('email')
    if (!password) throw new MissingParamError('password')
    const user = await this.loadUserByEmailRepository.load(email)
    const isValid = user && await this.encrypter.compare(password, user.password)
    if (isValid) {
      const acessToken = await this.tokenGenerator.generate(user._id)
      await this.updateAcessTokenRepository.update(user._id, acessToken)
      return acessToken
    }
    return null
  }
}
