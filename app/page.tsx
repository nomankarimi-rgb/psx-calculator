'use client';

import React, { useState, useEffect, useMemo } from 'react';

// Community Analysis Ideas Data
const COMMUNITY_IDEAS = [
  {
    id: 1,
    author: 'Tariq Equity Research',
    symbol: 'OGDC',
    target: 'PKR 198.00',
    type: 'LONG',
    timeframe: 'Swing Trade (3-4 Weeks)',
    thesis: 'Breakout above 172 neckline confirmed with heavy volume. Offshore discovery drilling phase 2 will provide upside momentum.',
    likes: 142,
    sentiment: 'Bullish'
  },
  {
    id: 2,
    author: 'KSE Alpha Trader',
    symbol: 'MEBL',
    target: 'PKR 255.00',
    type: 'LONG',
    timeframe: 'Quarterly',
    thesis: 'Meezan Bank sustaining 45%+ ROE. Record trade-finance spreads and high dividend payout ratio safeguard against market dips.',
    likes: 98,
    sentiment: 'Bullish'
  },
  {
    id: 3,
    author: 'PSX Technicals',
    symbol: 'SYS',
    target: 'PKR 430.00',
    type: 'SHORT / PULLBACK',
    timeframe: 'Intraday / Short Term',
    thesis: 'RSI divergence at 460 resistance. Testing 20-day exponential moving average before any continuation.',
    likes: 67,
    sentiment: 'Bearish'
  }
];

