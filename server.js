import App from './src/app.js'
import moment from 'moment'

moment.locale('pt-br')

function createServer(){
    try{
        const app = App()

        app.listen(3000)
        console.log(`Server Runing Port: 3000`)
        console.log(`TimeZoneLocal: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`)
        console.log(`Date Start: ${new Date(new Date().valueOf() - (180 * 60000)).toJSON()}`)
    }catch(error){
        console.log(`Do not possible init server! Error: ${error.message}`)
    }

}

createServer()
