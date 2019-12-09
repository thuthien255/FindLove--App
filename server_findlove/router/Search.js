const express = require('express')
const router  = express.Router()
const { USER_MODEL } = require('../model/User.model')
const { verifyToken } = require('../helper/middlewareToken')
const { verifyJWT } = require('../helper/jwt')
const { MOREINFO_MODEL } = require('../model/MoreInfo.model')


router.route('/search')
    .post(verifyToken,async(req,res)=>{
        const token = await verifyJWT(req.token)
        if(token.error){
            res.sendStatus(405).json({message:'Token Không đúng'})
        }else{
            const { height, school, age, homeTown, gender } =req.body

            const customerHeight = height.split(' ')
            let minHeight = customerHeight[0]
            let maxHeight = customerHeight[customerHeight.length-1]
            let convertAge = Number(age)
            let convertMinHeight = Number(minHeight)
            let convertMaxHeight = Number(maxHeight)
            if(minHeight == '<'){
                convertMinHeight = 1.3
            }else if(minHeight == '>'){
                convertMinHeight = convertMaxHeight
                convertMaxHeight = 2.1
            }
            console.log(school,convertAge,homeTown,gender,convertMinHeight,convertMaxHeight)
            const { id } = token.data
            const listUser = await USER_MODEL.aggregate(
                [
                    { 
                        "$project" : {
                            "_id" : Object, 
                            "users" : "$$ROOT"
                        }
                    }, 
                    { 
                        "$lookup" : {
                            "localField" : "users._id", 
                            "from" : "moreinfos", 
                            "foreignField" : "idUser", 
                            "as" : "moreinfos"
                        }
                    }, 
                    { 
                        "$unwind" : {
                            "path" : "$moreinfos", 
                        }
                    }, 
                    { 
                        "$match" : {
                            "$and" : [
                                {
                                    "moreinfos.school" : school
                                }, 
                                {
                                    "moreinfos.age" : convertAge
                                }, 
                                {
                                    "moreinfos.homeTown" : homeTown
                                }, 
                                {
                                    "users.gender" : gender
                                }, 
                                {
                                    "moreinfos.height" : {
                                        "$gt" : convertMinHeight
                                    }
                                }, 
                                {
                                    "moreinfos.height" : {
                                        "$lt" : convertMaxHeight
                                    }
                                },
                                {
                                    "users._id" : {
                                        "$ne" : id
                                    }
                                }      
                            ]
                        }
                    }
                ]
            );
            
            res.json({listUser})
        }
    })
exports.SEARCH = router