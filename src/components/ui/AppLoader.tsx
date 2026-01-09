import { motion } from "framer-motion";
import { Activity } from "lucide-react";

export const AppLoader = () => (
    <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="fixed inset-0 z-[999] bg-[#050505] flex flex-col items-center justify-center"
    >
        <div className="relative">
            <motion.div
                animate={{ scale: [0.8, 1, 0.8], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-24 h-24 rounded-full bg-indigo-600/20 blur-xl absolute inset-0"
            />
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-20 h-20 rounded-2xl bg-[#0F0F13] border border-white/10 flex items-center justify-center shadow-2xl"
            >
                <Activity size={40} className="text-indigo-500" />
            </motion.div>
        </div>
        <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-white mt-8 tracking-widest"
        >
            LUMINA
        </motion.h1>
        <div className="w-48 h-1 bg-white/10 rounded-full mt-4 overflow-hidden">
            <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="h-full bg-indigo-600 w-full"
            />
        </div>
    </motion.div>
);
