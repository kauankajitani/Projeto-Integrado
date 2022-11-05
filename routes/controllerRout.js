import express from 'express'
import path from 'path';
import { setMd5 } from '../src/util/globalFunctions.js';
import { serializeParamsForSendAgendamentoToClient, serializeParamsForInsertAgendamento } from '../src/models/serialize.js'
import { queryUserBusiness,deleteAgendamento, queryAgendamentos, querySelectUsers, queryInsertUsers, queryUniqueEmp, createAgendamento, queryEmps, queryHorasForDay, queryAgendamentosBusiness } from '../src/models/entity/database.js';
import { sendSucessEmail } from '../src/util/globalFunctions.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router()

//-----GET FILES-----\\

router.get('/style.css', function (req, res) {
    res.sendFile('./styles/style.css', { root: path.join(__dirname, '../src/public') });
})

router.get('/login.css', function (req, res) {
    res.sendFile('./styles/login.css', { root: path.join(__dirname, '../src/public') });
})

router.get('/logo.jpg', function (req, res) {
    res.sendFile('./imagens/LOGO_2.png', { root: path.join(__dirname, '../src/public') });
})

router.get('/agendamentos.css', function (req, res) {
    res.sendFile('./styles/agendamentos.css', { root: path.join(__dirname, '../src/public') });
})

router.get('/fundologin.jpeg', function (req, res) {
    res.sendFile('./imagens/fundologin.jpeg', { root: path.join(__dirname, '../src/public') });
})

router.get('/equipe.jpg', function (req, res) {
    res.sendFile('./imagens/equipe.jpg', { root: path.join(__dirname, '../src/public') });
})

router.get('/pqdoprojeto.jpg', function (req, res) {
    res.sendFile('./imagens/pqdoprojeto.jpg', { root: path.join(__dirname, '../src/public') });
})

router.get('/ideia.jpg', function (req, res) {
    res.sendFile('./imagens/ideia.jpg', { root: path.join(__dirname, '../src/public') });
})

router.get('/pessoa.jpg', function (req, res) {
    res.sendFile('./imagens/pessoa.jpg', { root: path.join(__dirname, '../src/public') });
})

router.get('/login.js', function (req, res) {
    res.sendFile('./js/login.js', { root: path.join(__dirname, '../src/public') });
})

router.get('/register.js', function (req, res) {
    res.sendFile('./js/register.js', { root: path.join(__dirname, '../src/public') });
})

router.get('/agendamentos.js', function (req, res) {
    res.sendFile('./agendamentos.js', { root: path.join(__dirname, '../src/public/js') });
})

router.get('/ajuda.css', function (req, res) {
    res.sendFile('./styles/ajuda.css', { root: path.join(__dirname, '../src/public') });
})

router.get('/business.css', function (req, res) {
    res.sendFile('./styles/business.css', { root: path.join(__dirname, '../src/public') });
})

router.get('/logoenterprise.png', function (req, res) {
    res.sendFile('./imagens/logoenterprise.png', { root: path.join(__dirname, '../src/public') });
})

router.get('/backgroundenterprise.png', function (req, res) {
    res.sendFile('./imagens/backgroundenterprise.png', { root: path.join(__dirname, '../src/public') });
})

router.get('/business.js', function (req, res) {
    res.sendFile('./js/business.js', { root: path.join(__dirname, '../src/public') });
})

//-----GET-----\\

router.get('/agendamentos', function (req, res) {
    if(req.cookies.userData){
        res.sendFile('./marcacao/agendamentos.html', { root: path.join(__dirname, '../src/public') });
    }else{
        res.redirect('/login')
    }
})

router.get('/ajuda', function (req, res) {
    res.sendFile('./marcacao/ajuda.html', { root: path.join(__dirname, '../src/public') });
})

router.get('/consulta-empresas', function (req, res) {
    queryEmps((emps) => {
        const serializeEmps = []
        emps.forEach(element => {
            serializeEmps.push({ "empresa": `${element.nome.toUpperCase()}`, "cnpj": `${String(element.cnpj)}` })
        });
        res.send(serializeEmps)

    })
})

router.get('/consulta-agendamentos', function (req, res) {
    const token = req.cookies.userData
    queryAgendamentos(token, (result) => {
        result = serializeParamsForSendAgendamentoToClient(result)
        res.send(result)
    })
})

router.get('/consulta-agendamentos-business', function (req, res) {
    const token =  req.cookies.empData
    console.log('Cu')
    queryAgendamentosBusiness(token, (result) => {
        result = serializeParamsForSendAgendamentoToClient(result)
        res.send(result)
    })
})

