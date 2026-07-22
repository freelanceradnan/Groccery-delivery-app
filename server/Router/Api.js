import express from "express";
import { register,login } from "../App/Controllers/authController.js";
import *as ProductController from '../App/Controllers/productController.js'
import authMiddleware from './../App/Middlewares/authMiddleware.js';
import adminMiddleware from "../App/Middlewares/adminMiddleware.js";
import *as OrderController from "../App/Controllers/orderController.js";
import *as addressController from "../App/Controllers/addressController.js";
import *as adminController from "../App/Controllers/adminController.js";
import *as deliveryController from "../App/Controllers/deliveryPartner.js";
import *as forgetController from  '../App/Controllers/ForgetPassword.js'
import { uploader } from "../App/Controllers/uploadController.js";
import multer from 'multer';
import { createAddress, deleteAddress, getAddresses, updateAddress } from "../App/Controllers/addressController.js";
import { getAdminStates } from "../App/Controllers/adminController.js";
import deliveryAuth from "../App/Middlewares/deliveryMiddleware.js";
const upload = multer({ storage: multer.memoryStorage() });



const router=express.Router()


//default 
router.get('/',function(req,res){
res.status(200).json({'message':'Api is ok!'})
})
//login

router.post('/register',register)
router.post('/login',login)
//forgot password
router.post('/verifyemail',forgetController.VerifyEmail)
router.post('/veryotp',forgetController.VerifyOtp)
router.post('/changepassword',forgetController.ChangePassword)

//product
router.get('/products/flash-deails',ProductController.getFlashDeals)
router.get('/products',ProductController.getProducts)
router.get('/product/:id',ProductController.getProduct)
//product with middlewares add
router.post('/product',authMiddleware,adminMiddleware,ProductController.addProduct)
router.put('/product/:id',authMiddleware,adminMiddleware,ProductController.updateProduct)
router.delete('/product/:id',authMiddleware,adminMiddleware,ProductController.deleteProduct)
//product with upload
router.post('/upload', upload.single('image'), uploader);

//order apis
router.post('/createorder',authMiddleware,OrderController.CreateOrder)
router.get('/getuserorders',authMiddleware,OrderController.GetOrders)
router.get('/getuserorder/:id',authMiddleware,OrderController.GetOrder)
router.put('/updateorder/:id',authMiddleware,adminMiddleware,OrderController.updateOrderStatus)
router.get('/getallorder',authMiddleware,adminMiddleware,OrderController.getAllOrders)
router.get('/getorderlocation/:id',adminMiddleware,OrderController.getOrderLocation)

//address router
router.get('/getaddresses',authMiddleware,addressController.getAddresses)
router.post('/createaddress',authMiddleware,addressController.createAddress)
router.put('/updateaddress/:id',authMiddleware,addressController.updateAddress)
router.delete('/deleteaddress/:id',authMiddleware,addressController.deleteAddress)

//admin router
router.get('/stats',authMiddleware,adminMiddleware,adminController.getAdminStates)
router.get('/delivery-partners',authMiddleware,adminMiddleware,adminController.getDeliveryPartnersList)
router.post('/delivery-partners',authMiddleware,adminMiddleware,adminController.createDeliveryPartner)
router.put('/delivery-partners/:id',authMiddleware,adminMiddleware,adminController.updateDeliveryPartner)
router.put('/orders/:id/assign',authMiddleware,adminMiddleware,adminController.assignDeliveryPartner)
//delivery partner
router.post('/login/deliverypartner',deliveryController.loginDeliveryPartner)
router.get('/my-deliveries',deliveryAuth,deliveryController.getMyDeliveries)
router.get('/my-deliveries/:id',deliveryAuth,deliveryController.getDeliveryDetail)
router.put('/my-deliveries/:id/complete',deliveryAuth,deliveryController.completeDelivery)
router.put('/my-deliveries/:id/cancel',deliveryAuth,deliveryController.cancelDelivery)
router.put('/my-deliveries/:id',deliveryAuth,deliveryController.updateDeliveryStatus)
router.put('/my-deliveries/:id/location',deliveryAuth,deliveryController.updateLocation)
export default router