const MongoHelper = require('../infra/helpers/mongo-helper')
const app = require('./config/app')
const { mongoUrl, port } = require('./config/env')

MongoHelper.connect(mongoUrl)
  .then(() => app.listen(port, () => console.log('Server running')))
  .catch(err => console.log(`Error: ${err}`))
