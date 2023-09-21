import mongoose from "mongoose";

// Define Mongoose schema
const userSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    //     otpExpiration: {
    //     type: Date,
    //     required: true,
    // },
    });
  // Define Mongoose model
    const User = mongoose.model('User', userSchema);

    export default User