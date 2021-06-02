const Koa = require('koa2')
const bodyParser = require('koa-bodyparser')
const cors = require('koa2-cors')

const useRoutes = require('../router/index')

const errorHandler = require('./error.handle')

const app = new Koa()

app.use(cors());
// app.use(async (ctx, next)=> {
//   ctx.set('Access-Control-Allow-Origin', 'http://localhost:8080');
//   ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, origin, Accept, X-Requested-With , multipart/form-data');
//   ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
//   if (ctx.method == 'OPTIONS') {
//     ctx.body = 200; 
//   } else {
//     await next();
//   }
// });

app.use(bodyParser())

useRoutes(app)

app.on('error',errorHandler)

module.exports = app