"use client";

import Image from "next/image";
import Menuproducts from "../data/Menuproducts";
import { MdOutlineTableBar } from "react-icons/md";
import { FiUser } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import AddToCartModal, { CartFloatingButton } from "./Cart";
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
    veg: <FaCircle className="text-green-600" size={10} />,
    nonVeg: <IoTriangleSharp className="text-red-800" size={10} />,
    egg: <FaCircle className="text-yellow-500" size={10} />,
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
      contentTopRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const scrollToCategory = (name) => {
    const section = categoryRefs.current[name];
    if (section) {
      isAutoScrollingRef.current = true;

      section.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveCategory(name);

      setTimeout(() => {
        isAutoScrollingRef.current = false;
      }, 800); // enough time for smooth scroll
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

        setTimeout(() => {
          isAutoScrollingRef.current = false;
        }, 800);
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

    setTimeout(() => {
      isFilteringRef.current = false;
    }, 400);
  };

  const toggleAllFilters = () => {
    const allChecked = filters.veg && filters.nonVeg && filters.egg;
    const updated = { veg: !allChecked, nonVeg: !allChecked, egg: !allChecked };
    setFilters(updated);

    if (!allChecked) {
      setTimeout(scrollToContent, 150);
    }
  };

  const activeCount = Object.values(filters).filter(Boolean).length;

  const toggleItemDescription = (index) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleCategoryVisibility = (categoryName) => {
    setHiddenCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
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
            activeTab.scrollIntoView({
              behavior: "smooth",
              inline: "center",
              block: "nearest",
            });
          }
        }
      },
      {
        root: null,
        threshold: [0.2, 0.4, 0.6],
        rootMargin: "-100px 0px -50% 0px",
      }
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
    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
        height: {
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1]
        },
        opacity: {
          duration: 0.25,
          delay: 0.1
        }
      }
    }
  };

  const chevronVariants = {
    collapsed: { rotate: 0 },
    expanded: { rotate: 180 }
  };

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
            <span>9</span>
          </button>

          <button className="bg-gray-100 px-3 py-2 rounded-lg flex items-center gap-2">
            <FiUser size={15} />
            <span className="flex sm:hidden">Group <br /> Order</span>
            <span className="hidden sm:flex">Group Order</span>
          </button>
        </div>
      </header>

      <div className="sticky top-0 z-30 bg-white px-3 py-2">

        <div className="flex gap-3 items-center">

          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search item"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-1.5 pl-10 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-gray-300 bg-white hover:bg-gray-50 transition"
            >
              Filters
              {activeCount > 0 && (
                <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {activeCount}
                </span>
              )}
              <motion.svg
                className="w-3 h-3"
                animate={{ rotate: filterDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </motion.svg>
            </button>

            <AnimatePresence>
              {filterDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
                  animate={{ opacity: 1, y: 0, scaleY: 1 }}
                  exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-40 origin-top"
                >
                  <div className="p-3 space-y-2">
                    <label className="flex justify-between items-center cursor-pointer text-sm hover:bg-gray-50 p-1 rounded">
                      <span>All</span>
                      <input
                        type="checkbox"
                        checked={filters.veg && filters.nonVeg && filters.egg}
                        onChange={toggleAllFilters}
                        className="accent-orange-300 w-4 h-4"
                      />
                    </label>

                    <label className="flex justify-between items-center cursor-pointer text-sm hover:bg-gray-50 p-1 rounded">
                      <span>Veg</span>
                      <input
                        type="checkbox"
                        checked={filters.veg}
                        onChange={() => toggleFilter("veg")}
                        className="accent-orange-300 w-4 h-4"
                      />
                    </label>

                    <label className="flex justify-between items-center cursor-pointer text-sm hover:bg-gray-50 p-1 rounded">
                      <span>Non-Veg</span>
                      <input
                        type="checkbox"
                        checked={filters.nonVeg}
                        onChange={() => toggleFilter("nonVeg")}
                        className="accent-orange-300 w-4 h-4"
                      />
                    </label>

                    <label className="flex justify-between items-center cursor-pointer text-sm hover:bg-gray-50 p-1 rounded">
                      <span>Egg</span>
                      <input
                        type="checkbox"
                        checked={filters.egg}
                        onChange={() => toggleFilter("egg")}
                        className="accent-orange-300 w-4 h-4"
                      />
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="sticky top-[50px] z-18 bg-white ">
        <div className="flex overflow-x-auto px- py-3 space-x-3 scrollbar-hide">
          {menuCategories.map((cat) => {
            const isActive = activeCategory === cat.name;

            return (
              <div
                key={cat.id}
                ref={(el) => {
                  if (el) tabRefs.current[cat.name] = el;
                }}
                className="flex-1 flex flex-col items-center"
              >
                <button
                  onClick={() => scrollToCategory(cat.name)}
                  className="relative flex flex-col items-center w-full"
                >
                  {activeCategory === cat.name && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                      className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full p-1 shadow"
                    >
                      <Check size={12} />
                    </motion.span>
                  )}

                  <div
                    className={`w-14 h-12 flex items-center justify-center mb-1 rounded-lg border transition-all duration-200 ${activeCategory === cat.name
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-300"
                      }`}
                  >
                    <img
                      src={cat.icon}
                      alt={cat.name}
                      className="w-full h-full object-cover rounded-lg  "
                    />
                  </div>
                </button>

                <span
                  className={`text-xs mt-1 text-center transition ${activeCategory === cat.name
                      ? "text-orange-500 font-semibold"
                      : "text-gray-700 font-medium"
                    }`}
                >
                  {cat.name}
                </span>
                {activeCategory === cat.name && (
                  <div className="h-[2px] w-6 bg-orange-500 mt-1 rounded-full" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div ref={contentTopRef} className="mx-auto px-4 py-4 space-y-10">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <div
              key={category.category}
              data-category={category.category}
              ref={(el) => (categoryRefs.current[category.category] = el)}
              className="mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <motion.button
                  onClick={() => toggleCategoryVisibility(category.category)}
                  className="flex items-center gap-2 hover:bg-gray-50 border-b border-gray-300 py-2 transition-colors group w-full"
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex-1 flex items-center gap-1 py-2">
                    <h2 className="lg:text-xl font-semibold">
                      {category.category}
                    </h2>
                    <span className="text-lg font-semibold">
                      ({category.products.length})
                    </span>
                  </div>

                  <motion.div
                    animate={{ rotate: hiddenCategories[category.category] ? 0 : 180 }}
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <ChevronDown
                      size={18}
                      className="text-gray-400 group-hover:text-gray-600"
                    />
                  </motion.div>
                </motion.button>
              </div>

              <AnimatePresence initial={false}>
                {!hiddenCategories[category.category] && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="space-y-6 overflow-hidden"
                  >
                    {category.products.map((item, index) => (
                      <div
                        key={`${category.category}-${index}`}
                        className="flex justify-between gap-6 border-b-2   border-dotted border-gray-200
 pb-5"
                      >
                        <div className="flex-1">
                          <div className="w-4 h-4 flex items-center justify-center border-1 rounded-sm">
                            {filterIcons[item.filters] || filterIcons.veg}
                          </div>

                          <h3 className="font-semibold mt-1 lg:text-xl">{item.name}</h3>
                          <p className="lg:text-lg">₹ {item.price}.00</p>

                          {item.description && (
                            <p className="text-[12px] text-gray-400 mt-2">
                              {expandedItems[`${category.category}-${index}`] ||
                                item.description.length <= MAX_LENGTH
                                ? item.description
                                : `${item.description.slice(0, MAX_LENGTH)}...`}

                              {item.description.length > MAX_LENGTH && (
                                <motion.button
                                  onClick={() =>
                                    toggleItemDescription(`${category.category}-${index}`)
                                  }
                                  className="ml-2 text-orange-500 text-xs"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  {expandedItems[`${category.category}-${index}`]
                                    ? "Read less"
                                    : "Read more"}
                                </motion.button>
                              )}
                            </p>
                          )}
                        </div>

                        <div className="relative  w-full max-w-[125px] aspect-square flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="rounded-xl object-contain"
                            sizes="(max-width: 640px) 80px, (max-width: 1024px) 110px, 130px"
                          />

                          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-full flex flex-col items-center px-2">
                            <motion.button
                              onClick={() => setSelectedItem(item)}
                              className="w-full max-w-[90px] bg-white border border-orange-500 py-1 text-orange-500 text-sm rounded-md shadow hover:bg-orange-50 transition-colors"
                              whileHover={{ scale: 1.02, backgroundColor: "#fff7ed" }}
                              whileTap={{ scale: 0.98 }}
                              transition={{ duration: 0.15 }}
                            >
                              + Add
                            </motion.button>

                            <span className="text-xs text-gray-500 mt-1 text-center">
                              Customisable
                            </span>
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
            className="text-center py-20"
          >
            <p className="text-gray-500 text-lg">No items found matching your filters or search.</p>
          </motion.div>
        )}
      </div>

      <CartFloatingButton />

      {selectedItem && (
        <AddToCartModal
          onClose={() => setSelectedItem(null)}
          item={selectedItem}
        />
      )}
    </div>
  );
}