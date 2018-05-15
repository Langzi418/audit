var accountInput = document.querySelector('[data-login="account"]'),
  pwdInput = document.querySelector('[data-login="password"]'),
  loginBtn = document.querySelector('[data-login="login-btn"]')

// post
function postJSON(url, params) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(params)
  })
}

loginBtn.addEventListener('click', ev => {
  ev.preventDefault()
  ev.stopPropagation()

  var account = accountInput.value,
    password = pwdInput.value,
    userAgent = navigator.userAgent

  postJSON('./login-check', {
    account,
    password,
    userAgent
  }).then(res => {
    location.href = './index'
  })
})
