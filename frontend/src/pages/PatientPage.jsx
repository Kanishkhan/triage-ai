import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../api/axiosInstance';
import Layout from '../components/Layout';
import { Send, AlertCircle, CheckCircle2, Ticket, Activity, Mic, MicOff, MoveLeft, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PatientPage = () => {
    const [symptoms, setSymptoms] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isListening, setIsListening] = useState(false);
    const [micError, setMicError] = useState(null);
    const recognitionRef = useRef(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                setIsListening(true);
                setMicError(null);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognition.onresult = (event) => {
                let currentTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    currentTranscript += event.results[i][0].transcript;
                }
                if (event.results[event.results.length - 1].isFinal) {
                    setSymptoms((prev) => prev ? `${prev} ${currentTranscript}` : currentTranscript);
                }
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);

                const messages = {
                    'not-allowed': 'Microphone access denied. Please check browser permissions.',
                    'network': 'Network error detected. Please check your connection.',
                    'no-speech': 'No speech detected. Please try again.',
                    'audio-capture': 'No microphone found or audio capture failed.',
                    'not-supported': 'Speech recognition is not supported in this browser.'
                };

                setMicError(messages[event.error] || `Microphone error: ${event.error}`);
            };

            recognitionRef.current = recognition;
        } else {
            setMicError('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
        }
    }, []);

    const toggleListening = () => {
        if (!recognitionRef.current) return;

        try {
            if (isListening) {
                recognitionRef.current.stop();
            } else {
                setMicError(null);
                recognitionRef.current.start();
            }
        } catch (err) {
            console.error('Mic toggle error:', err);
            setIsListening(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await axiosInstance.post('/triage', { symptoms });
            setResult(response.data);
        } catch (err) {
            setError('System encountered an analysis error. Please re-state symptoms.');
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
            <div className="max-w-3xl mx-auto py-12">
                <AnimatePresence mode="popLayout">
                    {!result ? (
                        <motion.div
                            key="form-container"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                            className="glass-card rounded-[3rem] overflow-hidden"
                        >
                            <div className="p-12">
                                <header className="text-center mb-12">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-50 dark:bg-brand-500/10 rounded-full border border-brand-200 dark:border-brand-500/20 mb-4">
                                        <Sparkles size={14} className="text-brand-600 dark:text-brand-400" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-600 dark:text-brand-400">AI Triage Protocol V4.2</span>
                                    </div>
                                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">Symptom Analysis</h2>
                                    <p className="text-slate-600 dark:text-slate-400 font-medium">State your condition clearly for automated routing and priority assignment.</p>
                                </header>

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="relative">
                                        <textarea
                                            className="w-full h-56 p-8 glass-input rounded-[2.5rem] text-lg font-medium resize-none shadow-sm focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-900 dark:text-slate-100"
                                            placeholder="Example: I'm experiencing intense abdominal pain for 2 hours, feel lightheaded and have a slight fever..."
                                            value={symptoms}
                                            onChange={(e) => setSymptoms(e.target.value)}
                                            required
                                            disabled={loading}
                                        />

                                        <div className="absolute bottom-6 right-6 flex items-center gap-4">
                                            {recognitionRef.current && (
                                                <div className="flex flex-col items-end gap-2">
                                                    {isListening && (
                                                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest animate-pulse mr-2 bg-red-50 px-2 py-1 rounded-md">Recording...</span>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={toggleListening}
                                                        className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all shadow-xl ${isListening
                                                            ? 'bg-red-500 text-white animate-pulse'
                                                            : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 border border-slate-100 dark:border-slate-700'
                                                            }`}
                                                    >
                                                        {isListening ? <MicOff size={24} /> : <Mic size={24} />}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {micError && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="flex items-center gap-3 text-red-600 bg-red-50/50 p-4 rounded-2xl border border-red-100 text-xs font-bold"
                                            >
                                                <AlertCircle size={16} />
                                                <span className="flex-1">{micError}</span>
                                                <button onClick={() => setMicError(null)} className="hover:bg-red-100 p-1 rounded-lg transition-colors">
                                                    <X size={14} />
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-center gap-3 text-red-600 bg-red-50/50 p-4 rounded-2xl border border-red-100 text-sm font-bold"
                                        >
                                            <AlertCircle size={20} />
                                            {error}
                                        </motion.div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading || !symptoms.trim()}
                                        className={`w-full py-5 rounded-[2rem] text-white font-black text-lg shadow-2xl transition-all flex items-center justify-center gap-3 ${loading || !symptoms.trim()
                                            ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                                            : 'bg-brand-600 hover:bg-brand-700 shadow-brand-600/30'
                                            }`}
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                                <span>Running AI Diagnostics...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Finalize Submission</span>
                                                <Send size={22} className="opacity-70" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="result-portal"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="glass-card rounded-[4rem] overflow-hidden text-center"
                        >
                            <div className="p-16">
                                <div className="mb-10 inline-flex items-center justify-center">
                                    <div className={`h-24 w-24 rounded-[2rem] flex items-center justify-center shadow-2xl ${result.urgencyLevel === 'Emergency' ? 'bg-red-500 text-white shadow-red-500/40' :
                                        result.urgencyLevel === 'Urgent' ? 'bg-orange-500 text-white shadow-orange-500/40' :
                                            'bg-emerald-500 text-white shadow-emerald-500/40'
                                        }`}>
                                        <Activity size={48} />
                                    </div>
                                </div>

                                <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Access Token Generated</h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium mb-12 italic">AI Analysis complete. Proceed to assigned department.</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-brand-500/20 shadow-sm transition-all hover:shadow-md">
                                        <p className="text-[10px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-2">Target Department</p>
                                        <p className="text-2xl font-black text-slate-900 dark:text-white leading-none">{result.department}</p>
                                    </div>
                                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-brand-500/20 shadow-sm transition-all hover:shadow-md">
                                        <p className="text-[10px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-2">Priority Classification</p>
                                        <p className={`text-2xl font-black leading-none ${result.urgencyLevel === 'Emergency' ? 'text-red-600 dark:text-red-400' :
                                            result.urgencyLevel === 'Urgent' ? 'text-orange-600 dark:text-orange-400' : 'text-emerald-600 dark:text-emerald-400'
                                            }`}>{result.urgencyLevel}</p>
                                    </div>
                                </div>

                                <div className="relative mb-12 px-12">
                                    <div className="bg-brand-600 rounded-[3rem] p-12 shadow-3xl shadow-brand-500/40 text-white">
                                        <p className="text-sm font-bold opacity-80 uppercase tracking-[0.3em] mb-2">Clinic Entry Code</p>
                                        <p className="text-7xl font-black tracking-tighter">
                                            #{String(result.tokenNumber).padStart(3, '0')}
                                        </p>
                                        <div className="mt-8 pt-8 border-t border-white/10 flex justify-between items-center text-[10px] font-bold opacity-60 tracking-[0.2em] uppercase">
                                            <span>Issued: {new Date().toLocaleTimeString()}</span>
                                            <span>Valid: Security Verified</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={resetForm}
                                    className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-800 font-black text-xs uppercase tracking-widest transition-all p-4 rounded-2xl hover:bg-slate-50"
                                >
                                    <MoveLeft size={16} /> Process Another Case
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
