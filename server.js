const app = require("./app");
const dotenv=require('dotenv')
dotenv.config({path:'./.env'})
const PORT=process.env.PORT || 5000


app.listen(PORT,()=>{
    console.log(`server is running ${PORT}`)
})