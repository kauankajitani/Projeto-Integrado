function sendRegister() {
  const nome = $('#nome').val()
  const email = $('#emailRegister').val()
  const senha = $('#senhaRegister').val()
  const cpf = $('#cpf').val()
  $('#myAlertSucessRegister').hide()
  $('#myAlertErrorRegister').hide()
  $.post('/register', { nome: nome.toLowerCase(), email: email.toLowerCase(), senha: senha, cpf: cpf.toLowerCase() }, function (response) {
    if (response) {
      $('#myAlertSucessRegister').show()
    } else {
      $('#myAlertErrorRegister').show()
    }
    location.reload()
  })
}
function toggleButtonDisable() {
  const emailValid = isEmailValid()
  document.getElementById('formRegister').disabled = !emailValid

  const cpf = isCpfValid()
  document.getElementById('formRegister').disabled = !cpf

}
function isEmailValid() {
  const email = document.getElementById('emailRegister').value
  if (!email) {
    return false
  }
  return validateEmail(email)
}
function isCpfValid() {
  const cpf = document.getElementById('cpf').value
  if (!cpf) {
    return false
  }
  return validateCpf(cpf)
}
function validateEmail(email) {
  const emailRegex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i
  return emailRegex.test(email)
}
function validateCpf(cpf) {
  const cpfRegex = /([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})/i
  return cpfRegex.test(cpf)
}

$('#cpf').change(function(){
  $('#myAlertErrorCpf').hide()
  const cpf = $('#cpf').val()
  const email = $('#emailRegister').val()
  if(validateCpf(cpf)){
    $.post('/consulta-usuarios',{email:email,cpf:cpf},function(response){
      if(response.cpf){
        $('#myAlertErrorCpf').show()
      }

    })
  }
})

$('#emailRegister').change(function(){
  $('#myAlertErrorEmail').hide()
  const cpf = $('#cpf').val()
  const email = $('#emailRegister').val()
  if(validateEmail(email)){
    $.post('/consulta-usuarios',{email:email,cpf:cpf},function(response){
      if(response.email){
        $('#myAlertErrorEmail').show()
      }
    })
  }
})



