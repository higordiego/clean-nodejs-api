const { MissingParamError } = require('../../utils/errors')
const AuthUseCase = require('./auth-usecase')

const makeSut = () => {
  class LoadUserByEmailRepositorySpy {
    async load (email) {
      this.email = email
      return this.user
    }
  }
  const loadUserByEmailRepository = new LoadUserByEmailRepositorySpy()
  loadUserByEmailRepository.user = {}
  const sut = new AuthUseCase(loadUserByEmailRepository)
  return { sut, loadUserByEmailRepository }
}

describe('Auth UseCase', () => {
  test('Should throw if no email is provided', async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('Should throw if no password is provided', async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth('any_email@hotmail.com')
    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })

  test('Should call LoadUserByEmailRepository  with correct email', async () => {
    const { sut, loadUserByEmailRepository } = makeSut()
    await sut.auth('any_email@hotmail.com', 'any_password')
    expect(loadUserByEmailRepository.email).toBe('any_email@hotmail.com')
  })

  test('Should throw if no LoadUserByEmailRepository is provider', async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth('any_email@hotmail.com', 'any_password')
    expect(promise).rejects.toThrow()
  })

  test('Should throw if no LoadUserByEmailRepository has no load method', async () => {
    const sut = new AuthUseCase({})
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
    const { sut } = makeSut()
    const accessToken = await sut.auth('valid@hotmail.com', 'invalid_password')
    expect(accessToken).toBeNull()
  })
})
