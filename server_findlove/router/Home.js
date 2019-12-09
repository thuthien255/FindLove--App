const express = require('express')
const router  = express.Router()
const path    = require('path')
const fs      = require('fs')
const { uploadMulter }   = require('../helper/multer')
const { USER_MODEL }     = require('../model/User.model')
const { POST_MODEL }     = require('../model/Post.model')
const { MOREINFO_MODEL } = require('../model/MoreInfo.model')
const { verifyToken } = require('../helper/middlewareToken')
const { verifyJWT } = require('../helper/jwt')

router.route('/home')
    .get(verifyToken,async(req,res)=>{
        const token = await verifyJWT(req.token)
        if(token.error){
            res.sendStatus(500).json({message:'Token không đúng'})
        }else{
            const { id } = token.data
            const userIsLoginning     = await USER_MODEL.findOne({_id: id})
            const listpost            = await POST_MODEL.find({idUser: id}).sort({_id:-1})
            const info                = await MOREINFO_MODEL.findOne({idUser:id})
            res.json({userIsLoginning, listpost, info})
        } 
    })

// cập nhật ảnh bìa
router.route('/home/updateimgcover')
    .post(verifyToken,uploadMulter.single('updateImgCover'),async(req,res)=>{
        const token = await verifyJWT(req.token)
        if(token.error){
            res.sendStatus(500).json({message:'Token không đúng'})
        }else{
            const { id }            = token.data
            const updateImgCover    = req.file
            const userIsLoginning   = await USER_MODEL.findOne({_id:id})
            const { coverImg,name } = userIsLoginning
            if(!updateImgCover){
                res.redirect('/findlove/home')
            }else if(coverImg == "imgcover.jpg"){  // imgcover.jpg là ảnh bìa mặc đinh khi khởi tạo user
                const userAfterUpdateCoverimg = await USER_MODEL.updateOne({_id:id},{$set:{coverImg:updateImgCover.originalname}})
                const createPost              = new POST_MODEL({status:`${name} đã cập nhật ảnh bìa`, img:updateImgCover.originalname, idUser:id}) // tạo bài viết cập nhật ảnh bìa
                const createPostSave          = await createPost.save()
                res.redirect('/findlove/home')
            }else{
                const userAfterUpdateCoverimg = await USER_MODEL.updateOne({_id:id},{$set:{coverImg:updateImgCover.originalname}})
                const removePost              = await POST_MODEL.deleteOne({img:coverImg}) // xóa bài viết cập nhật ảnh bìa trước đó, do không thê hiển list ảnh của user, nên xóa luôn ảnh và bài viết của lần cập nhật trước
                const createPost              = new POST_MODEL({status:`${name} đã cập nhật ảnh bìa`, img:updateImgCover.originalname, idUser:id})
                const createPostSave          = await createPost.save()
                const pathOfImgCover = path.resolve(__dirname,`../storeImg/${coverImg}`) 
                fs.unlink(pathOfImgCover,(error, message)=>{ 
                    if(error) res.json({error:true, message:'Lỗi Không Thể Xóa Ảnh'})
                })
                res.redirect('/findlove/home')      
            }
        }
    })

// cập nhật ảnh đại diện
router.route('/home/updateavata')
    .post(verifyToken,uploadMulter.single('updateAvata'),async(req,res)=>{
        const token = await verifyJWT(req.token)
        if(token.error){
            res.sendStatus(500).json({message:'Token không đúng'})
        }else{
            const { id }          = token.data
            const updateAvata     = req.file
            const userIsLoginning = await USER_MODEL.findOne({_id:id})
            const { avata,name }  = userIsLoginning
            if(!updateAvata){
                res.redirect('/findlove/home')
            }else if(avata == "avatar.jpg"){  // avatar.jpg là ảnh đại diện mặc định khi khởi tạo user
                const userAfterUpdateavata    = await USER_MODEL.updateOne({_id:id},{$set:{avata:updateAvata.originalname}})
                const createPost              = new POST_MODEL({status:`${name} đã cập nhật ảnh bìa`, img:updateAvata.originalname, idUser:id})
                const createPostSave          = await createPost.save()
                res.redirect('/findlove/home')
            }else{
                const userAfterUpdateavata    = await USER_MODEL.updateOne({_id:id},{$set:{avata:updateAvata.originalname}})
                const removePost              = await POST_MODEL.deleteOne({img:avata})
                const createPost              = new POST_MODEL({status:`${name} đã cập nhật ảnh đại diện`, img:updateAvata.originalname, idUser:id})
                const createPostSave          = await createPost.save()
                const pathOfImgCover = path.resolve(__dirname,`../storeImg/${avata}`) 
                fs.unlink(pathOfImgCover,(error, message)=>{  
                    if(error) res.json({error:true, message:'Lỗi Không Thể Xóa Ảnh'})
                })
                res.redirect('/findlove/home')      
            }
        }
    })  

exports.HOME = router