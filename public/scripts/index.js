// post
function postJSON(url, params) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    credentials: 'same-origin',
    body: JSON.stringify(params)
  })
    .then(res => {
      return res.json()
    })
    .catch(err => {
      console.log(err)
    })
}

// get
function getJSON(url) {
  return fetch(url, {
    method: 'GET',
    credentials: 'same-origin'
  })
    .then(res => {
      return res.json()
    })
    .catch(err => {
      console.log(err)
    })
}

getJSON('/setting').then(status => {
  if (status.show) {
    var setDiv = document.querySelector('[data-index="set-div"]')
    setDiv.classList.remove('hidden')

    var locatTxt = document.querySelector('[data-index="location"]'),
      deviceTxt = document.querySelector('[data-index="device"]'),
      setBtn = document.querySelector('[data-index="set-btn"]')

    locatTxt.innerText += status.location
    deviceTxt.innerText += status.device

    setBtn.addEventListener('click', ev => {
      postJSON('/setting', {
        location: status.location,
        device: status.device
      })
        .then(res => {
          if (res.status === 1) {
            setDiv.style.display = 'none'
            M.toast({ html: '设置成功' })
          }
        })
        .catch(err => {
          console.log(err)
        })
    })
  }
})
