import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
    label: { type: String },      
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    isDefault: { type: Boolean, default: false },
    lat: { type: Number },
    lng: { type: Number }
}, { _id: true });

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    avatar: { type: String },
    addresses: [AddressSchema],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    otp:{type:String,default:'0'}
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    image: { type: String },
    category: { type: String },
    unit: { type: String },          
    stock: { type: Number, default: 0 }, 
    isOrganic: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 } 
}, { timestamps: true });
const OrderSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ], 
    shippingAddress: [AddressSchema], 
    paymentMethod: { type: String },
    subtotal: { type: Number },    
    deliveryFee: { type: Number }, 
    tax: { type: Number },          
    total: { type: Number },        
    status: { 
        type: String, 
        enum: [ "Placed",
    "Confirmed",
    "Assigned",
    "Packed",
    "Out for Delivery",
    "Delivered",
"Cancelled"
], 
        default: 'Placed' 
    },
    statusHistory: [
        {
            status: { type: String },
            timestamp: { type: Date, default: Date.now }
        }
    ],
    deliveryPartner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'DeliveryPartner',
        default: null
    }, 
    deliveryOtp: { type: String },
    liveLocation: {
        lat: { type: Number },
        lng: { type: Number }
    }, 
    isPaid: { type: Boolean, default: false }
}, { timestamps: true });

const DeliveryPartnerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    avatar: { type: String },
    vehiclesType: { type: String }, 
    isActive: { type: Boolean, default: false }
    
}, { timestamps: true });
export const User = mongoose.model('User', UserSchema);
export const Product = mongoose.model('Product', ProductSchema);
export const Order = mongoose.model('Order', OrderSchema);
export const DeliveryPartner = mongoose.model('DeliveryPartner', DeliveryPartnerSchema);
export const Address = mongoose.model('Address', AddressSchema);

