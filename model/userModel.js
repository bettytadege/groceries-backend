const  validator  = require('validator')
const  bcrypt  = require('bcrypt')
const mongoose=require('mongoose')

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "first name is required"],
    },
    lastName: {
      type: String,
      required: [true, "last name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowecase: true,
      validate: [validator.isEmail, "please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "please provide password "],
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      default: "customer",
    },
    profileImage: {
      type: String,
    },
 
    // confirmPassword:{
    //   type: String,
    //   required: [true, "please confirm your password "],
    //   validate:function(el){
    //     return el === this.password
    //   },
    //   message:'password not matched'
    // },
    phoneNumber: {
      type: Number,
      // required:[true,'phone number is required']
    },
    address: {
      type: String,
      // required:[true,'phone number is required']
    },
  },
  { timestamps: true  , id: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },}
);
userSchema.pre('save',async function(next){
  if(!this.isModified('password')){
    next()
  }
  this.password=await bcrypt.hash(this.password, 12)
  this.confirmPassword=undefined
  next()
})
userSchema.methods.correctPassword = async function (password, hashPassword) {
  return await bcrypt.compare(password, hashPassword);
};
const userModel=mongoose.model('Users',userSchema)
module.exports=userModel