$.fn.datepicker.dates['pt-BR'] = {
    days: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
    daysShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
    daysMin: ["Do", "Se", "Te", "Qu", "Qua", "Se", "Sa"],
    months: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
    monthsShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
    today: "Hoje",
    monthsTitle: "Meses",
    clear: "Limpar",
    format: "dd/mm/yyyy",
    language: 'pt-br'
}

$("#datepicker").datepicker({
    format: "dd/mm/yyyy",
    language: 'pt-BR',
    startDate: 'today'
});

$('#dataConsulta').on('change', function () {
    const indexEmp = document.getElementById('emps').selectedIndex
    const cnpj = document.getElementById('emps').options[indexEmp].value 
    const options = document.querySelector('#horario').querySelectorAll('option')
    for (let x = 0; x < options.length; x++) {
        options[x].style.display = '';
    }
    let text = $('#dataConsulta').val()
    if (text.length == 0 || !validateDate(text) || text === '') {
        $('#horario').prop('disabled', true)
    }
    if (validateDate(text)) {
        $('#horario').prop('disabled', false)
        let day = $(this).val().split('/')
        day = `${day[2]}/${day[1]}/${day[0]}`
        getUniqueEmp(cnpj,(hash)=>{
            getHoursNotDisponible(day, hash, (result) => {
                if (result.length != 0) {
                    disableHorsIndisponibles(result)
                }
            })
        })
            
    }
})

$('#modalNovoAgendamento').on('click',function(){
    setTimeout($('#emps').selectpicker('refresh'),500)
})

$('#emps').on('change',function(){
    document.getElementById('dataConsulta').value = ''
    $('#dataConsulta').prop('disabled',false)
    if(document.getElementById('dataConsulta').value = ''){
        $('#dataConsulta').prop('disabled',true)
    }    
})

function getHoursNotDisponible(day, empresa,callback) {
    $.post('/consulta-horas', { 'data': day ,'empresa':empresa}, function (response) {
        callback(response)
    })
}

function disableHorsIndisponibles(list) {
    const options = document.querySelector('#horario').querySelectorAll('option')
    for (let i = 0; i < list.length; i++) {
        for (let x = 0; x < options.length; x++) {
            if (options[x].textContent === list[i]) {
                options[x].style.display = 'none';
            }
        }
    }
}

function validateDate(date) {
    var matches = /(\d{2})[-.\/](\d{2})[-.\/](\d{4})/.exec(date);
    if (matches == null) {
        return false;
    } else {
        return true
    }
}

function getUniqueEmp(empresa,callback){
    $.post('/unique-emp',{'empresa':empresa},function(response){
        const {id_empresas} = response
        callback(id_empresas)
    })
}

function getEmps(callback) {
    $.get('/consulta-empresas', {}, function (response) {
        callback(response)
    })
}

function defineListEmps() {
    if(document.querySelector('#emps').children.length <= 1){
        getEmps((emps) => {
            emps.forEach(element => {
                $('#emps').append(`<option value="${element.cnpj}" data-bs-tokens="${element.empresa}">${element.empresa}</option>`)
            });
        })
    }
}

function sendAgendamento(){
    const hour = $('#horario').val()
    const date = $('#dataConsulta').val()
    const emp = $('#emps').val()
    if(hour != 'default' && date && emp){
        $.post('/novo-agendamento',{data:date,empresa:emp,horario:hour}, function (response){
            if(response){
                $('#staticBackdrop-right').modal({focus:true})
            }else{
                $('#staticBackdrop-error').modal({focus:true})
                
            }
        });
    }
}

function getAgendamentos(){
    $.get('/consulta-agendamentos',{},function(response){
        if(response){
            if(document.querySelector('#agendamentosCriados').children.length <= 0){
                response.forEach(agendamento => {
                    const tr = document.createElement('tr')
                    const i = document.createElement('i')
                    i.setAttribute('class','material-icons')
                    i.append('delete')
                    i.setAttribute('style','border:none ')
                    const button = document.createElement('button')
                    button.setAttribute('id',agendamento.id_agendamentos)
                    button.setAttribute('style','border:none !important; background-color:white')
                    button.append(i)
                    const tdButtonExclude = document.createElement('td')
                    tdButtonExclude.append(button)
                    button.onclick = function(){
                        $.post('/delete-agendamento',{id:this.id},function(response){
                            if(response){
                                alert('Agendamento excluido com sucesso')
                                window.location.reload()
                            }else{
                                alert('Erro ao excluir agendamento')
                            }
                        })
                    }
                    const tdNome = document.createElement('td')
                    const tdData = document.createElement('td')
                    const tdHora = document.createElement('td')
                    tdNome.setAttribute('value',agendamento.cnpj)
                    tdNome.textContent = agendamento.nome
                    tdData.textContent = agendamento.data_agendamentos
                    tdHora.textContent = agendamento.hora
                    tr.append(tdNome,tdData,tdHora,tdButtonExclude)
                    document.querySelector('#agendamentosCriados').append(tr)
                    
                    
                    
                    
                });
            }
            
        }
    })
}




