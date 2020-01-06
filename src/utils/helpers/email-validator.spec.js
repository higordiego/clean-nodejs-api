jest.mock('validator', () => ({
  isEmailValid: true,
  isEmail (email) {
    this.email = email
    return this.isEmailValid
  }
}))
const validator = require('validator')
const EmailValidator = require('./email-validator')
const MissingParamError = require('../errors/missing-param-error')
const makeSut = () => {
  return new EmailValidator()
}

describe('Email Validator', () => {
  test('Should return true if validator returns true', () => {
    const sut = makeSut()
    const isEmailValid = sut.isValid('valid_email@email.com')
    expect(isEmailValid).toBe(true)
  })

  test('Should return false if validator returns false', () => {
    validator.isEmailValid = false
    const sut = makeSut()
    const isEmailValid = sut.isValid('invalid_email.email.com')
    expect(isEmailValid).toBe(false)
  })

  test('Should call validator with correct email', () => {
    const sut = makeSut()
    sut.isValid('invalid_email@email.com')
    expect(validator.email).toBe('invalid_email@email.com')
  })

  test('Should call Encrypter with correct password', () => {
    const sut = makeSut()
    sut.isValid('invalid_email@email.com')
    expect(validator.email).toBe('invalid_email@email.com')
  })
  test('Should throw if no email is provider', async () => {
    const sut = makeSut()
    expect(sut.isValid).toThrow(new MissingParamError('email'))
  })
})
