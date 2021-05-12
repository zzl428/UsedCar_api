const Koa = require('koa2')
const bodyParser = require('koa-bodyparser')
const cors = require('koa2-cors')

const useRoutes = require('../router/index')

const errorHandler = require('./error.handle')

const app = new Koa()

app.use(cors());

app.use(bodyParser())

useRoutes(app)

app.on('error',errorHandler)

module.exports = app