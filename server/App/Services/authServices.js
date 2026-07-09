import bcrypt from "bcryptjs";
import { User } from "../Models/DefaultModel.js";
import { TokenEncorde } from "../Utils/Token.js";

//check if admin
const getAdminStatus = (email) => {
  if (!email) return false;
  const adminEmails = process.env.ADMIN_EMAILS
    ? process.env.ADMIN_EMAILS.split(",").map((e) => e.trim().toLowerCase())
    : [];
  return adminEmails.includes(email.toLowerCase());
};

// register
export async function RegisterMyUser(name, email, password) {
  const normalizeEmail = email.toLowerCase();
  try {
    const isExistinguser = await User.findOne({ email: normalizeEmail });
    if (isExistinguser) {
      return { success: false, message: "User already exists! Please login" };
    }

    const passHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name,
      email: normalizeEmail,
      password: passHash,
    });

    if (!user) {
      return { success: false, message: "User creation failed" };
    }

    const token = await TokenEncorde(user._id);

    const userdata = user.toObject();
    delete userdata.password;

    userdata.isAdmin = getAdminStatus(userdata.email);

    return {
      success: true,
      message: "User registration successful",
      token: token,
      user: userdata,
    };
  } catch (error) {
    return { success: false, message: "Internal server error" };
  }
}
//login
export async function LoginMyUser(email,password) {
  const normalizeEmail = email.toLowerCase();
  try {
    const user = await User.findOne({ email: normalizeEmail });
     
    if (!user) {
      return { success: false, message: "User and password incorrect!" };
    }
  
    const passMatch = await bcrypt.compare(password, user.password);
   
    if (!passMatch) {
      return { success: false, message: "User and password incorrect!" };
    }
     console.log('d')
    const token = await TokenEncorde(user._id);
    if (!token) {
      return { success: false, message: "failed to decode token" };
    }

    const userdata = user.toObject();
    delete userdata.password;
    userdata.isAdmin = getAdminStatus(userdata.email);
    return {
      success: true,
      message: "User Login successful",
      token: token,
      user: userdata,
    };
  } catch (error) {
    return { success: false, message: "Internal server error" };
  }
}
