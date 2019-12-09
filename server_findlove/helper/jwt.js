const jwt = require('jsonwebtoken')
const accessToken = process.env.accessTokenSerect || 'access_token_serect_of_app_fnidlove'

const sigJWT = object =>{
    return new Promise(resolve=>{
        try {
            jwt.sign(object, accessToken, (error,token)=>{
                if(error) return resolve({error:true, message:error.message})
                return resolve({error:false,token})
            })
        } catch (error) {
            return resolve({error:true, message:error.message})
        }
    })
}

const verifyJWT = token =>{
    return new Promise(resolve=>{
        try{
            jwt.verify(token,accessToken,(error,data)=>{
                if(error) return resolve({error:true, message:error.message})
                return resolve({error:false, data})
            })
        }catch(error){
            return resolve({error:true, message:error.message})
        }
    })
}
module.exports = {
    sigJWT, verifyJWT
}