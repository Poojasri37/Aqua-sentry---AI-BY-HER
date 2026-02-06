import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Download, Trash2, Mail, Calendar, Filter, CheckCircle } from 'lucide-react';

const NewsletterSubscribers = () => {
    const [searchTerm, setSearchTerm] = useState('');

    // Mock data for subscribers
    const [subscribers, setSubscribers] = useState([
        { id: 1, email: "john.doe@gmail.com", date: "2026-02-06", status: "active" },
        { id: 2, email: "amrita.n@outlook.com", date: "2026-02-05", status: "active" },
        { id: 3, email: "kumar.v@technologies.in", date: "2026-02-04", status: "active" },
        { id: 4, email: "deepa.r@gmail.com", date: "2026-02-04", status: "active" },
        { id: 5, email: "sam.wick@example.net", date: "2026-02-03", status: "active" },
        { id: 6, email: "nisha.m@government.in", date: "2026-02-02", status: "active" },
        { id: 7, email: "vijay.p@chennai.gov", date: "2026-02-02", status: "active" },
        { id: 8, email: "priya.das@yahoo.com", date: "2026-02-01", status: "active" }
    ]);

    const filteredSubscribers = subscribers.filter(sub =>
        sub.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const deleteSubscriber = (id) => {
        setSubscribers(subscribers.filter(sub => sub.id !== id));
    };

    const exportCSV = () => {
        const csvContent = [
            ['Email', 'Subscription Date', 'Status'].join(','),
            ...subscribers.map(sub => [sub.email, sub.date, sub.status].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `subscribers-list-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 gradient-aqua-blue rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Newsletter Subscribers</h2>
                        <p className="text-sm text-gray-600">Total active subscriptions: {subscribers.length}</p>
                    </div>
                </div>
                <button
                    onClick={exportCSV}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                    <Download className="w-4 h-4" />
                    Export CSV
                </button>
            </div>

            <div className="card-premium overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by email..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
                        <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 flex items-center gap-1.5 hover:border-blue-400 hover:text-blue-600 transition-all">
                            <Filter className="w-3.5 h-3.5" />
                            Filter by Date
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Email Address</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Joined Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredSubscribers.map((sub, index) => (
                                <motion.tr
                                    key={sub.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="hover:bg-blue-50/30 transition-all group"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                                <Mail className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <span className="font-bold text-gray-900">{sub.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Calendar className="w-4 h-4" />
                                            <span className="text-sm">{sub.date}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit">
                                            <CheckCircle className="w-3 h-3" />
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => deleteSubscriber(sub.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredSubscribers.length === 0 && (
                    <div className="p-12 text-center text-gray-400">
                        <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p className="font-bold">No subscribers found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewsletterSubscribers;
