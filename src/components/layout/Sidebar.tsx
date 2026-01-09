import { motion } from "framer-motion";
import {
    LayoutDashboard,
    LineChart,
    Wallet,
    ArrowRightLeft,
    Sparkles,
    History,
    Settings,
    Activity,
    Zap,
} from "lucide-react";

type SidebarProps = {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    currentView: string;
    setCurrentView: (view: string) => void;
};

export const Sidebar = ({ isOpen, setIsOpen, currentView, setCurrentView }: SidebarProps) => {
    const menuItems = [
        {
            id: "dashboard",
            icon: <LayoutDashboard size={20} />,
            label: "Dashboard",
        },
        { id: "market", icon: <LineChart size={20} />, label: "Market" },
        { id: "wallet", icon: <Wallet size={20} />, label: "My Wallet" },
        { id: "swap", icon: <ArrowRightLeft size={20} />, label: "Swap" },
        { id: "ai", icon: <Sparkles size={20} />, label: "Lumina AI" },
        { id: "history", icon: <History size={20} />, label: "History" },
        { id: "settings", icon: <Settings size={20} />, label: "Settings" },
    ];

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#0F0F13] border-r border-white/5 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
                    } md:translate-x-0 flex flex-col`}
            >
                <div className="p-8 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.5)]">
                        <Activity className="text-white" size={18} />
                    </div>
                    <span className="text-2xl font-bold text-white tracking-tighter">
                        Lumina.
                    </span>
                </div>
                <nav className="px-4 space-y-2 flex-1">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setCurrentView(item.id);
                                setIsOpen(false);
                            }}
                            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 relative overflow-hidden group ${currentView === item.id
                                    ? "text-white"
                                    : "text-gray-500 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            {currentView === item.id && (
                                <motion.div
                                    layoutId="activeNav"
                                    className="absolute inset-0 bg-indigo-600/10 border border-indigo-500/20 rounded-xl"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span
                                className={`relative z-10 ${currentView === item.id ? "text-indigo-400" : ""
                                    }`}
                            >
                                {item.icon}
                            </span>
                            <span
                                className={`text-sm font-bold relative z-10 ${currentView === item.id ? "text-white" : ""
                                    }`}
                            >
                                {item.label}
                            </span>
                            {item.id === "ai" && (
                                <span className="absolute right-4 w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                            )}
                        </button>
                    ))}
                </nav>

                {/* Pro Card */}
                <div className="p-6">
                    <div className="bg-gradient-to-br from-[#18181C] to-black border border-white/10 rounded-2xl p-4 relative overflow-hidden group cursor-pointer">
                        <div className="absolute inset-0 bg-indigo-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2 text-indigo-400 font-bold text-xs">
                                <Zap size={14} fill="currentColor" /> PRO MEMBER
                            </div>
                            <p className="text-white text-sm font-bold mb-3">
                                Upgrade to unlock <br />
                                zero fees.
                            </p>
                            <button className="w-full py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors">
                                Upgrade
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};
