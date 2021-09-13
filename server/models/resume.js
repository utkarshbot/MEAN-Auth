const mongoose = require('mongoose')

const resumeDbSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
        
    },
    phone:{
        type:String,
        
    },
    address:{
        type:String,
    },
    role:{
        type:String,
    },
    languages:{
        type:String,
    },
    education:{
        type:Array,
    },
    skills:{
        type:String,
    },
    linkdin:{
        type:String,
    },
    github:{
        type:String,
    },
    instagram:{
        type:String,
    },
    objective:{
        type:String,
    },
    hobbies:{
        type:String,
    },
    certificates:{
        type:Array
    }

},{collection:'resume'})

const Resume = module.exports =  mongoose.model('resume',resumeDbSchema)

