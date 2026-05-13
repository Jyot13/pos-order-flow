"use client";

import { useState } from "react";

export default function OrderForm() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    otp: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.mobile) {
      alert("Please fill all fields");
      return;
    }

    // generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(otp);

    console.log("OTP Sent:", otp); // for testing

    setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    if (formData.otp === generatedOtp) {
      alert("OTP Verified ✅");
      console.log("Form Data:", formData);
    } else {
      alert("Invalid OTP ❌");
    }
  };

  const handleResendOtp = () => {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(otp);

    console.log("Resent OTP:", otp);

    alert("OTP Resent ");
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 py-6 px-4">
      <h1 className="text-xl md:text-2xl font-semibold mb-6">
        Vietnamese Iced Coffee
      </h1>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Customer Information</h2>
        </div>

        <form onSubmit={handleSendOtp} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Mobile Number <span className="text-red-500">*</span>
            </label>

            <div className="flex">
              <div className="px-4 py-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg">
                +91
              </div>
              <input
                type="tel"
                name="mobile"
                placeholder="Enter Mobile Number"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
          </div>

          {!otpSent && (
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg"
            >
              Send OTP
            </button>
          )}
        </form>

        {otpSent && (
          <div className="p-6 border-t space-y-4">
            <label className="block text-sm font-medium">
              Enter OTP <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={formData.otp}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500"
            />

            <div className="flex gap-3">

              <button
                type="button"
                onClick={handleVerifyOtp}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg"
              >
                Confirm OTP
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                className="w-full bg-gray-200 hover:bg-gray-300 text-black font-semibold py-3 rounded-lg"
              >
                Resend OTP
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}