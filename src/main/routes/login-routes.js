const LoginRouter = require('../compose/login-router-compose')

module.exports = async router => {
  router.post('/login', LoginRouter)
}
