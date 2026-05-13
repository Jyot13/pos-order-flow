"use client"

import Image from "next/image";
import Link from "next/link";

export default function CravoryCard() {
    return (
        <div
            className="min-h-screen px-3 flex items-center justify-center bg-[#fff8f4] relative overflow-hidden"
            style={{
                backgroundImage: "url('/website/background.png')",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "600px",
            }}
        >
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-10 right-20 w-40 h-40 border border-orange-200 rounded-full opacity-40" />
                <div className="absolute bottom-20 left-16 w-32 h-32 border border-orange-200 rounded-full opacity-40" />
                <div className="absolute top-1/2 left-10 grid grid-cols-5 gap-2 opacity-40">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <span key={i} className="w-1.5 h-1.5 bg-orange-200 rounded-full" />
                    ))}
                </div>
            </div>
            <div className="relative z-10 bg-white rounded-xl shadow-2xl px-10 py-8 w-[320px] text-center">
                <div className="flex justify-center mb-2">
                    <Image
                        src="/website/logo1.png"
                        alt="Cravory"
                        width={100}
                        height={80}
                    />
                </div>
                <h2 className="text-xl font-medium text-gray-800 mb-4">
                    Cravory
                </h2>
                <Link
                    href="/website/menu"
                    className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition"
                >
                    Order Now
                    <span className="text-lg">→</span>
                </Link>

            </div>
        </div>
    );
}
