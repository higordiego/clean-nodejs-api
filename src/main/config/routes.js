const { Router } = require('express')
const fg = require('fast-glob')
module.exports = app => {
  app.use('/api', Router)
  fg.sync('**/src/main/routes/**.js').forEach(file => require(`../../../${file}`)(Router))
}
