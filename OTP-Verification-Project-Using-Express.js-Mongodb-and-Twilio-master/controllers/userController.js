import twilio from "twilio";
import dotenv from "dotenv";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";

// Load environment variables
dotenv.config();

// Define Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function storeOTP(phoneNumber, otp) {
  try {
    const hashedOTP = await bcrypt.hash(otp, 10);
    console.log(hashedOTP);
    // const newUser = new User({
    //   phoneNumber,
    //   otp: hashedOTP,
    // });

    // let data = await newUser.save();

    const user = await User.findOneAndUpdate(
      { phoneNumber },
      { otp: hashedOTP },
      { upsert: true, new: true }
    );
    //console.log(data);

    console.log(user);
  } catch (err) {
    console.log(err);
  }
}

async function sendOTPviaSMS(phoneNumber, otp) {
  try {
    const message = await twilioClient.messages.create({
      body: `Your OTP is ${otp}`,
      from: "+1 8563353474",
      to: "+91" + phoneNumber,
    });
    console.log(`Sent OTP to ${"+91" + phoneNumber}: ${message.sid}`);

    return message;
  } catch (err) {
    console.error(`Error sending OTP to ${"+91" + phoneNumber}: ${err}`);
  }
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const registration = async (req, res) => {
  const { phoneNumber } = req.body;
  console.log(phoneNumber);

  const otp = generateOTP();

  try {
    await storeOTP(phoneNumber, otp);

    sendOTPviaSMS(phoneNumber, otp)
      .then(() => {
        // res.render('verify', { phoneNumber });
        res.status(200).json({ message: "OTP sent successfully" });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Failed to send OTP" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to store OTP" });
  }
};

export const verifyOTP = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  try {
    const document = await User.findOne({ phoneNumber });
    if (!document) {
      res.status(400).json({ error: "Phone number not found" });
      return;
    }

    const isMatch = await bcrypt.compare(otp, document.otp);

    if (isMatch) {
      res.status(200).json({ message: "OTP is valid" });
    } else {
      res.status(400).json({ error: "Invalid OTP" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
};

export const index = async (req, res) => {
  res.render("index.ejs");
};
