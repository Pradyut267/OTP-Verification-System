import express from 'express';
const router = express.Router();
import  {  registration, verifyOTP } from '../controllers/userController.js'

// Public Routes


 router.post('/login', registration)
 router.post('/verify', verifyOTP)


export default router