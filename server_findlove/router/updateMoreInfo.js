const express = require('express')
const router  = express.Router()
const { MOREINFO_MODEL } = require('../model/MoreInfo.model')
const { verifyToken } = require('../helper/middlewareToken')
const { verifyJWT } = require('../helper/jwt')

router.route('/updatemoreinfo')
    .post(verifyToken,async(req,res)=>{
        const token = await verifyJWT(req.token)
        if(token.error){
            res.sendStatus({message:'Token không đúng'})
        }else{
            const { id } = token.data
            const { introduce, height, dress, weight, homeTown, school, job, salary, hobby, viewOfLove, kindOfLover } = req.body
            const infoupdate     = await MOREINFO_MODEL.updateOne({idUser:id},{$set:{introduce:introduce, height:height, dress:dress, weight:weight, homeTown:homeTown, school:school, job:job, salary:salary, hobby:hobby, viewOfLove:viewOfLove, kindOfLover:kindOfLover, idUser:id }})
            const moreInfoOfUser = await MOREINFO_MODEL.findOne({idUser:id})
            res.json({moreInfoOfUser})   
        }
    })

exports.UPDATEMOREINFO = router