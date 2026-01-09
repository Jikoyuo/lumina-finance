import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, Shield, CheckCircle2 } from "lucide-react";

type NotificationDropdownProps = {
    isOpen: boolean;
    close: () => void;
};

export const NotificationDropdown = ({ isOpen, close }: NotificationDropdownProps) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute top-12 right-0 w-80 bg-[#121215] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#0F0F13]">
                    <h4 className="font-bold text-white text-sm">Notifications</h4>
                    <button onClick={close}>
                        <X size={14} className="text-gray-500 hover:text-white" />
                    </button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                    {[
                        {
                            msg: "ETH Price Alert: Up 5% in 1h",
                            time: "2 min ago",
                            type: "up",
                        },
                        {
                            msg: "Staking Reward Claimed",
                            time: "1 hour ago",
                            type: "success",
                        },
                        { msg: "New Login from ID", time: "5 hours ago", type: "alert" },
                    ].map((n, i) => (
                        <div
                            key={i}
                            className="p-4 hover:bg-white/5 border-b border-white/5 last:border-0 flex gap-3 cursor-pointer group"
                        >
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${n.type === "up"
                                        ? "bg-green-500/10 text-green-500"
                                        : n.type === "alert"
                                            ? "bg-red-500/10 text-red-500"
                                            : "bg-indigo-500/10 text-indigo-500"
                                    }`}
                            >
                                {n.type === "up" ? (
                                    <TrendingUp size={14} />
                                ) : n.type === "alert" ? (
                                    <Shield size={14} />
                                ) : (
                                    <CheckCircle2 size={14} />
                                )}
                            </div>
                            <div>
                                <p className="text-sm text-gray-300 font-medium group-hover:text-white transition-colors">
                                    {n.msg}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">{n.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="w-full py-2 text-xs text-center text-gray-500 hover:text-white hover:bg-white/5 transition-colors border-t border-white/5">
                    Mark all as read
                </button>
            </motion.div>
        )}
    </AnimatePresence>
);
