
module.exports=catchAsync=(fn)=>{
    return (req,res,next)=>{// express call when this route requested
        fn(req,res,next).catch(next)//err
    }
}