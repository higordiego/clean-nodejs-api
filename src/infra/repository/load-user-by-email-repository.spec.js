const LoadUserByEmailRepository = require('./load-user-by-email-repository')
const { connect, disconnect } = require('../helpers/mongo-helper')
let db

const makeSut = () => {
  const userModel = db.collection('users')
  const sut = new LoadUserByEmailRepository(userModel)
  return { userModel, sut }
}

describe('LoadUserByEmailRepository', () => {
  beforeAll(async () => {
    db = await connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await disconnect()
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany()
  })

  test('Should return null if no user is found', async () => {
    const { sut } = makeSut()
    const user = await sut.load('invalid_email@mail.com')
    expect(user).toBeNull()
  })

  test('Should return an user if user is found', async () => {
    const { sut, userModel } = makeSut()
    const fakeUser = await userModel.insertOne({ email: 'valid@mail.com', name: 'any_name', age: 50, state: 'any_state', password: 'hashed_password' })
    const user = await sut.load('valid@mail.com')
    expect(user).toEqual({ password: fakeUser.ops[0].password, _id: fakeUser.ops[0]._id })
  })
})
