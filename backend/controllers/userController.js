import validator from "validator";
import bcrypt, { hash } from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import razorpay from "razorpay"


//api to register user

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ success: false, message: "missing details" });
    }
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "enter valid email" });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "password should be at least 8 characters long",
      });
    }
    //hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };
    //_id
    const newUser = userModel(userData);
    const user = await newUser.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET );
    res.json({ success: true, message: "user created successfully", token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
//Api for user login

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "user does not exist" });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (isValidPassword) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "invalid password" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
//Api for user profile
const getProfile = async (req, res) => {
  try {
    const {userId} = req.body;
    const userData = await userModel.findById(userId).select("-password");
    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
//Api for user update profile
const updateProfile = async (req, res) => {
  try {
    const {  userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;
    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "data misssing" });
    }
    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    });
    if(imageFile)
    {
        //upload image to cloudinary
        const imageUpload=await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
        const imageURL=imageUpload.secure_url

        await userModel.findByIdAndUpdate(userId,{image:imageURL})
    }
    res.json({ success: true,message:"Profile updated"});
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//Api to book Appointment
const bookAppointment=async(req,res)=>{
  try {
    const {userId, docId,slotDate,slotTime}=req.body
    const docData=await doctorModel.findById(docId).select('-password')
    if(!docData.available){
      return res.json({success:false,message:'doctor not available'})}
      let slots_booked=docData.slots_booked

      //checking for slots availabilty
      if(slots_booked[slotDate]){
        if(slots_booked[slotDate].includes(slotTime))
        {
          return res.json({success:false,message:'slot already booked'})
        }
        else{
          //booking the slot
          slots_booked[slotDate].push(slotTime)

        }        
      }
      else{
          slots_booked[slotDate]=[]
          slots_booked[slotDate].push(slotTime)
      }
      const userData= await userModel.findById(userId).select('-password')
      delete docData.slots_booked
      const appoimtmentData={
        userId,
        docId,
        userData,
        docData,
        amount:docData.fees,
        slotDate,
        slotTime,
        date:Date.now(),
        // status: 'pending'  
     }
     const newAppointment=new appointmentModel(appoimtmentData)
     await newAppointment.save()

     //save new slots data in doctors data\
     await doctorModel.findByIdAndUpdate(docId,{slots_booked})
     res.json({success:true,message:'appointment booked'})
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

//Api to get user appointment for frontend my appointment page

const listAppointment=async(req,res)=>{
  try {
    const userId=req.body.userId
    const appointments=await appointmentModel.find({userId:userId})

    res.json({success:true,appointments})  
  }
  catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

//Api to cancel appointment
const cancelAppointment=async(req,res)=>{
    try {
      const{userId,appointmentId}=req.body
      const apppointmentData=await appointmentModel.findById(appointmentId)
      //verify appointment user
      if(apppointmentData.userId!==userId){
        return res.json({success:false,message:'you are not authorized to cancel this appointment'})
      }
      //update appointment status to cancelled
      await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})

      //releasing doctors slot
      const {docId,slotDate,slotTime}=apppointmentData
      const doctorData=await doctorModel.findById(docId)
      let slots_booked=doctorData.slots_booked
      slots_booked[slotDate]=slots_booked[slotDate].filter(e=>e!==slotTime)
      await doctorModel.findByIdAndUpdate(docId,{slots_booked})
      res.json({success:true,message:"Appointment Cancelled"})

      
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
}

const razorpayInstance=new razorpay({
  key_id:process.env.RAZORPAY_KEY_ID,
  key_secret:process.env.RAZORPAY_KEY_SECRET
})
//Api to make payment of appointment using razorpay
const paymentRazorpay=async(req,res)=>{
  
   try {
        const {appointmentId}=req.body
        const appointmentData=await appointmentModel.findById(appointmentId)
        if(!appointmentData || appointmentData.cancelled)
        {
          return res.json({success:false,message:"Appointment Cancelled or not found"})
        }
        //creating option for razorpay payment
        const options = {
          amount: appointmentData.amount * 100, // amount is in paise
          currency:process.env.CURRENCY,
          receipt: appointmentId,
          };
        //creation of an order
        const order=await razorpayInstance.orders.create(options)
        res.json({success:true,order})
      } 
      catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
      }
}

//api to verify payment of razorpay
const verifyRazorpay=async(req,res)=>{
  try {
    const{razorpay_order_id}=req.body
    const orderInfo=await razorpayInstance.orders.fetch(razorpay_order_id)
    
    if(orderInfo.status==='paid'){
      await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment:true})
      res.json({success:true,message:"Payment Successful"})
    }
    else{
      res.json({success:false,message:"Payment Failed"})
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
    
  }
}

export { registerUser, loginUser, getProfile, updateProfile,bookAppointment,listAppointment,cancelAppointment,paymentRazorpay,verifyRazorpay};
