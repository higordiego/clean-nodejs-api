const { MongoClient } = require('mongodb')
let client, db
class LoadUserByEmailRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async load (email) {
    const user = await this.userModel.findOne({ email })
    return user
  }
}

const makeSut = () => {
  const userModel = db.collection('users')
  const sut = new LoadUserByEmailRepository(userModel)
  return { userModel, sut }
}

describe('LoadUserByEmailRepository', () => {
  beforeAll(async () => {
    client = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    db = await client.db()
  })

  afterAll(async () => {
    await client.close()
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
    userModel.insertOne({ email: 'valid@mail.com' })
    const user = await sut.load('valid@mail.com')
    expect(user.email).toBe('valid@mail.com')
  })
})
