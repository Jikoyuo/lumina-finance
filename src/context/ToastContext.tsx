import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";

type Toast = {
    id: number;
    msg: string;
    type: "success" | "error";
};

type ToastContextType = {
    showToast: (msg: string, type?: "success" | "error") => void;
};

export const ToastContext = React.createContext<ToastContextType>({
    showToast: () => { },
});

export const useToast = () => useContext(ToastContext);

export const ToastContainer = ({ children }: { children: React.ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (msg: string, type: "success" | "error" = "success") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, msg, type }]);
        setTimeout(
            () => setToasts((prev) => prev.filter((t) => t.id !== id)),
            3000
        );
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 20, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.9 }}
                            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border ${toast.type === "success"
                                    ? "bg-[#0F1815] border-green-500/20 text-green-400"
                                    : "bg-[#181111] border-red-500/20 text-red-400"
                                }`}
                        >
                            {toast.type === "success" ? (
                                <CheckCircle2 size={18} />
                            ) : (
                                <X size={18} />
                            )}
                            <span className="text-sm font-bold text-white">{toast.msg}</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};
