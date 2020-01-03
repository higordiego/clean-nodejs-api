const { connect, disconnect } = require('../helpers/mongo-helper')
const MissingParamError = require('../../utils/errors/missing-param-error')
let db

class UpdateAccessTokenRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async update (userId, accessToken) {
    if (!userId) throw new MissingParamError('id')
    if (!accessToken) throw new MissingParamError('accessToken')
    await this.userModel.updateOne({ _id: userId }, { $set: { accessToken } })
  }
}

const makeSut = () => {
  const userModel = db.collection('users')
  const sut = new UpdateAccessTokenRepository(userModel)
  return { sut, userModel }
}

describe('UpdateAcessToken Repository', () => {
  beforeAll(async () => {
    db = await connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await disconnect()
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany()
  })
  test('should update the user with the given acessToken', async () => {
    const { sut, userModel } = makeSut()
    const fakeUser = await userModel.insertOne({ email: 'valid@mail.com', name: 'any_name', age: 50, state: 'any_state', password: 'hashed_password' })
    await sut.update(fakeUser.ops[0]._id, 'valid_token')
    const updateFakeUser = await userModel.findOne({ _id: fakeUser.ops[0]._id })
    expect(updateFakeUser.accessToken).toBe('valid_token')
  })
  test('Should throw if no userModel is provided', async () => {
    const sut = new UpdateAccessTokenRepository()
    const userModel = db.collection('users')
    const fakeUser = await userModel.insertOne({ email: 'valid@mail.com', name: 'any_name', age: 50, state: 'any_state', password: 'hashed_password' })
    const promise = sut.update(fakeUser.ops[0]._id, 'valid_token')
    expect(promise).rejects.toThrow()
  })

  test('Should throw if no params are provider', async () => {
    const { sut, userModel } = makeSut()
    const fakeUser = await userModel.insertOne({ email: 'valid@mail.com', name: 'any_name', age: 50, state: 'any_state', password: 'hashed_password' })
    console.log(sut.update())
    expect(sut.update()).rejects.toThrow(new MissingParamError('userId'))
    expect(sut.update(fakeUser.ops[0]._id)).rejects.toThrow(new MissingParamError('accessToken'))
  })
})
