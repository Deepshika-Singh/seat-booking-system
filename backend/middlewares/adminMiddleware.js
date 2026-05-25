import  User from "../models/User.js";

export const isAdmin =(req,res,next)=>{
  const user = req.user;
  if (!user) {
    return res.status(401).json({
      status: false,
      message: "Login required"
    });
  }
  if(user.role!=='admin'){
    return res.status(403).json({
      status:false,
      message :"Only admin can access this resource"
    });
  }
  next();
}