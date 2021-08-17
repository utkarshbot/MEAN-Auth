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
        required:true
    },
    password:{
        type:String,
        required:true
    },
    username:{
        type:String,
        unique:true,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    
})

const User = module.exports = mongoose.model('User',userSchema)

module.exports.getUserById = function(id,callback){
    User.findById(id,callback)
}

module.exports.getUserByUsername = function(username,callback){
    const query = {username:username}
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
