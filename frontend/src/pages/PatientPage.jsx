import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../api/axiosInstance';
import Layout from '../components/Layout';
import { Send, AlertCircle, CheckCircle2, Ticket, Activity, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PatientPage = () => {
    const [symptoms, setSymptoms] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new window.webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => setIsListening(false);
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setSymptoms((prev) => prev ? `${prev} ${transcript}` : transcript);
            };
            recognition.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        }
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            // Simulate slight network delay for better UX feel
            await new Promise(resolve => setTimeout(resolve, 800));
            const response = await axiosInstance.post('/triage', { symptoms });
            setResult(response.data);
        } catch (err) {
            setError('Failed to process triage request. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setSymptoms('');
        setResult(null);
    };

    return (
        <Layout>
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Patient Intake</h2>
                    <p className="text-gray-500">Describe your symptoms for immediate AI-assisted triage.</p>
                </div>

                <AnimatePresence mode="wait">
                    {!result ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                        >
                            <div className="p-1 bg-gradient-to-r from-brand-500 to-accent-500" />
                            <div className="p-8">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="symptoms">
                                            Symptoms Description
                                        </label>
                                        <div className="relative">
                                            <textarea
                                                className="w-full h-40 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-none text-gray-700 placeholder-gray-400"
                                                id="symptoms"
                                                placeholder="e.g., I have a sharp pain in my chest radiating to my left arm, accompanied by shortness of breath..."
                                                value={symptoms}
                                                onChange={(e) => setSymptoms(e.target.value)}
                                                required
                                                disabled={loading}
                                            />
                                            <div className="absolute bottom-3 right-3 flex gap-2">
                                                {recognitionRef.current && (
                                                    <button
                                                        type="button"
                                                        onClick={toggleListening}
                                                        className={`p-2 rounded-full transition-colors ${isListening
                                                                ? 'bg-red-100 text-red-600 animate-pulse'
                                                                : 'bg-gray-100 text-gray-400 hover:text-brand-600'
                                                            }`}
                                                        title="Voice Input"
                                                    >
                                                        {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        {isListening && (
                                            <p className="text-xs text-red-500 mt-1 animate-pulse font-medium">Listening... Speak now</p>
                                        )}
                                    </div>

                                    {error && (
                                        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
                                            <AlertCircle size={16} />
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading || !symptoms.trim()}
                                        className={`w-full py-3.5 px-6 rounded-xl text-white font-semibold shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] ${loading || !symptoms.trim()
                                                ? 'bg-gray-300 cursor-not-allowed text-gray-500 shadow-none'
                                                : 'bg-brand-600 hover:bg-brand-700 hover:shadow-brand-500/30'
                                            }`}
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Analyzing...
                                            </>
                                        ) : (
                                            <>
                                                <span>Submit for Triage</span>
                                                <Send size={18} />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden relative"
                        >
                            <div className={`absolute top-0 left-0 w-full h-2 ${result.urgencyLevel === 'Emergency' ? 'bg-red-500' :
                                    result.urgencyLevel === 'Urgent' ? 'bg-orange-500' : 'bg-green-500'
                                }`} />

                            <div className="p-8 text-center">
                                <div className="mb-6 flex justify-center">
                                    <div className={`p-4 rounded-full ${result.urgencyLevel === 'Emergency' ? 'bg-red-100 text-red-600' :
                                            result.urgencyLevel === 'Urgent' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                                        }`}>
                                        {result.urgencyLevel === 'Emergency' ? <AlertCircle size={48} /> : <CheckCircle2 size={48} />}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900 mb-1">Triage Complete</h3>
                                <p className="text-gray-500 mb-8">Patient has been added to the queue.</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Assigned Department</p>
                                        <p className="text-lg font-bold text-gray-800">{result.department}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Urgency Level</p>
                                        <p className={`text-lg font-bold ${result.urgencyLevel === 'Emergency' ? 'text-red-600' :
                                                result.urgencyLevel === 'Urgent' ? 'text-orange-600' : 'text-green-600'
                                            }`}>{result.urgencyLevel}</p>
                                    </div>
                                </div>

                                <div className="bg-brand-50 rounded-xl p-6 border border-brand-100 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Ticket size={100} />
                                    </div>
                                    <p className="text-brand-600 font-medium mb-1">Your Token Number</p>
                                    <p className="text-5xl font-black text-brand-700 tracking-tighter">
                                        #{String(result.tokenNumber).padStart(3, '0')}
                                    </p>
                                </div>

                                <button
                                    onClick={resetForm}
                                    className="mt-8 text-gray-500 hover:text-gray-800 font-medium text-sm underline decoration-gray-300 hover:decoration-gray-800 underline-offset-4 transition-all"
                                >
                                    Process Next Patient
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Layout>
    );
};

export default PatientPage;
