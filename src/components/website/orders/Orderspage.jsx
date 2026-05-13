"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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

    const handleOrderPlaced = () => {
      loadOrders();
    };

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
        item => item.name === newItem.name &&
          item.addon?.id === newItem.addon?.id
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
    <div className="min-h-screen bg-white">
     
      <header className="px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/website/logo1.png"
            alt="Cravory"
            width={40}
            height={40}
            className="rounded shadow-md"
          />
          <span className="text-sm font-semibold text-gray-800">
            Cravory
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-medium">
          <button className="bg-gray-100 px-2 py-2 rounded-lg flex items-center gap-2">
            <MdOutlineTableBar size={18} />
            <span>{orders.length}</span>
          </button>

          <button className="bg-gray-100 px-3 py-2 rounded-lg flex items-center gap-2">
            <FiUser size={15} />
            <span className="flex sm:hidden">Group <br /> Order</span>
            <span className="hidden sm:flex">Group Order</span>
          </button>
        </div>
      </header>

      <div className="border-b  border-gray-200">
        <div className="max-w-5xl mx-auto px-6 flex justify-between">
          <button
            onClick={() => setActiveTab("orders")}
            className={`relative flex items-center gap-2 py-4 ${activeTab === "orders" ? "text-orange-500" : "text-gray-500"}`}
          >
            <IoRestaurantOutline />
            Orders
            <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-600">
              {orders.length}
            </span>
            {activeTab === "orders" && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-orange-500" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("items")}
            className={`relative flex items-center gap-2 py-4 ${activeTab === "items" ? "text-orange-500" : "text-gray-500"}`}
          >
            <IoListOutline />
            Item List
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200">
              {approvedOrders.length}
            </span>
            {activeTab === "items" && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-orange-500" />
            )}
          </button>
        </div>
      </div>

      {activeTab === "orders" && (
        <main className="p-4 ">
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20">
              <Image
                src="/website/dining.png"
                alt="No Orders"
                width={160}
                height={160}
              />
              <h2 className="text-xl font-semibold mt-6">No Orders Yet</h2>
              <p className="text-gray-500 mt-2">
               You haven’t ordered anything yet. Place your first order.          
              </p>
              <Link
                href="/website/menu"
                className="mt-6 bg-orange-500 text-white px-5 py-3 rounded-lg"
              >
                Start Ordering
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {approvedOrders.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-green-600 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    Approved Orders ({approvedOrders.length})
                  </h3>
                  <div className="space-y-4">
                    {approvedOrders.map((order, index) => (
                      <OrderCard 
                        key={`approved-${index}`} 
                        order={order} 
                        onReorder={handleReorder}
                        onDelete={handleDeleteOrder}
                        showReorder={true}
                      />
                    ))}
                  </div>
                </div>
              )}
              {rejectedOrders.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-red-500 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Rejected Orders ({rejectedOrders.length})
                  </h3>
                  <div className="space-y-4 mb-16">
                    {rejectedOrders.map((order, index) => (
                      <OrderCard 
                        key={`rejected-${index}`} 
                        order={order} 
                        onReorder={handleReorder}
                        onDelete={handleDeleteOrder}
                        showReorder={true}
                      />
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
            <main className="flex flex-col items-center justify-center text-center py-20">
              <Image
                src="/website/dining.png"
                alt="dining"
                width={180}
                height={180}
                priority
              />
              <h2 className="mt-6 text-lg font-semibold text-gray-900">
                No Orders Yet
              </h2>
              <p className="mt-2 text-sm text-gray-500 max-w-sm">
                You haven't ordered anything yet. Place your first order.
              </p>
              <Link
                href="/website/menu"
                className="mt-6 inline-flex items-center justify-center rounded-lg bg-orange-500 px-4 py-2 text-white font-medium hover:bg-orange-600 transition"
              >
                Start Ordering
              </Link>
            </main>
          ) : (
            <div className="space-y-6 px-4 py-6 mb-13">
              <div>
                <h3 className="text-lg font-semibold text-green-600 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  Approved Orders ({approvedOrders.length})
                </h3>
                <div className="space-y-4">
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
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <span className="font-medium">{order.id}</span>
          <span className={`text-xs px-2 py-1 rounded ${order.statusColor}`}>
            {order.status}
          </span>
          {order.customerName && (
            <span className="text-xs text-gray-500">
              {order.customerName}
            </span>
          )}
        </div>
        <span className="text-xs text-gray-500">{order.time}</span>
      </div>

      <div className="px-4 py-3 space-y-2">
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 border border-gray-200 flex items-center justify-center ${
                order.status === "Approved" ? "border-green-600" : "border-red-500"
              }`}>
                <div className={`w-2 h-2 ${
                  order.status === "Approved" ? "bg-green-600" : "bg-red-500"
                }`}></div>
              </div>
              <span className="text-sm">{item.name}</span>
              {item.addon && (
                <span className="text-xs text-gray-500">+ {item.addon.name}</span>
              )}
            </div>
            <div className="flex items-center gap-6 text-sm">
              <span className="text-gray-500">×{item.qty}</span>
              <span className="font-medium">₹{item.price}.00</span>
            </div>
          </div>
        ))}

        {order.totalAmount && (
          <div className="flex justify-end pt-2 border-t border-gray-200 mt-2">
            <span className="text-sm font-semibold">Total: ₹{order.totalAmount}.00</span>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-4 py-2 border-t border-gray-200 bg-gray-50">
        {showReorder && (
          <button
            onClick={() => onReorder(order)}
            className="flex items-center gap-2 px-4 py-2 text-orange-500 font-medium  rounded-lg transition-colors"
          >
            <RefreshCcw size={16} />
            Reorder
          </button>
        )}
        
        {showDelete && (
          <button
            onClick={() => onDelete(order.id)}
            className="flex items-center gap-2 px-4 py-2 text-red-400 font-medium  rounded-lg transition-colors"
          >
            <span className="text-lg"><MdCancel /></span>
            Delete
          </button>
        )}
      </div>
    </div>
  );
}