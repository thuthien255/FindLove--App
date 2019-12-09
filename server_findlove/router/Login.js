const express         = require('express')
const router          = express.Router()
const { COMPAREPASS } = require('../helper/bcrypt')
const { USER_MODEL }  = require('../model/User.model')
const { sigJWT } = require('../helper/jwt')

router.route('/login')
    .get((req,res)=>{
        res.json({message:'Trang đăng nhập'})
    })

    .post(async(req,res)=>{
        const { email, password } = req.body
        let userLogin = await USER_MODEL.findOne({email:email}) 
        if(!userLogin)
            return res.json({message:'Tên Đăng Nhập Không Đúng'})
        else{
            const checkPassUserLogin = await COMPAREPASS(password,userLogin.password)
            if(checkPassUserLogin.error)
                return res.json({message:'PassWord Không Đúng'})
            else{
                const objUserLogin = {email:userLogin.email, id:userLogin._id} 
                const tokenOfUserLogin = await sigJWT(objUserLogin) 
                if(tokenOfUserLogin.error)
                    console.log(tokenOfUserLogin.message)
                else
                    res.json({name:userLogin.name, Email:userLogin.email, Token: tokenOfUserLogin.token}) 
            }
        }
    })

exports.LOGIN = router