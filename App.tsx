import React, { useState, useCallback } from 'react';
import { analyzeText } from './services/geminiService';
import ResultCard from './components/ResultCard';
import { SessionStats, TrendChart } from './components/Charts';
import { AnalysisResult, HistoryItem, LoadingState, SentimentType } from './types';
import { MessageSquare, RefreshCw, Trash2, BarChart3, Quote } from './components/Icons';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [status, setStatus] = useState<LoadingState>('idle');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!input.trim()) return;

    setStatus('loading');
    setErrorMsg(null);
    setResult(null);

    try {
      const analysis = await analyzeText(input);
      setResult(analysis);
      
      const newItem: HistoryItem = {
        ...analysis,
        id: Date.now().toString(),
        text: input,
        timestamp: Date.now()
      };
      
      setHistory(prev => [newItem, ...prev]);
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setErrorMsg("Failed to analyze sentiment. Please check your API key or try again.");
    }
  };

  const clearHistory = () => {
    setHistory([]);
    setResult(null);
    setInput('');
    setStatus('idle');
  };

  const loadHistoryItem = useCallback((item: HistoryItem) => {
    setResult(item);
    setInput(item.text);
    setStatus('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">SentimentScope AI</h1>
          </div>
          <div className="text-sm text-slate-500 hidden sm:block">
            Powered by Gemini 2.5 Flash
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input & Current Result */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Input Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <label htmlFor="sentiment-input" className="block text-sm font-medium text-slate-700 mb-2">
                Enter text for analysis
              </label>
              <div className="relative">
                <textarea
                  id="sentiment-input"
                  rows={5}
                  className="w-full rounded-lg border-slate-300 border p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none text-slate-800 placeholder-slate-400 bg-slate-50 focus:bg-white"
                  placeholder="Paste a review, social media post, or any text here..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <Quote className="absolute right-3 top-3 text-slate-300 w-5 h-5 pointer-events-none" />
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleAnalyze}
                  disabled={status === 'loading' || !input.trim()}
                  className={`
                    flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-white transition-all shadow-sm
                    ${status === 'loading' || !input.trim() 
                      ? 'bg-slate-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 active:scale-95 hover:shadow-md'}
                  `}
                >
                  {status === 'loading' ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Analyze Sentiment
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {status === 'error' && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{errorMsg}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Result Display */}
            {result && status !== 'loading' && (
              <ResultCard result={result} />
            )}
            
            {status === 'loading' && (
              <div className="h-64 rounded-xl border border-slate-200 bg-white p-6 flex flex-col items-center justify-center animate-pulse">
                 <div className="h-4 bg-slate-200 rounded w-1/3 mb-4"></div>
                 <div className="h-2 bg-slate-200 rounded w-1/2 mb-2"></div>
                 <div className="h-2 bg-slate-200 rounded w-2/3"></div>
              </div>
            )}
          </div>

          {/* Right Column: Stats & History */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Dashboard/Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-slate-500" />
                <h2 className="text-lg font-semibold text-slate-800">Session Overview</h2>
              </div>
              
              {history.length > 0 ? (
                <>
                  <SessionStats history={history} />
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100">
                      <div className="text-lg font-bold text-emerald-600">
                        {history.filter(h => h.sentiment === SentimentType.POSITIVE).length}
                      </div>
                      <div className="text-[10px] uppercase font-bold text-emerald-400">Pos</div>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-lg font-bold text-gray-600">
                        {history.filter(h => h.sentiment === SentimentType.NEUTRAL).length}
                      </div>
                      <div className="text-[10px] uppercase font-bold text-gray-400">Neu</div>
                    </div>
                    <div className="p-2 bg-red-50 rounded-lg border border-red-100">
                      <div className="text-lg font-bold text-red-600">
                        {history.filter(h => h.sentiment === SentimentType.NEGATIVE).length}
                      </div>
                      <div className="text-[10px] uppercase font-bold text-red-400">Neg</div>
                    </div>
                  </div>
                  <TrendChart history={history} />
                </>
              ) : (
                <div className="text-center py-8 text-slate-400 text-sm">
                  Analyze some text to see statistics.
                </div>
              )}
            </div>

            {/* Recent History List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col max-h-[500px]">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-slate-800">Recent Analysis</h2>
                {history.length > 0 && (
                  <button onClick={clearHistory} className="text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="overflow-y-auto p-2 space-y-2 flex-1 custom-scrollbar">
                {history.length === 0 && (
                  <p className="text-slate-400 text-sm text-center py-8">No history yet.</p>
                )}
                {history.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => loadHistoryItem(item)}
                    className="p-3 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`
                        text-xs font-bold px-2 py-0.5 rounded-full
                        ${item.sentiment === SentimentType.POSITIVE ? 'bg-emerald-100 text-emerald-700' : 
                          item.sentiment === SentimentType.NEGATIVE ? 'bg-red-100 text-red-700' : 
                          'bg-gray-100 text-gray-700'}
                      `}>
                        {item.sentiment}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2 group-hover:text-slate-900">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default App;