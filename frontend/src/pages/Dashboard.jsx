import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import Layout from '../components/Layout';
import {
    Users, Clock, AlertTriangle, CheckCircle, RefreshCw,
    Filter, Trash2, ChevronRight, X, Search, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
    const [queue, setQueue] = useState([]);
    const [filteredQueue, setFilteredQueue] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [alert, setAlert] = useState(null);
    const [selectedPatient, setSelectedPatient] = useState(null);

    // Filters
    const [filterUrgency, setFilterUrgency] = useState('All');
    const [filterDept, setFilterDept] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchQueue = async () => {
        try {
            const response = await axiosInstance.get('/queue');
            const newQueue = response.data;

            if (queue.length > 0) {
                const newEmergencies = newQueue.filter(p =>
                    p.urgencyLevel === 'Emergency' && !queue.find(oldP => oldP._id === p._id)
                );
                if (newEmergencies.length > 0) {
                    setAlert({
                        title: 'EMERGENCY ALERT',
                        message: `Critical: Token #${String(newEmergencies[0].tokenNumber).padStart(3, '0')}`,
                    });
                    setTimeout(() => setAlert(null), 6000);
                }
            }

            setQueue(newQueue);
            setLoading(false);
            setLastUpdated(new Date());
        } catch (error) {
            console.error('Error fetching queue:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQueue();
        const interval = setInterval(fetchQueue, 5000);
        return () => clearInterval(interval);
    }, []); // Run once on mount

    // Apply Filters
    useEffect(() => {
        let result = [...queue];

        if (filterUrgency !== 'All') {
            result = result.filter(p => p.urgencyLevel === filterUrgency);
        }

        if (filterDept !== 'All') {
            result = result.filter(p => p.department === filterDept);
        }

        if (searchQuery) {
            result = result.filter(p =>
                p.symptoms.toLowerCase().includes(searchQuery.toLowerCase()) ||
                String(p.tokenNumber).includes(searchQuery)
            );
        }

        setFilteredQueue(result);
    }, [queue, filterUrgency, filterDept, searchQuery]);

    const handleComplete = async (id) => {
        try {
            await axiosInstance.patch(`/queue/${id}/complete`);
            fetchQueue();
        } catch (error) {
            console.error('Error completing case:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to permanently delete this patient record?')) {
            try {
                await axiosInstance.delete(`/queue/${id}`);
                fetchQueue();
            } catch (error) {
                console.error('Error deleting case:', error);
            }
        }
    };

    const departments = ['All', ...new Set(queue.map(p => p.department))];

    const getStatusBadge = (urgency) => {
        const styles = {
            Emergency: 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20 ring-4 ring-red-500/5 animate-pulse',
            Urgent: 'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/20',
            Normal: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
        };
        const Icons = { Emergency: AlertTriangle, Urgent: Clock, Normal: CheckCircle };
        const Icon = Icons[urgency];

        return (
            <span className={`status-pill ${styles[urgency]} flex items-center gap-1.5`}>
                <Icon size={12} /> {urgency}
            </span>
        );
    };

    return (
        <Layout>
            {/* Real-time Overlay Alert */}
            <AnimatePresence>
                {alert && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-8 left-1/2 z-[60] w-full max-w-sm"
                    >
                        <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-2xl border border-white/10 flex items-center gap-4">
                            <div className="bg-red-500 p-2.5 rounded-2xl shadow-lg shadow-red-500/40">
                                <AlertTriangle size={24} className="animate-bounce" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400 mb-0.5">{alert.title}</p>
                                <p className="font-bold text-sm">{alert.message}</p>
                            </div>
                            <button onClick={() => setAlert(null)} className="p-1 hover:bg-white/10 rounded-xl transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                    { label: 'Active Queue', value: queue.length, icon: Users, color: 'text-brand-600', bg: 'bg-brand-100', darkColor: 'dark:text-brand-400', darkBg: 'dark:bg-brand-500/20' },
                    { label: 'Emergency', value: queue.filter(p => p.urgencyLevel === 'Emergency').length, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100', darkColor: 'dark:text-red-400', darkBg: 'dark:bg-red-500/20' },
                    { label: 'Wait Estimate', value: `${queue.length * 12}m`, icon: Clock, color: 'text-slate-700', bg: 'bg-slate-200', darkColor: 'dark:text-slate-300', darkBg: 'dark:bg-slate-800' }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-6 rounded-[2.5rem] flex items-center justify-between border-slate-200 dark:border-slate-800"
                    >
                        <div>
                            <p className="text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter tabular-nums">{stat.value}</p>
                        </div>
                        <div className={`p-4 rounded-3xl shadow-sm ${stat.bg} ${stat.darkBg} ${stat.color} ${stat.darkColor}`}>
                            <stat.icon size={32} />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="glass-card rounded-[2.5rem] overflow-hidden">
                {/* Dashboard Controls */}
                <div className="p-8 border-b border-slate-100 flex flex-col lg:flex-row justify-between items-center gap-6 bg-white/30">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by symptoms or token..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 pr-6 py-3.5 glass-input rounded-2xl w-full md:w-80 text-sm font-medium"
                            />
                        </div>
                        <div className="h-10 w-px bg-slate-200" />
                        <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live Updates</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100/50 rounded-xl border border-slate-200">
                            <Filter size={14} className="text-slate-500" />
                            <select
                                value={filterUrgency}
                                onChange={(e) => setFilterUrgency(e.target.value)}
                                className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer"
                            >
                                <option value="All">All Severity</option>
                                <option value="Emergency">Emergency</option>
                                <option value="Urgent">Urgent</option>
                                <option value="Normal">Normal</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100/50 rounded-xl border border-slate-200">
                            <select
                                value={filterDept}
                                onChange={(e) => setFilterDept(e.target.value)}
                                className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer"
                            >
                                {departments.map(d => <option key={d} value={d}>{d} Dept</option>)}
                            </select>
                        </div>
                        <button onClick={fetchQueue} className="p-3 glass-input rounded-xl text-slate-600 hover:text-brand-600">
                            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                        </button>
                    </div>
                </div>

                {/* Queue Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-100 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Patient Token</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Clinical Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Department</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Symptoms Summary</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Arrival</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <AnimatePresence mode="popLayout">
                                {filteredQueue.map((patient) => (
                                    <motion.tr
                                        key={patient._id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className={`group transition-all hover:bg-brand-50/50 dark:hover:bg-brand-500/5 ${patient.urgencyLevel === 'Emergency' ? 'bg-red-50/30 dark:bg-red-500/5' : ''}`}
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center font-black text-brand-600 dark:text-brand-400 text-lg tracking-tighter">
                                                    #{String(patient.tokenNumber).padStart(3, '0')}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            {getStatusBadge(patient.urgencyLevel)}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{patient.department}</div>
                                            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Assigned AI</div>
                                        </td>
                                        <td className="px-8 py-6 max-w-sm">
                                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed" title={patient.symptoms}>
                                                {patient.symptoms}
                                            </p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                                {new Date(patient.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Logged Arrival</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleComplete(patient._id)}
                                                    className="p-2.5 bg-brand-50 text-brand-600 rounded-xl hover:bg-brand-600 hover:text-white transition-all shadow-sm border border-brand-100"
                                                    title="Mark Complete"
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                                <button
                                                    onClick={() => setSelectedPatient(patient)}
                                                    className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-brand-600 hover:text-white transition-all border border-slate-200 dark:border-slate-700"
                                                    title="View Details"
                                                >
                                                    <Info size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(patient._id)}
                                                    className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all border border-red-100"
                                                    title="Delete Record"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                            {filteredQueue.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center text-slate-400 bg-slate-50/30">
                                        <div className="flex flex-col items-center justify-center grayscale opacity-50">
                                            <Users size={64} className="mb-4 stroke-[1px]" />
                                            <p className="font-bold text-sm tracking-widest uppercase">No clinical records found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Patient Detail Modal */}
            <AnimatePresence>
                {selectedPatient && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedPatient(null)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-3xl overflow-hidden"
                        >
                            <div className="p-10">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-3xl font-black text-brand-600 tracking-tighter">Token #{String(selectedPatient.tokenNumber).padStart(3, '0')}</span>
                                            {getStatusBadge(selectedPatient.urgencyLevel)}
                                        </div>
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Clinical Detail Overview</p>
                                    </div>
                                    <button onClick={() => setSelectedPatient(null)} className="p-2 hover:bg-slate-100 rounded-2xl transition-colors text-slate-400">
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="space-y-8">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Primary Department</p>
                                            <p className="text-xl font-bold text-slate-800">{selectedPatient.department}</p>
                                        </div>
                                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Arrival Time</p>
                                            <p className="text-xl font-bold text-slate-800">{new Date(selectedPatient.createdAt).toLocaleTimeString()}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Reported Symptoms</p>
                                        <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 italic text-slate-600 leading-relaxed text-lg">
                                            "{selectedPatient.symptoms}"
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 flex gap-4">
                                    <button
                                        onClick={() => {
                                            handleComplete(selectedPatient._id);
                                            setSelectedPatient(null);
                                        }}
                                        className="btn-primary flex-1 flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle size={20} /> Mark as Processed
                                    </button>
                                    <button
                                        onClick={() => setSelectedPatient(null)}
                                        className="px-8 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </Layout>
    );
};

export default Dashboard;
