const path = require('path')
const cors = require('cors')
const express = require('express')
const passport = require('passport')
const mongoose = require('mongoose')
const routes = require('../routes/routes')
const config = require('../database/config')

const PORT = process.env.PORT || 5000

const app = express()

mongoose.connect(config.database,
    {
        useCreateIndex:true,
        useFindAndModify:false,
        useNewUrlParser:true,
        useUnifiedTopology:true
    })

mongoose.connection.on('connected',()=>{
    console.log('Connected to database')
})
mongoose.connection.on('error',()=>{
    console.log('Cannot connect to databse')
})

app.use(cors())

app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use(passport.initialize())
app.use(passport.session())

require('../database/passport')(passport)

app.use(express.static(path.join(__dirname,'../public')))

app.use('/users',routes)

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'../public/index.html'))
})

app.listen(PORT,()=>console.log(`Server Running on port ${PORT}`))