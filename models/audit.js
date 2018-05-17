// 处理审计模型的数据库操作

const UserModel = require('./user')
const Audit = require('./schema').Audit

function insert(username, audit) {
  UserModel.findOne({ name: username })
    .then(user => {
      Audit.create({
        ip: audit.ip,
        time: audit.time,
        agent: audit.agent,
        userId: user._id
      })
    })
    .catch(err => {
      console.log(err.message)
    })
}

module.exports = {
  insert
}
