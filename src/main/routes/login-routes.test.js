const request = require('supertest')
const MongoHelper = require('../../infra/helpers/mongo-helper')
const app = require('../config/app')

describe('Login Routes', () => {
  let userModel
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    userModel = await MongoHelper.getCollection('users')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    await userModel.deleteMany()
    await userModel.insertOne({
      email: 'valid_email@mail.com',
      name: 'any_name',
      age: 50,
      state: 'any_state',
      password: 'hashed_password'
    })
  })
  test('Should 200 when valid crendetials are provider', () => {
    request(app)
      .post('/api/login')
      .send({ email: 'valid_email@mail.com', password: '13245' })
  }).expect(200)
})
