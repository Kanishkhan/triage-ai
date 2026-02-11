import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, LayoutDashboard, Stethoscope } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const Navbar = () => {
    const location = useLocation();

    const NavItem = ({ to, icon: Icon, label }) => {
        const isActive = location.pathname === to;
        return (
            <Link
                to={to}
                className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200",
                    isActive
                        ? "bg-brand-100 text-brand-700 font-medium shadow-sm"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
            >
                <Icon size={18} />
                <span>{label}</span>
            </Link>
        );
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-3">
                        <div className="bg-brand-600 p-2 rounded-lg text-white shadow-lg shadow-brand-500/30">
                            <Activity size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight">TRIAGE.AI</h1>
                            <p className="text-xs text-gray-500 font-medium">Intelligent Healthcare Routing</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-1">
                        <NavItem to="/" icon={Stethoscope} label="Patient Check-In" />
                        <NavItem to="/dashboard" icon={LayoutDashboard} label="Staff Board" />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
