import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import generateToken from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password} = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password,
    });

    const token = generateToken(user);

    res.cookie("token", token, {
      // httpOnly: true,
      // secure: true,
      // sameSite: "strict",
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "Signup successful",
      user,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Signup failed",
      error: error.message,
    });
  }
};

export const login = async (req ,res)=>{
  try{
  const {email,password}= req.body;
  const user = await User.findOne({email}).select("+password");
  if(!user){
    return res.status(404).json({
      success: false,
      message:"User not found"
    });
  }
  const isPasswordValid = await bcrypt.compare(password,user.password);
  if(!isPasswordValid){
    return res.status(401).json({
      success:false,
      message: "Invalid password"
    })
  }
  const token = generateToken(user);
  user.password = undefined;
  res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });
    console.log(res.data);
  return res.status(200).json({
    success:true,
    message: "Login successful",
    user,
    token
  })
}catch(error){
  return res.status(500).json({
    success:false,
    message:"Login failed",
    error: error.message
  })
}
};


export const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

export const getMe = async(req,res)=>{
  try{
    const user = req.user;
    const userDetails = await User.findById(user.userId).select("-password");
    if(!userDetails){
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    return res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      user: userDetails
    });
  }catch(error){
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user details",
      error: error.message
    });
  }
};
