const express = require('express')
const router  = express.Router()
const { HASH_PASSWORD }  = require('../helper/bcrypt')
const { USER_MODEL }     = require('../model/User.model')
const { MOREINFO_MODEL } = require('../model/MoreInfo.model')
const moment = require('moment')

router.route('/registration')
    .get((req,res)=>{
        res.json({message: 'Trang Đăng Ký Thành Viên'})
    })

    .post(async(req,res)=>{
        const { name, gender, birthday, email, password } =req.body
        let errorName, errorPassword, errorEmail, errorGender, errorBirthday

        if(!name)
            errorName = 'UserName là bắt buộc'
        else if (name.length < 10)
            errorName = 'UserName phải có ít nhất 10 kí tự'
        else if(name.length > 40) 
            errorName = 'UserName chỉ có nhiều nhất là 40 kí tự'
        
        const accountExists = await USER_MODEL.findOne({name:name, password:password})
        if(!password)
            errorPassword = 'Password là bắt buộc'
        else if(password.length < 8)
            errorPassword = 'Password phải có ít nhất 8 kí tự'
        else if(password.length > 25)
            errorPassword = 'Password chỉ có nhiều nhất là 25 kí tự'
        else if(accountExists)
            errorPassWord = 'Tài khoản đã tồn tại'
        
        const emailExists = await USER_MODEL.findOne({email:email})
        if(!email)
            errorEmail = 'Email là bắt buộc'
        else if(email.indexOf('@')===-1)
            errorEmail = 'Email không hợp lệ'
        else if(emailExists)
            errorEmail = 'Email đã tồn tại'

         if(!gender)
            errorGender = 'Chưa chọn giới tính'

        if(!birthday)
            errorBirthday = 'Chưa nhập ngày sinh'

        if(errorName || errorPassword || errorEmail || errorGender || errorBirthday )
            res.json({errorName:errorName, errorPassword:errorPassword, errorEmail:errorEmail, errorGender:errorGender, errorBirthday: errorBirthday}) 
        else {
            const hashpass = await HASH_PASSWORD(password)
            const userRegis = new USER_MODEL({name:name, password:hashpass.data, email:email, gender:gender, birthday:birthday})
            const saveuserregis   = await userRegis.save()
            
            const formartBirthday = moment(birthday,'YYYY-MM-DD')
            const getDate         = moment()
            const age             = getDate.diff(formartBirthday,'year')
            const moreinfo      = new MOREINFO_MODEL({introduce:'', height:'', dress:'', weight:'', homeTown:'', school:'', job:'', salary:'', hobby:'', viewOfLove:'', kindOfLover:'', idUser:saveuserregis._id, age:age})
            const moreinfosave  = await moreinfo.save()
            res.json({message:'Thêm thành công'})     
        }
    })

exports.REGISTRATION = router