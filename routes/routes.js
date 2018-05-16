const path = require('path')
const UAParser = require('ua-parser-js')
const USERS = require('../config/users')

function checkLogin(req, res, next) {
  // req session 中 无 user
  if (!req.session.username) {
    return res.redirect('login')
  }

  next()
}

function isLogined(req, res, next) {
  // req session 中 有 user
  if (req.session.username) {
    return res.redirect('index')
  }

  next()
}

module.exports = app => {
  app.get('/', (req, res) => {
    res.redirect('/index')
  })

  app.get('/index', checkLogin, (req, res) => {
    var username = req.session.username
    res.render('index', { username })
  })

  app.get('/login', isLogined, (req, res) => {
    res.render('login')
  })

  app.post('/login-check', isLogined, (req, res) => {
    var username = req.body.username
    var password = req.body.password

    if (Object.keys(USERS).indexOf(username) !== -1) {
      if (USERS[username] === password) {
        req.session.username = username
        res.redirect('index')
        return
      }
    }

    // 登录失败
    res.redirect('login')
  })

  app.get('/logout', (req, res) => {
    req.session.username = null
    res.render('login')
  })
}