export default function NafaXTradingTerminal() {
  const [selectedSymbol, setSelectedSymbol] = useState('OGDC');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Timeframe & Chart Style
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1D');
  const [chartMode, setChartMode] = useState<'candles' | 'area'>('candles');

  // Screener Filters
  const [sectorFilter, setSectorFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyShariah, setOnlyShariah] = useState(false);

  // Smart Averaging Desk Inputs
  const [existingQty, setExistingQty] = useState('');
  const [existingPrice, setExistingPrice] = useState('');
  const [newQty, setNewQty] = useState('');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [customPrice, setCustomPrice] = useState('');
  const [includeBrokerage, setIncludeBrokerage] = useState(true);

  // Bottom Center Tabs
  const [activeTab, setActiveTab] = useState<'macro' | 'ideas' | 'financials'>('macro');

  const fetchStock = async (sym: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/stock?symbol=${sym}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock(selectedSymbol);
    const interval = setInterval(() => fetchStock(selectedSymbol), 10000);
    return () => clearInterval(interval);
  }, [selectedSymbol]);

  const activeStock = data?.stockDetails || {
    name: 'Oil & Gas Dev Co',
    sector: 'Oil & Gas Exploration',
    price: 174.50,
    pe: 4.8,
    mktCap: '750B',
    shariah: true
  };

  const currentLive = data?.currentPrice || activeStock.price;

  // Cost Averaging Math
  const eQty = parseFloat(existingQty) || 0;
  const ePrice = parseFloat(existingPrice) || 0;
  const nQty = parseFloat(newQty) || 0;
  const executionPrice = orderType === 'limit' && customPrice ? parseFloat(customPrice) || 0 : currentLive;
  const rawCost = nQty * executionPrice;
  const brokerage = includeBrokerage ? rawCost * 0.0018 : 0;
  const totalRequiredCapital = rawCost + brokerage;
  const totalShares = eQty + nQty;
  const newAverage = totalShares > 0 ? (eQty * ePrice + totalRequiredCapital) / totalShares : 0;
  const delta = ePrice > 0 ? newAverage - ePrice : 0;

  // Filter Directory (50+ Stocks)
  const directory: any[] = data?.directory || [];
  const filteredStocks = useMemo(() => {
    return directory.filter((s) => {
      const matchSearch = s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || s.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchSearch) return false;
      if (onlyShariah && !s.shariah) return false;
      if (sectorFilter === 'ALL') return true;
      return s.sector.toLowerCase().includes(sectorFilter.toLowerCase());
    });
  }, [directory, searchQuery, sectorFilter, onlyShariah]);

  const sectors = useMemo(() => {
    const list = Array.from(new Set(directory.map((s: any) => s.sector)));
    return ['ALL', ...list];
  }, [directory]);

  // Chart Coordinates
  const candles = data?.candles || [];
  const minPrice = candles.length > 0 ? Math.min(...candles.map((c: any) => c.low)) * 0.995 : 100;
  const maxPrice = candles.length > 0 ? Math.max(...candles.map((c: any) => c.high)) * 1.005 : 200;
  const priceRange = maxPrice - minPrice || 1;

  return (
    <div className="min-h-screen bg-[#0a0705] text-stone-200 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      
      {/* 1. TOP MACRO TICKER (TradingView Style Header Strip) */}
      <header className="border-b border-orange-500/10 bg-[#100b08] px-4 py-2 flex flex-wrap justify-between items-center gap-3 text-xs sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-700 flex items-center justify-center font-black text-white text-sm shadow-md shadow-orange-500/20">
              NX
            </div>
            <div>
              <span className="font-black text-white tracking-wide text-sm block">NAFAX <span className="text-orange-500">TERMINAL</span></span>
              <span className="text-[10px] text-stone-400">Pakistan Stock Exchange Financial Suite</span>
            </div>
          </div>
        </div>

        {/* Global Pakistan Market Strip */}
        <div className="flex items-center gap-3 overflow-x-auto text-xs font-mono">
          {data?.macroSummary?.indices?.slice(0, 3).map((idx: any) => (
            <div key={idx.symbol} className="bg-[#17110d] border border-orange-500/10 px-2.5 py-1 rounded-md flex items-center gap-2 whitespace-nowrap">
              <span className="text-stone-400 font-semibold">{idx.name}:</span>
              <span className="text-white font-bold">{idx.value}</span>
              <span className={`font-bold ${idx.isUp ? 'text-orange-400' : 'text-stone-400'}`}>{idx.percent}</span>
            </div>
          ))}

          <div className="bg-[#17110d] border border-orange-500/10 px-2.5 py-1 rounded-md flex items-center gap-2 whitespace-nowrap">
            <span className="text-stone-400 font-semibold">USD/PKR:</span>
            <span className="text-white font-bold">278.45</span>
            <span className="text-stone-400">-0.05%</span>
          </div>

          <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold px-3 py-1 rounded-md whitespace-nowrap shadow-sm">
            {selectedSymbol} PKR {currentLive.toFixed(2)}
          </div>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE (3-COLUMN DESKTOP ENGINE) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 p-3 overflow-hidden">
        
        {/* ================= COLUMN 1: LEFT SMART AVERAGING DESK ================= */}
        <div className="lg:col-span-3 flex flex-col justify-between bg-[#130e0b] border border-orange-500/10 rounded-xl p-3.5 shadow-xl space-y-3">
          <div>
            <div className="flex justify-between items-center border-b border-stone-800 pb-2.5">
              <div>
                <h2 className="text-xs font-black uppercase text-white tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                  SMART AVERAGING DESK
                </h2>
                <span className="text-[10px] text-stone-400">Position Down/Up Averaging Engine</span>
              </div>
              <span className="text-xs font-bold font-mono text-orange-400 bg-orange-500/10 border border-orange-500/25 px-2 py-0.5 rounded">
                {selectedSymbol}
              </span>
            </div>

            {/* Form Fields */}
            <div className="space-y-3 mt-3">
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">1. Existing Holding</span>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div>
                    <span className="text-[10px] text-stone-500">Shares Count</span>
                    <input
                      type="number"
                      placeholder="e.g. 1000"
                      value={existingQty}
                      onChange={(e) => setExistingQty(e.target.value)}
                      className="w-full bg-[#1b140f] border border-orange-500/15 rounded-lg p-2 text-xs font-mono font-bold text-white outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500">Avg Cost (PKR)</span>
                    <input
                      type="number"
                      placeholder="e.g. 185.0"
                      value={existingPrice}
                      onChange={(e) => setExistingPrice(e.target.value)}
                      className="w-full bg-[#1b140f] border border-orange-500/15 rounded-lg p-2 text-xs font-mono font-bold text-white outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Order Execution */}
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">2. Planned Buy Order</span>
                <div className="grid grid-cols-2 gap-1.5 mt-1 bg-[#17110d] p-1 rounded-lg border border-orange-500/10 text-xs font-bold">
                  <button
                    onClick={() => setOrderType('market')}
                    className={`py-1.5 rounded-md transition ${orderType === 'market' ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white' : 'text-stone-400 hover:text-white'}`}
                  >
                    ⚡ Market Rate
                  </button>
                  <button
                    onClick={() => setOrderType('limit')}
                    className={`py-1.5 rounded-md transition ${orderType === 'limit' ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white' : 'text-stone-400 hover:text-white'}`}
                  >
                    🎯 Limit Bid
                  </button>
                </div>
              </div>

              {orderType === 'limit' && (
                <div className="bg-orange-500/10 border border-orange-500/25 p-2 rounded-lg">
                  <label className="text-[10px] text-orange-400 font-bold block uppercase">Custom Target Limit (PKR)</label>
                  <input
                    type="number"
                    placeholder="e.g. 165"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    className="w-full bg-[#17110d] border border-orange-500/20 rounded-md p-1.5 mt-1 text-xs font-mono font-bold text-white outline-none focus:border-orange-400"
                  />
                </div>
              )}

              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">3. New Shares to Add</span>
                <input
                  type="number"
                  placeholder="e.g. 500"
                  value={newQty}
                  onChange={(e) => setNewQty(e.target.value)}
                  className="w-full bg-[#1b140f] border border-orange-500/15 rounded-lg p-2 text-xs font-mono font-bold text-white outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex items-center justify-between bg-[#1b140f] p-2 rounded-lg border border-orange-500/10">
                <div>
                  <span className="text-[11px] text-stone-300 font-bold block">Apply PSX Charges (+0.18%)</span>
                  <span className="text-[9px] text-stone-500">Brokerage, CVT, CDC, SECP</span>
                </div>
                <input
                  type="checkbox"
                  checked={includeBrokerage}
                  onChange={(e) => setIncludeBrokerage(e.target.checked)}
                  className="w-4 h-4 accent-orange-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Resulting Average Box */}
          <div className="bg-[#18110e] border border-orange-500/15 rounded-lg p-3 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-stone-800 text-stone-400">
              <span>Required Capital:</span>
              <span className="font-mono font-bold text-amber-400">PKR {totalRequiredCapital.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-800 text-stone-400">
              <span>Final Portfolio Count:</span>
              <span className="font-bold text-white">{totalShares} shares</span>
            </div>

            <div className="bg-gradient-to-br from-[#231711] to-[#150f0c] border border-orange-500/30 p-3 rounded-md text-center mt-2 shadow-md">
              <span className="text-[10px] font-black uppercase text-orange-400 tracking-wider block">Projected New Average Cost</span>
              <div className="text-2xl font-black font-mono text-white mt-1">
                PKR {newAverage.toFixed(2)}
              </div>
              {ePrice > 0 && nQty > 0 && (
                <span className={`text-[11px] font-bold block mt-1 ${delta < 0 ? 'text-orange-400' : 'text-amber-300'}`}>
                  {delta < 0 ? `📉 Averaged Down by PKR ${Math.abs(delta).toFixed(2)}/sh` : `📈 Averaged Up by PKR ${delta.toFixed(2)}/sh`}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ================= COLUMN 2: TRADINGVIEW CHART & MACRO ANALYTICS ================= */}
        <div className="lg:col-span-6 flex flex-col space-y-3">
          
          {/* Main Chart Card */}
          <div className="bg-[#130e0b] border border-orange-500/10 rounded-xl p-3.5 shadow-xl flex flex-col">
            
            {/* Asset Header Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 pb-2.5 mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-white">{selectedSymbol}</h2>
                  <span className="text-xs text-stone-400">{activeStock.name}</span>
                  {activeStock.shariah && (
                    <span className="text-[9px] bg-orange-500/10 text-orange-400 border border-orange-500/20 px-1.5 py-0.2 rounded font-bold">
                      KMI Shariah
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-1 font-mono text-xs">
                  <span className="text-2xl font-black text-white">PKR {currentLive.toFixed(2)}</span>
                  <span className="text-orange-400 font-bold">
                    ▲ +{data?.change || 3.85} (+{data?.changePercent || 2.26}%)
                  </span>
                </div>
              </div>

              {/* Timeframes & Modes */}
              <div className="flex items-center gap-2">
                <div className="flex bg-[#18110d] p-1 rounded-md border border-orange-500/10 text-xs font-bold">
                  {(['1D', '1W', '1M', '1Y'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTimeframe(t)}
                      className={`px-2 py-0.5 rounded transition ${timeframe === t ? 'bg-orange-600 text-white' : 'text-stone-400'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="flex bg-[#18110d] p-1 rounded-md border border-orange-500/10 text-xs font-bold">
                  <button
                    onClick={() => setChartMode('candles')}
                    className={`px-2 py-0.5 rounded transition ${chartMode === 'candles' ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white' : 'text-stone-400'}`}
                  >
                    🕯️
                  </button>
                  <button
                    onClick={() => setChartMode('area')}
                    className={`px-2 py-0.5 rounded transition ${chartMode === 'area' ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white' : 'text-stone-400'}`}
                  >
                    📈
                  </button>
                </div>
              </div>
            </div>

            {/* TradingView Interactive SVG Canvas */}
            <div className="relative w-full h-[330px] bg-[#0c0806] rounded-lg p-3 border border-orange-500/10 overflow-hidden flex flex-col justify-between">
              
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 opacity-10">
                <div className="border-b border-dashed border-orange-400 w-full"></div>
                <div className="border-b border-dashed border-orange-400 w-full"></div>
                <div className="border-b border-dashed border-orange-400 w-full"></div>
                <div className="border-b border-dashed border-orange-400 w-full"></div>
              </div>

              <div className="flex justify-between text-[11px] font-mono text-stone-400 z-10">
                <span>HIGH: <strong className="text-orange-400">PKR {maxPrice.toFixed(2)}</strong></span>
                <span>LOW: <strong className="text-stone-300">PKR {minPrice.toFixed(2)}</strong></span>
              </div>

              {chartMode === 'candles' ? (
                <div className="w-full h-[250px] flex items-end justify-between px-2 z-10">
                  {candles.slice(-32).map((c: any, idx: number) => {
                    const isUp = c.close >= c.open;
                    const bodyHeight = Math.max(4, (Math.abs(c.close - c.open) / priceRange) * 200);
                    const wickHeight = Math.max(bodyHeight, ((c.high - c.low) / priceRange) * 220);
                    return (
                      <div key={idx} className="flex flex-col items-center justify-center relative w-full h-full cursor-crosshair">
                        <div className={`w-[1px] ${isUp ? 'bg-orange-500' : 'bg-stone-500'}`} style={{ height: `${wickHeight}px` }}></div>
                        <div
                          className={`w-[6px] md:w-[8px] rounded-[1px] ${isUp ? 'bg-gradient-to-t from-orange-600 to-amber-500 shadow-sm shadow-orange-500/30' : 'bg-[#2b1f18] border border-stone-600'} absolute`}
                          style={{ height: `${bodyHeight}px` }}
                        ></div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="w-full h-[250px] flex items-center z-10">
                  <svg viewBox="0 0 500 180" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="amberGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f97316" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {candles.length > 1 && (
                      <>
                        <polygon
                          fill="url(#amberGlow)"
                          points={`0,180 ${candles.map((c: any, i: number) => `${(i / (candles.length - 1)) * 500},${180 - ((c.close - minPrice) / priceRange) * 160}`).join(' ')} 500,180`}
                        />
                        <polyline
                          fill="none"
                          stroke="#f97316"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={candles.map((c: any, i: number) => `${(i / (candles.length - 1)) * 500},${180 - ((c.close - minPrice) / priceRange) * 160}`).join(' ')}
                        />
                      </>
                    )}
                  </svg>
                </div>
              )}

              <div className="flex justify-between text-[10px] text-stone-500 font-mono z-10 border-t border-stone-900 pt-1">
                <span>09:15 AM (Open)</span>
                <span>11:30 AM</span>
                <span>01:30 PM</span>
                <span>03:30 PM (Close)</span>
              </div>
            </div>

            {/* Daily Ticker Metrics */}
            <div className="grid grid-cols-4 gap-2 pt-2.5 text-center font-mono text-[11px]">
              <div className="bg-[#17110d] p-1.5 rounded-md border border-orange-500/10">
                <span className="text-stone-500 block text-[9px] uppercase">Open</span>
                <span className="font-bold text-white">PKR {data?.open || '171.0'}</span>
              </div>
              <div className="bg-[#17110d] p-1.5 rounded-md border border-orange-500/10">
                <span className="text-stone-500 block text-[9px] uppercase">High</span>
                <span className="font-bold text-orange-400">PKR {data?.high || '176.0'}</span>
              </div>
              <div className="bg-[#17110d] p-1.5 rounded-md border border-orange-500/10">
                <span className="text-stone-500 block text-[9px] uppercase">Low</span>
                <span className="font-bold text-stone-300">PKR {data?.low || '170.5'}</span>
              </div>
              <div className="bg-[#17110d] p-1.5 rounded-md border border-orange-500/10">
                <span className="text-stone-500 block text-[9px] uppercase">Volume</span>
                <span className="font-bold text-white">{data?.volume ? data.volume.toLocaleString() : '14.5M'}</span>
              </div>
            </div>
          </div>

          {/* Bottom Tabs: Macro Summary vs Community Ideas vs Financials */}
          <div className="bg-[#130e0b] border border-orange-500/10 rounded-xl p-3 shadow-xl flex-1 flex flex-col">
            <div className="flex gap-4 border-b border-stone-800 pb-2 mb-2 text-xs font-bold">
              <button
                onClick={() => setActiveTab('macro')}
                className={`pb-1 transition ${activeTab === 'macro' ? 'text-orange-400 border-b-2 border-orange-400' : 'text-stone-400 hover:text-white'}`}
              >
                📊 Pakistan Macro, Currencies & Gold
              </button>
              <button
                onClick={() => setActiveTab('ideas')}
                className={`pb-1 transition ${activeTab === 'ideas' ? 'text-orange-400 border-b-2 border-orange-400' : 'text-stone-400 hover:text-white'}`}
              >
                💡 TradingView Community Ideas
              </button>
              <button
                onClick={() => setActiveTab('financials')}
                className={`pb-1 transition ${activeTab === 'financials' ? 'text-orange-400 border-b-2 border-orange-400' : 'text-stone-400 hover:text-white'}`}
              >
                📈 Company Fundamentals
              </button>
            </div>

            {/* TAB 1: Macro Summary (Inspired by screenshot) */}
            {activeTab === 'macro' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto max-h-[170px] pr-1">
                {/* Currency Table */}
                <div className="bg-[#17110d] p-2.5 rounded-lg border border-orange-500/10">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1.5">Forex (Pakistani Rupee Spot)</span>
                  <div className="space-y-1 text-xs font-mono">
                    {data?.macroSummary?.currencies?.map((c: any) => (
                      <div key={c.pair} className="flex justify-between py-0.5 border-b border-stone-800">
                        <span className="text-stone-300">{c.pair}</span>
                        <span className="font-bold text-white">PKR {c.rate}</span>
                        <span className={c.isUp ? 'text-orange-400' : 'text-stone-400'}>{c.percent}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Commodities Table (Gold, Silver, Oil) */}
                <div className="bg-[#17110d] p-2.5 rounded-lg border border-orange-500/10">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1.5">Commodities & Bullion (Pakistan)</span>
                  <div className="space-y-1 text-xs font-mono">
                    {data?.macroSummary?.commodities?.map((m: any) => (
                      <div key={m.name} className="flex justify-between py-0.5 border-b border-stone-800">
                        <span className="text-stone-300">{m.name}</span>
                        <span className="font-bold text-white">{m.rate}</span>
                        <span className={m.isUp ? 'text-orange-400' : 'text-stone-400'}>{m.percent}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Community Ideas & Analysis */}
            {activeTab === 'ideas' && (
              <div className="space-y-2 overflow-y-auto max-h-[170px] pr-1">
                {COMMUNITY_IDEAS.map((idea) => (
                  <div key={idea.id} className="p-2.5 rounded-lg bg-[#18110d] border border-orange-500/10 flex flex-col space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{idea.author}</span>
                        <span className="bg-orange-500/15 text-orange-400 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold">
                          {idea.symbol} • {idea.type}
                        </span>
                      </div>
                      <span className="text-orange-400 font-mono font-bold text-xs">Target: {idea.target}</span>
                    </div>
                    <p className="text-[11px] text-stone-300">{idea.thesis}</p>
                    <div className="flex justify-between text-[10px] text-stone-500 pt-1">
                      <span>{idea.timeframe}</span>
                      <span>❤️ {idea.likes} traders agree</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: Financials */}
            {activeTab === 'financials' && (
              <div className="grid grid-cols-4 gap-2 font-mono text-xs">
                <div className="bg-[#18110d] p-2 rounded-lg border border-orange-500/10 text-center">
                  <span className="text-stone-500 text-[10px] block uppercase">P/E Ratio</span>
                  <span className="font-bold text-white text-base">{activeStock.pe}x</span>
                </div>
                <div className="bg-[#18110d] p-2 rounded-lg border border-orange-500/10 text-center">
                  <span className="text-stone-500 text-[10px] block uppercase">Market Cap</span>
                  <span className="font-bold text-white text-base">PKR {activeStock.mktCap}</span>
                </div>
                <div className="bg-[#18110d] p-2 rounded-lg border border-orange-500/10 text-center">
                  <span className="text-stone-500 text-[10px] block uppercase">Sector</span>
                  <span className="font-bold text-orange-400 text-xs truncate block">{activeStock.sector}</span>
                </div>
                <div className="bg-[#18110d] p-2 rounded-lg border border-orange-500/10 text-center">
                  <span className="text-stone-500 text-[10px] block uppercase">Shariah Status</span>
                  <span className="font-bold text-emerald-400 text-xs block">{activeStock.shariah ? '✓ KMI Compliant' : 'Conventional'}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ================= COLUMN 3: PSX COMPLETE DIRECTORY & SECTOR SCREENER ================= */}
        <div className="lg:col-span-3 bg-[#130e0b] border border-orange-500/10 rounded-xl p-3 shadow-xl flex flex-col space-y-2.5">
          <div className="border-b border-stone-800 pb-2 space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <span className="text-orange-400">🔥</span> PSX Sectors Screener
              </h3>
              <span className="text-[10px] bg-[#18110d] text-orange-400 px-2 py-0.5 rounded font-mono border border-orange-500/10">
                {filteredStocks.length} Stocks
              </span>
            </div>

            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search Symbol (e.g. MEBL, SYS, PRL)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#18110d] border border-orange-500/15 rounded-md px-2.5 py-1.5 text-xs text-white placeholder-stone-500 outline-none focus:border-orange-500"
            />

            {/* Shariah Filter Switch */}
            <div className="flex justify-between items-center text-xs">
              <span className="text-stone-400 text-[11px]">KMI-30 Shariah Only</span>
              <input
                type="checkbox"
                checked={onlyShariah}
                onChange={(e) => setOnlyShariah(e.target.checked)}
                className="accent-orange-500 cursor-pointer"
              />
            </div>

            {/* Sector Dropdown */}
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="w-full bg-[#18110d] border border-orange-500/15 text-stone-300 text-xs rounded-md p-1.5 outline-none font-bold"
            >
              {sectors.map((sec: string) => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>

          {/* Comprehensive 50+ Stock List */}
          <div className="space-y-1 overflow-y-auto max-h-[660px] pr-1">
            {filteredStocks.map((stk) => {
              const isSelected = stk.symbol === selectedSymbol;

              return (
                <div
                  key={stk.symbol}
                  onClick={() => {
                    setSelectedSymbol(stk.symbol);
                    fetchStock(stk.symbol);
                  }}
                  className={`p-2 rounded-lg border cursor-pointer transition flex items-center justify-between group ${
                    isSelected
                      ? 'bg-gradient-to-r from-orange-500/20 to-amber-600/10 border-orange-500/40 shadow-sm'
                      : 'bg-[#17110d] border-orange-500/5 hover:border-orange-500/20'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-xs text-white group-hover:text-orange-400 transition">{stk.symbol}</span>
                      {stk.shariah && (
                        <span className="text-[8px] bg-orange-500/15 text-orange-400 px-1 py-0.2 rounded font-bold">
                          KMI
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-stone-400 truncate max-w-[100px]">{stk.name}</p>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-xs font-bold text-white block">PKR {stk.price.toFixed(1)}</span>
                    <span className="text-[10px] font-bold text-orange-400">
                      {stk.change >= 0 ? `+${stk.change}%` : `${stk.change}%`}
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
