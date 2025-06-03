const AppError = require("../ErrorHandler/appError");
const catchAsync = require("../ErrorHandler/catchAsync");
const authUtils = require("../utils/authUtils");

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // console.log(req.headers)
  // console.log(req.headers.authorization)

  //check the path ...allow for signup and login with out token
  console.log(req.path)
  if (req.path === "/api/users/signup" || req.path === "/api/users/login") {
    next();
    return;
  } 
  else {
    //check authorization
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // get the provided token
       token = req.headers.authorization.split(" ")[1];
      // console.log(token)
    } else {
      next(new AppError(" token not provided in the autorization", 401));
    }
  }
  console.log('token',token)

  const verified = await authUtils.getUserId(token);
//   console.log("verified user");
//   console.log(verfied);
req.id=verified.id
req.role=verified.role
res.locals.id = verified.id

// console.log(req.id,req.role)

});
