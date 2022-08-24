import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema=new Schema({
    email:String,
    password:String,
    role:String,
})

export const userdetails = mongoose.model('User_collection',userSchema);