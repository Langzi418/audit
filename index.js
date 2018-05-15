const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const routes = require('./routes/routes')

var config
if (process.env.NODE_ENV === 'development') {
  config = require('./config/dev')
} else {
  config = require('./config/prod')
}

const app = express()

// 静态文件目录
app.use(express.static('public'))

// 模板引擎
app.set('views', './views')
app.set('view engine', 'ejs')

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))
// for parsing application/x-www-form-urlencoded

app.use(
  session({
    name: 'sessionId', // 设置 cookie 中保存 session id 的字段名称
    secret: 'secret', // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
    resave: true, // 强制更新 session
    saveUninitialized: false, // 设置为 false，强制创建一个 session，即使用户未登录
    cookie: {
      maxAge: 2592000000 // 过期时间，过期后 cookie 中的 session id 自动删除
    },
    store: new MongoStore({
      // 将 session 存储到 mongodb
      url: config.mongodb // mongodb 地址
    })
  })
)

// 注册路由
routes(app)

// 监听端口
app.listen(config.port, () => {
  console.log(`listening on port ${config.port}`)
})
