import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const SensorChart = ({ data, series = [], height = 300, showLegend = false }) => {
    return (
        <div className="w-full bg-white p-4 rounded-xl" style={{ height: height }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                    <defs>
                        {series.map(s => (
                            <linearGradient key={s.key} id={`color${s.key}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={s.color} stopOpacity={0.2} />
                                <stop offset="95%" stopColor={s.color} stopOpacity={0} />
                            </linearGradient>
                        ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                        dataKey="timeLabel"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
                        interval={Math.floor(data.length / 6)}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
                        domain={['auto', 'auto']}
                        width={30}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            borderRadius: '12px',
                            border: 'none',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            fontSize: '12px'
                        }}
                    />
                    {showLegend && <Legend verticalAlign="top" height={36} />}
                    {series.map(s => (
                        <Area
                            key={s.key}
                            type="monotone"
                            dataKey={s.key}
                            name={s.label || s.key}
                            stroke={s.color}
                            strokeWidth={3}
                            fillOpacity={1}
                            fill={`url(#color${s.key})`}
                        />
                    ))}
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SensorChart;
