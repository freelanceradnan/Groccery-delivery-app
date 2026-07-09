import express from "express";
import { LoginMyUser, RegisterMyUser } from "../Services/authServices.js";

//user register
export const register = async (req, res) => {
    const { name, email, password } = req.body;

    // ১. ফিল্ড ভ্যালিডেশন
    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide all fields' });
    }

    try {
 
        const result = await RegisterMyUser(name, email, password);

   
        if (!result.success) {
            return res.status(400).json({ 
                success: false, 
                message: result.message || "User creation failed" 
            });
        }

        return res.status(201).json({
            success: true,
            message: 'Register Success!',
            token: result.token, 
            user: result.user   
        });

    } catch (error) {
        console.error("Controller Registration Error:", error);
        
        return res.status(500).json({ 
            success: false, 
            message: error.message || "Internal server error" 
        });
    }
};
//login register
export const login=async(req,res)=>{
    const {email,password}=req.body
    
    try {
    if( !email || !password){
        return res.status(400).json({success:false,message:'Please Provides all fields'})
    }
    const result=await LoginMyUser(email,password)
    if(!result.success){
    return res.status(400).json({success:false,message:result.message||"Login Failed"})
    }
    return res.status(201).json({
            success: true,
            message: 'Register Success!',
            token: result.token, 
            user: result.user   
        });
    } catch (error) {
        res.status(400).json({success:false,message:error.message||"Login failed"})
    }
}