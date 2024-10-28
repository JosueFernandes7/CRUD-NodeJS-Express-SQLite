import userRouter from './routes/userRoutes.js'
import homeRouter from './routes/homeRoutes.js'
import express from 'express'

const app = express()

app.use(express.json())
app.use(express.urlencoded({
    extended: false
})) 

app.set('view engine', 'ejs')  
app.set('views', 'src/views')

app.get('/healthcheck', (req, res) => {
    res.send('OK')
})

app.get('/', (req, res) => res.redirect('/home'))
app.get('/home', homeRouter)
app.use('/users', userRouter)

app.listen(3000, () => console.log("Server iniciou na porta 3000"))


