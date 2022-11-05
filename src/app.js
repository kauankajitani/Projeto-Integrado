import express from "express"
import cookieParser from 'cookie-parser'
import router from '../routes/controllerRout.js'
import bodyParser from 'body-parser'
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function App() {
    const app = express()
    
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.use(express.static(path.join('./public/')))
    app.use('/', router)
    return app
}
