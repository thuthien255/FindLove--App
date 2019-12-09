const express = require('express')
const router  = express.Router()
const session = require('../index')
const { COMPAREPASS } = require('../helper/bcrypt')
const { sigJWT,verifyJWT } = require('../helper/jwt')
const { USER_MODEL } =require('../model/User.model')

router.route('/logintest')
    .get((req,res)=>{
        res.render('loginTestAddFriend')
    })
    .post(async(req,res)=>{
        const { email, password } = req.body
        let userLogin = await USER_MODEL.findOne({email:email}) 
        if(!userLogin)
            return res.redirect('/findlove/logintest')
        else{
            const checkPassUserLogin = await COMPAREPASS(password,userLogin.password)
            if(checkPassUserLogin.error)
                return res.redirect('/findlove/logintest')
            else{
                const objUserLogin = {email:userLogin.email, id:userLogin._id} 
                const tokenOfUserLogin = await sigJWT(objUserLogin) 
                if(tokenOfUserLogin.error)
                    console.log(tokenOfUserLogin.message)
                else{
                    session.token = tokenOfUserLogin
                    res.redirect('/findlove/addfriendtest') 
                }
            }
        }
    })

exports.LOGINTESTADDFRIEND = router