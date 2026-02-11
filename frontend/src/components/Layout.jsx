import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-100 dark:bg-[#020617] font-sans text-slate-900 dark:text-slate-100 transition-colors duration-500">
            <Navbar />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-fast mb-20">
                {children}
            </main>
            <footer className="glass-card !border-x-0 !border-b-0 py-10 mt-auto">
                <div className="container mx-auto px-4 text-center text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">
                    &copy; {new Date().getFullYear()} TRIAGE.AI • Elite Medical Protocol
                </div>
            </footer>
        </div>
    );
};

export default Layout;
