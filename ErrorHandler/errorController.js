

const sendErrDevelopment = (err, res) => {
    // In development, send full error details 
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,  
    });
  };
  
  const sendErrProduction = (err, res) => {
   //  in production 
    if (err.isOperational) {
      
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } 
    else {
      // Log the error for  debugging
      console.error('ERROR 💥:', err);
  
      // Send generic message 
      res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!',   });
    }
  };
  



module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrDevelopment(err,res)
  } 
  else if (process.env.NODE_ENV === "production") {
    sendErrProduction(err,res)
  }
};
