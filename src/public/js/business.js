function getAgendamentos() {
    $.get('/consulta-agendamentos-business', {}, function (response) {
        console.log(response)
        if(response){
            if(document.querySelector('#agendamentosCriados').children.length <= 0){
                response.forEach(agendamento => {
                    const tr = document.createElement('tr')
                    const tdNome = document.createElement('td')
                    const tdCpf = document.createElement('td')
                    const tdData = document.createElement('td')
                    const tdHora = document.createElement('td')
                    tdNome.textContent = agendamento.nome.toUpperCase()
                    tdCpf.textContent = agendamento.cpf
                    tdData.textContent = agendamento.data_agendamentos
                    tdHora.textContent = agendamento.hora
                    tr.append(tdNome,tdCpf,tdData,tdHora)
                    document.querySelector('#agendamentosCriados').append(tr)
                });
            }
        }
    })
}

function toggleButtonDisable() {
    const cnpjValid = isEmailValid()
    $('#sendBusiness').val().disabled = !cnpjValid

    const password = isPasswordValid()
    $('#sendBusiness').val().disabled = !cnpjValid || !password
}

function isEmailValid() {
    const cnpj = $('#cnpj').val()
    if (!cnpj) {
        return false
    }
    return validateEmail(cnpj)
}

function isPasswordValid() {
    const senha = $('#senha').val()
    if (!senha) {
        return false
    }
    return true
}

function validateEmail(cnpj) {
    const cnpjValid = /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/
    return cnpjValid.test(cnpj)
}

const cnpjMask = (value) => {
    return value
        .replace(/\D+/g, '') // não deixa ser digitado nenhuma letra
        .replace(/(\d{2})(\d)/, '$1.$2') // captura 2 grupos de número o primeiro com 2 digitos e o segundo de com 3 digitos, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de número
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2') // captura 2 grupos de número o primeiro e o segundo com 3 digitos, separados por /
        .replace(/(\d{4})(\d)/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1') // captura os dois últimos 2 números, com um - antes dos dois números
}

$('#cnpj').on('change',function(){
    this.value = cnpjMask(this.value)
})
