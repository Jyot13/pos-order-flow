"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import CartSummaryModal from "./CartSummaryModal";
import OrderFormModal from "./OrderFormModal";

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
    window.addEventListener("cartUpdated", loadCart);
    return () => {
      window.removeEventListener("cartUpdated", loadCart);
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
      const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
      localStorage.setItem("orders", JSON.stringify([approvedOrder, ...existingOrders]));
      localStorage.removeItem("cart");
      localStorage.removeItem("currentCustomer");
      setCart([]);
      setIsProcessingOrder(false);
      setCurrentOrderDetails(null);
      window.dispatchEvent(new Event("cartUpdated"));
      window.dispatchEvent(new Event("orderApproved"));
      toast.success("Order Approved", { id: "order" });
    }, 10000);
  };

  const handleRejectOrder = (e) => {
    e.stopPropagation();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    if (cartItems.length === 0 && currentOrderDetails) cartItems = currentOrderDetails.items;
    const rejectedOrder = {
      id: `KOT ${Math.floor(Math.random() * 1000)}`,
      status: "Rejected",
      statusColor: "bg-red-100 text-red-500",
      time: new Date().toLocaleTimeString(),
      items: cartItems,
      totalAmount: cartItems.reduce((sum, i) => sum + i.total, 0),
    };
    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
    localStorage.setItem("orders", JSON.stringify([rejectedOrder, ...existingOrders]));
    localStorage.removeItem("cart");
    localStorage.removeItem("currentCustomer");
    setCart([]);
    setIsProcessingOrder(false);
    setCurrentOrderDetails(null);
    window.dispatchEvent(new Event("cartUpdated"));
    window.dispatchEvent(new Event("orderRejected"));
    toast.error("Order Rejected", { id: "order" });
  };

  const handlePlaceOrder = () => {
    setShowCartSummary(false);
    setTimeout(() => setShowOrderForm(true), 300);
  };

  const shouldShow = (totalItems > 0 && showFloatingButton) || isProcessingOrder;
  if (!shouldShow) return null;

  return (
    <>
      <div
        onClick={() => !isProcessingOrder && setShowCartSummary(true)}
        className="fixed bottom-18 left-1/2 -translate-x-1/2 z-50 w-[92vw] max-w-lg font-raleway cursor-pointer"
      >
        <div className="bg-[#181D24] border border-[#2E2A22] px-4 py-3 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-3">
            {isProcessingOrder && (
              <span className="w-3.5 h-3.5 border-2 border-[#CCA665] border-t-transparent rounded-full animate-spin" />
            )}
            <div>
              <p className="text-[10px] text-[#9E958B] tracking-widest uppercase leading-none mb-0.5">
                {isProcessingOrder ? "Processing" : `${totalItems} ${totalItems === 1 ? "item" : "items"}`}
              </p>
              <p className="text-[#CCA665] text-xs font-medium tracking-wide">
                {isProcessingOrder ? "Your order is being confirmed..." : "View your order"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isProcessingOrder ? (
              <>
                <span className="border border-[#CCA665]/60 text-[#CCA665] px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase">
                  View Cart
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); setShowFloatingButton(false); }}
                  className="text-[#9E958B] hover:text-[#CCA665] transition-colors p-1"
                >
                  <X size={13} />
                </button>
              </>
            ) : (
              <>
                <span className="border border-[#CCA665]/40 text-[#9E958B] px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase">
                  Processing
                </span>
                <button
                  onClick={handleRejectOrder}
                  className="text-red-400/70 hover:text-red-400 transition-colors p-1"
                >
                  <X size={13} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {showCartSummary && (
        <CartSummaryModal onClose={() => setShowCartSummary(false)} onPlaceOrder={handlePlaceOrder} />
      )}
      {showOrderForm && (
        <OrderFormModal
          onClose={() => setShowOrderForm(false)}
          onOrderPlaced={() => {
            const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
            const customerInfo = JSON.parse(localStorage.getItem("currentCustomer")) || {};
            processOrder(cartItems, customerInfo);
          }}
        />
      )}
    </>
  );
}
