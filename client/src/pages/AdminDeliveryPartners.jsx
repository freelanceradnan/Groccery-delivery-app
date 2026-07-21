import { useEffect, useState } from "react";
import { PlusIcon, XIcon, TruckIcon, PhoneIcon, MailIcon } from "lucide-react";

import Loading from "../components/Loading";
import { dummyDeliveryPartnerData } from "../assets/assets";
import { useCreateDeliveryPartnerMutation, useGetAllDeliveryPartnerQuery, useUpdateDeliveryPartnerStatusMutation } from "../Feature/ApiSlice";
import toast from "react-hot-toast";

export default function AdminDeliveryPartners() {
    const {data:allParteners}=useGetAllDeliveryPartnerQuery()
    const [addPartner]=useCreateDeliveryPartnerMutation()
   const [updateDeliveryPartner]=useUpdateDeliveryPartnerStatusMutation()
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", vehicleType: "bike" });
  
    useEffect(() => {
      
    if(allParteners){
        setPartners(allParteners)
    }
    }, [allParteners]);

    const handleSubmit = async (e) => {
        e.preventDefault();
       try {
       const response=await addPartner(form).unwrap()
       if(response.success===true){
        toast.success('delivery Parner Crated Success!')
        setShowForm(false)
       }
       else{
        toast.error('failed to create delivery partner')
       }
       } catch (error) {
        toast.error('failed to create delivery partner')
       }
    };

    const toggleActive = async (id, isActive) => {
        
       try {
        const response=await updateDeliveryPartner({id:id,status:isActive})
        if(response.data.success===true){
        toast.success('Delivery Partner status updated!')
        }
        else{
            toast.error('Delivery Partner status update failed!')
        }
       } catch (error) {
         toast.error('Delivery Partner status update failed!')
       }
    };

    if (loading) return <Loading />;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold text-zinc-900">Delivery Partners</h1>
                <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-[#1c3323] text-white text-sm font-semibold rounded-xl hover:bg-[#2D4A35] transition-colors flex items-center gap-2">
                    <PlusIcon className="size-4" /> Add Partner
                </button>
            </div>

            {/* Partners Grid */}
            {partners.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-app-border">
                    <TruckIcon className="size-12 text-app-border mx-auto mb-3" />
                    <p className="text-lg font-semibold text-zinc-900 mb-1">No delivery partners</p>
                    <p className="text-sm text-zinc-500">Onboard your first partner to get started</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {partners.map((p) => (
                        <div key={p._id} className="bg-white rounded-2xl border border-app-border p-5 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-[#032E15] flex items-center justify-center">
                                        <span className="text-white font-semibold text-sm text-center">{p.name.charAt(0)}</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-zinc-900 text-sm">{p.name}</p>
                                        <p className="text-xs text-zinc-500 capitalize">{p.vehicleType}</p>
                                    </div>
                                </div>
                                <span className={`px-2.5 py-1 text-[10px] font-semibold rounded-full ${p.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                    {p.isActive ? "Active" : "Inactive"}
                                </span>
                            </div>
                            <div className="space-y-1.5 text-sm text-zinc-600">
                                <p className="flex items-center gap-2"><MailIcon className="w-3.5 h-3.5 text-zinc-400" /> {p.email}</p>
                                <p className="flex items-center gap-2"><PhoneIcon className="w-3.5 h-3.5 text-zinc-400" /> {p.phone}</p>
                            </div>
                            <button onClick={() => toggleActive(p._id, !p.isActive)} className={`w-full py-2 text-xs font-medium rounded-lg transition-colors ${p.isActive ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}>
                                {p.isActive ? "Deactivate" : "Activate"}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Partner Modal */}
            {showForm && (
               <>
  {/* Backdrop Overlay */}
  <div 
    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity" 
    onClick={() => setShowForm(false)} 
  />

 
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
    <form 
      onSubmit={handleSubmit} 
      className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl relative z-10 my-auto animate-fade-in"
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-app-green">Onboard Delivery Partner</h2>
        <button 
          type="button" 
          onClick={() => setShowForm(false)} 
          className="p-2 hover:bg-app-cream rounded-lg transition-colors"
        >
          <XIcon className="size-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-app-green mb-1.5">Full Name</label>
          <input 
            type="text" 
            required 
            value={form.name} 
            onChange={(e) => setForm({ ...form, name: e.target.value })} 
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-app-border focus:border-app-green outline-none" 
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-app-green mb-1.5">Email</label>
            <input 
              type="email" 
              required 
              value={form.email} 
              onChange={(e) => setForm({ ...form, email: e.target.value })} 
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-app-border focus:border-app-green outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-app-green mb-1.5">Password</label>
            <input 
              type="password" 
              required 
              minLength={6} 
              value={form.password} 
              onChange={(e) => setForm({ ...form, password: e.target.value })} 
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-app-border focus:border-app-green outline-none" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-app-green mb-1.5">Phone</label>
            <input 
              type="text" 
              required 
              value={form.phone} 
              onChange={(e) => setForm({ ...form, phone: e.target.value })} 
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-app-border focus:border-app-green outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-app-green mb-1.5">Vehicle Type</label>
            <select 
              value={form.vehicleType} 
              onChange={(e) => setForm({ ...form, vehicleType: e.target.value })} 
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-app-border focus:border-app-green outline-none bg-white"
            >
              <option value="bike">Bike</option>
              <option value="scooter">Scooter</option>
              <option value="car">Car</option>
            </select>
          </div>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={saving} 
        className="mt-6 w-full py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-app-green-light transition-colors disabled:opacity-60"
      >
        {saving ? "Creating..." : "Create Partner"}
      </button>
    </form>
  </div>
</>
            )}
        </div>
    );
}