router.get('/register', function (req, res) {
    res.sendFile('./marcacao/register.html', { root: path.join(__dirname, '../src/public') })
})

router.get('/', function (req, res) {
    res.sendFile('./marcacao/index.html', { root: path.join(__dirname, '../src/public') });

})

router.get('/login', function (req, res) {
    res.sendFile('./marcacao/login.html', { root: path.join(__dirname, '../src/public') })
})

router.get('/sobre', function (req, res) {
    res.sendFile('./marcacao/sobre.html', { root: path.join(__dirname, '../src/public') })
})

router.get('/business', function (req, res) {
    res.sendFile('./marcacao/business.html', { root: path.join(__dirname, '../src/public') })
})

router.get('/home-business',function(req,res){
    if(req.cookies.empData){
        res.sendFile('./marcacao/home_business.html', { root: path.join(__dirname, '../src/public') });
    }else{
        res.redirect('/business')
    }
})

//-----POST-----\\

router.post('/register', function (req, res) {
    querySelectUsers(req.body['email'], 0, 0, (result1) => {
        if (result1.exist) {
            res.send(false)
        } else {
            querySelectUsers(0, req.body['cpf'], 0, (result2) => {
                if (result2.exist) {
                    res.send(false)
                } else {
                    const infos = `${req.body['nome']}${req.body['email']}${req.body['senha']}${req.body['cpf']}`
                    const token = setMd5(infos)
                    queryInsertUsers(req.body['nome'], req.body['email'], req.body['senha'], req.body['cpf'], token)
                    res.send(true)
                }
            })

        }
    })


})

router.post('/login', function (req, res) {
    querySelectUsers(req.body['email'], 0, 0, function (result) {
        if (result.exist && result.password === req.body['senha']) {
            delete result.email, result.password
            res.cookie("userData", result.token, { expire: 600000 + Date.now() });
            res.redirect('/agendamentos')
        } else {
            res.send(false)
        }
    })
})

router.post('/novo-agendamento', function (req, res) {
    const { data, horario } = serializeParamsForInsertAgendamento(req.body['data'], req.body['horario'])
    queryUniqueEmp(req.body.empresa, (result) => {
        if (result.id_empresas != false) {
            createAgendamento(Number(result.id_empresas), req.cookies.userData, data, horario, (bool) => {
                if (bool === true) {
                    querySelectUsers(0, 0, req.cookies.userData, (result2) => {
                        let infoUser = {}
                        infoUser.email = result2.email
                        infoUser.nome = result2.name
                        infoUser.data_agendamento = req.body['data']
                        infoUser.hora = horario
                        sendSucessEmail(infoUser)
                    })
                    res.send(true)
                } else {
                    res.send(false)
                }
            })
        } else {
            res.send(false)
        }


    })
})

router.post('/unique-emp', function (req, res) {
    queryUniqueEmp(req.body.empresa, (result) => {
        res.send(result)
    })
})

router.post('/consulta-horas', function (req, res) {
    const { empresa } = req.body
    const { data } = req.body
    queryHorasForDay(data, empresa, (result) => {
        if (result) {
            const horarios = []
            for (let i = 0; i < result.length; i++) {
                let hora = result[i].hora.split(':')
                horarios.push(`${hora[0]}:${hora[1]}`)
            }
            res.send(horarios)
        } else {
            res.send('Todos os horários disponiveis')
        }

    })
})

router.post('/consulta-usuarios', function (req, res) {
    const cpf = req.body['cpf']
    const email = req.body['email']
    let obj = {}
    querySelectUsers(0, cpf, 0, (result) => {
        obj.cpf = result.exist
        querySelectUsers(email, 0, 0, (result) => {
            obj.email = result.exist
            res.send(obj)
        })

    })
})

router.post('/delete-agendamento', function (req, res) {
    const { id } = req.body
    deleteAgendamento(id, (result) => {
        if (result) {
            res.send(true)
        } else {
            res.send(false)
        }
    })
})

router.post('/login-business', function (req, res) {
    let {cnpj,senha} = req.body
    cnpj = cnpj.replace('-','').replace('.','').replace('/','')
    cnpj = cnpj.replace('.','')
    if(cnpj && senha){
        queryUserBusiness(cnpj,(result)=>{
            if(result){
                if(result.senha === senha){
                    res.cookie("empData", result.token, { expire: 600000 + Date.now() })
                    res.redirect('/home-business')
                }
            }
        })
    }
    
})

export default router

