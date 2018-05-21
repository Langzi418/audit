const path = require('path')
const UAParser = require('ua-parser-js')
const UserModel = require('../models/user')
const AuditModel = require('../models/audit')
const SettingModel = require('../models/setting')
const ToSetting = require('../utils/toSetting').toSetting
const each = require('async').each

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
    var userId = req.session.userId
    var audit = {
      // ip: req.ip,
      ip: '171.82.153.4',
      time: Date.now(),
      agent: req.headers['user-agent'],
      userId
    }

    res.render('index', { username })
    AuditModel.insert(audit)
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
          req.session.userId = user._id
          res.json({
            status: 1
          })
        } else {
          // 登录失败
          res.json({
            status: 0
          })
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

  // user setting
  app.post('/setting', (req, res) => {
    var location = req.body.location
    var device = req.body.device
    var userId = req.session.userId

    SettingModel.insert({
      location,
      device,
      userId
    }).then(setting => {
      if (setting) {
        res.json({
          status: 1
        })
      }
    })
  })

  // show setting?
  app.get('/setting', (req, res) => {
    var userId = req.session.userId

    var status = {
      show: false
    }

    SettingModel.findOne({ userId })
      .then(setting => {
        if (!setting) {
          ToSetting({
            ip: '171.82.153.4',
            agent: req.headers['user-agent']
          }).then(obj => {
            status = obj
            status.show = true
            res.json(status)
          })
        } else {
          res.json(status)
        }
      })
      .catch(err => {
        console.log(err)
      })
  })

  app.get('/audit', (req, res) => {
    AuditModel.find({
      normal: false,
      userId: req.session.userId
    })
      .then(audits => {
        if (audits.length !== 0) {
          var len = audits.length
          var cnt = 0
          var newAudit = []

          audits.forEach(audit => {
            var time = audit.time

            ToSetting({
              ip: audit.ip,
              agent: audit.agent
            })
              .then(obj => {
                audit = obj
                audit.time = time
                newAudit.push(audit)
                return ++cnt
              })
              .then(cnt => {
                if (cnt === len) {
                  newAudit.sort((a, b) => {
                    return new Date(b.time) - new Date(a.time)
                  })

                  res.render('./audit/audit', { audits: newAudit })
                }
              })
          })
        } else {
          res.render('./audit/audit', { audits: null })
        }
      })
      .catch(err => {
        console.log(err)
      })
  })
}
