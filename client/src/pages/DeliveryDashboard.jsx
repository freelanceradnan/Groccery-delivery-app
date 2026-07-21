import { useEffect, useState } from "react";
import { PackageIcon, NavigationIcon } from "lucide-react";
import OtpModal from "../components/OtpModal";
import CancelModal from "../components/CancelModal";
import DeliveryOrderCard from "../components/DeliveryOrderCard";
import Loading from "../components/Loading";
import { dummyDashboardOrdersData } from "../assets/assets";
import {
    useCancelDeliveryOrderMutation,
  useCompleteDeliveryOrderMutation,
  useDeliveryPartnerOrderQuery,
  useOrderStatusDeliveryUpdateMutation,
} from "../Feature/ApiSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function DeliveryDashboard() {
    const navigate=useNavigate()
  const [completeDelivery] = useCompleteDeliveryOrderMutation();
  const [cancelDelivery]=useCancelDeliveryOrderMutation()
  const { data: allOrder } = useDeliveryPartnerOrderQuery();
  const [updateStatus] = useOrderStatusDeliveryUpdateMutation();
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
  const [deliveryId, setDeliveryId] = useState(null);
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
      const response = updateStatus({ id: orderId, status: status });

      toast.success(`Status change to ${status}`);
    } catch (error) {
      toast.error(`Status change failed please contact support team`);
    }
  };

  const handleComplete = async () => {
    if (!otpModal || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      const response = await completeDelivery({ id: otpModal, otp }).unwrap();

      if (response.success === true) {
        toast.success(response.message || "Delivery completed successfully!");
        setOtpModal(null);
        setOtp("");
      }
    } catch (error) {
      console.error("Delivery Complete Error:", error);
      toast.error(error?.data?.message || "Failed to verify OTP. Try again!");
    }
  };

  const handleCancel = async () => {
    if (!cancelModal) return;
    setSubmitting(true);
    try {
    const response=await cancelDelivery({id:cancelModal,reason:cancelReason})
    if(response.data.success===true){
    toast.success('Delivery Cancelled Success!')
    setCancelReason(null)
    setCancelModal(false)
     setSubmitting(false)
    }
    else{
         toast.error('Delivery Cancelled failed!')
      setCancelReason(null)
    setCancelModal(false)
     setSubmitting(false)
    }
   
    } catch (error) {
         toast.error('Delivery Cancelled failed!')
         setCancelReason(null)
    setCancelModal(false)
     setSubmitting(false)
         
    }
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
          <p className="text-lg font-semibold text-zinc-900 mb-1">
            No {tab} deliveries
          </p>
          <p className="text-sm text-zinc-500">
            {tab === "active"
              ? "You'll see new assignments here"
              : "Completed deliveries will appear here"}
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
              setDeliveryId={setDeliveryId}
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
