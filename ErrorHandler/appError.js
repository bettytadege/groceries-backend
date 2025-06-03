class AppError extends Error{
    constructor(stausCode,message){
        super(message)
        this.stausCode=stausCode 
        this.status=`${stausCode}`.startsWith('4') ?'fail':'error'
        this.isOperational=true
        Error.captureStackTrace(this, this.constructor);
    }
}
module.exports=AppError