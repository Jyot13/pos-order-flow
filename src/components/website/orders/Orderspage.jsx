"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import logoImg from "../../../../public/website/aureva-logo.png";
import diningImg from "../../../../public/website/dining.png";
import { FiUser } from "react-icons/fi";
import { MdOutlineTableBar } from "react-icons/md";
import { IoRestaurantOutline, IoListOutline } from "react-icons/io5";
import { RefreshCcw } from "lucide-react";
import { MdCancel } from "react-icons/md";

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);

  const loadOrders = () => {
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    if (savedOrders.length === 0) {
      setOrders([]);
    } else {
      setOrders(savedOrders);
    }
  };

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

  const handleReorder = (order) => {
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    const newCartItems = order.items.map(item => ({
      id: Date.now() + Math.random(),
      name: item.name,
      price: item.price,
      qty: item.qty,
      total: item.price * item.qty,
      addon: item.addon || null,
      note: item.note || "",
      image: "/website/coffee-placeholder.jpg"
    }));
    const updatedCart = [...existingCart];
    newCartItems.forEach(newItem => {
      const existingItemIndex = updatedCart.findIndex(
        item => item.name === newItem.name && item.addon?.id === newItem.addon?.id
      );
      if (existingItemIndex > -1) {
        updatedCart[existingItemIndex].qty += newItem.qty;
        updatedCart[existingItemIndex].total = updatedCart[existingItemIndex].qty * updatedCart[existingItemIndex].price;
      } else {
        updatedCart.push(newItem);
      }
    });
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
    alert(`${order.items.length} item(s) from ${order.id} added to cart!`);
  };

  const handleDeleteOrder = (orderId) => {
    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const updatedOrders = existingOrders.filter(order => order.id !== orderId);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    window.dispatchEvent(new Event("orderDeleted"));
    setOrders(updatedOrders);
    alert("Order Deleted ");
  };

  const approvedOrders = orders.filter(order => order.status === "Approved");
  const rejectedOrders = orders.filter(order => order.status === "Rejected");

  return (
    <div className="min-h-screen bg-[#F6F3EE] font-raleway">
      <header className="bg-[#181D24] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logoImg.src} alt="Aureva" width={52} height={52} className="shadow-md" />
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="relative group">
            <button className="border border-[#2E2A22] px-3 py-2 flex items-center gap-2 text-[#9E958B]">
              <MdOutlineTableBar size={16} className="text-[#CCA665]" />
              <span>5</span>
            </button>
            <div className="absolute right-0 top-full mt-1.5 bg-[#181D24] border border-[#2E2A22] text-[#CCA665] text-[10px] tracking-widest uppercase px-2.5 py-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              Table 5
            </div>
          </div>
          <button className="border border-[#2E2A22] px-3 py-2 flex items-center gap-2 text-[#9E958B]">
            <FiUser size={14} className="text-[#CCA665]" />
            <span>Guest</span>
          </button>
        </div>
      </header>

      <div className="border-b border-[#E8DDD0] bg-white">
        <div className="flex">
          <button
            onClick={() => setActiveTab("orders")}
            className={`relative flex items-center gap-2 px-6 py-4 text-xs tracking-widest uppercase transition-colors ${
              activeTab === "orders" ? "text-[#CCA665]" : "text-[#9E958B]"
            }`}
          >
            <IoRestaurantOutline size={14} />
            Orders
            <span className={`text-[10px] px-2 py-0.5 ${
              activeTab === "orders" ? "bg-[#CCA665]/10 text-[#CCA665]" : "bg-[#F6F3EE] text-[#9E958B]"
            }`}>
              {orders.length}
            </span>
            {activeTab === "orders" && (
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#CCA665]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("items")}
            className={`relative flex items-center gap-2 px-6 py-4 text-xs tracking-widest uppercase transition-colors ${
              activeTab === "items" ? "text-[#CCA665]" : "text-[#9E958B]"
            }`}
          >
            <IoListOutline size={14} />
            Item List
            <span className={`text-[10px] px-2 py-0.5 ${
              activeTab === "items" ? "bg-[#CCA665]/10 text-[#CCA665]" : "bg-[#F6F3EE] text-[#9E958B]"
            }`}>
              {approvedOrders.length}
            </span>
            {activeTab === "items" && (
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#CCA665]" />
            )}
          </button>
        </div>
      </div>

      {activeTab === "orders" && (
        <main className="p-4">
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20">
              <img src={diningImg.src} alt="No Orders" width={140} height={140} />
              <h2 className="font-rufina text-xl text-[#181D24] mt-6 tracking-wide">No Orders Yet</h2>
              <p className="text-[#9E958B] text-sm mt-2 max-w-xs tracking-wide">
                You haven&apos;t ordered anything yet. Place your first order.
              </p>
              <Link
                href="/website/menu"
                className="mt-6 border border-[#CCA665] text-[#CCA665] px-7 py-3 text-xs tracking-[0.2em] uppercase hover:bg-[#CCA665] hover:text-[#0E0A09] transition-colors duration-200"
              >
                Start Ordering
              </Link>
            </div>
          ) : (
            <div className="space-y-6 pb-20">
              {approvedOrders.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3 pt-2">
                    <span className="w-1.5 h-1.5 bg-[#4CAF50] rounded-full" />
                    <p className="text-[10px] tracking-widest uppercase text-[#4CAF50]">Approved ({approvedOrders.length})</p>
                  </div>
                  <div className="space-y-3">
                    {approvedOrders.map((order, index) => (
                      <OrderCard key={`approved-${index}`} order={order} onReorder={handleReorder} onDelete={handleDeleteOrder} showReorder={true} />
                    ))}
                  </div>
                </div>
              )}
              {rejectedOrders.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3 pt-2">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                    <p className="text-[10px] tracking-widest uppercase text-red-400">Rejected ({rejectedOrders.length})</p>
                  </div>
                  <div className="space-y-3">
                    {rejectedOrders.map((order, index) => (
                      <OrderCard key={`rejected-${index}`} order={order} onReorder={handleReorder} onDelete={handleDeleteOrder} showReorder={true} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      )}

      {activeTab === "items" && (
        <>
          {approvedOrders.length === 0 ? (
            <main className="flex flex-col items-center justify-center text-center py-20 px-10">
              <img src={diningImg.src} alt="dining" width={140} height={140} />
              <h2 className="font-rufina text-xl text-[#181D24] mt-6 tracking-wide">No Orders Yet</h2>
              <p className="text-sm text-[#9E958B] mt-2 max-w-sm tracking-wide">
                You haven&apos;t ordered anything yet. Place your first order.
              </p>
              <Link
                href="/website/menu"
                className="mt-6 border border-[#CCA665] text-[#CCA665] px-7 py-3 text-xs tracking-[0.2em] uppercase hover:bg-[#CCA665] hover:text-[#0E0A09] transition-colors duration-200"
              >
                Start Ordering
              </Link>
            </main>
          ) : (
            <div className="space-y-6 px-4 py-4 pb-20">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-1.5 bg-[#4CAF50] rounded-full" />
                  <p className="text-[10px] tracking-widest uppercase text-[#4CAF50]">Approved ({approvedOrders.length})</p>
                </div>
                <div className="space-y-3">
                  {approvedOrders.map((order, index) => (
                    <OrderCard
                      key={`approved-${index}`}
                      order={order}
                      onReorder={handleReorder}
                      onDelete={handleDeleteOrder}
                      showReorder={true}
                      showDelete={true}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function OrderCard({ order, onReorder, onDelete, showReorder = true, showDelete = false }) {
  return (
    <div className="bg-white border border-[#E8DDD0] overflow-hidden">
      <div className="flex justify-between items-center px-4 py-3 border-b border-[#E8DDD0] bg-[#FDFAF6]">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-rufina text-[#181D24] tracking-wide">{order.id}</span>
          <span className={`text-[10px] tracking-widest uppercase px-2 py-0.5 ${order.statusColor}`}>
            {order.status}
          </span>
          {order.customerName && (
            <span className="text-[11px] text-[#9E958B] tracking-wide">{order.customerName}</span>
          )}
        </div>
        <span className="text-[11px] text-[#BDA070] tracking-wide shrink-0">{order.time}</span>
      </div>

      <div className="px-4 py-3 space-y-2">
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className={`w-3.5 h-3.5 border flex items-center justify-center shrink-0 ${
                order.status === "Approved" ? "border-[#4CAF50]" : "border-red-400"
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${
                  order.status === "Approved" ? "bg-[#4CAF50]" : "bg-red-400"
                }`} />
              </div>
              <span className="text-sm text-[#181D24]">{item.name}</span>
              {item.addon && (
                <span className="text-[11px] text-[#BDA070]">+ {item.addon.name}</span>
              )}
            </div>
            <div className="flex items-center gap-5 text-sm shrink-0">
              <span className="text-[#9E958B]">×{item.qty}</span>
              <span className="text-[#CCA665] font-medium min-w-12 text-right">₹{item.price}</span>
            </div>
          </div>
        ))}

        {order.totalAmount && (
          <div className="flex justify-end pt-2 border-t border-[#E8DDD0] mt-2">
            <span className="text-sm font-semibold text-[#CCA665] tracking-wide">Total: ₹{order.totalAmount}</span>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-4 py-2.5 border-t border-[#E8DDD0] bg-[#FDFAF6]">
        {showReorder && (
          <button
            onClick={() => onReorder(order)}
            className="flex items-center gap-2 px-4 py-1.5 text-[#CCA665] text-xs tracking-widest uppercase border border-[#CCA665]/40 hover:bg-[#CCA665]/5 transition-colors"
          >
            <RefreshCcw size={12} />
            Reorder
          </button>
        )}
        {showDelete && (
          <button
            onClick={() => onDelete(order.id)}
            className="flex items-center gap-2 px-4 py-1.5 text-red-400 text-xs tracking-widest uppercase border border-red-200 hover:bg-red-50 transition-colors"
          >
            <MdCancel size={14} />
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
