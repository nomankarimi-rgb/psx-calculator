'use client';

import React, { useState, useEffect, useMemo } from 'react';

// Comprehensive PSX Stock Universe (KSE-100, KMI-30, Energy, Tech, Banking, Fertilizer, Cement)
const PSX_STOCKS = [
  // Oil & Gas / Energy
  { symbol: 'OGDC', name: 'Oil & Gas Dev Co', price: 172.40, change: +3.85, category: 'KSE100', shariah: true, history: [162, 164, 163, 167, 169, 172.4] },
  { symbol: 'PPL', name: 'Pak Petroleum Ltd', price: 124.60, change: +2.15, category: 'KSE100', shariah: true, history: [120, 121, 122, 123, 122.5, 124.6] },
  { symbol: 'PSO', name: 'Pak State Oil', price: 218.30, change: -1.75, category: 'KSE100', shariah: false, history: [224, 222, 221, 220, 219, 218.3] },
  { symbol: 'HUBC', name: 'Hub Power Co', price: 144.50, change: +4.20, category: 'KMI30', shariah: true, history: [137, 139, 140, 141, 142.5, 144.5] },
  { symbol: 'PRL', name: 'Pakistan Refinery', price: 29.80, change: +5.30, category: 'KSE100', shariah: true, history: [27, 27.5, 28, 28.5, 29.1, 29.8] },
  { symbol: 'SNGP', name: 'Sui Northern Gas', price: 74.20, change: +1.60, category: 'KSE100', shariah: false, history: [71, 72, 72.8, 73, 73.5, 74.2] },

  // Technology
  { symbol: 'SYS', name: 'Systems Limited', price: 448.00, change: -2.30, category: 'KMI30', shariah: true, history: [460, 458, 455, 452, 450, 448] },
  { symbol: 'TRG', name: 'TRG Pakistan', price: 59.20, change: -3.60, category: 'KSE100', shariah: false, history: [63, 62, 61, 60.5, 60, 59.2] },
  { symbol: 'AIRLINK', name: 'Air Link Communication', price: 112.50, change: +3.20, category: 'KMI30', shariah: true, history: [106, 107, 108, 109, 111, 112.5] },
  { symbol: 'NETSOL', name: 'NetSol Technologies', price: 118.00, change: +0.80, category: 'KSE100', shariah: true, history: [115, 116, 115.5, 117, 117.2, 118] },

  // Banking
  { symbol: 'MEBL', name: 'Meezan Bank Ltd', price: 232.00, change: +1.95, category: 'KMI30', shariah: true, history: [225, 226, 228, 229, 230, 232] },
  { symbol: 'HBL', name: 'Habib Bank Ltd', price: 131.50, change: -0.85, category: 'KSE100', shariah: false, history: [134, 133, 132.5, 132, 131.8, 131.5] },
  { symbol: 'UBL', name: 'United Bank Ltd', price: 285.00, change: +2.10, category: 'KSE100', shariah: false, history: [278, 279, 281, 282, 283, 285] },
  { symbol: 'MCB', name: 'MCB Bank Limited', price: 228.40, change: +0.40, category: 'KSE100', shariah: false, history: [226, 227, 227.5, 228, 228, 228.4] },

  // Cement
  { symbol: 'LUCK', name: 'Lucky Cement', price: 925.00, change: +2.80, category: 'KMI30', shariah: true, history: [890, 895, 905, 912, 918, 925] },
  { symbol: 'DGKC', name: 'D.G. Khan Cement', price: 84.50, change: +1.70, category: 'KSE100', shariah: true, history: [81, 82, 82.5, 83, 83.8, 84.5] },
  { symbol: 'MLCF', name: 'Maple Leaf Cement', price: 41.20, change: -1.40, category: 'KSE100', shariah: true, history: [42.5, 42.2, 41.8, 41.6, 41.4, 41.2] },
  { symbol: 'CHCC', name: 'Cherat Cement', price: 178.00, change: +3.10, category: 'KMI30', shariah: true, history: [170, 172, 174, 175, 176, 178] },

  // Fertilizers & Chemicals
  { symbol: 'ENGRO', name: 'Engro Corporation', price: 345.00, change: +1.20, category: 'KMI30', shariah: true, history: [338, 340, 341, 342, 343, 345] },
  { symbol: 'FFC', name: 'Fauji Fertilizer Co', price: 202.50, change: +0.65, category: 'KSE100', shariah: true, history: [199, 200, 201, 200.5, 201.8, 202.5] },
  { symbol: 'EFERT', name: 'Engro Fertilizers', price: 168.00, change: -0.50, category: 'KMI30', shariah: true, history: [170, 169.5, 169, 168.8, 168.2, 168] },
  { symbol: 'FATIMA', name: 'Fatima Fertilizer', price: 54.00, change: +0.20, category: 'KSE100', shariah: true, history: [53, 53.5, 53.8, 53.7, 53.9, 54] },

  // Automobiles & Industrials
  { symbol: 'INDU', name: 'Indus Motor Co', price: 1620.00, change: +4.50, category: 'KMI30', shariah: true, history: [1540, 1560, 1580, 1595, 1605, 1620] },
  { symbol: 'MTL', name: 'Millat Tractors', price: 615.00, change: -1.80, category: 'KMI30', shariah: true, history: [630, 626, 622, 620, 618, 615] },
  { symbol: 'PAEL', name: 'Pak Elektron Ltd', price: 26.10, change: +2.90, category: 'KSE100', shariah: false, history: [24.8, 25.1, 25.4, 25.6, 25.8, 26.1] },

  // Telecommunication & Power
  { symbol: 'KEL', name: 'K-Electric Limited', price: 4.95, change: +3.10, category: 'KSE100', shariah: false, history: [4.7, 4.75, 4.8, 4.85, 4.9, 4.95] },
  { symbol: 'PTC', name: 'Pak Telecom Co', price: 14.80, change: -0.90, category: 'KSE100', shariah: false, history: [15.2, 15.1, 15.0, 14.95, 14.85, 14.8] },
  { symbol: 'WTL', name: 'WorldCall Telecom', price: 1.38, change: +0.00, category: 'KSE100', shariah: false, history: [1.38, 1.37, 1.39, 1.38, 1.37, 1.38] },
];

