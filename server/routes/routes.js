const express =require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const passport = require('passport')
const config = require('../database/config')
const User = require('../models/register')

router.post('/register',(req,res,next)=>{
    const user = new User({
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        username:req.body.username,
        email:req.body.email,
        phone:req.body.phone,
        age:req.body.age,
        password:req.body.password,
    })
    User.addUser(user,(err,callback)=>{
        if(err)
            res.json({success:false,massage:'not registerd'})
        else{
            const token = jwt.sign({user},config.secret,{expiresIn:604800})
            res.json({success:true,massage:'user registerd',token:'JWT '+token,user:user})

        }
    })
})

router.post('/authanticate',(req,res,next)=>{
    const username = req.body.username
    const password = req.body.password
    User.getUserByUsername(username,(err,user)=>{
        if(err)
            throw err
        if(!user)
            return res.json({success:false,message:'User not found'})
        User.comparePassword(password,user.password,(err,isMatch)=>{
            if(err)
                throw err
            if(isMatch){
                const token = jwt.sign({user},config.secret,{expiresIn:604800})
                res.json({
                    success:true,
                    token:'JWT '+token,
                    user:{
                        id:user._id,
                        username:user.username,
                        firstname:user.firstname,
                        lastname:user.lastname,
                        phone:user.phone,
                        email:user.email,
                        age:user.age
                    }
                })
            }else{
                res.json({sucess:false,message:'Wrong Password'})
            }
        })
    })
})

router.post('/profile/update',(req,res)=>{
    const _id = req.body._id
    const username = req.body.username
    const firstname = req.body.firstname
    const lastname = req.body.lastname
    const email = req.body.email
    const phone = req.body.phone
    
    User.findOneAndUpdate({_id},{username,firstname,lastname,email,phone},(err,user)=>{
        if(err){
            res.json({success:false})
        }else{
            const token = jwt.sign({user},config.secret,{expiresIn:604800})
                res.json({
                    success:true,
                    token:'JWT '+token,
                    user:{
                        id:_id,
                        username:username,
                        firstname:firstname,
                        lastname:lastname,
                        phone:phone,
                        email:email,
                        
                    }
                })
        }
    })
})

router.get('/profile',passport.authenticate('jwt',{session:false}),(req,res,next)=>{
    res.json({success:true,user:req.user})
})

module.exports = router