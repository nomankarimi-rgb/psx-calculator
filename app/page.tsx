'use client';

import React, { useState, useEffect } from 'react';

// Popular PSX Stocks for Side Panel
const MARKET_STOCKS = [
  { symbol: 'OGDC', name: 'Oil & Gas Dev', price: 168.50, change: +4.25, type: 'gainer', history: [160, 162, 161, 165, 166, 168.5] },
  { symbol: 'HUBC', name: 'Hub Power Co', price: 142.10, change: +3.80, type: 'gainer', history: [136, 137, 139, 138, 140, 142.1] },
  { symbol: 'PRL', name: 'Pak Refinery', price: 28.40, change: +5.10, type: 'gainer', history: [26, 26.5, 27, 26.8, 27.8, 28.4] },
  { symbol: 'SYS', name: 'Systems Limited', price: 442.00, change: -2.85, type: 'loser', history: [458, 455, 450, 448, 445, 442] },
  { symbol: 'PSO', name: 'Pakistan State Oil', price: 215.30, change: -1.90, type: 'loser', history: [222, 220, 219, 217, 216, 215.3] },
  { symbol: 'TRG', name: 'TRG Pak Ltd', price: 58.75, change: -3.40, type: 'loser', history: [62, 61, 60.5, 59.8, 59, 58.75] },
  { symbol: 'KEL', name: 'K-Electric', price: 4.85, change: +0.20, type: 'medium', history: [4.7, 4.75, 4.8, 4.78, 4.82, 4.85] },
  { symbol: 'WTL', name: 'WorldCall Telecom', price: 1.35, change: -0.05, type: 'medium', history: [1.4, 1.38, 1.36, 1.37, 1.35, 1.35] },
  { symbol: 'FFC', name: 'Fauji Fertilizer', price: 198.20, change: +0.75, type: 'medium', history: [196, 197, 196.5, 197.8, 198, 198.2] },
];

// Mini Sparkline Graph Component (Theme based SVG)
function Sparkline({ data, isPositive }: { data: number[], isPositive: boolean }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 60;
  const height = 24;

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');

  const strokeColor = isPositive ? '#34d399' : '#f87171';

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  );
}

// Large Custom Theme Interactive Graph Component
function MainGraph({ symbol, data, isPositive }: { symbol: string, data: number[], isPositive: boolean }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 500;
  const height = 140;

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 20) - 10;
      return `${x},${y}`;
    })
    .join(' ');

  const strokeColor = isPositive ? '#10b981' : '#ef4444';
  const fillColor = isPositive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)';
  const areaPoints = `${points} ${width},${height} 0,${height}`;

  return (
    <div className="bg-slate-950/70 border border-slate-800/80 p-4 rounded-xl mt-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: strokeColor }}></span>
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">{symbol} Intraday Trend</span>
        </div>
        <div className="text-[11px] text-slate-400">
          Range: <span className="text-white font-mono font-bold">Rs. {min.toFixed(1)}</span> - <span className="text-white font-mono font-bold">Rs. {max.toFixed(1)}</span>
        </div>
      </div>
      
      <div className="w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-28">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>
          {/* Area under line */}
          <polygon fill="url(#chartGradient)" points={areaPoints} />
          {/* Line */}
          <polyline fill="none" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={points} />
        </svg>
      </div>
    </div>
  );
}

