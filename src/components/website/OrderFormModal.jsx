"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function OrderFormModal({ onClose, onOrderPlaced }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    otp: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsOpen(true), 10);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if ((name === "mobile" || name === "otp") && !/^\d*$/.test(value)) return;
    setFormData({ ...formData, [name]: value });
  };

  const calculateTotal = () => {
    if (typeof window === "undefined") return 0;
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    return cart.reduce((sum, item) => sum + item.total, 0);
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile) {
      alert("Please fill all fields");
      return;
    }
    if (formData.mobile.length !== 10) {
      alert("Enter valid mobile number");
      return;
    }

    setIsSendingOtp(true);
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    setTimeout(() => {
      setGeneratedOtp(otp);
      setOtpSent(true);
      setIsSendingOtp(false);
      alert(`OTP: ${otp}`);
    }, 1000);
  };

  useEffect(() => {
    const handleRejection = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      if (cart.length > 0) {
        const rejectedOrder = {
          id: `KOT ${Math.floor(Math.random() * 1000)}`,
          status: "Rejected",
          statusColor: "bg-red-100 text-red-500",
          time: "Just now",
          items: cart.map(item => ({
            name: item.name,
            qty: item.qty,
            price: item.price,
            addon: item.addon,
            note: item.note
          })),
          showReorder: true,
          customerName: formData.name,
          customerMobile: formData.mobile,
          orderDate: new Date().toISOString(),
          totalAmount: calculateTotal()
        };

        const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
        localStorage.setItem("orders", JSON.stringify([rejectedOrder, ...existingOrders]));
        localStorage.removeItem("cart");

        window.dispatchEvent(new Event("cartUpdated"));
        window.dispatchEvent(new Event("orderPlaced"));

        handleClose();
        alert("Order rejected");
      }
    };

    window.addEventListener("orderRejected", handleRejection);
    return () => window.removeEventListener("orderRejected", handleRejection);
  }, [formData.name, formData.mobile]);

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (formData.otp === generatedOtp) {
      onOrderPlaced && onOrderPlaced();
      handleClose();
    } else {
      alert("Invalid OTP");
    }
  };

  const handleResendOtp = () => {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(otp);
    alert(`Resent OTP: ${otp}`);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => onClose(), 300);
  };

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && handleClose();
    window.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", esc);
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <>
      <div
        onClick={handleClose}
        className={`fixed inset-0 z-[80] transition-opacity duration-300 ${isOpen ? "bg-black/40" : "bg-black/0"
          }`}
      />

      <div className="fixed bottom-0 left-0 right-0 z-[90]">
        <div
          className={`relative bg-white rounded-t-2xl shadow-lg max-h-[70vh] flex flex-col transition-transform duration-300 ease-out ${isOpen ? 'translate-y-0' : 'translate-y-full'
            }`}
        >
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-30">
            <button
              onClick={handleClose}
              className="p-3 bg-black/70 text-white rounded-full shadow-lg backdrop-blur"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Customer Information</h2>
          </div>

          <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="p-6 space-y-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter Name"
                  className="w-full mt-1 border border-gray-200 px-4 py-3 rounded-lg focus:ring-2 focus:ring-orange-500 transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Mobile Number *</label>
                <div className="flex mt-1">
                  <div className="px-4 py-3 bg-gray-100 border border-gray-200 border-r-0 rounded-l-lg">
                    +91
                  </div>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    maxLength={10}
                    placeholder="Enter Mobile Number"
                    className="w-full border border-gray-200 px-4 py-3 rounded-r-lg focus:ring-2 focus:ring-orange-500 transition-all duration-200"
                    required
                  />
                </div>
              </div>
            </div>

            <div className={`transition-all duration-800 ease-in-out ${otpSent ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0 overflow-hidden'
              }`}>
              {otpSent && (
                <div className="space-y-3 animate-slideDown">
                  <div>
                    <label className="text-sm font-medium">Enter OTP *</label>
                    <input
                      type="text"
                      name="otp"
                      value={formData.otp}
                      onChange={handleChange}
                      maxLength={4}
                      placeholder="Enter OTP"
                      className="w-full mt-1 border border-gray-200 px-4 py-3 rounded-lg focus:ring-2 focus:ring-orange-500 transition-all duration-200"
                      required
                      autoFocus
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="w-full bg-gray-200 hover:bg-gray-300 py-3 rounded-lg transition-all duration-200 font-medium"
                    >
                      Resend OTP
                    </button>
                    <button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-all duration-200 font-medium"
                    >
                      Confirm Order
                    </button>
                  </div>
                </div>
              )}
            </div>

            {!otpSent && (
              <button
                type="submit"
                disabled={isSendingOtp}
                className={`w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-all duration-200 ${isSendingOtp ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
              >
                {isSendingOtp ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending OTP...</span>
                  </div>
                ) : (
                  'Send OTP'
                )}
              </button>
            )}
          </form>

          <div className="p-4 bg-gray-50 text-center">
            <p className="text-sm text-gray-600">
              By continuing, you agree to our Terms & Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
