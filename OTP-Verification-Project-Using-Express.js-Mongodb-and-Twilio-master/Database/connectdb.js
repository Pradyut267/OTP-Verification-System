import mongoose from "mongoose";

const connectDB = async(DATABASE_URL) =>{
    try{
        mongoose.set('strictQuery', false);
        await mongoose.connect(DATABASE_URL);
        console.log("Database Connected Successfully..");
       
    }
    catch(err){
        console.log(err);
    }
};

export default connectDB;
