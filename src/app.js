import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { router } from './routes/user.router.js'

const app = express()

app.use(cors())
app.use(express.json({limit: '16kb'}))
app.use(express.urlencoded({extended: true ,limit: '16kb'}))
app.use(express.static('public'))
app.use(cookieParser())


// Routes
app.use("/api/v1/users", router)
export {app}