import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Wrench, MapPin, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const TechnicianDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Mock Tasks
    const [tasks, setTasks] = useState([
        {
            id: 'TASK-102',
            location: 'Salem Ward 4',
            issue: 'Pump Malfunction',
            status: 'pending',
            priority: 'high',
            time: '2 hours ago'
        },
        {
            id: 'TASK-098',
            location: 'Coimbatore North',
            issue: 'Sensor Calibration',
            status: 'in-progress',
            priority: 'medium',
            time: 'Yesterday'
        }
    ]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const completeTask = (id) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, status: 'completed' } : t));
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans p-8">
            <header className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                        Technician Console
                    </h1>
                    <p className="text-slate-400 font-bold mt-1">Hello, {user?.name}</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg text-sm font-bold hover:bg-slate-700 transition-all border border-slate-700"
                >
                    <LogOut className="w-4 h-4" /> Sign Out
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Stats */}
                <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
                    <h3 className="text-slate-400 text-xs font-bold uppercase mb-2">Pending Tasks</h3>
                    <p className="text-4xl font-black text-white">2</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
                    <h3 className="text-slate-400 text-xs font-bold uppercase mb-2">Completed (This Month)</h3>
                    <p className="text-4xl font-black text-emerald-400">14</p>
                </div>
            </div>

            <h2 className="text-xl font-bold mt-12 mb-6 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-purple-400" /> Assigned Work Orders
            </h2>

            <div className="grid gap-6">
                {tasks.map(task => (
                    <div key={task.id} className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between group hover:border-purple-500/50 transition-colors">
                        <div className="flex items-start gap-4">
                            <div className={`p-4 rounded-xl ${task.priority === 'high' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="text-xs font-mono text-slate-500">{task.id}</span>
                                    {task.priority === 'high' && <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">URGENT</span>}
                                </div>
                                <h3 className="text-lg font-bold text-white">{task.issue}</h3>
                                <p className="text-slate-400 text-sm flex items-center gap-1 mt-1">
                                    <MapPin className="w-4 h-4" /> {task.location}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 md:mt-0 flex items-center gap-4">
                            {task.status === 'completed' ? (
                                <span className="text-emerald-400 font-bold flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-lg">
                                    <CheckCircle className="w-4 h-4" /> Completed
                                </span>
                            ) : (
                                <button
                                    onClick={() => completeTask(task.id)}
                                    className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-purple-900/20"
                                >
                                    Mark Complete
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TechnicianDashboard;
