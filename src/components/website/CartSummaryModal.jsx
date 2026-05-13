"use client";

import { useEffect, useState } from "react";
import { FiMinus, FiPlus, FiShoppingBag } from "react-icons/fi";
import { X } from "lucide-react";
import { FaLeaf } from "react-icons/fa";
import { GiChickenLeg } from "react-icons/gi";
import { IoEgg } from "react-icons/io5";

export default function CartSummaryModal({ onClose, onPlaceOrder }) {
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
    setTimeout(() => setIsOpen(true), 10);
  }, []);

  const filterIcons = {
    veg: <FaLeaf className="text-green-600" size={14} />,
    nonVeg: <GiChickenLeg className="text-red-600" size={14} />,
    egg: <IoEgg className="text-yellow-500" size={14} />,
  };

  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => onClose(), 300);
  };

  const updateQuantity = (index, newQty) => {
    if (newQty < 1) {
      const updatedCart = cart.filter((_, i) => i !== index);
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      window.dispatchEvent(new Event('cartUpdated'));
    } else {
      const updatedCart = [...cart];
      updatedCart[index].qty = newQty;
      updatedCart[index].total = updatedCart[index].qty *
        (updatedCart[index].price + (updatedCart[index].addon?.price || 0));
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      window.dispatchEvent(new Event('cartUpdated'));
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
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <>
      <div
        onClick={handleClose}
        className={`fixed inset-0 z-[60] transition-opacity duration-300 ${isOpen ? "bg-black/40" : "bg-black/0"
          }`}
      />

      <div className="fixed bottom-0 left-0 right-0 z-[70]">
        <div
          className={`relative bg-white rounded-t-xl shadow-lg max-h-[70vh] flex flex-col transition-transform duration-300 ease-out ${isOpen ? "translate-y-0" : "translate-y-full"
            }`}
        >
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-30">
            <button
              onClick={handleClose}
              className="p-2 bg-black/70 text-white rounded-full shadow-lg backdrop-blur"
            >
              <X size={18} />
            </button>
          </div>
          <div className="pt-5 px-4 pb-2 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Your Order Summary
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {cart.length === 0 ? (
              <div className="text-center py-10">
                <FiShoppingBag className="w-14 h-14 text-gray-300 mx-auto" />
                <p className="text-gray-500 text-sm mt-2">
                  Your cart is empty
                </p>
              </div>
            ) : (
              cart.map((item, index) => (
                <div key={index} className="border-b border-gray-200 pb-2 last:border-0">
                  <div className="flex justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="text-sm text-gray-900 leading-tight">
                        {item.name}
                      </h3>

                      {item.addon && (
                        <p className="text-xs text-gray-500 mt-1">
                          + {item.addon.name}
                        </p>
                      )}

                      <textarea
                        value={item.note || ""}
                        onChange={(e) => updateItemNote(index, e.target.value)}
                        placeholder="Add note..."
                        className="mt-1 w-full text-xs border border-gray-200 rounded-md p-1 focus:ring-1 focus:ring-orange-400 resize-none"
                        rows={1}
                      />
                    </div>

                    <div className="flex flex-col items-end gap-1 min-w-[80px]">
                      <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
                        <button
                          onClick={() => updateQuantity(index, item.qty - 1)}
                          className="px-2 py-1 text-orange-500"
                        >
                          <FiMinus size={14} />
                        </button>

                        <span className="px-2 text-xs font-medium">
                          {item.qty}
                        </span>

                        <button
                          onClick={() => updateQuantity(index, item.qty + 1)}
                          className="px-2 py-1 text-orange-500"
                        >
                          <FiPlus size={14} />
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        ₹ {item.total}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="bg-orange-500 p-3">
            {cart.length > 0 ? (
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-bold text-white">
                    ₹ {subtotal}
                  </p>
                  <p className="text-xs text-white">SUBTOTAL</p>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  className="px-5 py-2 bg-white text-orange-500 font-semibold rounded-md"
                >
                  Place Order
                </button>
              </div>
            ) : (
              <button
                onClick={handleClose}
                className="w-full py-2 bg-white text-gray-700 rounded-md"
              >
                Continue Shopping
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
