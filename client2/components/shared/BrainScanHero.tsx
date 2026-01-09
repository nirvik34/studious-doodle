"use client";

import { motion } from "framer-motion";
import { Brain } from "lucide-react";

export function BrainScanHero() {
    return (
        <div className="relative flex items-center justify-center w-64 h-64 mx-auto my-8">
            <motion.div
                initial={{ opacity: 0.5, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                className="absolute inset-0 bg-blue-100 rounded-full opacity-20 blur-xl"
            />
            <div className="relative z-10 text-blue-900">
                <Brain size={120} strokeWidth={1} />
            </div>
            <motion.div
                className="absolute w-full h-1 bg-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.5)] z-20"
                initial={{ top: "0%" }}
                animate={{ top: "100%" }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
        </div>
    );
}