// Mini Sparkline Graph for Right Panel
function MiniSparkline({ data, isPositive }: { data: number[]; isPositive: boolean }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 56;
  const height = 20;

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');

  const strokeColor = isPositive ? '#10b981' : '#f43f5e';

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  );
}

// Center TradingView Style Interactive Canvas / SVG Chart
function TradingViewChart({
  symbol,
  history,
  isPositive,
  timeframe,
  setTimeframe,
  chartType,
  setChartType,
}: {
  symbol: string;
  history: number[];
  isPositive: boolean;
  timeframe: string;
  setTimeframe: (t: string) => void;
  chartType: 'area' | 'candles';
  setChartType: (t: 'area' | 'candles') => void;
}) {
  const min = Math.min(...history) * 0.985;
  const max = Math.max(...history) * 1.015;
  const range = max - min || 1;
  const width = 800;
  const height = 260;

  const points = history
    .map((val, idx) => {
      const x = (idx / (history.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 30) - 15;
      return `${x},${y}`;
    })
    .join(' ');

  const strokeColor = isPositive ? '#10b981' : '#f43f5e';
  const areaPoints = `${points} ${width},${height} 0,${height}`;

  // Fake candlestick representation
  const candles = useMemo(() => {
    return history.map((close, i) => {
      const open = i === 0 ? close * 0.99 : history[i - 1];
      const high = Math.max(open, close) * 1.008;
      const low = Math.min(open, close) * 0.992;
      return { open, close, high, low, isUp: close >= open };
    });
  }, [history]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col space-y-4">
      {/* Top Chart Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full animate-ping" style={{ backgroundColor: strokeColor }}></span>
            <span className="text-lg font-black text-white tracking-wide">{symbol} / PKR</span>
          </div>
          <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono font-bold">PSX</span>
        </div>

        {/* Filters: Timeframe & Chart Style */}
        <div className="flex items-center gap-2">
          {/* Chart Type Toggle */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
            <button
              onClick={() => setChartType('area')}
              className={`px-3 py-1 rounded-lg transition ${chartType === 'area' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-white'}`}
            >
              📈 Line
            </button>
            <button
              onClick={() => setChartType('candles')}
              className={`px-3 py-1 rounded-lg transition ${chartType === 'candles' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-white'}`}
            >
              🕯️ Candles
            </button>
          </div>

          {/* Timeframe Buttons */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
            {['1D', '1W', '1M', '1Y'].map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-2.5 py-1 rounded-lg transition ${timeframe === t ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chart Canvas Area */}
      <div className="relative w-full h-[300px] bg-slate-950/80 rounded-xl p-3 border border-slate-800/60 overflow-hidden flex flex-col justify-between">
        
        {/* Price Levels Grid Lines */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 opacity-15">
          <div className="border-b border-dashed border-slate-400 w-full"></div>
          <div className="border-b border-dashed border-slate-400 w-full"></div>
          <div className="border-b border-dashed border-slate-400 w-full"></div>
          <div className="border-b border-dashed border-slate-400 w-full"></div>
        </div>

        {/* High / Low Level Labels */}
        <div className="flex justify-between text-[11px] font-mono text-slate-400 z-10 px-2">
          <span>High: <strong className="text-emerald-400">PKR {max.toFixed(2)}</strong></span>
          <span>Low: <strong className="text-rose-400">PKR {min.toFixed(2)}</strong></span>
        </div>

        {/* Render Line / Area SVG */}
        {chartType === 'area' ? (
          <div className="w-full h-full flex items-center">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[230px] overflow-visible">
              <defs>
                <linearGradient id="tradingGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={strokeColor} stopOpacity="0.35" />
                  <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <polygon fill="url(#tradingGradient)" points={areaPoints} />
              <polyline fill="none" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={points} />
            </svg>
          </div>
        ) : (
          /* Render Simulated Candlestick Bars */
          <div className="w-full h-[230px] flex items-end justify-between px-4 z-10">
            {candles.map((c, idx) => {
              const bodyHeight = Math.max(8, ((Math.abs(c.close - c.open)) / range) * 180);
              const wickHeight = ((c.high - c.low) / range) * 200;
              return (
                <div key={idx} className="flex flex-col items-center justify-center relative w-full h-full">
                  <div className={`w-[2px] ${c.isUp ? 'bg-emerald-400' : 'bg-rose-400'}`} style={{ height: `${wickHeight}px` }}></div>
                  <div
                    className={`w-6 rounded-sm ${c.isUp ? 'bg-emerald-500' : 'bg-rose-500'} absolute shadow-sm`}
                    style={{ height: `${bodyHeight}px` }}
                  ></div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Time Axis */}
        <div className="flex justify-between text-[10px] text-slate-500 font-mono z-10 border-t border-slate-900 pt-1">
          <span>09:15 AM</span>
          <span>11:00 AM</span>
          <span>01:00 PM</span>
          <span>02:30 PM</span>
          <span>03:30 PM (Close)</span>
        </div>
      </div>
    </div>
  );
}

export default function StockAverageDashboard() {
  const [symbol, setSymbol] = useState('OGDC');
  const [livePrice, setLivePrice] = useState<number | null>(172.40);
  const [loading, setLoading] = useState(false);
  const [timeframe, setTimeframe] = useState('1D');
  const [chartType, setChartType] = useState<'area' | 'candles'>('area');

  // Market Watch Filter & Search
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'KSE100' | 'KMI30' | 'GAINERS' | 'LOSERS'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Averaging Buy Desk Inputs
  const [priceMode, setPriceMode] = useState<'live' | 'limit'>('live');
  const [customLimitPrice, setCustomLimitPrice] = useState('');
  const [existingQty, setExistingQty] = useState('');
  const [existingPrice, setExistingPrice] = useState('');
  const [newQty, setNewQty] = useState('');
  const [includeBrokerage, setIncludeBrokerage] = useState(true);
  const BROKERAGE_PERCENTAGE = 0.0018;

  // Real-time Fetcher
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

  // Click handler from Right Panel
  const handleSelectStock = (stock: typeof PSX_STOCKS[0]) => {
    setSymbol(stock.symbol);
    setLivePrice(stock.price);
    fetchLivePrice(stock.symbol);
  };

  // Find active stock object
  const activeStock = PSX_STOCKS.find((s) => s.symbol === symbol) || {
    symbol,
    name: 'PSX Listed Company',
    price: livePrice || 100,
    change: +1.5,
    history: [95, 96, 98, 97, 99, 100],
  };

  // Calculations
  const eQty = parseFloat(existingQty) || 0;
  const ePrice = parseFloat(existingPrice) || 0;
  const nQty = parseFloat(newQty) || 0;

  const effectiveBuyPrice = priceMode === 'limit' && customLimitPrice ? parseFloat(customLimitPrice) || 0 : livePrice || 0;

  const rawBuyCost = nQty * effectiveBuyPrice;
  const brokerageCharges = includeBrokerage ? rawBuyCost * BROKERAGE_PERCENTAGE : 0;
  const totalNewInvestment = rawBuyCost + brokerageCharges;

  const totalShares = eQty + nQty;
  const existingInvestment = eQty * ePrice;
  const newAveragePrice = totalShares > 0 ? (existingInvestment + totalNewInvestment) / totalShares : 0;
  const avgDifference = ePrice > 0 ? newAveragePrice - ePrice : 0;

  // Right Panel Stock Filtering Logic
  const filteredStocks = useMemo(() => {
    return PSX_STOCKS.filter((stock) => {
      const matchesSearch = stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || stock.name.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeCategory === 'ALL') return true;
      if (activeCategory === 'KSE100') return stock.category === 'KSE100';
      if (activeCategory === 'KMI30') return stock.category === 'KMI30';
      if (activeCategory === 'GAINERS') return stock.change > 0;
      if (activeCategory === 'LOSERS') return stock.change < 0;

      return true;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-2 md:p-4 font-sans selection:bg-emerald-500 selection:text-black">
      {/* Top Professional Ticker Header */}
      <header className="bg-slate-900 border border-slate-800 rounded-2xl p-3 md:p-4 mb-4 flex flex-col md:flex-row justify-between items-center gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500 text-slate-950 font-black px-3 py-1.5 rounded-xl text-lg tracking-wider">
            INVESTIFY <span className="text-white text-xs font-normal bg-slate-950 px-2 py-0.5 rounded ml-1">PRO</span>
          </div>
          <div>
            <h1 className="text-sm md:text-base font-extrabold text-white">Pakistan Stock Exchange Live Terminal</h1>
            <p className="text-[11px] text-slate-400">Integrated Market Watch • KSE-100 • KMI-30 Shariah • Live Averaging Engine</p>
          </div>
        </div>

        {/* Global Market Overview Badges */}
        <div className="flex items-center gap-3 overflow-x-auto text-xs font-mono">
          <div className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl">
            <span className="text-slate-400 block text-[10px]">KSE-100 INDEX</span>
            <span className="text-emerald-400 font-bold">170,068 ▲ +1.22%</span>
          </div>
          <div className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl">
            <span className="text-slate-400 block text-[10px]">KMI-30 (ISLAMIC)</span>
            <span className="text-emerald-400 font-bold">22,157 ▲ +1.38%</span>
          </div>
          <div className="bg-slate-950 border border-emerald-500/40 px-3 py-1.5 rounded-xl">
            <span className="text-slate-400 block text-[10px]">{symbol} LIVE TICK</span>
            <span className="text-emerald-400 font-bold text-sm">PKR {livePrice ? livePrice.toFixed(2) : '---'}</span>
          </div>
        </div>
      </header>

      {/* 3-Column Trading Terminal Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* ================= LEFT COLUMN: SMART AVERAGING BUY DESK ================= */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h2 className="text-sm font-black text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                SMART AVERAGING DESK
              </h2>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40 font-mono">
                {symbol}
              </span>
            </div>

            {/* Step 1: Existing Holdings */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 block uppercase tracking-wider">1. Current Holding</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] text-slate-400">Shares Owned</span>
                  <input
                    type="number"
                    placeholder="e.g. 1000"
                    value={existingQty}
                    onChange={(e) => setExistingQty(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 mt-1 text-sm font-bold text-white focus:border-emerald-500 outline-none font-mono"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400">Avg Buy Price (PKR)</span>
                  <input
                    type="number"
                    placeholder="e.g. 180"
                    value={existingPrice}
                    onChange={(e) => setExistingPrice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 mt-1 text-sm font-bold text-white focus:border-emerald-500 outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Planned Order Type */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-slate-300 block uppercase tracking-wider">2. Planned Buying Order</label>
              
              {/* Order Mode Toggle */}
              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setPriceMode('live')}
                  className={`py-2 rounded-lg transition ${priceMode === 'live' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  ⚡ Market Rate
                </button>
                <button
                  type="button"
                  onClick={() => setPriceMode('limit')}
                  className={`py-2 rounded-lg transition ${priceMode === 'limit' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  🎯 Limit Order
                </button>
              </div>

              {priceMode === 'limit' && (
                <div className="bg-slate-950 p-3 rounded-xl border border-amber-500/50">
                  <span className="text-xs text-amber-400 font-bold block">Target Limit Price (PKR)</span>
                  <input
                    type="number"
                    placeholder="e.g. 165"
                    value={customLimitPrice}
                    onChange={(e) => setCustomLimitPrice(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 mt-1 text-sm font-mono font-bold text-white outline-none focus:border-amber-400"
                  />
                </div>
              )}

              <div>
                <span className="text-[11px] text-slate-400">Quantity To Buy</span>
                <input
                  type="number"
                  placeholder="e.g. 500"
                  value={newQty}
                  onChange={(e) => setNewQty(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 mt-1 text-sm font-bold text-white focus:border-emerald-500 outline-none font-mono"
                />
              </div>

              {/* Commission Toggle */}
              <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-xs font-bold text-slate-300 block">Standard PSX Charges (+0.18%)</span>
                  <span className="text-[10px] text-slate-500">Brokerage + SST + SECP + CDC</span>
                </div>
                <input
                  type="checkbox"
                  checked={includeBrokerage}
                  onChange={(e) => setIncludeBrokerage(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Impact Calculation Preview */}
            <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-900 text-slate-400">
                <span>Execution Price:</span>
                <span className="font-mono font-bold text-emerald-400">PKR {effectiveBuyPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900 text-slate-400">
                <span>Total Portfolio Shares:</span>
                <span className="font-bold text-white">{totalShares} shares</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900 text-slate-400">
                <span>Capital Required:</span>
                <span className="font-mono font-bold text-amber-400">PKR {totalNewInvestment.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>

              {/* Big Result Box */}
              <div className="bg-slate-900 border border-emerald-500/40 p-4 rounded-xl text-center mt-3">
                <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">Projected New Average</span>
                <div className="text-3xl font-black font-mono text-white mt-1">
                  PKR {newAveragePrice.toFixed(2)}
                </div>
                {ePrice > 0 && nQty > 0 && (
                  <p className={`text-xs mt-2 font-bold ${avgDifference < 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {avgDifference < 0 ? `📉 Averaged Down by PKR ${Math.abs(avgDifference).toFixed(2)} / share` : `📈 Averaged Up by PKR ${avgDifference.toFixed(2)} / share`}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ================= CENTER COLUMN: TRADINGVIEW INTERACTIVE CHART ================= */}
        <div className="lg:col-span-5 space-y-4">
          <TradingViewChart
            symbol={symbol}
            history={activeStock.history}
            isPositive={activeStock.change >= 0}
            timeframe={timeframe}
            setTimeframe={setTimeframe}
            chartType={chartType}
            setChartType={setChartType}
          />

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Day's Range</span>
              <span className="text-xs font-mono font-bold text-white">
                Rs {Math.min(...activeStock.history).toFixed(1)} - {Math.max(...activeStock.history).toFixed(1)}
              </span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">24h Volatility</span>
              <span className={`text-xs font-mono font-bold ${activeStock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {activeStock.change >= 0 ? `+${activeStock.change}%` : `${activeStock.change}%`}
              </span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Compliance</span>
              <span className="text-xs font-bold text-emerald-400">
                {activeStock.shariah ? '✓ Shariah Compliant' : 'Conventional'}
              </span>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: PSX MARKET WATCH (30+ EQUITIES) ================= */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col space-y-3">
          <div className="border-b border-slate-800 pb-3 space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <span>📈</span> PSX Equities Watch
              </h3>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
                {filteredStocks.length}
              </span>
            </div>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search Symbol or Company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500"
            />

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1 text-[10px] font-bold">
              {(['ALL', 'KSE100', 'KMI30', 'GAINERS', 'LOSERS'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2 py-1 rounded-md transition ${activeCategory === cat ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Stock Tickers List */}
          <div className="space-y-1.5 overflow-y-auto max-h-[640px] pr-1 scrollbar-thin scrollbar-thumb-slate-800">
            {filteredStocks.map((stk) => {
              const isSelected = stk.symbol === symbol;
              const isGain = stk.change >= 0;

              return (
                <div
                  key={stk.symbol}
                  onClick={() => handleSelectStock(stk)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition flex items-center justify-between group ${
                    isSelected ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg' : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-xs text-white group-hover:text-emerald-400 transition">{stk.symbol}</span>
                      {stk.shariah && <span className="text-[8px] bg-emerald-950 text-emerald-400 px-1 rounded font-black">KMI</span>}
                    </div>
                    <p className="text-[10px] text-slate-400 truncate max-w-[90px]">{stk.name}</p>
                  </div>

                  {/* Sparkline Graph */}
                  <MiniSparkline data={stk.history} isPositive={isGain} />

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-white block">Rs {stk.price.toFixed(1)}</span>
                    <span className={`text-[10px] font-mono font-bold ${isGain ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isGain ? `+${stk.change}%` : `${stk.change}%`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
