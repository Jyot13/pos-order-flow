"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiClock, FiUser, FiPhone } from "react-icons/fi";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
    const handleOrderPlaced = () => { loadOrders(); };
    window.addEventListener("orderPlaced", handleOrderPlaced);
    window.addEventListener("orderRejected", handleOrderPlaced);
    window.addEventListener("orderDeleted", handleOrderPlaced);
    return () => {
      window.removeEventListener("orderPlaced", handleOrderPlaced);
      window.removeEventListener("orderRejected", handleOrderPlaced);
      window.removeEventListener("orderDeleted", handleOrderPlaced);
    };
  }, []);

  const loadOrders = () => {
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const approvedOrders = savedOrders.filter(order => order.status === "Approved");
    setOrders(approvedOrders);
  };

  const approvedOrders = orders.filter(order => order.status === "Approved");

  return (
    <div className="min-h-screen bg-[#F6F3EE] font-raleway">
      <header className="bg-[#0E0A09] px-5 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Image src="/website/aureva-logo.png" alt="Aureva" width={52} height={52} className="shadow-md" priority />
        </div>
        <div className="text-right">
          <p className="text-[10px] text-[#9E958B] tracking-widest uppercase">Bills</p>
          <p className="text-[#CCA665] text-sm font-medium">{approvedOrders.length} order{approvedOrders.length !== 1 ? "s" : ""}</p>
        </div>
      </header>

      <main className="p-4 pb-24">
        {approvedOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center px-10 min-h-[60vh]">
            <Image src="/website/bill.png" alt="No Bill" width={140} height={140} priority />
            <h2 className="font-rufina text-xl text-[#181D24] mt-6 tracking-wide">No Bill Generated Yet</h2>
            <p className="text-sm text-[#9E958B] mt-2 max-w-sm tracking-wide">
              Your bill will appear here once you place your order.
            </p>
            <Link
              href="/website/menu"
              className="mt-6 border border-[#CCA665] text-[#CCA665] px-7 py-3 text-xs tracking-[0.2em] uppercase hover:bg-[#CCA665] hover:text-[#0E0A09] transition-colors duration-200"
            >
              Start Ordering
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {approvedOrders.map((order, index) => (
              <div key={index} className="bg-white border border-[#E8DDD0] overflow-hidden shadow-sm">
                <div className="bg-[#181D24] px-5 py-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-rufina text-[#CCA665] text-lg tracking-wide">Bill #{order.id}</h3>
                      <p className="text-[11px] text-[#9E958B] flex items-center gap-1.5 mt-1 tracking-wide">
                        <FiClock size={11} />
                        {order.time}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-rufina text-[#CCA665] text-2xl tracking-wide">
                        ₹{(order.totalAmount * 1.05).toFixed(0)}
                      </p>
                      <p className="text-[10px] text-[#9E958B] tracking-widest uppercase mt-0.5">Grand Total</p>
                    </div>
                  </div>
                </div>

                {(order.customerName || order.customerMobile) && (
                  <div className="px-5 py-2.5 border-b border-[#E8DDD0] bg-[#FDFAF6]">
                    <div className="flex flex-wrap gap-4 text-xs text-[#5A5040]">
                      {order.customerName && (
                        <div className="flex items-center gap-1.5">
                          <FiUser size={12} className="text-[#BDA070]" />
                          <span>{order.customerName}</span>
                        </div>
                      )}
                      {order.customerMobile && (
                        <div className="flex items-center gap-1.5">
                          <FiPhone size={12} className="text-[#BDA070]" />
                          <span>+91 {order.customerMobile}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="px-5 py-3">
                  <div className="space-y-0">
                    {order.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex justify-between items-start py-2.5 border-b border-[#F6F3EE] last:border-0">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm text-[#181D24] font-medium">{item.name}</span>
                            {item.addon && (
                              <span className="text-[11px] text-[#BDA070]">+ {item.addon.name}</span>
                            )}
                          </div>
                          {item.note && (
                            <p className="text-[11px] text-[#BDA070] mt-0.5 tracking-wide">Note: {item.note}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-5 shrink-0">
                          <span className="text-xs text-[#9E958B]">×{item.qty}</span>
                          <span className="text-sm text-[#CCA665] font-medium min-w-16 text-right">
                            ₹{(item.price + (item.addon?.price || 0)) * item.qty}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#FDFAF6] border-t border-[#E8DDD0] px-5 py-4">
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-[#5A5040]">
                      <span className="tracking-wide">Subtotal</span>
                      <span>₹{order.totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-[#5A5040]">
                      <span className="tracking-wide">GST (5%)</span>
                      <span>₹{(order.totalAmount * 0.05).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[#5A5040]">
                      <span className="tracking-wide">Delivery</span>
                      <span>₹0.00</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-baseline pt-3 mt-3 border-t border-[#E8DDD0]">
                    <span className="text-xs tracking-widest uppercase text-[#5A5040]">Grand Total</span>
                    <span className="font-rufina text-[#CCA665] text-xl tracking-wide">
                      ₹{(order.totalAmount * 1.05).toFixed(2)}
                    </span>
                  </div>
                </div>

                {selectedOrder === index && (
                  <div className="px-5 py-4 bg-[#F6F3EE] border-t border-[#E8DDD0]">
                    <h4 className="text-[10px] tracking-widest uppercase text-[#5A5040] mb-2">Order Details</h4>
                    <div className="space-y-1 text-xs text-[#5A5040]">
                      <p><span className="text-[#BDA070]">Order ID: </span>{order.id}</p>
                      {order.orderDate && (
                        <p><span className="text-[#BDA070]">Date: </span>{new Date(order.orderDate).toLocaleString()}</p>
                      )}
                      <p><span className="text-[#BDA070]">Status: </span><span className="text-[#4CAF50]">✓ Approved</span></p>
                      {order.items.length > 0 && (
                        <p><span className="text-[#BDA070]">Total Items: </span>{order.items.reduce((sum, item) => sum + item.qty, 0)}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
