const { connect, disconnect } = require('../helpers/mongo-helper')
const MissingParamError = require('../../utils/errors/missing-param-error')
const UpdateAccessTokenRepository = require('./update-access-toke-repository')
let db

const makeSut = () => {
  const userModel = db.collection('users')
  const sut = new UpdateAccessTokenRepository(userModel)
  return { sut, userModel }
}

describe('UpdateAcessToken Repository', () => {
  let fakeUser
  beforeAll(async () => {
    db = await connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await disconnect()
  })

  beforeEach(async () => {
    const userModel = db.collection('users')
    await userModel.deleteMany()
    fakeUser = await userModel.insertOne({ email: 'valid@mail.com', name: 'any_name', age: 50, state: 'any_state', password: 'hashed_password' })
  })
  test('should update the user with the given acessToken', async () => {
    const { sut, userModel } = makeSut()
    await sut.update(fakeUser.ops[0]._id, 'valid_token')
    const updateFakeUser = await userModel.findOne({ _id: fakeUser.ops[0]._id })
    expect(updateFakeUser.accessToken).toBe('valid_token')
  })
  test('Should throw if no userModel is provided', async () => {
    const sut = new UpdateAccessTokenRepository()
    const promise = sut.update(fakeUser.ops[0]._id, 'valid_token')
    expect(promise).rejects.toThrow()
  })

  test('Should throw if no params are provider', async () => {
    const { sut } = makeSut()
    console.log(sut.update())
    expect(sut.update()).rejects.toThrow(new MissingParamError('userId'))
    expect(sut.update(fakeUser.ops[0]._id)).rejects.toThrow(new MissingParamError('accessToken'))
  })
})
