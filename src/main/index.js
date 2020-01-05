const MongoHelper = require('../infra/helpers/mongo-helper')
const app = require('./config/app')
const { mongoUrl, port } = require('./config/env')

MongoHelper.connect(mongoUrl)
  .then(() => app.listen(port, () => console.log(`Server running at http://localhost:${port}`)))
  .catch(err => console.log(`Error: ${err}`))
