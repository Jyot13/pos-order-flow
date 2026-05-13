"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FiMinus, FiPlus, FiFileText, FiShoppingBag } from "react-icons/fi";
import { X } from "lucide-react";
import { FaLeaf } from "react-icons/fa";
import { GiChickenLeg } from "react-icons/gi";
import { IoEgg } from "react-icons/io5";
import toast from "react-hot-toast";

export default function AddToCartModal({ onClose, item }) {
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  const [selectedAddon, setSelectedAddon] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsOpen(true), 10);
  }, []);

  const basePrice = item.price || 0;
  const addons = [
    { id: 1, name: "Vanilla Syrup", price: 39 },
  ];

  const filterIcons = {
    veg: <FaLeaf className="text-green-600" size={14} />,
    nonVeg: <GiChickenLeg className="text-red-600" size={14} />,
    egg: <IoEgg className="text-yellow-500" size={14} />,
  };

  const selectedAddonPrice = selectedAddon
    ? addons.find((a) => a.id === selectedAddon)?.price || 0
    : 0;

  const total = (basePrice + selectedAddonPrice) * qty;

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => onClose(), 300);
  };

  const handleAddToCart = () => {
    const cartItem = {
      id: item.id || Date.now(),
      name: item.name,
      price: basePrice,
      qty: qty,
      addon: selectedAddon ? addons.find(a => a.id === selectedAddon) : null,
      note: note,
      total: total,
      image: item.image
    };

    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingItemIndex = existingCart.findIndex(ci =>
      ci.id === item.id &&
      ci.addon?.id === selectedAddon &&
      ci.note === note
    );

    if (existingItemIndex > -1) {
      existingCart[existingItemIndex].qty += qty;
      existingCart[existingItemIndex].total = existingCart[existingItemIndex].qty * (basePrice + (selectedAddonPrice || 0));
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(existingCart));
    window.dispatchEvent(new Event('cartUpdated'));

    handleClose();
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [handleClose]);

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
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${isOpen ? 'bg-black/40' : 'bg-black/0'
          }`}
      />
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div
          className={`relative bg-white rounded-t-2xl shadow-lg max-h-[85vh] flex flex-col transition-transform duration-300 ease-out ${isOpen ? "translate-y-0" : "translate-y-full"
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

          <div className="p-4 border-b border-gray-200 flex justify-between items-start pt-8">
            <div className="flex gap-4 flex-1">
              <div className="relative w-14 h-14">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="flex gap-2 items-center">
                  <div className="w-5 h-5 flex items-center justify-center border border-gray-200 rounded-sm">
                    {filterIcons[item.filters] || filterIcons.veg}
                  </div>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                </div>

                <p className="text-sm text-gray-500">{item.description}</p>
                <p className="font-semibold mt-1">₹ {basePrice}</p>
              </div>
            </div>

            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 text-orange-500">
                <FiMinus />
              </button>
              <span className="px-4">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="px-3 py-2 text-orange-500">
                <FiPlus />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">

            <div>
              <p className="text-sm font-medium mb-1">Special Instructions</p>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Enter note..."
                className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {addons.length > 0 && (
              <AddonGroup
                title={`Add On (${selectedAddon ? "1" : "0"}/1)`}
                subtitle="Select up to 1 add-on"
                items={addons}
                selected={selectedAddon}
                onSelect={(id) =>
                  setSelectedAddon(selectedAddon === id ? null : id)
                }
              />
            )}
          </div>

          <div className="sticky bottom-0 bg-orange-500 p-4">
            <div className="flex justify-between items-center">
              <div className="text-white">
                <p className="text-sm">Total</p>
                <p className="font-bold">₹ {total}</p>
              </div>

              <button
                onClick={handleAddToCart}
                className="bg-white text-orange-600 px-6 py-2 rounded-lg font-medium"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function AddonGroup({ title, subtitle, items, selected, onSelect }) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div>
          <p className="font-medium text-sm text-gray-900">{title}</p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className="text-xs text-gray-500">
          {selected ? '1 selected' : '0 selected'}
        </div>
      </div>

      <div className="divide-y">
        {items.map((item) => (
          <label
            key={item.id}
            className="flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={selected === item.id}
                  onChange={() => onSelect(item.id)}
                  className="peer sr-only"
                />
                <div className="w-5 h-5 border-2 rounded flex items-center justify-center
                                border-gray-300 peer-checked:border-orange-500 peer-checked:bg-orange-50
                                transition-colors">
                  {selected === item.id && (
                    <span className="text-orange-500 font-bold text-sm">✓</span>
                  )}
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-900">{item.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-900">+₹ {item.price}.00</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}


function CartSummaryModal({ onClose, onPlaceOrder }) {
  const [cart, setCart] = useState([]);
  const [orderNote, setOrderNote] = useState("");
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

                    {/* LEFT */}
                    <div className="flex-1">

                      <h3 className="text-sm text-gray-900   leading-tight">
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

                    {/* RIGHT */}
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



function OrderFormModal({ onClose, onOrderPlaced }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    otp: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

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
        const updatedOrders = [rejectedOrder, ...existingOrders];

        localStorage.setItem("orders", JSON.stringify(updatedOrders));
        localStorage.removeItem("cart");

        window.dispatchEvent(new Event("cartUpdated"));
        window.dispatchEvent(new Event("orderPlaced"));

        handleClose();
        alert("Order rejected ");
      }
    };

    window.addEventListener("orderRejected", handleRejection);

    return () => {
      window.removeEventListener("orderRejected", handleRejection);
    };
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

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.4s ease-out forwards;
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin {
          animation: spin 0.6s linear infinite;
        }
      `}</style>
    </>
  );
}



export function CartFloatingButton() {
  const [cart, setCart] = useState([]);
  const [showCartSummary, setShowCartSummary] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showFloatingButton, setShowFloatingButton] = useState(true);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [currentOrderDetails, setCurrentOrderDetails] = useState(null);

  const timeoutRef = useRef(null);
  useEffect(() => {
    const loadCart = () => {
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(savedCart);
    };

    loadCart();

    const handleCartUpdate = () => loadCart();

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const processOrder = (cartItems, customerInfo = {}) => {
    setIsProcessingOrder(true);

    toast.loading("Processing your order...", { id: "order" });

    setCurrentOrderDetails({
      items: cartItems,
      customerName: customerInfo.name,
      customerMobile: customerInfo.mobile,
      totalAmount: cartItems.reduce((sum, i) => sum + i.total, 0),
    });

    timeoutRef.current = setTimeout(() => {
      const approvedOrder = {
        id: `KOT ${Math.floor(Math.random() * 1000)}`,
        status: "Approved",
        statusColor: "bg-green-100 text-green-600",
        time: new Date().toLocaleTimeString(),
        items: cartItems,
        totalAmount: cartItems.reduce((sum, i) => sum + i.total, 0),
      };

      const existingOrders =
        JSON.parse(localStorage.getItem("orders")) || [];

      localStorage.setItem(
        "orders",
        JSON.stringify([approvedOrder, ...existingOrders])
      );

      localStorage.removeItem("cart");
      localStorage.removeItem("currentCustomer");

      setCart([]);
      setIsProcessingOrder(false);
      setCurrentOrderDetails(null);

      window.dispatchEvent(new Event("cartUpdated"));
      window.dispatchEvent(new Event("orderApproved"));

      toast.success("Order Approved ", { id: "order" });
    }, 10000);
  };

  const handleRejectOrder = (e) => {
    e.stopPropagation();

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

    if (cartItems.length === 0 && currentOrderDetails) {
      cartItems = currentOrderDetails.items;
    }

    const rejectedOrder = {
      id: `KOT ${Math.floor(Math.random() * 1000)}`,
      status: "Rejected",
      statusColor: "bg-red-100 text-red-500",
      time: new Date().toLocaleTimeString(),
      items: cartItems,
      totalAmount: cartItems.reduce((sum, i) => sum + i.total, 0),
    };

    const existingOrders =
      JSON.parse(localStorage.getItem("orders")) || [];

    localStorage.setItem(
      "orders",
      JSON.stringify([rejectedOrder, ...existingOrders])
    );

    localStorage.removeItem("cart");
    localStorage.removeItem("currentCustomer");

    setCart([]);
    setIsProcessingOrder(false);
    setCurrentOrderDetails(null);

    window.dispatchEvent(new Event("cartUpdated"));
    window.dispatchEvent(new Event("orderRejected"));

    toast.error("Order Rejected ", { id: "order" });
  };

  const handlePlaceOrder = () => {
    setShowCartSummary(false);
    setTimeout(() => setShowOrderForm(true), 300);
  };

  const shouldShow =
    (totalItems > 0 && showFloatingButton) || isProcessingOrder;

  if (!shouldShow) return null;

  return (
    <>
      <div
        onClick={() => !isProcessingOrder && setShowCartSummary(true)}
        className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 
        bg-[#ffe8dc] border border-orange-400 rounded-xl shadow-lg 
        px-5 py-3 flex items-center justify-between gap-4 
        w-[95vw] max-w-7xl"
      >
        <div className="flex items-center gap-3">
          {isProcessingOrder && (
            <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          )}

          <p className="text-sm font-medium text-orange-600">
            {isProcessingOrder
              ? "Processing Order..."
              : `${totalItems} ${totalItems === 1 ? "Item" : "Items"} in cart`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!isProcessingOrder ? (
            <>
              <div className="bg-orange-500 text-white px-4 py-2 rounded-lg text-xs font-bold">
                View Cart
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFloatingButton(false);
                }}
                className="text-orange-500 bg-white rounded-full p-1"
              >
                <X size={14} />
              </button>
            </>
          ) : (
            <>
              <div className="bg-orange-500 text-white px-4 py-2 rounded-lg text-xs font-bold">
                Processing
              </div>

              <button
                onClick={handleRejectOrder}
                className="text-red-500 bg-white rounded-full p-1"
              >
                <X size={14} />
              </button>
            </>
          )}
        </div>
      </div>
      {showCartSummary && (
        <CartSummaryModal
          onClose={() => setShowCartSummary(false)}
          onPlaceOrder={handlePlaceOrder}
        />
      )}
      {showOrderForm && (
        <OrderFormModal
          onClose={() => setShowOrderForm(false)}
          onOrderPlaced={() => {
            const cartItems =
              JSON.parse(localStorage.getItem("cart")) || [];

            const customerInfo =
              JSON.parse(localStorage.getItem("currentCustomer")) || {};

            processOrder(cartItems, customerInfo);
          }}
        />
      )}
    </>
  );
}