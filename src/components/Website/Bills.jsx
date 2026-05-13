// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { IoRestaurantOutline } from "react-icons/io5";

// export default function OrdersPage() {
//     return (
//         <div className="min-h-screen bg-[#FAFAF9] flex flex-col">

//             <header className="flex items-center justify-between px-6 py-4 bg-white">
//                 {/* <div className="flex items-center gap-3">
//                     <Image
//                         src="/website/logo1.png"
//                         alt="Cravory"
//                         width={32}
//                         height={32}
//                         className="rounded"
//                     />
//                     <span className="font-semibold text-lg">Cravory</span>
//                 </div> */}
//  <div className="flex items-center gap-3">
     
//                <div className="bg-white p-1   ">
//                  <Image
//                    src="/website/logo1.png"
//                    alt="Cravory"
//                    width={40}
//                    height={40}
//                    className="rounded shadow-md"
//                    priority
//                  />
//                </div>
     
//                <span className="text-sm font-semibold text-gray-800">
//                  Cravory
//                </span>
//              </div>
     
//                 <button className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg text-sm">
//                     <IoRestaurantOutline />
//                     <span className="font-medium">9</span>
//                 </button>
//             </header>

//             <main className="flex-1 flex flex-col items-center justify-center text-center px-10 mb-14">
//                 <Image
//                     src="/website/bill.png"
//                     alt="No Bill"
//                     width={180}
//                     height={180}
//                     priority
//                 />

//                 <h2 className="mt-6 text-lg font-semibold text-gray-900">
//                     No Bill Generated Yet
//                 </h2>

//                 <p className="mt-2 text-sm text-gray-500 max-w-sm">
//                     Your bill will appear here once you place your order.
//                 </p>

