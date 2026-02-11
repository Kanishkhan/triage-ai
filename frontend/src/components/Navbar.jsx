import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, LayoutDashboard, Stethoscope, Moon, Sun } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const Navbar = () => {
    const location = useLocation();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark' ||
                (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    const NavItem = ({ to, icon: Icon, label }) => {
        const isActive = location.pathname === to;
        return (
            <Link
                to={to}
                className={cn(
                    "flex items-center space-x-2 px-6 py-2.5 rounded-2xl transition-all duration-300",
                    isActive
                        ? "bg-brand-600 text-white font-bold shadow-lg shadow-brand-600/25"
                        : "text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-300 font-bold"
                )}
            >
                <Icon size={18} />
                <span className="text-sm">{label}</span>
            </Link>
        );
    };

    return (
        <nav className="sticky top-0 z-50 glass-card !rounded-none !border-x-0 !border-t-0 shadow-sm border-b border-slate-200 dark:border-slate-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center space-x-8">
                        <div className="flex items-center space-x-4">
                            <div className="bg-brand-600 p-2.5 rounded-2xl text-white shadow-xl shadow-brand-600/30 ring-4 ring-brand-500/10">
                                <Activity size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter leading-none block">TRIAGE.AI</h1>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Elite Clinic OS</p>
                            </div>
                        </div>

                        <div className="hidden lg:flex flex-col border-l border-slate-200 dark:border-slate-800 pl-8">
                            <span className="text-[10px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-widest leading-none mb-1">Live Time</span>
                            <span className="text-sm font-black text-slate-700 dark:text-white tabular-nums">
                                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                            <NavItem to="/" icon={Stethoscope} label="Registration" />
                            <NavItem to="/dashboard" icon={LayoutDashboard} label="Staff Ops" />
                        </div>

                        <div className="w-px h-8 bg-slate-300 dark:bg-slate-800 mx-2" />

                        <button
                            onClick={() => setIsDark(!isDark)}
                            className="p-3 glass-input !rounded-2xl text-slate-700 dark:text-yellow-400 hover:scale-105 transition-transform bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700"
                            title="Toggle Theme"
                        >
                            {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
