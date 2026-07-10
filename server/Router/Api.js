import express from "express";
import { register,login } from "../App/Controllers/authController.js";
import *as ProductController from '../App/Controllers/productController.js'

const router=express.Router()
//login
router.post('/register',register)
router.post('/login',login)

//product
router.get('/products/flash-deails',ProductController.getFlashDeals)
router.get('/products',ProductController.getProducts)
router.get('/product/:id',ProductController.getProduct)
export default router