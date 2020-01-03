const { connect, disconnect } = require('../helpers/mongo-helper')
const MissingParamError = require('../../utils/errors/missing-param-error')
let db

class UpdateAcessTokenRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async update (userId, accessToken) {
    if (!userId) throw new MissingParamError('id')
    if (!accessToken) throw new MissingParamError('token')
    const result = await this.userModel.updateOne({ _id: userId }, { $set: { accessToken } })
    return result
  }
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
    const userModel = db.collection('users')
    const sut = new UpdateAcessTokenRepository(userModel)
    const fakeUser = await userModel.insertOne({ email: 'valid@mail.com', name: 'any_name', age: 50, state: 'any_state', password: 'hashed_password' })
    await sut.update(fakeUser.ops[0]._id, 'valid_token')
    const updateFakeUser = await userModel.findOne({ _id: fakeUser.ops[0]._id })
    expect(updateFakeUser.accessToken).toBe('valid_token')
  })
})
