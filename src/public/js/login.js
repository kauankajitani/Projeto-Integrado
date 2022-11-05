function toggleButtonDisable() {
  const emailValid = isEmailValid()
  $('.login').val().disabled = !emailValid

  const password = isPasswordValid()
  $('.login').val().disabled = !emailValid || !password
}

function isEmailValid() {
  const email = $('#exampleInputEmail1').val()
  if (!email) {
    return false
  }
  return validateEmail(email)
}

function isPasswordValid() {
  const senha = $('#exampleInputPassword1').val()
  if (!password) {
    return false
  }
  return true
}

function validateEmail(email) {
  const emailRegex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i
  return emailRegex.test(email)
}

