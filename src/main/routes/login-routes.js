const { adapt } = require('../adapters/express-router-adapter')
const LoginRouterComposer = require('../compose/login-router-compose')

module.exports = router => {
  const loginRouter = LoginRouterComposer.compose()
  router.post('/login', adapt(loginRouter))
}
