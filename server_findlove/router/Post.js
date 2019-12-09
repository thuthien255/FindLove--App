const express           = require('express')
const router            = express.Router()
const { uploadMulter }  = require('../helper/multer')
const { POST_MODEL }    = require('../model/Post.model')
const path              = require('path')
const fs                = require('fs')
const { USER_MODEL }    = require('../model/User.model')
const { verifyToken }   = require('../helper/middlewareToken')
const { verifyJWT }     = require('../helper/jwt')
const mongoose = require('mongoose')
const id="5dde1586b164f61eb016c365"
var listpost = [{}]

router.route('/addpost')
    // lấy ra list bài viết
    .get(verifyToken,async(req,res)=>{ 
        const token = await verifyJWT(req.token)
        if(token.error){
            res.status(405).json({message:'Token Không Đúng'})
        }else{
            listpost = await POST_MODEL.aggregate(
                [
                    { 
                        "$project" : {
                            "_id" : Object, 
                            "posts" : "$$ROOT"
                        }
                    }, 
                    { 
                        "$lookup" : {
                            "localField" : "posts.idUser", 
                            "from" : "users", 
                            "foreignField" : "_id", 
                            "as" : "users"
                        }
                    }, 
                    { 
                        "$unwind" : {
                            "path" : "$users"
                        }
                    }
                ]
            );
        }
        res.json({listpost})
    })
    // Thêm bài viết
    .post(verifyToken,uploadMulter.single('img'), async(req,res)=>{ 
        const token = await verifyJWT(req.token)
        if(token.error){
            res.status(405).json({message:'Token Không Đúng'})
        }else{
            const { id }     = token.data
            const { status } = req.body 
            const  img       = req.file 
            if(!status && !img)
                res.json({message:'Chưa có thông tin'})
            else if(!img){ 
                const post = new POST_MODEL({ status:status, img:'', idUser:id, file:'' })
                const postsave = await post.save()
                listpost = await POST_MODEL.find({})
                res.json({ listpost })
            }else{ 
                const { mimetype } = img
                const post = new POST_MODEL({status:status, img:img.originalname, idUser:id, file:mimetype})
                const postsave = await post.save()
                listpost = await POST_MODEL.find({})
                res.json({ listpost })
            }
        }
    })

router.route('/deletepost/:idpost')
    .get(verifyToken,async(req,res)=>{
        const token = await verifyJWT(req.token)
        if(token.error){
            res.status(405).json({message:'Token không đúng'})
        }else{
            let listpost
            const { id }          = token.data
            const userIsLoginning = await USER_MODEL.findOne({_id:id})
            const { idpost }      = req.params 
            const  postRemove     = await POST_MODEL.findOne({_id:idpost})
            if(postRemove.idUser == id){
                if(!postRemove.img || userIsLoginning.avata == postRemove.img || userIsLoginning.coverImg == postRemove.img){
                    const listPostAfterRemove = await POST_MODEL.deleteOne({_id:idpost})
                    listpost = await POST_MODEL.find({})
                }else{
                    const imgOfPostRemove = postRemove.img 
                    var listPostAfterRemove = await POST_MODEL.deleteOne({_id:idpost}) 
                    const pathOfImgOfPostRemove = path.resolve(__dirname,`../storeImg/${imgOfPostRemove}`) 
                    fs.unlink(pathOfImgOfPostRemove,(error, message)=>{  
                        if(error) res.json({error:true, message:'Lỗi Không Thể Xóa Ảnh'})
                    })
                    listpost = await POST_MODEL.find({})
                }
            }else{
                return res.status(500).json({message:'bạn không có quyền xóa Bài viết này'})
            }
            res.json({listpost})
        }
    })
      
exports.POST = router