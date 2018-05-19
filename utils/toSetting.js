const GetLocation = require('./iplocation').location
const UAParser = require('ua-parser-js')

module.exports = {
  toSetting: obj => {
    return GetLocation(obj.ip).then(res => {
      return {
        location: res.content.address,
        device: UAParser(obj.agent).device.model || 'pc'
      }
    })
  }
}
