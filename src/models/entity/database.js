import mysql from 'mysql'

const conector = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ''
})

export function querySelectUsers(email=0,cpf=0,token=0,callback) {
    try {
        conector.query('USE FACULDADE', function (err, result) {
            if (err) { console.log(err.message) }
        })
        if(email != 0){
            conector.query(`SELECT * FROM usuarios WHERE email = '${email}'`, function (err, result) {
                if (err) { console.log(err.message) }
                if (result[0]) {
                    callback({
                        exist: true,
                        password: result[0].senha,
                        userId: result[0].id_usuarios,
                        name: result[0].nome,
                        email: result[0].email,
                        token:result[0].token
                    })
                } else {
                    callback({
                        exist: false,
                        password: ''
                    })
        
                }
            })
        }
        else if(cpf !=0){
            conector.query(`SELECT * FROM usuarios WHERE cpf = '${cpf}'`, function (err, result) {
                if (err) { console.log(err.message) }
                if (result[0]) {
                    callback({
                        exist: true,
                        password: result[0].senha,
                        userId: result[0].id_usuarios,
                        name: result[0].nome,
                        email: result[0].email,
                        token:result[0].token
                    })
                } else {
                    callback({
                        exist: false,
                        password: ''
                    })
        
                }
            })
        }else if(token !=0 ){
            conector.query(`SELECT * FROM usuarios WHERE token = '${token}'`, function (err, result) {
                if (err) { console.log(err.message) }
                if (result[0]) {
                    callback({
                        exist: true,
                        password: result[0].senha,
                        userId: result[0].id_usuarios,
                        name: result[0].nome,
                        email: result[0].email,
                        token:result[0].token
                    })
                } else {
                    callback({
                        exist: false,
                        password: ''
                    })
        
                }
            })
        }
        
        
    } catch (err) {
        console.log(err.message)
        callback(false)
    }
}

export function queryInsertUsers(nome, email, senha, cpf,token) {
    try {
        conector.query('USE FACULDADE', function (err, result) {
            if (err) throw err
        })
        conector.query(`INSERT INTO usuarios (nome,email,senha,cpf,token) values('${nome}' , '${email}' , '${senha}', '${cpf}', '${token}')`, function (err, result) {
            if (err) throw err
        })
    } catch (err) {
        console.log(err.message)
        return false
    }
}

export function createAgendamento(empresa, token_u,data, hora, callback) {
    conector.query('USE FACULDADE', function (err, result) {
        if (err){
            callback(false)
            throw err 
        } 
    })
    conector.query(`INSERT INTO agendamentos (id_empresas,token_usuarios,token_empresas,data_agendamentos,hora) values('${empresa}' , '${token_u}', (SELECT token from empresas where id_empresas = '${empresa}'), '${data}', '${hora}')`, function (err, result) {
        if (err){
            callback(false)
        }else{
            callback(true)
        }
        
    })
}

export function queryUniqueEmp(empresa,callback){
    conector.query('USE FACULDADE', function (err, result) {
        if (err) throw err
    })
    conector.query(`SELECT id_empresas FROM empresas WHERE cnpj = '${empresa}'`, function (err, result) {
        if (result.length > 0) {
            callback(result[0])
        }else{
            callback(false)
        }
    })
}

export function queryAgendamentos(token, callback) {
    conector.query('USE FACULDADE', function (err, result) {
        if (err) throw err
    })
    conector.query(`SELECT ag.id_agendamentos,emp.nome,emp.cnpj,ag.data_agendamentos,ag.hora FROM agendamentos as ag inner join empresas as emp ON ag.id_empresas = emp.id_empresas where ag.token_usuarios = '${token}'`, function (err, result) {
        if (err) throw err
        if (result.length > 0) {
            callback(result)
        }
    })
}

export function queryHorasForDay(day, empresa,callback) {
    conector.query('USE FACULDADE', function (err, result) {
        if (err) throw err
    })
    conector.query(`SELECT hora FROM agendamentos WHERE data_agendamentos = '${day}' and id_empresas = '${empresa}' `, function (err, result) {
        if (err) throw err

        if (result.length > 0) {
            callback(result)
        } else {
            callback(false)
        }

    })
}

export function queryEmps(callback){
    conector.query('USE FACULDADE', function (err, result) {
        if (err) throw err
    })
    conector.query(`SELECT * FROM empresas `, function (err, result) {
        if (err) throw err

        if (result.length > 0) {
            callback(result)
        } else {
            callback(false)
        }

    })

    
}

export function deleteAgendamento(id,callback){
    conector.query('USE FACULDADE', function (err, result) {
        if (err){
            callback(false)
            throw err 
        } 
    })
    
    conector.query(`delete FROM agendamentos where id_agendamentos = ${id}`,function(err,result){
        if (err){
            callback(false)
            throw err 
        }else if(!err){
            callback(true)
        }
    })
}

export function queryUserBusiness(cnpj,callback){
    conector.query('USE FACULDADE', function (err, result) {
        if (err){
            callback(false)
            throw err 
        } 
    })

    conector.query(`SELECT * FROM empresas WHERE cnpj = '${cnpj}'`,function(err,result){
        if (err){
            callback(false)
            throw err 
        }

        if(result.length > 0){
            callback(result[0])
        }else{
            callback(false)
        }
    })
}

export function queryAgendamentosBusiness(token, callback) {
    conector.query('USE FACULDADE', function (err, result) {
        if (err){
            callback(false)
            throw err 
        } 
    })
    conector.query(`SELECT ag.id_agendamentos,us.nome,us.cpf,ag.data_agendamentos,ag.hora FROM agendamentos as ag inner join usuarios as us ON ag.token_usuarios = us.token where ag.token_empresas = '${token}';`, function (err, result) {
        if (err) throw err
        if (result.length > 0) {
            callback(result)
        }
    })
}