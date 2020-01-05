module.exports = {
  port: process.env.PORT || 3000,
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/test',
  tokenSecret: process.env.TOKEN_SECRET || 'secret'
}
