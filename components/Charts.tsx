import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { HistoryItem, SentimentType } from '../types';

interface ChartsProps {
  history: HistoryItem[];
}

const COLORS = {
  [SentimentType.POSITIVE]: '#10b981',
  [SentimentType.NEGATIVE]: '#ef4444',
  [SentimentType.NEUTRAL]: '#9ca3af',
};

export const SessionStats: React.FC<ChartsProps> = ({ history }) => {
  if (history.length === 0) return null;

  const counts = history.reduce((acc, item) => {
    acc[item.sentiment] = (acc[item.sentiment] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = [
    { name: SentimentType.POSITIVE, value: counts[SentimentType.POSITIVE] || 0 },
    { name: SentimentType.NEGATIVE, value: counts[SentimentType.NEGATIVE] || 0 },
    { name: SentimentType.NEUTRAL, value: counts[SentimentType.NEUTRAL] || 0 },
  ].filter(d => d.value > 0);

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name as SentimentType]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend verticalAlign="bottom" height={36}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const TrendChart: React.FC<ChartsProps> = ({ history }) => {
  if (history.length === 0) return null;

  // Take last 10 items
  const recentHistory = [...history].reverse().slice(0, 10).reverse();

  return (
    <div className="h-64 w-full mt-8">
      <h4 className="text-sm font-medium text-gray-500 mb-4">Confidence Trend (Last 10)</h4>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={recentHistory}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis dataKey="sentiment" tick={{fontSize: 10}} hide />
          <YAxis hide domain={[0, 100]} />
          <Tooltip 
             cursor={{fill: '#f3f4f6'}}
             content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload as HistoryItem;
                return (
                  <div className="bg-white p-2 shadow-md rounded border text-xs">
                    <p className="font-bold">{data.sentiment}</p>
                    <p>Score: {data.score}</p>
                    <p className="text-gray-500 truncate w-32">{data.text}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="score" radius={[4, 4, 0, 0]}>
            {recentHistory.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.sentiment]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};