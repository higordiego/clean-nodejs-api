const request = require('supertest')
const app = require('../config/app')
describe('Content-Type Middleware', () => {
  test('Should return json content type as default', async () => {
    app.get('/test_content_type', (req, res) => res.json({}))
    await request(app)
      .get('/test_content_type')
      .expect('content-type', /json/)
  })
})
