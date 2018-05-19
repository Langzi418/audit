// 处理审计模型的数据库操作

const SettingModel = require('./setting')
const Audit = require('./schema').Audit
const ToSetting = require('../utils/toSetting').toSetting

function insert(audit) {
  ToSetting({
    ip: audit.ip,
    agent: audit.agent
  })
    .then(res1 => {
      // console.log(res1)
      SettingModel.findOne({ userId: audit.userId }).then(res2 => {
        // console.log(res2)
        if (res1.location !== res2.location || res1.device !== res2.device) {
          audit.normal = false
        }

        Audit.create(audit)
      })
    })
    .catch(err => {
      console.log(err)
    })
}

function find(cond) {
  return Audit.find(cond).exec()
}

module.exports = {
  insert,
  find
}
