import express from "express";
import { register,login } from "../App/Controllers/authController.js";
import *as ProductController from '../App/Controllers/productController.js'
import authMiddleware from './../App/Middlewares/authMiddleware.js';
import adminMiddleware from "../App/Middlewares/adminMiddleware.js";
import *as OrderController from "../App/Controllers/orderController.js";
import { uploader } from "../App/Controllers/uploadController.js";
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });



const router=express.Router()
//login
router.post('/register',register)
router.post('/login',login)

//product
router.get('/products/flash-deails',ProductController.getFlashDeals)
router.get('/products',ProductController.getProducts)
router.get('/product/:id',ProductController.getProduct)
//product with middlewares add
router.post('/product',authMiddleware,adminMiddleware,ProductController.addProduct)
router.put('/product/:id',authMiddleware,adminMiddleware,ProductController.updateProduct)
router.delete('/product/:id',authMiddleware,adminMiddleware,ProductController.deleteProduct)
//product with upload
router.post('/upload', upload.single('myFile'), uploader);

//order apis
router.post('/createorder',authMiddleware,OrderController.CreateOrder)
router.get('/getuserorders',authMiddleware,OrderController.GetOrders)
router.get('/getuserorder/:id',authMiddleware,OrderController.GetOrder)
router.put('/updateorder/:id',authMiddleware,adminMiddleware,OrderController.updateOrderStatus)
router.get('/getallorder',authMiddleware,adminMiddleware,OrderController.getAllOrders)
router.get('/getorderlocation/:id',adminMiddleware,OrderController.getOrderLocation)
export default router