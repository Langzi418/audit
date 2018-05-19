// 处理用户设置数据库操作
const UserModel = require('./user')
const Setting = require('./schema').Setting

function insert(setting) {
  return Setting.create({
    location: setting.location,
    device: setting.device,
    userId: setting.userId
  }).catch(err => {
    console.log(err)
  })
}

function findOne(cond) {
  return Setting.findOne(cond).exec()
}

module.exports = {
  insert,
  findOne
}
