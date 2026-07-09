import express from "express";
import { register,login } from "../App/Controllers/authController.js";


const router=express.Router()
router.get('/api',function(req,res){
    res.json({
        status:"success",
        message:"db connection successfull"
    })
})
router.post('/register',register)
router.post('/login',login)

export default router