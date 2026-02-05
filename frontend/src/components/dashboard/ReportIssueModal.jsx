import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ReportIssueModal = ({ isOpen, onClose, tank }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([
        { role: 'assistant', content: `Hello! I'm your Aqua-Sentry Maintenance Assistant. I see you're reporting an issue for **${tank?.name}**. Please describe the situation in detail.` }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isResolved, setIsResolved] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const token = localStorage.getItem('aquasentry_token');
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
                    tankContext: { name: tank.name, status: tank.status }
                })
            });

            const data = await response.json();
            if (response.ok) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting. Please try again or contact support directly." }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: "Error connecting to AI assistant." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFinalize = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('aquasentry_token');
            const summary = messages.length > 2
                ? messages.map(m => m.content).slice(-2).join(' | ')
                : "Manual ticket filed by user";

            // Send notification to admin
            const notification = {
                type: 'issue_report',
                user: user?.name || 'Registered User',
                email: user?.email || 'N/A',
                issueDetails: {
                    tankId: tank.id,
                    tankName: tank.name,
                    description: summary,
                    severity: 'medium',
                    issueType: 'General Issue'
                },
                timestamp: new Date().toISOString()
            };

            // Store in localStorage for admin to see
            const existingNotifications = JSON.parse(localStorage.getItem('issueNotifications') || '[]');
            existingNotifications.push(notification);
            localStorage.setItem('issueNotifications', JSON.stringify(existingNotifications));

            console.log('Issue Report Notification sent to admin:', notification);

            await fetch('/api/ai/report-finalize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    tankName: tank.name,
                    issueSummary: summary,
                    user: user?.name || 'Registered User'
                })
            });

            setIsResolved(true);
            setTimeout(() => {
                onClose();
                setIsResolved(false);
                setMessages([
                    { role: 'assistant', content: `Hello! I'm your Aqua-Sentry Maintenance Assistant. I see you're reporting an issue for **${tank?.name}**. Please describe the situation in detail.` }
                ]);
            }, 2500);
        } catch (error) {
            console.error('Error finalizing:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.9, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 20, opacity: 0 }}
                        className="bg-white w-full max-w-2xl h-[600px] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative z-10"
                    >
                        {/* Header */}
                        <div className="bg-indigo-600 p-6 text-white flex justify-between items-center shadow-lg">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-xl">
                                    <Bot className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-lg">Maintenance AI Assistant</h2>
                                    <p className="text-white/70 text-xs">Reporting for {tank?.name}</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Chat Body */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50"
                        >
                            {messages.map((msg, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={idx}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[80%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-white shadow-sm text-indigo-600'
                                            }`}>
                                            {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                        </div>
                                        <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                            ? 'bg-indigo-600 text-white rounded-tr-none'
                                            : 'bg-white shadow-sm border border-gray-100 text-gray-700 rounded-tl-none'
                                            }`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white shadow-sm border border-gray-100 p-4 rounded-2xl rounded-tl-none flex gap-2 items-center">
                                        <div className="flex gap-1">
                                            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                                            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Success State Overlay */}
                        <AnimatePresence>
                            {isResolved && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0 bg-white/90 backdrop-blur-md z-20 flex flex-col items-center justify-center p-12 text-center"
                                >
                                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                                        <CheckCircle className="w-10 h-10" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Issue Logged!</h2>
                                    <p className="text-gray-500">The AI assistant has summarized your issue and notified our technical team. Help is on the way.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Footer / Input */}
                        <div className="p-6 bg-white border-t border-gray-100">
                            <div className="flex gap-3 mb-4">
                                <button
                                    onClick={handleFinalize}
                                    className="flex-1 py-2 px-4 bg-gray-100 hover:bg-green-100 hover:text-green-700 text-gray-600 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                                >
                                    <CheckCircle className="w-3.5 h-3.5" /> Resolve & File Ticket
                                </button>
                                <button
                                    onClick={() => setMessages([{ role: 'assistant', content: "Chat reset. How can I help?" }])}
                                    className="px-4 py-2 bg-gray-50 text-gray-400 hover:text-red-500 rounded-xl text-xs font-bold transition-all"
                                >
                                    Reset
                                </button>
                            </div>
                            <form onSubmit={handleSendMessage} className="relative">
                                <input
                                    type="text"
                                    placeholder="Type your issue here..."
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-5 pr-14 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    disabled={isLoading || isResolved}
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isLoading || isResolved}
                                    className="absolute right-3 top-3 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-md"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                            <div className="mt-4 flex items-center gap-2 text-[10px] text-gray-400 justify-center">
                                <AlertCircle className="w-3 h-3" />
                                AI insights are based on provided data. Follow standard safety protocols.
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ReportIssueModal;
