import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import Layout from '../components/Layout';
import { Users, Clock, AlertTriangle, CheckCircle, RefreshCw, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
    const [queue, setQueue] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const fetchQueue = async () => {
        try {
            const response = await axiosInstance.get('/queue');
            setQueue(response.data);
            setLoading(false);
            setLastUpdated(new Date());
        } catch (error) {
            console.error('Error fetching queue:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQueue();
        const interval = setInterval(fetchQueue, 5000); // Auto-refresh every 5 seconds
        return () => clearInterval(interval);
    }, []);

    const getStatusBadge = (urgency) => {
        switch (urgency) {
            case 'Emergency':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                        <AlertTriangle size={12} className="mr-1" /> Emergency
                    </span>
                );
            case 'Urgent':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                        <Clock size={12} className="mr-1" /> Urgent
                    </span>
                );
            case 'Normal':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        <CheckCircle size={12} className="mr-1" /> Normal
                    </span>
                );
            default:
                return null;
        }
    };

    const getRowStyle = (urgency) => {
        switch (urgency) {
            case 'Emergency': return 'bg-red-50/50 hover:bg-red-50 border-l-4 border-l-red-500';
            case 'Urgent': return 'bg-orange-50/50 hover:bg-orange-50 border-l-4 border-l-orange-400';
            default: return 'hover:bg-gray-50 border-l-4 border-l-transparent';
        }
    }

    // Calculate Stats
    const urgentCount = queue.filter(p => p.urgencyLevel === 'Emergency').length;
    const waitingCount = queue.length;
    // Estimated wait time: 15 mins per patient on average
    const avgWaitTime = waitingCount > 0 ? `${waitingCount * 15} min` : '0 min';

    const StatCard = ({ icon: Icon, label, value, color }) => (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-sm font-medium mb-1">{label}</p>
                <p className="text-3xl font-bold text-gray-900">{value}</p>
            </div>
            <div className={`p-3 rounded-xl ${color}`}>
                <Icon size={24} className="text-white" />
            </div>
        </div>
    );

    return (
        <Layout>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard icon={Users} label="Total Waiting" value={waitingCount} color="bg-brand-500" />
                <StatCard icon={AlertTriangle} label="Critical Cases" value={urgentCount} color="bg-red-500" />
                <StatCard icon={Clock} label="Est. Wait Time" value={avgWaitTime} color="bg-accent-500" />
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Live Patient Queue</h2>
                        <p className="text-xs text-gray-500 mt-1">
                            Last updated: {lastUpdated.toLocaleTimeString()}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                            <Filter size={16} />
                            Filter
                        </button>
                        <button onClick={fetchQueue} className="p-2 bg-white border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-brand-600 transition-colors">
                            <RefreshCw size={18} />
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-gray-500">
                        <div className="inline-block w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-4"></div>
                        <p>Refreshing data...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50/50">
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Token</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Urgency</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Department</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Arrival</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Symptoms</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <AnimatePresence>
                                    {queue.map((patient) => (
                                        <motion.tr
                                            key={patient._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className={`transition-colors text-sm ${getRowStyle(patient.urgencyLevel)}`}
                                        >
                                            <td className="px-6 py-4 font-mono font-bold text-gray-900 text-base">
                                                #{String(patient.tokenNumber).padStart(3, '0')}
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(patient.urgencyLevel)}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-700">
                                                {patient.department}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {new Date(patient.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td className="px-6 py-4 max-w-xs truncate text-gray-500" title={patient.symptoms}>
                                                {patient.symptoms}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button className="text-brand-600 hover:text-brand-800 font-medium text-xs hover:underline">
                                                    View Details
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                                {queue.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500 bg-gray-50">
                                            <div className="flex flex-col items-center justify-center">
                                                <Users size={40} className="text-gray-300 mb-2" />
                                                <p>No patients currently in queue</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Dashboard;
