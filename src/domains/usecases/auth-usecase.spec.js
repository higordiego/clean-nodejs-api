const { MissingParamError } = require('../../utils/errors')
const AuthUseCase = require('./auth-usecase')

const makeEncrypter = () => {
  class EncrypterSpy {
    async compare (password, hashedPassword) {
      this.password = password
      this.hashedPassword = hashedPassword
      return this.isValid
    }
  }

  const encrypter = new EncrypterSpy()
  encrypter.isValid = true
  return encrypter
}

const makeloadUserByEmailRepository = () => {
  class LoadUserByEmailRepositorySpy {
    async load (email) {
      this.email = email
      return this.user
    }
  }
  const loadUserByEmailRepository = new LoadUserByEmailRepositorySpy()
  loadUserByEmailRepository.user = {
    _id: 'any_id',
    password: 'hasjed_password'
  }
  return loadUserByEmailRepository
}

const makeUpdateAcessTokenRepository = () => {
  class UpdateAcessTokenRepository {
    async update (userId, accessToken) {
      this.userId = userId
      this.accessToken = accessToken
    }
  }
  return new UpdateAcessTokenRepository()
}

const makeTokenGenerator = () => {
  class TokenGenerator {
    async generate (userId) {
      this.userId = userId
      return this.accessToken
    }
  }

  const tokenGenerator = new TokenGenerator()
  tokenGenerator.accessToken = 'any_token'
  return tokenGenerator
}

const makeSut = () => {
  const encrypter = makeEncrypter()
  const updateAccessTokenRepository = makeUpdateAcessTokenRepository()
  const loadUserByEmailRepository = makeloadUserByEmailRepository()
  const tokenGenerator = makeTokenGenerator()
  const sut = new AuthUseCase({ loadUserByEmailRepository, encrypter, tokenGenerator, updateAccessTokenRepository })
  return { sut, loadUserByEmailRepository, encrypter, tokenGenerator, updateAccessTokenRepository }
}

describe('Auth UseCase', () => {
  test('Should throw if no email is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('Should throw if no password is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth('any_email@hotmail.com')
    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })

  test('Should call LoadUserByEmailRepository  with correct email', async () => {
    const { sut, loadUserByEmailRepository } = makeSut()
    await sut.auth('any_email@hotmail.com', 'any_password')
    expect(loadUserByEmailRepository.email).toBe('any_email@hotmail.com')
  })

  test('Should throw if no LoadUserByEmailRepository has no load method', async () => {
    const sut = new AuthUseCase({ loadUserByEmailRepository: {} })
    const promise = sut.auth('any_email@hotmail.com', 'any_password')
    expect(promise).rejects.toThrow()
  })

  test('Should return null if as invalid email is provider', async () => {
    const { sut, loadUserByEmailRepository } = makeSut()
    loadUserByEmailRepository.user = null
    const accessToken = await sut.auth('any_email@hotmail.com', 'any_password')
    expect(accessToken).toBeNull()
  })

  test('Should return null if an invalid password is provider', async () => {
    const { sut, encrypter } = makeSut()
    encrypter.isValid = false
    const accessToken = await sut.auth('valid@hotmail.com', 'invalid_password')
    expect(accessToken).toBeNull()
  })

  test('Should call Encrypter with correct values', async () => {
    const { sut, loadUserByEmailRepository, encrypter } = makeSut()
    await sut.auth('valid@hotmail.com', 'any_password')
    expect(encrypter.password).toBe('any_password')
    expect(encrypter.hashedPassword).toBe(loadUserByEmailRepository.user.password)
  })

  test('Should call TokenGenerator with correct userId', async () => {
    const { sut, loadUserByEmailRepository, encrypter, tokenGenerator } = makeSut()
    await sut.auth('valid@hotmail.com', 'any_password')
    expect(encrypter.password).toBe('any_password')
    expect(tokenGenerator.userId).toBe(loadUserByEmailRepository.user._id)
  })

  test('Should return and acessToken if correct credentials are provider', async () => {
    const { sut, tokenGenerator } = makeSut()
    const accessToken = await sut.auth('valid@hotmail.com', 'valid_password')
    expect(accessToken).toBe(tokenGenerator.accessToken)
    expect(accessToken).toBeTruthy()
  })

  test('Should call UpdateAcessTokenRepository with correct values', async () => {
    const { sut, loadUserByEmailRepository, tokenGenerator, updateAccessTokenRepository } = makeSut()
    await sut.auth('valid@hotmail.com', 'valid_password')
    expect(updateAccessTokenRepository.userId).toBe(loadUserByEmailRepository.user._id)
    expect(updateAccessTokenRepository.accessToken).toBe(tokenGenerator.accessToken)
  })
})
