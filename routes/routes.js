const path = require('path')
const UAParser = require('ua-parser-js')

function checkLogin(req, res, next) {
  // req session 中 无 user
  if (!req.session.user) {
    return res.redirect('login')
  }

  next()
}

function checkNotLogin(req, res, next) {
  // req session 中 有 user
  if (req.session.user) {
    return res.redirect('index')
  }

  next()
}

module.exports = app => {
  app.get('/', (req, res) => {
    res.redirect('/index')
  })

  app.get('/index', checkLogin, (req, res) => {
    res.render('index')
  })

  app.get('/login', checkNotLogin, (req, res) => {
    res.render('login')
  })

  app.post('/login-check', checkNotLogin, (req, res) => {
    var user = req.body.username
    req.session.user = user
    // var ua = UAParser(req.headers['user-agent'])
    res.redirect('index')
  })
}
