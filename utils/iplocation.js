const fetch = require('node-fetch')

module.exports = {
  location: ip => {
    if (ip.substr(0, 7) === '::ffff:') {
      ip = ip.substr(7)
    }

    var url = `http://api.map.baidu.com/location/ip?ip=${ip}&ak=FGRlCEw0t4iwksHiRXEZZYgC3rswhkvK&coor=bd09ll`
    return fetch(url)
  }
}

// {
//   headers: {
//     'content-type': 'application/json'
//   },
//   method: 'POST',
//   body: JSON.stringify({
//     ip,
//     ak: '7U43dOhyDGrXRoPaYRruvPLOgIe47wiZ'
//   })
// }
