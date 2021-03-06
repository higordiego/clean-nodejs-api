const express = require('express')

const app = express()

const setuApp = require('./setup')
const setupRoutes = require('./routes')
setuApp(app)
setupRoutes(app)

module.exports = app
