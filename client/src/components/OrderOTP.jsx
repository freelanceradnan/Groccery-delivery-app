import { KeyRoundIcon } from "lucide-react";

export default function OrderOTP({ order }) {
  const otpString = order?.deliveryOtp ? String(order.deliveryOtp) : "";
  const showOtp =
    Boolean(otpString) &&
    ["Assigned", "Packed", "Out for Delivery"].includes(order?.status || "");

  if (!showOtp) return null;

  return (
    <div className="bg-gradient-to-r from-[#2c4733] to-[#2c4733] rounded-2xl p-6 text-white shadow-lg w-full">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <KeyRoundIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-white">Delivery OTP</h3>
          <p className="text-xs text-white/80">
            Share this with your delivery partner
          </p>
        </div>
      </div>
      
      <div className="flex gap-2 mt-2">
        {otpString.split("").map((digit, i) => (
          <div
            key={`${i}-${digit}`}
            className="w-11 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl font-mono font-bold tracking-wider text-white"
          >
            {digit}
          </div>
        ))}
      </div>
    </div>
  );
}