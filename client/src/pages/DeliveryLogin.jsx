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
    const isPrevLogin=localStorage.getItem('token')
    if(isPrevLogin){
        localStorage.removeItem('token')
        localStorage.removeItem('auth_user')
    }

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
       <div className="min-h-screen w-full flex flex-col lg:flex-row bg-app-cream">
  
  <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center min-h-screen bg-green-900 overflow-hidden">
    <img
      src={heroSectionData.hero_image}
      alt="Hero background"
      className="absolute inset-0 w-full h-full object-cover object-center opacity-40"
    />
    <div className="relative z-10 text-center px-8 xl:px-12 max-w-lg mx-auto">
      <h2 className="text-3xl xl:text-4xl font-semibold text-white mb-4">
        Delivery Partner Portal
      </h2>
      <p className="text-white/80 font-serif text-lg xl:text-xl leading-relaxed">
        Manage your deliveries and keep customers happy.
      </p>
    </div>
  </div>

  {/* Right Side Form */}
  <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-12 py-10 min-h-screen">
    <div className="w-full max-w-md mx-auto">
      {/* Header & Logo */}
      <div className="text-center mb-8">
        <Link to="/" className="inline-flex items-center justify-center gap-2 mb-4 group">
          <img src={assets.favicon} alt="Supacart logo" className="h-10 w-10 object-contain" />
          <span className="text-2xl font-bold text-app-green">Supacart</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-semibold text-app-green mb-2">
          Delivery Partner Login
        </h1>
        <p className="text-sm text-app-text-light">
          Sign in to manage your deliveries
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
        <div>
          <label className="block text-sm font-medium text-app-green mb-1.5">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
            placeholder="partner@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-app-green mb-1.5">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 active:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  </div>
</div>
    );
}