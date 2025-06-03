const { error } = require("console");
const  mongoose  = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });
const DB=process.env.DATABASE

module.exports=DBCon=async()=>{
  try {
    await mongoose.connect(DB)
    console.log('database connected successfully')
  } catch (error) {
    console.log(error)
    console.log('connection not established')
  }
 
}