const express = require('express')

const app = express()

const setuApp = require('./setup')

setuApp(app)

app.get('/api/mongo', (req, res) => {
  res.send('mongo')
})

module.exports = app
