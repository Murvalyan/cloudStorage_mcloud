require('dotenv').config()
const cookieParser = require('cookie-parser')
const express = require('express')
const authRoute = require('./routes/auth.route')
const errorMiddlewares = require('./middlewares/error.middlewares')

const app = new express()

app.use(express.json())
app.use(cookieParser())
app.use('/api', authRoute)
app.use(errorMiddlewares)


const start = () => {
    try {
        app.listen(process.env.S_PORT, () => {
            console.log('server started')
        })
    } catch (err) {
        console.log(err)
    }
}

start()