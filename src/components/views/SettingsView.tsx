import { motion } from "framer-motion";
import { User, Shield } from "lucide-react";

export const SettingsView = () => (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="max-w-3xl"
    >
        <h2 className="text-3xl font-bold text-white mb-8">Settings</h2>
        <div className="space-y-6">
            <div className="bg-[#121215] border border-white/5 rounded-3xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <User size={20} className="text-indigo-400" /> Profile
                </h3>
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-xl font-bold text-white">
                        AM
                    </div>
                    <div>
                        <p className="text-white font-bold">Alex Morgan</p>
                        <p className="text-gray-500 text-sm">alex.morgan@lumina.fi</p>
                    </div>
                    <button className="ml-auto px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white font-bold transition-colors">
                        Edit
                    </button>
                </div>
            </div>
            <div className="bg-[#121215] border border-white/5 rounded-3xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Shield size={20} className="text-green-400" /> Security
                </h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-[#0A0A0C] rounded-xl border border-white/5">
                        <div>
                            <p className="text-white font-bold">2-Factor Authentication</p>
                            <p className="text-gray-500 text-xs">
                                Secure your account with Google Authenticator
                            </p>
                        </div>
                        <div className="w-12 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </motion.div>
);