export default function StockAverageDashboard() {
  const [symbol, setSymbol] = useState('OGDC');
  const [livePrice, setLivePrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedStockHistory, setSelectedStockHistory] = useState<number[]>([160, 162, 161, 165, 166, 168.5]);
  const [filterType, setFilterType] = useState<'all' | 'gainer' | 'loser' | 'medium'>('all');

  // Price Mode: 'live' or 'limit'
  const [priceMode, setPriceMode] = useState<'live' | 'limit'>('live'); 
  const [customLimitPrice, setCustomLimitPrice] = useState('');

  // Brokerage Toggle
  const [includeBrokerage, setIncludeBrokerage] = useState(true);
  const BROKERAGE_PERCENTAGE = 0.0018; 

  // Holding Inputs
  const [existingQty, setExistingQty] = useState('');
  const [existingPrice, setExistingPrice] = useState('');
  const [newQty, setNewQty] = useState('');

  // Live PSX Fetcher
  const fetchLivePrice = async (targetSymbol = symbol) => {
    if (!targetSymbol) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/stock?symbol=${targetSymbol}`);
      const data = await res.json();
      if (data.currentPrice) {
        setLivePrice(data.currentPrice);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLivePrice(symbol);
    const interval = setInterval(() => fetchLivePrice(symbol), 5000);
    return () => clearInterval(interval);
  }, [symbol]);

  // Click on any stock from sidebar
  const handleStockClick = (stock: typeof MARKET_STOCKS[0]) => {
    setSymbol(stock.symbol);
    setLivePrice(stock.price);
    setSelectedStockHistory(stock.history);
    fetchLivePrice(stock.symbol);
  };

  // Calculations
  const eQty = parseFloat(existingQty) || 0;
  const ePrice = parseFloat(existingPrice) || 0;
  const nQty = parseFloat(newQty) || 0;

  const effectiveBuyPrice = priceMode === 'limit' && customLimitPrice 
    ? parseFloat(customLimitPrice) || 0 
    : (livePrice || 0);

  const rawBuyCost = nQty * effectiveBuyPrice;
  const brokerageCharges = includeBrokerage ? rawBuyCost * BROKERAGE_PERCENTAGE : 0;
  const totalNewInvestment = rawBuyCost + brokerageCharges;

  const totalShares = eQty + nQty;
  const existingInvestment = eQty * ePrice;
  
  const newAveragePrice = totalShares > 0 
    ? (existingInvestment + totalNewInvestment) / totalShares 
    : 0;

  const avgDifference = ePrice > 0 ? (newAveragePrice - ePrice) : 0;

  // Filter stocks
  const displayedStocks = filterType === 'all' 
    ? MARKET_STOCKS 
    : MARKET_STOCKS.filter(s => s.type === filterType);

  const isCurrentPositive = (MARKET_STOCKS.find(s => s.symbol === symbol)?.change || 0) >= 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-3 md:p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-5">
        
        {/* Top Navbar */}
        <div className="bg-slate-900 border border-slate-800 p-4 md:p-5 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 border border-emerald-500/50 rounded-xl flex items-center justify-center text-emerald-400 font-black text-xl">
              PSX
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">PSX Smart Average Terminal</h1>
              <p className="text-slate-400 text-xs">Real-time market analytics with smart down-averaging</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                {symbol} Current Price
              </span>
              <div className="text-xl md:text-2xl font-extrabold text-emerald-400 font-mono">
                {livePrice ? `PKR ${livePrice.toFixed(2)}` : 'Fetching...'}
              </div>
            </div>
            {loading && <span className="animate-spin text-emerald-400 text-lg">↻</span>}
          </div>
        </div>

        {/* 2-Column Main Layout: (Sidebar Market Watch + Calculator Area) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* LEFT: SIDE PANEL (Market Watch with Mini Sparklines) */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-4 shadow-lg flex flex-col">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>📊</span> PSX Market Watch
                </h2>
                <span className="text-[11px] text-slate-400">Click any stock to analyze</span>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[10px] font-bold">
                <button 
                  onClick={() => setFilterType('all')}
                  className={`px-2 py-1 rounded ${filterType === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}>
                  All
                </button>
                <button 
                  onClick={() => setFilterType('gainer')}
                  className={`px-2 py-1 rounded ${filterType === 'gainer' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50' : 'text-slate-400'}`}>
                  ▲ Gain
                </button>
                <button 
                  onClick={() => setFilterType('loser')}
                  className={`px-2 py-1 rounded ${filterType === 'loser' ? 'bg-red-950 text-red-400 border border-red-800/50' : 'text-slate-400'}`}>
                  ▼ Lose
                </button>
              </div>
            </div>

            {/* Stock List with Sparkline Graphs */}
            <div className="space-y-2 overflow-y-auto max-h-[580px] pr-1">
              {displayedStocks.map((stk) => {
                const isSelected = stk.symbol === symbol;
                const isGain = stk.change >= 0;

                return (
                  <div
                    key={stk.symbol}
                    onClick={() => handleStockClick(stk)}
                    className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between group ${
                      isSelected 
                        ? 'bg-emerald-950/30 border-emerald-500/50 shadow-md' 
                        : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-white">{stk.symbol}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase ${
                          stk.type === 'gainer' ? 'bg-emerald-500/20 text-emerald-400' :
                          stk.type === 'loser' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {stk.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{stk.name}</p>
                    </div>

                    {/* Mini Sparkline Graph */}
                    <div className="px-2">
                      <Sparkline data={stk.history} isPositive={isGain} />
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold font-mono text-white">Rs {stk.price.toFixed(2)}</div>
                      <div className={`text-[11px] font-bold ${isGain ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isGain ? `+${stk.change}%` : `${stk.change}%`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: MAIN TERMINAL (Calculator + Interactive Graph) */}
          <div className="lg:col-span-8 space-y-5">
            
            {/* Search + Graph Container */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                    placeholder="Symbol (e.g. OGDC)"
                    className="bg-slate-950 border border-slate-700 px-4 py-2 rounded-xl uppercase font-bold text-white text-sm outline-none focus:border-emerald-500 w-full sm:w-48"
                  />
                  <button 
                    onClick={() => fetchLivePrice(symbol)}
                    className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-xl font-bold text-xs transition"
                  >
                    Fetch
                  </button>
                </div>

                <div className="text-xs text-slate-400">
                  Active Asset: <span className="text-emerald-400 font-extrabold">{symbol}</span>
                </div>
              </div>

              {/* Theme Custom Graph */}
              <MainGraph symbol={symbol} data={selectedStockHistory} isPositive={isCurrentPositive} />
            </div>

            {/* Calculator Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Inputs */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-slate-300 border-b border-slate-800 pb-2">1. Your Holding</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 font-medium">Owned Shares</label>
                    <input
                      type="number"
                      placeholder="e.g. 1000"
                      value={existingQty}
                      onChange={(e) => setExistingQty(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 mt-1 text-sm focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-medium">Avg Price (PKR)</label>
                    <input
                      type="number"
                      placeholder="e.g. 125"
                      value={existingPrice}
                      onChange={(e) => setExistingPrice(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 mt-1 text-sm focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-300 border-b border-slate-800 pb-2 pt-1">2. Buy Strategy</h3>

                {/* Live vs Limit Toggle */}
                <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setPriceMode('live')}
                    className={`py-1.5 text-xs font-bold rounded-lg transition ${
                      priceMode === 'live' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    ⚡ Market Live
                  </button>
                  <button
                    type="button"
                    onClick={() => setPriceMode('limit')}
                    className={`py-1.5 text-xs font-bold rounded-lg transition ${
                      priceMode === 'limit' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🎯 Limit Price
                  </button>
                </div>

                {priceMode === 'limit' && (
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-amber-500/40">
                    <label className="text-[11px] text-amber-400 font-semibold">Your Target Price (PKR)</label>
                    <input
                      type="number"
                      placeholder="e.g. 110"
                      value={customLimitPrice}
                      onChange={(e) => setCustomLimitPrice(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 mt-1 text-sm text-white focus:border-amber-400 outline-none font-bold"
                    />
                  </div>
                )}

                <div>
                  <label className="text-[11px] text-slate-400 font-medium">New Shares to Purchase</label>
                  <input
                    type="number"
                    placeholder="e.g. 500"
                    value={newQty}
                    onChange={(e) => setNewQty(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 mt-1 text-sm focus:border-emerald-500 outline-none font-bold"
                  />
                </div>

                {/* Brokerage Toggle */}
                <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-xs font-medium text-slate-300">PSX Brokerage (+0.18%)</span>
                  <input
                    type="checkbox"
                    checked={includeBrokerage}
                    onChange={(e) => setIncludeBrokerage(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Summary Results */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-300 border-b border-slate-800 pb-2">3. Average Impact</h3>

                  <div className="flex justify-between text-xs py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Target Buy Price:</span>
                    <span className="font-mono font-bold text-emerald-400">Rs {effectiveBuyPrice.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-xs py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Total Shares (Old + New):</span>
                    <span className="font-bold">{totalShares} shares</span>
                  </div>

                  <div className="flex justify-between text-xs py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Total Cash Required:</span>
                    <span className="font-bold font-mono text-amber-400">Rs {totalNewInvestment.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  </div>

                  {/* Big Calculated Result Box */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 text-center mt-4">
                    <span className="text-[10px] uppercase font-black text-emerald-400 tracking-wider">
                      Resulting New Average Price
                    </span>
                    <div className="text-3xl font-black text-white mt-1 font-mono">
                      PKR {newAveragePrice.toFixed(2)}
                    </div>

                    {ePrice > 0 && nQty > 0 && (
                      <div className={`text-[11px] mt-2 font-bold ${avgDifference < 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {avgDifference < 0 
                          ? `📉 Average Down: Rs ${Math.abs(avgDifference).toFixed(2)} per share` 
                          : `📈 Average Up: Rs ${avgDifference.toFixed(2)} per share`}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 text-center mt-4">
                  Real-time Calculations • PSX Terminal 2026
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
