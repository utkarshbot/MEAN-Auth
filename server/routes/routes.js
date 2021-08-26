const express =require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const passport = require('passport')
const config = require('../database/config')
const User = require('../models/register')
const Resume = require('../models/resume') 



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




module.exports = router