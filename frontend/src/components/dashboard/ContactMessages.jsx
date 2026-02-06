import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, User, Clock, Trash2, CheckCircle, Search, Filter, MessageSquare } from 'lucide-react';

const ContactMessages = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMessage, setSelectedMessage] = useState(null);

    // Mock data for messages
    const [messages, setMessages] = useState([
        {
            id: 1,
            name: "Rahul Sharma",
            email: "rahul.s@example.com",
            subject: "Inquiry about Ward 4 sensors",
            message: "Our sensors in Ward 4 are showing inconsistent pH readings for the last 2 hours. Can you check if there's a calibration issue?",
            timestamp: "2026-02-06 10:30 AM",
            status: "unread",
            avatar: "RS"
        },
        {
            id: 2,
            name: "Priya Lakshmi",
            email: "priya.l@government.in",
            subject: "Monthly Report Access",
            message: "I am unable to download the consolidated water quality report for the month of January. Please assist.",
            timestamp: "2026-02-05 04:15 PM",
            status: "read",
            avatar: "PL"
        },
        {
            id: 3,
            name: "Anand Kumar",
            email: "anand.k@technologies.com",
            subject: "Software Update Inquiry",
            message: "When is the next version of the AI vision model scheduled for release? We are looking forward to the rust detection improvements.",
            timestamp: "2026-02-05 11:20 AM",
            status: "read",
            avatar: "AK"
        }
    ]);

    const filteredMessages = messages.filter(msg =>
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const markAsRead = (id) => {
        setMessages(messages.map(msg => msg.id === id ? { ...msg, status: 'read' } : msg));
    };

    const deleteMessage = (id) => {
        setMessages(messages.filter(msg => msg.id !== id));
        if (selectedMessage?.id === id) setSelectedMessage(null);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-200px)] space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-100 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 gradient-aqua-blue rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Contact Messages</h2>
                        <p className="text-sm text-gray-600">Manage inquiries sent from the contact form</p>
                    </div>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search messages..."
                        className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 transition-all outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
                {/* Messages List */}
                <div className="col-span-12 lg:col-span-5 card-premium flex flex-col h-full overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-900">{filteredMessages.length} Messages</span>
                        <Filter className="w-4 h-4 text-gray-400 cursor-pointer hover:text-blue-500 transition-colors" />
                    </div>
                    <div className="overflow-y-auto flex-1 divide-y divide-gray-50">
                        {filteredMessages.map((msg) => (
                            <div
                                key={msg.id}
                                onClick={() => {
                                    setSelectedMessage(msg);
                                    markAsRead(msg.id);
                                }}
                                className={`p-4 cursor-pointer hover:bg-blue-50/30 transition-all relative ${selectedMessage?.id === msg.id ? 'bg-blue-50/50 border-r-4 border-blue-500' : ''}`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm ${msg.status === 'unread' ? 'gradient-aqua-blue' : 'bg-gray-400'}`}>
                                        {msg.avatar}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-0.5">
                                            <h4 className={`text-sm font-bold truncate ${msg.status === 'unread' ? 'text-gray-900' : 'text-gray-600'}`}>{msg.name}</h4>
                                            <span className="text-[10px] text-gray-400 flex-shrink-0">{msg.timestamp.split(' ').slice(1).join(' ')}</span>
                                        </div>
                                        <p className="text-xs font-semibold text-blue-600 mb-1 truncate">{msg.subject}</p>
                                        <p className="text-xs text-gray-500 line-clamp-1">{msg.message}</p>
                                    </div>
                                    {msg.status === 'unread' && (
                                        <div className="absolute right-4 bottom-4 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Message Detail */}
                <div className="col-span-12 lg:col-span-7 card-premium flex flex-col h-full overflow-hidden bg-white">
                    <AnimatePresence mode="wait">
                        {selectedMessage ? (
                            <motion.div
                                key={selectedMessage.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex flex-col h-full"
                            >
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full gradient-aqua-blue flex items-center justify-center text-lg font-bold text-white shadow-md">
                                            {selectedMessage.avatar}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">{selectedMessage.name}</h3>
                                            <p className="text-sm text-gray-500">{selectedMessage.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => deleteMessage(selectedMessage.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            title="Delete Message"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                        <button className="px-4 py-2 gradient-aqua-blue text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4" />
                                            Reply
                                        </button>
                                    </div>
                                </div>

                                <div className="p-8 flex-1 overflow-y-auto space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            <Clock className="w-3 h-3" />
                                            {selectedMessage.timestamp}
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">{selectedMessage.subject}</h2>
                                    </div>

                                    <div className="p-6 bg-blue-50/30 rounded-2xl border border-blue-50 text-gray-700 leading-relaxed text-lg italic quotes">
                                        "{selectedMessage.message}"
                                    </div>

                                    <div className="pt-6 border-t border-gray-100">
                                        <div className="flex items-center gap-2 text-sm text-green-600 font-bold">
                                            <CheckCircle className="w-4 h-4" />
                                            Verified User Inquiry
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-12 text-center">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                    <Mail className="w-10 h-10 text-gray-300" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No Message Selected</h3>
                                <p className="max-w-xs mx-auto">Click on a message from the list to view its contents and respond.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default ContactMessages;
