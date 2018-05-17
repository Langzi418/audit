// 处理用户模型的数据库操作
const User = require('./schema').User

function findOne(cond) {
  return User.findOne(cond).exec()
}

function insert(obj) {
  User.create(obj).catch(err => {
    console.log(err)
  })
}

module.exports = {
  findOne,
  insert
}
