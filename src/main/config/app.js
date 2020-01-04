const express = require('express')

const app = express()

const setuApp = require('./setup')
const setupRoutes = require('./routes')
setupRoutes(app)
setuApp(app)

module.exports = app
