"use client"

import Image from "next/image";
import Link from "next/link";

export default function AurevaCard() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0E0A09] relative overflow-hidden font-raleway">

            {/* Concentric decorative rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-[#CCA665]/[0.08] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-[#CCA665]/[0.10] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full border border-[#CCA665]/[0.12] pointer-events-none" />

            {/* Corner ornaments */}
            <div className="absolute top-8 left-8 w-10 h-10 border-t border-l border-[#CCA665]/30 pointer-events-none" />
            <div className="absolute top-8 right-8 w-10 h-10 border-t border-r border-[#CCA665]/30 pointer-events-none" />
            <div className="absolute bottom-24 left-8 w-10 h-10 border-b border-l border-[#CCA665]/30 pointer-events-none" />
            <div className="absolute bottom-24 right-8 w-10 h-10 border-b border-r border-[#CCA665]/30 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center px-8">

                {/* Logo */}
                <Image
                    src="/website/aureva-logo.png"
                    alt="Aureva"
                    width={64}
                    height={64}
                    className="rounded-sm opacity-75 mb-8"
                />

                {/* Top ornamental rule */}
                <div className="flex items-center gap-4 mb-7">
                    <div className="w-14 h-px bg-gradient-to-r from-transparent to-[#CCA665]" />
                    <div className="w-1.5 h-1.5 rotate-45 bg-[#CCA665]" />
                    <div className="w-14 h-px bg-gradient-to-l from-transparent to-[#CCA665]" />
                </div>

                {/* Brand wordmark */}
                <h1
                    className="font-rufina text-5xl sm:text-6xl font-normal tracking-[0.22em] text-transparent bg-clip-text mb-3"
                    style={{ backgroundImage: 'linear-gradient(135deg, #EAC25E 0%, #CCA665 55%, #C89B5A 100%)' }}
                >
                    AUREVA
                </h1>

                {/* Tagline */}
                <p className="text-[#9E958B] text-[11px] tracking-[0.35em] uppercase mb-7">
                    Fine Dining &nbsp;·&nbsp; Exquisite Flavours
                </p>

                {/* Bottom ornamental rule */}
                <div className="flex items-center gap-4 mb-11">
                    <div className="w-14 h-px bg-gradient-to-r from-transparent to-[#CCA665]" />
                    <div className="w-1.5 h-1.5 rotate-45 bg-[#CCA665]" />
                    <div className="w-14 h-px bg-gradient-to-l from-transparent to-[#CCA665]" />
                </div>

                {/* Primary CTA */}
                <Link
                    href="/website/menu"
                    className="inline-flex items-center gap-3 border border-[#CCA665]/60 text-[#CCA665] px-10 py-3.5 text-[11px] tracking-[0.3em] uppercase hover:bg-[#CCA665] hover:text-[#0E0A09] hover:border-[#CCA665] transition-all duration-300"
                >
                    View Menu
                </Link>

                {/* Footer caption */}
                <p className="text-[#3a3228] text-[10px] tracking-[0.3em] uppercase mt-12">
                    In-Restaurant Ordering
                </p>
            </div>
        </div>
    );
}
