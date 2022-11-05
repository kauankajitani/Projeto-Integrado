import md5 from "md5";
import nodemailer from  "nodemailer";

export function setMd5(value) {
    
    return md5(value)
}

export function sendSucessEmail(infoUser){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'projetointegrado.facu@gmail.com',
          pass: 'gfjgbvxaihxozkqd'
        }
      });
    
      var mailOptions = {
        to: infoUser.email,
        subject: 'Confirmação de Agendamento',
        text: `Prezado ${infoUser.nome}, seu agendamento foi marcado para o dia ${infoUser.data_agendamento} às ${infoUser.hora}` 
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else if(info.response){
          console.log('Email sent to: ' + infoUser.email);
        }
      });
}