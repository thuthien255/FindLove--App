const verifyToken = (req,res,next)=>{
    const bearerHeader = req.headers['authorization']
    if(typeof bearerHeader !== 'undefined'){
        const bearer      = bearerHeader.split(' ')
        const bearerToken = bearer[1]
        req.token         = bearerToken
        next() 
    }else{
        res.status(405).json({message:'Không có token'})
    }
}

module.exports = {
    verifyToken
}