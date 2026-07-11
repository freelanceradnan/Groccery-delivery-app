import express from "express";
import { register,login } from "../App/Controllers/authController.js";
import *as ProductController from '../App/Controllers/productController.js'
import authMiddleware from './../App/Middlewares/authMiddleware.js';
import adminMiddleware from "../App/Middlewares/adminMiddleware.js";

const router=express.Router()
//login
router.post('/register',register)
router.post('/login',login)

//product
router.get('/products/flash-deails',ProductController.getFlashDeals)
router.get('/products',ProductController.getProducts)
router.get('/product/:id',ProductController.getProduct)
//product with middleware
router.post('/product',authMiddleware,adminMiddleware,ProductController.addProduct)
router.put('/product/:id',authMiddleware,adminMiddleware,ProductController.updateProduct)
router.delete('/product/:id',authMiddleware,adminMiddleware,ProductController.deleteProduct)
export default router