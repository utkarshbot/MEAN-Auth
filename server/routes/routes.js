const express =require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const passport = require('passport')
const config = require('../database/config')
const User = require('../models/register')
const Resume = require('../models/resume') 
const nodemailer = require('nodemailer')
const {google} = require('googleapis')


const CLIENT_ID = '90134197976-6ipmig730424rf3qadpq5d0nvlugmggb.apps.googleusercontent.com'
const CLIENT_SECRET = '3-tN1efodGH8tU9Rf0FPdKVW'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//04PhvAsSXhKa2CgYIARAAGAQSNwF-L9IrhIf9za5uq5qrsjde5bgqdQ64L9QsopR4XfpDLVMMP_oqvQXn3fSErfg1L5vyloNiROA'

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URI)
oAuth2Client.setCredentials({refresh_token:REFRESH_TOKEN})


async function sendMail(userEmail,link){
    try {
        const accessToken = await oAuth2Client.getAccessToken()
        const transport = nodemailer.createTransport({
            service:'gmail',
            auth:{
                type:'OAUTH2',
                user:'utkarsh.11802819@gmail.com',
                clientId:CLIENT_ID,
                clientSecret:CLIENT_SECRET,
                refreshToken:REFRESH_TOKEN,
                accessToken:accessToken
            }
        })

        const mailOptions = {
            from: 'EASY RESUME <utkarsh.11802819@gmail.com>',
            to: userEmail,
            subject: 'Password Reset Link',
            text:'Reset your Account Password, link is valid for only 15 minutes.',
            html:`<h3>Reset your Account Password, link is valid for only 15 minutes.</h3></br>Click <a href=${link}>Here</a> to reset your password.`
        }

        const result = await transport.sendMail(mailOptions)
        console.log(result)
        return result

    } catch (error) {
        console.log(error.message)
    }
}



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

router.post('/generateResume',async(req,res,next)=>{
    const newResume = new Resume({
         _id:req.body.id,
         name : req.body.resumeForm.name,
         email : req.body.resumeForm.email,
         phone : req.body.resumeForm.phone,
         address : req.body.resumeForm.address,
         role : req.body.resumeForm.role,
         languages : req.body.resumeForm.languages,
         highschool: req.body.resumeForm.highschool,
         intermediate: req.body.resumeForm.intermediate,
         graduation: req.body.resumeForm.graduation,
         highmarks: req.body.resumeForm.highmarks,
         intermarks: req.body.resumeForm.intermarks,
         graduationmarks: req.body.resumeForm.graduationmarks,
         skills : req.body.resumeForm.skills,
         linkdin : req.body.resumeForm.linkdin,
         github : req.body.resumeForm.github,
         instagram : req.body.resumeForm.instagram,
         objective : req.body.resumeForm.objective,
         hobbies : req.body.resumeForm.hobbies
    })
    const saved = await newResume.save()
    if(saved){
        res.json({success:true,message:'Resume created'})
    }else{
        res.json({success:false,message:'not created'})
    }
})
router.get('/getresume:id',async(req,res,next)=>{
    const _id = req.params.id
    const resumeData = await Resume.findById({_id})
    if(resumeData){
        res.json({success:true,resumeData:resumeData})
    }else{
        res.json({success:false,resumeData:null})
    }
})

router.post('/update-resume:id',async(req,res,next)=>{
    const _id = req.params.id
    const name = req.body.name
    const email = req.body.email
    const phone = req.body.phone
    const address = req.body.address
    const role = req.body.role
    const languages = req.body.languages
    const highschool= req.body.highschool
    const intermediate= req.body.intermediate
    const graduation= req.body.graduation
    const highmarks= req.body.highmarks
    const intermarks= req.body.intermarks
    const graduationmarks= req.body.graduationmarks
    const skills = req.body.skills
    const linkdin = req.body.linkdin
    const github = req.body.github
    const instagram = req.body.instagram
    const objective = req.body.objective
    const hobbies = req.body.hobbies
    const updated = await Resume.findByIdAndUpdate(
        {_id},
        {
            name,email,phone,address,role,languages,
            highschool,highmarks,intermarks,intermediate,
            graduation,graduationmarks,skills,linkdin,github,
            instagram,objective,hobbies
        }
    )
    if(updated){
        res.json({success:true})
    }else{
        res.json({success:false})

    }
})

//forgot-password

router.post('/forgot-password',async(req,res,next)=>{
   const email = req.body.email
   const ifMatch = await User.findOne({email})
   if(ifMatch){
       const secret = config.reset + ifMatch.password
       const payload = {
           id : ifMatch._id,
           email : ifMatch.email
        }
        const token = jwt.sign(payload,secret,{expiresIn:'15m'})
        const link = `http://meanstack-auth.herokuapp.com/reset-password/${ifMatch._id}/${token}`
        const ifSend = await sendMail(email,link)
        if(ifSend){
            res.json({success:true})
        }else{
            res.json({success:false})
        }
        console.log(link)
   }else{
       res.json({success:false})
   }
})
router.get('/reset-password/:id/:token',async(req,res,next)=>{
    const {id,token} = req.params
    try {
        const checkId = await User.findById({_id:id})
        if(checkId){
            const secret = config.reset + checkId.password  
            try {
                const payload = jwt.verify(token,secret)
                if(payload){
                    res.json({success:true})
                }
            }   catch (error) {
                    res.json({success:false})
                    }   
                }
            }
    catch (error) {
        res.json({success:false})
    }
})

router.post('/reset-password/:id',async(req,res,next)=>{
    const _id = req.params.id
    let password = req.body.password

    try {
        User.updatePassword(password,async(err,hash)=>{
            if(err){
                res.json({success:false})
            }
            if(hash){
                const updated = await User.findByIdAndUpdate({_id},{password:hash})
                if(updated){
                    res.json({success:true})
                }
            }
            
        })
    } catch (error) {
        console.log(error.message)
        res.json({success:false})
    }
})

module.exports = router