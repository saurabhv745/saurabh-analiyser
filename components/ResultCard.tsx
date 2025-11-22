import React from 'react';
import { AnalysisResult, SentimentType } from '../types';
import { CheckCircle2, AlertCircle, Meh, Activity } from './Icons';

interface ResultCardProps {
  result: AnalysisResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const { sentiment, score, reasoning, emotions, keywords } = result;

  const getColorConfig = (type: SentimentType) => {
    switch (type) {
      case SentimentType.POSITIVE:
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          text: 'text-emerald-700',
          badge: 'bg-emerald-100 text-emerald-800',
          icon: <CheckCircle2 className="w-8 h-8 text-emerald-500" />,
          progress: 'bg-emerald-500'
        };
      case SentimentType.NEGATIVE:
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-700',
          badge: 'bg-red-100 text-red-800',
          icon: <AlertCircle className="w-8 h-8 text-red-500" />,
          progress: 'bg-red-500'
        };
      case SentimentType.NEUTRAL:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-700',
          badge: 'bg-gray-100 text-gray-800',
          icon: <Meh className="w-8 h-8 text-gray-500" />,
          progress: 'bg-gray-500'
        };
    }
  };

  const config = getColorConfig(sentiment);

  return (
    <div className={`w-full rounded-xl border shadow-sm p-6 animate-fade-in ${config.bg} ${config.border}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white rounded-full shadow-sm">
            {config.icon}
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${config.text}`}>{sentiment}</h2>
            <p className="text-sm text-gray-500 font-medium">Classification Result</p>
          </div>
        </div>

        <div className="flex flex-col items-end w-full md:w-auto">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-semibold text-gray-600">Confidence Score</span>
          </div>
          <div className="flex items-center gap-3 w-full md:w-48">
            <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out ${config.progress}`} 
                style={{ width: `${score}%` }} 
              />
            </div>
            <span className="font-bold text-lg text-gray-700">{score}%</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white/60 rounded-lg p-4 border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">Analysis</h3>
          <p className="text-gray-700 leading-relaxed">{reasoning}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Detected Emotions</h3>
            <div className="flex flex-wrap gap-2">
              {emotions.map((emotion, idx) => (
                <span key={idx} className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-600 border border-gray-200 shadow-sm">
                  {emotion}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword, idx) => (
                <span key={idx} className="px-3 py-1 bg-indigo-50 rounded-full text-sm font-medium text-indigo-600 border border-indigo-100">
                  #{keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;