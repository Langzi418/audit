const path = require('path')
const UAParser = require('ua-parser-js')
const UserModel = require('../models/user')
const AuditModel = require('../models/audit')
const GetLocation = require('../utils/iplocation').location

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
    var audit = {
      ip: req.ip,
      time: Date.now(),
      agent: req.headers['user-agent']
    }

    GetLocation(audit.ip)
      .then(json => {
        return json.json()
      })
      .then(obj => {
        var status = {
          location: obj.content.address,
          device: UAParser(audit.agent).device.model || 'pc'
        }
        res.render('index', { username, status })
      })
      .catch(err => {
        console.log(err)
      })

    AuditModel.insert(username, audit)
  })

  app.get('/login', isLogined, (req, res) => {
    res.render('login')
  })

  app.post('/login-check', isLogined, (req, res) => {
    var username = req.body.username
    var password = req.body.password

    UserModel.findOne({ name: username })
      .then(user => {
        if (user && user.passwd === password) {
          req.session.username = username
          res.redirect('index')
        } else {
          // 登录失败
          res.redirect('login')
        }
      })
      .catch(err => {
        console.log(err.message)
      })
  })

  app.get('/logout', (req, res) => {
    req.session.username = null
    res.redirect('login')
  })

  // test ua
  app.get('/ua', (req, res) => {
    console.log(UAParser(req.headers['user-agent']))
    res.send(UAParser(req.headers['user-agent']))
  })
}
