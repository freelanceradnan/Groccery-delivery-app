import { useState } from "react";
import { BikeIcon } from "lucide-react";
import { assets, heroSectionData } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { useDeliveryLoginMutation } from "../Feature/ApiSlice";
import toast from "react-hot-toast";

export default function DeliveryLogin() {
    const navigate=useNavigate()
    const [deliveryLogin]=useDeliveryLoginMutation()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
       try {
        const loginData={
        email,
        password
        }
        const response=await deliveryLogin(loginData).unwrap()
        if(response.success===true){
        localStorage.setItem('delivery_token',response.token)
        localStorage.setItem('delivery_user',JSON.stringify(response.partner))
        toast.success('Delivery Partener login success!')
        navigate('/delivery')
        }
        else{
            toast.error(response?.message||"failed to login!try again")
        }
       } catch (error) {
         toast.error(error?.data?.message||"failed to login!try again")
       }
    };

    return (
        <div className="min-h-screen flex items-center">
            {/* Left Side */}
            <div className="hidden lg:flex lg:w-1/2 bg-green-900 relative items-center justify-center min-h-screen">
                <img src={heroSectionData.hero_image} alt="" className="absolute inset-0 object-cover h-full bg-center opacity-40" />
                <div className="relative text-center px-12">
                    <h2 className="text-4xl font-semibold text-white mb-4">Delivery Partner Portal</h2>
                    <p className="text-white/60 font-serif text-xl max-w-sm mx-auto">Manage your deliveries and keep customers happy.</p>
                </div>
            </div>

            {/* Right Side Form */}
            <div className="flex-1 flex-center px-4 py-12 bg-app-cream">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div >
                            <Link to="/" className="flex items-center justify-center gap-2 mb-4">
                            <img src={assets.favicon} className="h-10 w-10"/>
                            <span className="text-2xl font-semibold text-app-green">Supacart</span>
                            </Link>
                        </div>
                        <h1 className="text-2xl font-semibold text-app-green mb-2">Delivery Partner Login</h1>
                        <p className="text-sm text-app-text-light">Sign in to manage your deliveries</p>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-app-green mb-1.5">Email</label>
                            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border not-focus:border-app-border text-sm transition-colors" placeholder="partner@example.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-app-green mb-1.5">Password</label>
                            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border not-focus:border-app-border text-sm transition-colors" placeholder="••••••••" />
                        </div>
                        <button type="submit" disabled={loading} className="w-full py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-500 transition-colors disabled:opacity-60">
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}