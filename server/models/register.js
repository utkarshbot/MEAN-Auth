const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const config = require('../database/config')

const userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    username:{
        type:String,
        lowercase:true
    },  
    age:{
        type:Number,
    },
    phone:{
        type:Number,
    },
    photoUrl:{
        type:String
    }
    
})

const User = module.exports = mongoose.model('User',userSchema)

module.exports.getUserById = function(id,callback){
    User.findById(id,callback)
}

module.exports.getUserByUserEmail = function(email,callback){
    const query = {email:email}
    User.findOne(query,callback)
}

module.exports.addUser = function(newUser,callback){
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(newUser.password,salt,(err,hash)=>{
            if(err)
                throw err
            newUser.password = hash
            newUser.save(callback)
        })
    })
}

module.exports.comparePassword = function(userPassword,hash,callback){
    bcrypt.compare(userPassword,hash,(err,isMatch)=>{
        if(err)
            throw err
        callback(null,isMatch)
    })
}

module.exports.updatePassword = function(password,callback){
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt,(err,hash)=>{
            if(err)
                throw err
            callback(null,hash)
        })
    })
}
