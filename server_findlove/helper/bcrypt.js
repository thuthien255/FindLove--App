
const bcrypt = require('bcrypt')


const hashPassWord = PassWord =>{
    return new Promise (resolve =>{
        bcrypt.genSalt(10,(error,salt)=>{
            if(error) return resolve({error: true, message: error.message})
            bcrypt.hash(PassWord,salt,(error,encrypted)=>{
                if(error) return resolve({error: true, message: error.message})
                return resolve({data:encrypted})
            })
        })
    })   
}


const comparePassWord = (passwordlogin, hashPassWord) =>{
    return new Promise(resolve=>{
        bcrypt.compare(passwordlogin, hashPassWord, (error, ismatch)=>{
            if(error) return resolve({error: true, message: error.message})
            if(!ismatch) return resolve({error: true})
            return resolve({error: false})
        })
    })
}
exports.COMPAREPASS = comparePassWord
exports.HASH_PASSWORD = hashPassWord