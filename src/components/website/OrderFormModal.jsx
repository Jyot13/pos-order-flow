"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function OrderFormModal({ onClose, onOrderPlaced }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", mobile: "" });

  useEffect(() => { setTimeout(() => setIsOpen(true), 10); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile" && !/^\d*$/.test(value)) return;
    setFormData({ ...formData, [name]: value });
  };

  const calculateTotal = () => {
    if (typeof window === "undefined") return 0;
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    return cart.reduce((sum, item) => sum + item.total, 0);
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
          items: cart.map(item => ({ name: item.name, qty: item.qty, price: item.price, addon: item.addon, note: item.note })),
          showReorder: true,
          customerName: formData.name,
          customerMobile: formData.mobile,
          orderDate: new Date().toISOString(),
          totalAmount: calculateTotal(),
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile) { alert("Please fill all fields"); return; }
    if (formData.mobile.length !== 10) { alert("Enter valid mobile number"); return; }
    onOrderPlaced && onOrderPlaced();
    handleClose();
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => onClose(), 300);
  };

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && handleClose();
    window.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", esc); document.body.style.overflow = "unset"; };
  }, []);

  const inputClass = "w-full border border-[#E8DDD0] bg-[#FDFAF6] px-4 py-3 text-sm text-[#181D24] placeholder-[#BDA070] focus:outline-none focus:border-[#CCA665] transition-all";

  return (
    <>
      <div
        onClick={handleClose}
        className={`fixed inset-0 z-80 transition-opacity duration-300 ${isOpen ? "bg-black/50" : "bg-black/0"}`}
      />

      <div className="fixed bottom-0 left-0 right-0 z-90 font-raleway">
        <div
          className={`relative bg-white max-h-[80vh] flex flex-col transition-transform duration-300 ease-out ${
            isOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-30">
            <button
              onClick={handleClose}
              className="p-2.5 bg-[#181D24] text-[#BDA070] rounded-full shadow-lg hover:bg-[#0E0A09] transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="pt-6 px-5 pb-3 border-b border-[#E8DDD0]">
            <h2 className="font-rufina text-lg text-[#181D24] tracking-wide">Guest Details</h2>
            <p className="text-[11px] text-[#9E958B] mt-0.5 tracking-wide">Enter your details to place the order</p>
          </div>

          <div className="flex-1 overflow-y-auto bg-[#FDFAF6]">
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-medium text-[#5A5040] mb-1.5 tracking-widest uppercase">
                    Full Name <span className="text-[#CCA665]">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-[#5A5040] mb-1.5 tracking-widest uppercase">
                    Mobile Number <span className="text-[#CCA665]">*</span>
                  </label>
                  <div className="flex border border-[#E8DDD0] focus-within:border-[#CCA665] transition-all">
                    <div className="px-3 py-3 bg-[#F6F3EE] border-r border-[#E8DDD0] text-sm text-[#9E958B] shrink-0">
                      +91
                    </div>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      maxLength={10}
                      placeholder="10-digit number"
                      className="w-full bg-[#FDFAF6] px-4 py-3 text-sm text-[#181D24] placeholder-[#BDA070] focus:outline-none transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#CCA665] hover:bg-[#b38e45] text-[#0E0A09] px-8 py-3.5 text-xs font-semibold tracking-[0.2em] uppercase transition-colors duration-200"
              >
                Confirm Order
              </button>
            </form>

            <p className="text-center text-[10px] text-[#BDA070] pb-5 tracking-wide px-5">
              By continuing, you agree to our Terms & Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