//                 <Link
//                     href="/website/menu"
//                     className="mt-6 inline-flex items-center justify-center rounded-lg bg-orange-500 px-2 py-2 text-white font-medium hover:bg-orange-600 transition"
//                 >
//                     Start Ordering
//                 </Link>
//             </main>
//         </div>
//     );
// }

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoRestaurantOutline } from "react-icons/io5";
import { FiClock, FiUser, FiPhone } from "react-icons/fi";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

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

    const loadOrders = () => {
        const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
      
        const approvedOrders = savedOrders.filter(order => order.status === "Approved");
        setOrders(approvedOrders);
    };

    const approvedOrders = orders.filter(order => order.status === "Approved");

    return (
        <div className="min-h-screen bg-[#FAFAF9] flex flex-col">
            <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
                <div className="flex items-center gap-3">
                    <div className="bg-white p-1">
                        <Image
                            src="/website/logo1.png"
                            alt="Cravory"
                            width={40}
                            height={40}
                            className="rounded shadow-md"
                            priority
                        />
                    </div>
                    <span className="text-sm font-semibold text-gray-800">
                        Cravory
                    </span>
                </div>

                <button className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg text-sm">
                    <IoRestaurantOutline />
                    <span className="font-medium">{approvedOrders.length}</span>
                </button>
            </header>

            <main className="flex-1 p-6">
                {approvedOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center px-10 min-h-[60vh]">
                        <Image
                            src="/website/bill.png"
                            alt="No Bill"
                            width={180}
                            height={180}
                            priority
                        />
                        <h2 className="mt-6 text-lg font-semibold text-gray-900">
                            No Bill Generated Yet
                        </h2>
                        <p className="mt-2 text-sm text-gray-500 max-w-sm">
                            Your bill will appear here once you place your order.
                        </p>
                        <Link
                            href="/website/menu"
                            className="mt-6 inline-flex items-center justify-center rounded-lg bg-orange-500 px-6 py-3 text-white font-medium hover:bg-orange-600 transition"
                        >
                            Start Ordering
                        </Link>
                    </div>
                ) : (
                    <div className="w-full mx-auto space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Bills</h2>
                        
                        {approvedOrders.map((order, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                       
                                <div className="bg-orange-400 px-6 py-2 text-white">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="text-lg font-bold">Bill #{order.id}</h3>
                                            <p className="text-sm opacity-90 flex items-center gap-1 mt-1">
                                                <FiClock size={14} />
                                                {order.time}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold">₹{order.totalAmount}.00</p>
                                            <p className="text-xs opacity-90">Total Amount</p>
                                        </div>
                                    </div>
                                </div>
                                {(order.customerName || order.customerMobile) && (
                                    <div className="bg-gray-50 px-6 py-2 border-b border-gray-200">
                                        <div className="flex flex-wrap gap-4 text-sm">
                                            {order.customerName && (
                                                <div className="flex items-center gap-2 text-gray-700">
                                                    <FiUser size={14} />
                                                    <span>{order.customerName}</span>
                                                </div>
                                            )}
                                            {order.customerMobile && (
                                                <div className="flex items-center gap-2 text-gray-700">
                                                    <FiPhone size={14} />
                                                    <span>+91 {order.customerMobile}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="px-6 py-2">
                                    <div className="space-y-3">
                                        {order.items.map((item, itemIndex) => (
                                            <div key={itemIndex} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-gray-900">{item.name}</span>
                                                        {item.addon && (
                                                            <span className="text-xs text-gray-500">+ {item.addon.name}</span>
                                                        )}
                                                    </div>
                                                    {item.note && (
                                                        <p className="text-xs text-gray-400 mt-1">Note: {item.note}</p>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <span className="text-sm text-gray-500">x{item.qty}</span>
                                                    <span className="font-medium text-gray-900 min-w-[70px] text-right">
                                                        ₹{(item.price + (item.addon?.price || 0)) * item.qty}.00
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                               <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
    <div className="grid grid-cols-3 gap-4">
        <div className="text-sm">
            <span className="text-gray-600 block">Subtotal</span>
            <span className="text-gray-900 font-semibold">₹{order.totalAmount}.00</span>
        </div>
        <div className="text-sm">
            <span className="text-gray-600 block">GST (5%)</span>
            <span className="text-gray-900 font-semibold">₹{(order.totalAmount * 0.05).toFixed(2)}</span>
        </div>
        <div className="text-sm">
            <span className="text-gray-600 block">Delivery</span>
            <span className="text-gray-900 font-semibold">₹0.00</span>
        </div>
        <div className="col-span-3 flex justify-between text-lg font-bold pt-3 mt-2 border-t border-gray-200">
            <span className="text-gray-900">Grand Total</span>
            <span className="text-orange-600">₹{(order.totalAmount * 1.05).toFixed(2)}</span>
        </div>
    </div>
</div>

                                {/* Action Buttons */}
                                {/* <div className="px-6 py-4 bg-white border-t border-gray-200 flex gap-3">
                                    <button
                                        onClick={() => setSelectedOrder(selectedOrder === index ? null : index)}
                                        className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition"
                                    >
                                        {selectedOrder === index ? "Hide Details" : "View Details"}
                                    </button>
                                    <button
                                        onClick={() => {
                                            // Print bill functionality
                                            const printWindow = window.open('', '_blank');
                                            printWindow.document.write(`
                                                <html>
                                                <head>
                                                    <title>Bill ${order.id}</title>
                                                    <style>
                                                        body { font-family: Arial, sans-serif; padding: 20px; }
                                                        .header { text-align: center; margin-bottom: 20px; }
                                                        .items { width: 100%; border-collapse: collapse; margin: 20px 0; }
                                                        .items th, .items td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
                                                        .total { text-align: right; margin-top: 20px; font-size: 18px; font-weight: bold; }
                                                    </style>
                                                </head>
                                                <body>
                                                    <div class="header">
                                                        <h2>Cravory</h2>
                                                        <p>Bill #${order.id}</p>
                                                        <p>${order.time}</p>
                                                    </div>
                                                    <table class="items">
                                                        <tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr>
                                                        ${order.items.map(item => `
                                                            <tr>
                                                                <td>${item.name}${item.addon ? ` + ${item.addon.name}` : ''}</td>
                                                                <td>${item.qty}</td>
                                                                <td>₹${(item.price + (item.addon?.price || 0)).toFixed(2)}</td>
                                                                <td>₹${((item.price + (item.addon?.price || 0)) * item.qty).toFixed(2)}</td>
                                                            </tr>
                                                        `).join('')}
                                                    </table>
                                                    <div class="total">
                                                        <p>Total: ₹${order.totalAmount}.00</p>
                                                        <p>GST (5%): ₹${(order.totalAmount * 0.05).toFixed(2)}</p>
                                                        <p>Grand Total: ₹${(order.totalAmount * 1.05).toFixed(2)}</p>
                                                    </div>
                                                </body>
                                                </html>
                                            `);
                                            printWindow.document.close();
                                            printWindow.print();
                                        }}
                                        className="flex-1 border border-orange-500 text-orange-500 px-4 py-2 rounded-lg font-medium hover:bg-orange-50 transition"
                                    >
                                        Print Bill
                                    </button>
                                </div> */}

                                {/* Expanded Details */}
                                {selectedOrder === index && (
                                    <div className="px-6 py-4 bg-orange-50 border-t border-orange-200">
                                        <h4 className="font-semibold text-gray-900 mb-2">Order Details</h4>
                                        <div className="space-y-1 text-sm text-gray-700">
                                            <p><strong>Order ID:</strong> {order.id}</p>
                                            <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
                                            <p><strong>Status:</strong> <span className="text-green-600">✓ Approved</span></p>
                                            {order.items.length > 0 && (
                                                <p><strong>Total Items:</strong> {order.items.reduce((sum, item) => sum + item.qty, 0)}</p>
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