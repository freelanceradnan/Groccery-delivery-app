import bcrypt from "bcryptjs";
import { User } from "../Models/DefaultModel.js";
import { EmailSent } from "../Utils/Emailsent.js";

//email verify
export const VerifyMyEmail = async (email) => {
  const normalizedEmail = email.toLowerCase();
  try {
    const isExists = await User.findOne({ email: normalizedEmail });
    if (!isExists) {
      return { success: false, message: "Account Not found!" };
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    isExists.otp = otp;
    await isExists.save();
    const emailsending = await EmailSent({
      email: isExists.email,
      sub: "Forget Password Verify",
      message: `Your onetime otp code is ${otp}`,
    });
    if (!emailsending.success) {
      return { success: false, message: emailsending.message };
    }
    return { success: true, message: "Your Otp Sent To Your Email Address!" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
//otp verify
export const VerifyMyOtp = async (email, otp) => {
  const normalizedEmail = email.toLowerCase();
  try {
    const isExists = await User.findOne({ email: normalizedEmail });
    if (!isExists) {
      return { success: false, message: "Invalid Email!" };
    }
    
    const currentUser=isExists.toObject()
  
    if (String(currentUser.otp) !== String(otp)) {
    return { success: false, message: "Invalid OTP code. Please try again!" };
}

      
     return { success: true, message: "Otp verification Success!" };
  } catch (error) {
     return { success: false, message: "Otp verification failed!" };
  }
};
//change password
export const ChangeMyPassword = async (email, otp,password) => {
  const normalizedEmail = email.toLowerCase();

  try {
    const isExists = await User.findOne({ email: normalizedEmail });
    if (!isExists) {
      return { success: false, message: "Invalid Email!" };
    }
    
    const currentUser=isExists.toObject()
  
    if (String(currentUser.otp) !== String(otp)) {
    return { success: false, message: "Invalid OTP code. Please try again!" };
}
    const hashedPassword = await bcrypt.hash(password, 10)
    const updateUser=await User.updateOne({email:normalizedEmail},{
        $set:{
            otp:'0',
            password:hashedPassword
        }
    })
     if (!updateUser) {
      return { success: false, message: "Failed to Change Password" };
    }
     return { success: true, message: "Password Change Success!" };
  } catch (error) {
     return { success: false, message: error.message };
  }
};