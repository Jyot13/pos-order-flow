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
            const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
            const customerInfo = JSON.parse(localStorage.getItem("currentCustomer")) || {};
            processOrder(cartItems, customerInfo);
          }}
        />
      )}
    </>
  );
}
