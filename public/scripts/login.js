var usernameInput = document.querySelector('[data-login="username"]'),
  passwdInput = document.querySelector('[data-login="password"]'),
  loginBtn = document.querySelector('[data-login="login-btn"]')

// post
function postJSON(url, params) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    credentials: 'same-origin',
    body: JSON.stringify(params)
  }).then(res => {
    return res.json()
  })
}

loginBtn.addEventListener('click', ev => {
  ev.preventDefault()
  ev.stopPropagation()

  postJSON('/login-check', {
    username: usernameInput.value,
    password: md5(passwdInput.value, 'wust')
  })
    .then(res => {
      if (res.status === 1) {
        location.href = '/index'
      } else {
        M.toast({ html: '用户名或密码错误' })
      }
    })
    .catch(err => {
      console.log(err)
    })
})
