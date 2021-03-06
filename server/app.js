const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa-cors')
const path = require('path')

// error handler
onerror(app)

app.use(cors())
// middlewares
app.use(
  bodyparser({
    enableTypes: [ 'json', 'form', 'text' ]
  })
)
app.use(json())
app.use(logger())
app.use(require('koa-static')(path.resolve(__dirname, '../dist')))
// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
// app.use(index.routes(), index.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app
