const LoginRouter = require('../compose/login-router-compose')

const ExpressRouterAadapter = require('../adapters/express-router-adapter')

module.exports = router => {
  router.post('/login', ExpressRouterAadapter.adapt(LoginRouter))
}
