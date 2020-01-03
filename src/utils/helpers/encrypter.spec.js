const bcrypt = require('bcrypt')
const Encrypter = require('./encrypter')
const MissingParamError = require('../errors/missing-param-error')
const makeSut = () => {
  return new Encrypter()
}

describe('Encrypter', () => {
  test('Should return true if bcrypt return true', async () => {
    const sut = makeSut()
    const isValid = await sut.compare('any_value', 'any_hash')
    expect(isValid).toBe(true)
  })

  test('Should return false if bcrypt return false', async () => {
    const sut = makeSut()
    bcrypt.isValid = false
    const isValid = await sut.compare('any_value', 'any_hash')
    expect(isValid).toBe(false)
  })

  test('Should call bcrypt with correct values', async () => {
    const sut = makeSut()
    await sut.compare('any_value', 'any_hash')
    expect(bcrypt.value).toBe('any_value')
    expect(bcrypt.hash).toBe('any_hash')
  })

  test('Should throw if no params are provider', async () => {
    const sut = makeSut()
    const promise = sut.compare()
    expect(promise).rejects.toThrow(new MissingParamError('value'))
  })
})
