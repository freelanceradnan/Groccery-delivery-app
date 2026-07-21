import { useEffect, useState } from "react";
import { PackageIcon, NavigationIcon } from "lucide-react";
import OtpModal from "../components/OtpModal";
import CancelModal from "../components/CancelModal";
import DeliveryOrderCard from "../components/DeliveryOrderCard";
import Loading from "../components/Loading";
import { dummyDashboardOrdersData } from "../assets/assets";
import { useDeliveryPartnerOrderQuery, useOrderStatusDeliveryUpdateMutation } from "../Feature/ApiSlice";

export default function DeliveryDashboard() {
    const {data:allOrder}=useDeliveryPartnerOrderQuery()
    const [updateStatus]=useOrderStatusDeliveryUpdateMutation()
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState("active");
    const [tracking, setTracking] = useState(false);

    // OTP modal
    const [otpModal, setOtpModal] = useState(null);
    const [otp, setOtp] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Cancel modal
    const [cancelModal, setCancelModal] = useState(null);
    const [cancelReason, setCancelReason] = useState("");

    const fetchOrders = async () => {
        setLoading(true);
        setOrders(allOrder);
        setLoading(false);
    };

    useEffect(() => {
        fetchOrders();
    }, [allOrder]);

    const handleUpdateStatus = async (orderId, status) => {
       
        try {
            const response=updateStatus({id:orderId,status:status})
            // console.log(response)
        } catch (error) {
            
        }
    };

    const handleComplete = async () => {
        if (!otpModal || !otp) return;
        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
            setOtpModal(null);
            setOtp("");
        }, 1000);
    };

    const handleCancel = async () => {
        if (!cancelModal) return;
        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
            setCancelModal(null);
            setCancelReason("");
        }, 1000);
    };

    return (
        <div className="space-y-6">
            {/* Tabs + Tracking toggle */}
            <div className="flex items-center gap-2 flex-wrap">
                {["active", "completed"].map((t) => (
                    <button 
                        key={t} 
                        onClick={() => setTab(t)} 
                        className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                            tab === t 
                                ? "bg-blue-500 text-white" 
                                : "bg-white text-zinc-600 hover:bg-[#FAF8F5] border border-[#E0DDD8]"
                        }`}
                    >
                        {t === "active" ? "Active" : "Completed"}
                    </button>
                ))}
                {/* <div className="ml-auto">
                    <button 
                        onClick={() => setTracking((prev) => !prev)} 
                        className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors flex items-center gap-1.5 ${
                            tracking 
                                ? "bg-green-600 text-white" 
                                : "bg-white text-zinc-600 border border-app-border hover:bg-app-cream"
                        }`}
                    >
                        <NavigationIcon className={`w-3.5 h-3.5 ${tracking ? "animate-pulse" : ""}`} />
                        {tracking ? "Sharing Location" : "Share Location"}
                    </button>
                </div> */}
            </div>

            {/* Orders */}
            {loading ? (
                <Loading />
            ) : orders?.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-app-border">
                    <PackageIcon className="size-12 text-app-border mx-auto mb-3" />
                    <p className="text-lg font-semibold text-zinc-900 mb-1">No {tab} deliveries</p>
                    <p className="text-sm text-zinc-500">
                        {tab === "active" ? "You'll see new assignments here" : "Completed deliveries will appear here"}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders?.map((order) => (
                        <DeliveryOrderCard 
                            key={order._id} 
                            order={order} 
                            tab={tab} 
                            handleUpdateStatus={handleUpdateStatus} 
                            setOtpModal={setOtpModal} 
                            setCancelModal={setCancelModal} 
                        />
                    ))}
                </div>
            )}

            {/* OTP Modal */}
            {otpModal && (
                <OtpModal 
                    setOtpModal={setOtpModal} 
                    otp={otp} 
                    setOtp={setOtp} 
                    handleComplete={handleComplete} 
                    submitting={submitting} 
                />
            )}
            
            {/* Cancel Modal */}
            {cancelModal && (
                <CancelModal 
                    setCancelModal={setCancelModal} 
                    cancelReason={cancelReason} 
                    setCancelReason={setCancelReason} 
                    handleCancel={handleCancel} 
                    submitting={submitting} 
                />
            )}
        </div>
    );
}