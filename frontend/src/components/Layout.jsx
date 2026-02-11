import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <Navbar />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                {children}
            </main>
            <footer className="bg-white border-t border-gray-200 mt-auto">
                <div className="container mx-auto px-4 py-6 text-center text-gray-400 text-sm">
                    &copy; {new Date().getFullYear()} TRIAGE.AI System. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Layout;
