"use client";

import Menuproducts from "../../data/Menuproducts";
import logoImg from "../../../public/website/aureva-logo.png";
import foodImg from "../../../public/website/food.png";
import food1Img from "../../../public/website/food1.png";
import platterImg from "../../../public/website/platter.png";

const iconMap = {
  "/website/food1.png": food1Img.src,
  "/website/platter.png": platterImg.src,
};
import { MdOutlineTableBar } from "react-icons/md";
import { FiUser } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import AddToCartModal from "./AddToCartModal";
import { Check, ChevronDown } from "lucide-react";
import { FaCircle } from "react-icons/fa";
import { IoTriangleSharp } from "react-icons/io5";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MAX_LENGTH = 30;

export default function MenuPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [filters, setFilters] = useState({ veg: false, nonVeg: false, egg: false });
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Chef Special");
  const [expandedItems, setExpandedItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [hiddenCategories, setHiddenCategories] = useState({});
  const contentTopRef = useRef(null);
  const isFilteringRef = useRef(false);
  const categoryRefs = useRef({});
  const lastUpdateRef = useRef(0);
  const isAutoScrollingRef = useRef(false);

  const filterIcons = {
    veg: <FaCircle className="text-green-600" size={8} />,
    nonVeg: <IoTriangleSharp className="text-red-700" size={8} />,
    egg: <FaCircle className="text-yellow-500" size={8} />,
  };

  const menuCategories = [
    { id: 1, name: "Chef Special", icon: "/website/food1.png" },
    { id: 2, name: "Beverages", icon: "/website/platter.png" },
    { id: 3, name: "Breakfast Specials", icon: "/website/platter.png" },
    { id: 4, name: "Continental", icon: "/website/food1.png" },
    { id: 5, name: "Mini Croissants", icon: "/website/platter.png" },
    { id: 6, name: "Appetizers", icon: "/website/platter.png" },
    { id: 7, name: "Sandwich", icon: "/website/food1.png" },
    { id: 8, name: "Indian Fusion", icon: "/website/platter.png" },
    { id: 9, name: "Italian", icon: "/website/food1.png" },
    { id: 10, name: "Healthy", icon: "/website/platter.png" },
    { id: 11, name: "Chinese", icon: "/website/food1.png" },
    { id: 12, name: "Main Course", icon: "/website/food1.png" },
    { id: 13, name: "Breads", icon: "/website/platter.png" },
    { id: 14, name: "Combos", icon: "/website/platter.png" },
    { id: 15, name: "Desserts", icon: "/website/platter.png" },
  ];

  const filterCategories = () => {
    const activeFilters = Object.keys(filters).filter(key => filters[key]);

    return Menuproducts.categories.map(category => {
      const filteredProducts = category.products.filter(product => {
        const matchesFilter = activeFilters.length === 0 ||
          (product.filters && activeFilters.includes(product.filters));
        const matchesSearch = !searchQuery ||
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesFilter && matchesSearch;
      });
      return { ...category, products: filteredProducts };
    }).filter(category => category.products.length > 0);
  };

  const filteredCategories = filterCategories();

  const scrollToContent = () => {
    if (contentTopRef.current) {
      contentTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToCategory = (name) => {
    const section = categoryRefs.current[name];
    if (section) {
      isAutoScrollingRef.current = true;
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveCategory(name);
      setTimeout(() => { isAutoScrollingRef.current = false; }, 800);
    }
  };

  const scrollToFilteredCategory = (filterKey) => {
    const matchedCategory = Menuproducts.categories.find((cat) =>
      cat.products.some((item) => item.filters === filterKey)
    );
    if (matchedCategory) {
      const section = categoryRefs.current[matchedCategory.category];
      if (section) {
        isAutoScrollingRef.current = true;
        section.scrollIntoView({ behavior: "smooth", block: "start" });
        setActiveCategory(matchedCategory.category);
        setTimeout(() => { isAutoScrollingRef.current = false; }, 800);
      }
    }
  };

  const toggleFilter = (key) => {
    isFilteringRef.current = true;
    setFilters((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      if (!prev[key] && updated[key]) {
        setTimeout(() => scrollToFilteredCategory(key), 150);
      }
      return updated;
    });
    setTimeout(() => { isFilteringRef.current = false; }, 400);
  };

  const toggleAllFilters = () => {
    const allChecked = filters.veg && filters.nonVeg && filters.egg;
    const updated = { veg: !allChecked, nonVeg: !allChecked, egg: !allChecked };
    setFilters(updated);
    if (!allChecked) { setTimeout(scrollToContent, 150); }
  };

  const activeCount = Object.values(filters).filter(Boolean).length;

  const toggleItemDescription = (index) => {
    setExpandedItems((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleCategoryVisibility = (categoryName) => {
    setHiddenCategories((prev) => ({ ...prev, [categoryName]: !prev[categoryName] }));
    setExpandedCategory(null);
  };

  const tabRefs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isFilteringRef.current || isAutoScrollingRef.current) return;
        let visibleEntry = null;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!visibleEntry || entry.intersectionRatio > visibleEntry.intersectionRatio) {
              visibleEntry = entry;
            }
          }
        });
        const now = Date.now();
        if (now - lastUpdateRef.current < 150) return;
        lastUpdateRef.current = now;
        if (visibleEntry) {
          const categoryName = visibleEntry.target.getAttribute("data-category");
          setActiveCategory((prev) => {
            if (prev === categoryName) return prev;
            return categoryName;
          });
          const activeTab = tabRefs.current[categoryName];
          if (activeTab) {
            activeTab.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
          }
        }
      },
      { root: null, threshold: [0.2, 0.4, 0.6], rootMargin: "-100px 0px -50% 0px" }
    );
    Object.values(categoryRefs.current).forEach((section) => {
      if (section) observer.observe(section);
    });
    return () => {
      Object.values(categoryRefs.current).forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, [filteredCategories]);

  const dropdownVariants = {
    hidden: { opacity: 0, height: 0, transition: { duration: 0.3, ease: "easeInOut" } },
    visible: {
      opacity: 1, height: "auto",
      transition: {
        duration: 0.4, ease: [0.4, 0, 0.2, 1],
        height: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
        opacity: { duration: 0.25, delay: 0.1 }
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F3EE] font-raleway">

      {/* Sticky header block: logo + search + category tabs */}
      <div className="sticky top-0 z-30 bg-white">

        {/* Header */}
        <header className="px-4 py-3 flex items-center justify-between border-b border-[#E8DDD0]">
          <div className="flex items-center">
            <img
              src={logoImg.src}
              alt="Aureva"
              width={52}
              height={52}
              className="rounded-sm"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="relative group">
              <button className="flex items-center gap-1.5 bg-[#F6F3EE] border border-[#E8DDD0] px-3 py-1.5 text-[#5A5040]">
                <MdOutlineTableBar size={15} className="text-[#BDA070]" />
                <span className="font-medium tracking-wide">5</span>
              </button>
              <div className="absolute right-0 top-full mt-1.5 bg-[#181D24] border border-[#2E2A22] text-[#CCA665] text-[10px] tracking-widest uppercase px-2.5 py-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                Table 5
              </div>
            </div>
            <button className="flex items-center gap-1.5 bg-[#F6F3EE] border border-[#E8DDD0] px-3 py-1.5 text-[#5A5040]">
              <FiUser size={13} className="text-[#BDA070]" />
              <span className="font-medium tracking-wide hidden sm:inline">Group Order</span>
              <span className="font-medium tracking-wide sm:hidden">Group</span>
            </button>
          </div>
        </header>

        {/* Search + Filter bar */}
        <div className="border-b border-[#E8DDD0] px-4 py-2.5">
          <div className="flex gap-2.5 items-center">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-[#E8DDD0] bg-[#FDFAF6] px-4 py-2 pl-9 text-sm text-[#181D24] placeholder-[#BDA070] focus:outline-none focus:border-[#CCA665] focus:ring-1 focus:ring-[#CCA665]/30 transition-all"
              />
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#BDA070]" />
            </div>

            <div className="relative">
              <button
                onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-medium border border-[#E8DDD0] bg-white text-[#5A5040] hover:border-[#CCA665] hover:text-[#CCA665] transition-all"
              >
                Filter
                {activeCount > 0 && (
                  <span className="bg-[#CCA665] text-white text-[10px] px-1.5 py-0.5 leading-none">
                    {activeCount}
                  </span>
                )}
                <motion.svg
                  className="w-3 h-3"
                  animate={{ rotate: filterDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </motion.svg>
              </button>

              <AnimatePresence>
                {filterDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
                    animate={{ opacity: 1, y: 0, scaleY: 1 }}
                    exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 mt-1.5 w-44 bg-white border border-[#E8DDD0] shadow-lg z-40 origin-top"
                  >
                    <div className="p-3 space-y-1">
                      {[
                        { label: "All", checked: filters.veg && filters.nonVeg && filters.egg, onChange: toggleAllFilters },
                        { label: "Veg", checked: filters.veg, onChange: () => toggleFilter("veg") },
                        { label: "Non-Veg", checked: filters.nonVeg, onChange: () => toggleFilter("nonVeg") },
                        { label: "Egg", checked: filters.egg, onChange: () => toggleFilter("egg") },
                      ].map(({ label, checked, onChange }) => (
                        <label key={label} className="flex justify-between items-center cursor-pointer text-xs text-[#5A5040] hover:text-[#CCA665] px-1 py-1.5 transition-colors">
                          <span className="tracking-wide">{label}</span>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={onChange}
                            className="accent-[#CCA665] w-3.5 h-3.5"
                          />
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Category tab strip */}
        <div className="border-b border-[#E8DDD0]">
          <div className="flex overflow-x-auto scrollbar-hide px-3 py-3 gap-3">
          {menuCategories.map((cat) => {
            const isActive = activeCategory === cat.name;
            return (
              <div
                key={cat.id}
                ref={(el) => { if (el) tabRefs.current[cat.name] = el; }}
                className="shrink-0"
              >
                <button
                  onClick={() => scrollToCategory(cat.name)}
                  className="relative flex flex-col items-center w-16 group"
                >
                  <div
                    className={`w-14 h-12 flex items-center justify-center mb-1.5 transition-all duration-200 border ${
                      isActive
                        ? "border-[#CCA665] bg-[#FDFAF6]"
                        : "border-[#E8DDD0] bg-white group-hover:border-[#CCA665]/50"
                    }`}
                  >
                    <img src={iconMap[cat.icon]} alt={cat.name} className="object-cover w-full h-full" />
                    {isActive && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 25 }}
                        className="absolute -top-1.5 -right-1.5 bg-[#CCA665] text-white rounded-full p-0.5 shadow-sm"
                      >
                        <Check size={9} />
                      </motion.span>
                    )}
                  </div>
                  <span
                    className={`text-[10px] text-center leading-tight transition-colors duration-200 tracking-wide ${
                      isActive ? "text-[#CCA665] font-semibold" : "text-[#9E958B] group-hover:text-[#5A5040]"
                    }`}
                  >
                    {cat.name}
                  </span>
                  {isActive && (
                    <div className="mt-1 h-[1.5px] w-5 bg-[#CCA665]" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
        </div>
      </div>

      {/* Menu content */}
      <div ref={contentTopRef} className="px-4 py-5 pb-24 space-y-8">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <div
              key={category.category}
              data-category={category.category}
              ref={(el) => (categoryRefs.current[category.category] = el)}
            >
              {/* Category header */}
              <motion.button
                onClick={() => toggleCategoryVisibility(category.category)}
                className="w-full flex items-center justify-between mb-4 pb-2 border-b border-[#E8DDD0] group"
                whileHover={{ opacity: 0.85 }}
                transition={{ duration: 0.15 }}
              >
                <div className="flex items-baseline gap-2">
                  <h2 className="font-rufina text-lg text-[#181D24] tracking-wide">
                    {category.category}
                  </h2>
                  <span className="text-xs text-[#BDA070] font-raleway">
                    ({category.products.length})
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: hiddenCategories[category.category] ? 0 : 180 }}
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                >
                  <ChevronDown size={15} className="text-[#BDA070] group-hover:text-[#CCA665] transition-colors" />
                </motion.div>
              </motion.button>

              {/* Category items */}
              <AnimatePresence initial={false}>
                {!hiddenCategories[category.category] && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="space-y-5 overflow-hidden"
                  >
                    {category.products.map((item, index) => (
                      <div
                        key={`${category.category}-${index}`}
                        className="flex justify-between gap-4 pb-5 border-b border-dashed border-[#E8DDD0] last:border-0"
                      >
                        {/* Item info */}
                        <div className="flex-1 min-w-0">
                          <div className="w-4 h-4 flex items-center justify-center border border-[#E8DDD0] mb-1.5">
                            {filterIcons[item.filters] || filterIcons.veg}
                          </div>
                          <h3 className="font-medium text-[#181D24] text-sm leading-snug mb-0.5">
                            {item.name}
                          </h3>
                          <p className="text-[#CCA665] text-sm font-semibold mb-1.5 tracking-wide">
                            ₹{item.price}.00
                          </p>
                          {item.description && (
                            <p className="text-[11px] text-[#9E958B] leading-relaxed">
                              {expandedItems[`${category.category}-${index}`] ||
                                item.description.length <= MAX_LENGTH
                                ? item.description
                                : `${item.description.slice(0, MAX_LENGTH)}...`}
                              {item.description.length > MAX_LENGTH && (
                                <motion.button
                                  onClick={() => toggleItemDescription(`${category.category}-${index}`)}
                                  className="ml-1.5 text-[#CCA665] text-[11px] underline underline-offset-2"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  {expandedItems[`${category.category}-${index}`] ? "Less" : "More"}
                                </motion.button>
                              )}
                            </p>
                          )}
                        </div>

                        {/* Item image + Add button */}
                        <div className="relative w-28 shrink-0">
                          <div className="relative w-full aspect-square">
                            <img
                              src={foodImg.src}
                              alt={item.name}
                              className="object-cover rounded-md absolute inset-0 w-full h-full"
                            />
                          </div>
                          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-full flex justify-center px-2">
                            <motion.button
                              onClick={() => setSelectedItem(item)}
                              className="w-full max-w-22 bg-white border border-[#CCA665] py-1 text-[#CCA665] text-xs tracking-widest font-medium hover:bg-[#CCA665] hover:text-white transition-all duration-200"
                              whileTap={{ scale: 0.97 }}
                            >
                              + ADD
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center py-24"
          >
            <p className="font-rufina text-xl text-[#BDA070] tracking-wide mb-2">No dishes found</p>
            <p className="text-xs text-[#9E958B] tracking-widest uppercase">Try adjusting your filters</p>
          </motion.div>
        )}
      </div>

      {selectedItem && (
        <AddToCartModal
          onClose={() => setSelectedItem(null)}
          item={selectedItem}
        />
      )}
    </div>
  );
}
