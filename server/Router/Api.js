import express from "express";


const router=express.Router()
router.get('/api',function(req,res){
    res.json({
        status:"success",
        message:"db connection successfull"
    })
})

export default router