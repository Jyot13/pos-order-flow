"use client";

import { useEffect, useState } from "react";
import { FiMinus, FiPlus, FiShoppingBag } from "react-icons/fi";
import { X } from "lucide-react";

export default function CartSummaryModal({ onClose, onPlaceOrder }) {
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
    setTimeout(() => setIsOpen(true), 10);
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => onClose(), 300);
  };

  const updateQuantity = (index, newQty) => {
    if (newQty < 1) {
      const updatedCart = cart.filter((_, i) => i !== index);
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      window.dispatchEvent(new Event("cartUpdated"));
    } else {
      const updatedCart = [...cart];
      updatedCart[index].qty = newQty;
      updatedCart[index].total =
        updatedCart[index].qty * (updatedCart[index].price + (updatedCart[index].addon?.price || 0));
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  const updateItemNote = (index, value) => {
    const updatedCart = [...cart];
    updatedCart[index].note = value;
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handlePlaceOrder = () => {
    handleClose();
    onPlaceOrder();
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  return (
    <>
      <div
        onClick={handleClose}
        className={`fixed inset-0 z-60 transition-opacity duration-300 ${isOpen ? "bg-black/50" : "bg-black/0"}`}
      />

      <div className="fixed bottom-0 left-0 right-0 z-70 font-raleway">
        <div
          className={`relative bg-white max-h-[75vh] flex flex-col transition-transform duration-300 ease-out ${
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

          {/* Header */}
          <div className="pt-6 px-5 pb-3 border-b border-[#E8DDD0]">
            <h2 className="font-rufina text-lg text-[#181D24] tracking-wide">Order Summary</h2>
          </div>

          {/* Items list */}
          <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3 bg-[#FDFAF6]">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <FiShoppingBag className="w-10 h-10 text-[#E8DDD0] mx-auto mb-3" />
                <p className="text-[#BDA070] text-sm tracking-wide">Your order is empty</p>
              </div>
            ) : (
              cart.map((item, index) => (
                <div key={index} className="bg-white border border-[#E8DDD0] p-3 last:mb-0">
                  <div className="flex justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#181D24] font-medium leading-snug truncate">{item.name}</p>
                      {item.addon && (
                        <p className="text-[11px] text-[#BDA070] mt-0.5">+ {item.addon.name}</p>
                      )}
                      <textarea
                        value={item.note || ""}
                        onChange={(e) => updateItemNote(index, e.target.value)}
                        placeholder="Add note..."
                        className="mt-1.5 w-full text-[11px] border border-[#E8DDD0] bg-[#FDFAF6] px-2 py-1 text-[#5A5040] placeholder-[#BDA070] focus:outline-none focus:border-[#CCA665] resize-none transition-all"
                        rows={1}
                      />
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <div className="flex items-center border border-[#E8DDD0]">
                        <button
                          onClick={() => updateQuantity(index, item.qty - 1)}
                          className="px-2 py-1 text-[#CCA665] hover:bg-[#F6F3EE] transition-colors"
                        >
                          <FiMinus size={12} />
                        </button>
                        <span className="px-2.5 text-xs font-medium text-[#181D24]">{item.qty}</span>
                        <button
                          onClick={() => updateQuantity(index, item.qty + 1)}
                          className="px-2 py-1 text-[#CCA665] hover:bg-[#F6F3EE] transition-colors"
                        >
                          <FiPlus size={12} />
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-[#CCA665] tracking-wide">₹ {item.total}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="bg-[#181D24] px-5 py-4">
            {cart.length > 0 ? (
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-[#9E958B] tracking-widest uppercase">Subtotal</p>
                  <p className="text-[#CCA665] font-semibold text-xl tracking-wide">₹ {subtotal}</p>
                </div>
                <button
                  onClick={handlePlaceOrder}
                  className="bg-[#CCA665] hover:bg-[#b38e45] text-[#0E0A09] px-7 py-2.5 text-xs font-semibold tracking-[0.2em] uppercase transition-colors duration-200"
                >
                  Place Order
                </button>
              </div>
            ) : (
              <button
                onClick={handleClose}
                className="w-full py-2.5 border border-[#E8DDD0]/30 text-[#9E958B] text-xs tracking-widest uppercase"
              >
                Continue Browsing
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
