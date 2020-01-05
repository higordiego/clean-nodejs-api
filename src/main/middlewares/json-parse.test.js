describe('JSON Parse Middleware', () => {
  const request = require('supertest')
  const app = require('../config/app')
  test('Should parse body as JSON', async () => {
    app.post('/test_json_parse', (req, res) => res.json(req.body))
    await request(app)
      .post('/test_json_parse')
      .send({ name: 'test' })
      .expect({ name: 'test' })
  })
})
