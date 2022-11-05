import moment from "moment"

export function serializeParamsForInsertAgendamento(data, hora) {
    let date = moment(data, "DD/MM/YYYY").format("YYYY-MM-DD")
    return {
        data: date,
        horario: hora
    }
}

export function serializeParamsForSendAgendamentoToClient(data){
    data.forEach(agendamento => {
        agendamento.data_agendamentos = moment(agendamento.data_agendamentos,"YYYY-MM-DD").format("DD/MM/YYYY")
        const hour = agendamento.hora.split(':')[0]
        const minutes = agendamento.hora.split(':')[1]
        agendamento.hora = `${hour}:${minutes}`
    });
    return data
}