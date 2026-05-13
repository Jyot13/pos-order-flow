"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FiMinus, FiPlus } from "react-icons/fi";
import { X } from "lucide-react";
import { FaLeaf } from "react-icons/fa";
import { GiChickenLeg } from "react-icons/gi";
import { IoEgg } from "react-icons/io5";

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
