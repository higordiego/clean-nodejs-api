const express = require('express')

const app = express()

const setuApp = require('./setup')

setuApp(app)

module.exports = app
