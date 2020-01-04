const { Router } = require('express')
const fb = require('fast-glob')
module.exports = app => {
  app.use('/api', Router)
  fb.sync('**/src/main/routes/**.js').forEach(file => require(`../../../${file}`)(Router))
}
