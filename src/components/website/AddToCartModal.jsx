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

  useEffect(() => { setTimeout(() => setIsOpen(true), 10); }, []);

  const basePrice = item.price || 0;
  const addons = [{ id: 1, name: "Vanilla Syrup", price: 39 }];

  const filterIcons = {
    veg: <FaLeaf className="text-green-600" size={11} />,
    nonVeg: <GiChickenLeg className="text-red-700" size={11} />,
    egg: <IoEgg className="text-yellow-500" size={11} />,
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
      qty,
      addon: selectedAddon ? addons.find(a => a.id === selectedAddon) : null,
      note,
      total,
      image: item.image,
    };
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItemIndex = existingCart.findIndex(
      ci => ci.id === item.id && ci.addon?.id === selectedAddon && ci.note === note
    );
    if (existingItemIndex > -1) {
      existingCart[existingItemIndex].qty += qty;
      existingCart[existingItemIndex].total =
        existingCart[existingItemIndex].qty * (basePrice + (selectedAddonPrice || 0));
    } else {
      existingCart.push(cartItem);
    }
    localStorage.setItem("cart", JSON.stringify(existingCart));
    window.dispatchEvent(new Event("cartUpdated"));
    handleClose();
  };

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [handleClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  return (
    <>
      <div
        onClick={handleClose}
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${isOpen ? "bg-black/50" : "bg-black/0"}`}
      />

      <div className="fixed bottom-0 left-0 right-0 z-50 font-raleway">
        <div
          className={`relative bg-white max-h-[88vh] flex flex-col transition-transform duration-300 ease-out ${
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

          {/* Item header */}
          <div className="p-4 pt-8 border-b border-[#E8DDD0] flex justify-between items-start gap-4">
            <div className="flex gap-3 flex-1 min-w-0">
              <div className="relative w-16 h-16 shrink-0">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-4 h-4 flex items-center justify-center border border-[#E8DDD0]">
                    {filterIcons[item.filters] || filterIcons.veg}
                  </div>
                  <h3 className="font-rufina text-base text-[#181D24] tracking-wide truncate">{item.name}</h3>
                </div>
                {item.description && (
                  <p className="text-[11px] text-[#9E958B] leading-relaxed line-clamp-2">{item.description}</p>
                )}
                <p className="text-[#CCA665] font-semibold text-sm mt-1 tracking-wide">₹ {basePrice}.00</p>
              </div>
            </div>

            <div className="flex items-center border border-[#E8DDD0] shrink-0">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 text-[#CCA665] hover:bg-[#F6F3EE] transition-colors">
                <FiMinus size={14} />
              </button>
              <span className="px-3 text-sm font-medium text-[#181D24] min-w-8 text-center">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="px-3 py-2 text-[#CCA665] hover:bg-[#F6F3EE] transition-colors">
                <FiPlus size={14} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FDFAF6]">
            <div>
              <p className="text-[10px] font-medium text-[#5A5040] mb-2 tracking-widest uppercase">Special Instructions</p>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Any special requests..."
                rows={2}
                className="w-full border border-[#E8DDD0] bg-white px-3 py-2.5 text-sm text-[#181D24] placeholder-[#BDA070] focus:outline-none focus:border-[#CCA665] focus:ring-1 focus:ring-[#CCA665]/20 resize-none transition-all"
              />
            </div>

            {addons.length > 0 && (
              <AddonGroup
                title={`Add-ons (${selectedAddon ? "1" : "0"}/1)`}
                subtitle="Select up to 1"
                items={addons}
                selected={selectedAddon}
                onSelect={(id) => setSelectedAddon(selectedAddon === id ? null : id)}
              />
            )}
          </div>

          {/* Footer */}
          <div className="bg-[#181D24] px-4 py-4 flex justify-between items-center">
            <div>
              <p className="text-[10px] text-[#9E958B] tracking-widest uppercase">Total</p>
              <p className="text-[#CCA665] font-semibold text-lg tracking-wide">₹ {total}.00</p>
            </div>
            <button
              onClick={handleAddToCart}
              className="bg-[#CCA665] hover:bg-[#b38e45] text-[#0E0A09] px-7 py-2.5 text-xs font-semibold tracking-[0.2em] uppercase transition-colors duration-200"
            >
              Add to Order
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function AddonGroup({ title, subtitle, items, selected, onSelect }) {
  return (
    <div className="border border-[#E8DDD0] bg-white overflow-hidden">
      <div className="flex justify-between items-center px-4 py-3 border-b border-[#E8DDD0] bg-[#F6F3EE]">
        <div>
          <p className="text-xs font-semibold text-[#181D24] tracking-wide">{title}</p>
          <p className="text-[10px] text-[#9E958B] mt-0.5">{subtitle}</p>
        </div>
        <span className="text-[10px] text-[#BDA070]">{selected ? "1 selected" : "0 selected"}</span>
      </div>
      <div className="divide-y divide-[#E8DDD0]">
        {items.map((item) => (
          <label
            key={item.id}
            className="flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-[#FDFAF6] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <input type="checkbox" checked={selected === item.id} onChange={() => onSelect(item.id)} className="peer sr-only" />
                <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${
                  selected === item.id ? "border-[#CCA665] bg-[#CCA665]" : "border-[#E8DDD0]"
                }`}>
                  {selected === item.id && <span className="text-white text-[10px] font-bold leading-none">✓</span>}
                </div>
              </div>
              <span className="text-sm text-[#181D24]">{item.name}</span>
            </div>
            <span className="text-sm text-[#CCA665] font-medium">+₹ {item.price}.00</span>
          </label>
        ))}
      </div>
    </div>
  );
}
