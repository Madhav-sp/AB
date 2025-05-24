
import app from "./app.js";
import connectDB from "./db/db.js";
import dotenv from "dotenv";


dotenv.config();




connectDB().then(()=>{
    app.listen(process.env.PORT || 3000 , ()=>{
        console.log("server is running !")
    })
    app.on("error", (error)=>{
        console.error(error);
        throw error
    })
}).catch((error)=>{
    console.log(error);
})



/*
import express from "express";
const app=express();

(async ()=>{
    try {
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
       app.on("error",(error)=>{
        console.log("ERRR:",error);
        throw error
       })
       app.listen(process.env.PORT,()=>{
        console.log(`app is listening at port ${process.env.PORT}`)
       })
        
    } catch (error) {
        console.log(error)
        
    }
})()*/