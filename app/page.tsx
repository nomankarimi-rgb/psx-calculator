'use client';

import React, { useState, useEffect, useMemo } from 'react';

const PSX_UNIVERSE = [
  { symbol: 'OGDC', name: 'Oil & Gas Dev Co', sector: 'Oil & Gas', pe: 4.8, mktCap: '745B', shariah: true, price: 174.50, change: +3.85 },
  { symbol: 'PPL', name: 'Pak Petroleum Ltd', sector: 'Oil & Gas', pe: 5.2, mktCap: '340B', shariah: true, price: 126.20, change: +2.15 },
  { symbol: 'PSO', name: 'Pak State Oil', sector: 'Oil & Gas', pe: 6.1, mktCap: '102B', shariah: false, price: 218.30, change: -1.75 },
  { symbol: 'MARI', name: 'Mari Energies Ltd', sector: 'Oil & Gas', pe: 7.9, mktCap: '420B', shariah: true, price: 2840.00, change: +4.10 },
  { symbol: 'HUBC', name: 'Hub Power Company', sector: 'Power Gen', pe: 4.5, mktCap: '185B', shariah: true, price: 146.20, change: +4.20 },
  { symbol: 'PRL', name: 'Pak Refinery Ltd', sector: 'Refinery', pe: 3.9, mktCap: '35B', shariah: true, price: 30.15, change: +5.30 },
  { symbol: 'SYS', name: 'Systems Limited', sector: 'Technology', pe: 14.5, mktCap: '128B', shariah: true, price: 452.00, change: -2.30 },
  { symbol: 'TRG', name: 'TRG Pakistan Ltd', sector: 'Technology', pe: 8.2, mktCap: '32B', shariah: false, price: 59.80, change: -3.60 },
  { symbol: 'AIRLINK', name: 'Air Link Communication', sector: 'Technology', pe: 11.0, mktCap: '44B', shariah: true, price: 114.50, change: +3.20 },
  { symbol: 'WTL', name: 'WorldCall Telecom', sector: 'Telecom', pe: 2.1, mktCap: '6B', shariah: false, price: 1.39, change: +0.00 },
  { symbol: 'MEBL', name: 'Meezan Bank Ltd', sector: 'Islamic Bank', pe: 5.6, mktCap: '410B', shariah: true, price: 236.00, change: +1.95 },
  { symbol: 'HBL', name: 'Habib Bank Limited', sector: 'Banking', pe: 4.2, mktCap: '190B', shariah: false, price: 132.50, change: -0.85 },
  { symbol: 'MCB', name: 'MCB Bank Limited', sector: 'Banking', pe: 5.1, mktCap: '270B', shariah: false, price: 229.40, change: +0.40 },
  { symbol: 'UBL', name: 'United Bank Limited', sector: 'Banking', pe: 4.9, mktCap: '345B', shariah: false, price: 288.00, change: +2.10 },
  { symbol: 'LUCK', name: 'Lucky Cement Ltd', sector: 'Cement', pe: 8.4, mktCap: '290B', shariah: true, price: 935.00, change: +2.80 },
  { symbol: 'DGKC', name: 'D.G. Khan Cement', sector: 'Cement', pe: 6.8, mktCap: '37B', shariah: true, price: 85.50, change: +1.70 },
  { symbol: 'ENGRO', name: 'Engro Corporation', sector: 'Fertilizer', pe: 6.3, mktCap: '188B', shariah: true, price: 348.00, change: +1.20 },
  { symbol: 'FFC', name: 'Fauji Fertilizer Co', sector: 'Fertilizer', pe: 5.8, mktCap: '260B', shariah: true, price: 204.50, change: +0.65 },
];

const MARKET_NEWS = [
  { id: 1, title: 'PSX sets historical milestone as KSE-100 rallies past key resistance with corporate buying', time: '10m ago', category: 'Equities' },
  { id: 2, title: 'OGDC & PPL joint exploration appraisal yields high-gravity hydrocarbon reservoir', time: '35m ago', category: 'Energy' },
  { id: 3, title: 'Meezan Bank records record quarterly asset surge driven by trade finance expansion', time: '2h ago', category: 'Banking' },
  { id: 4, title: 'SBP reserves maintain upward trajectory as export remittances bolster currency stability', time: '4h ago', category: 'Economy' },
];

export default function NafaXTerminal() {
  const [selectedSymbol, setSelectedSymbol] = useState('OGDC');
  const [stockData, setStockData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [chartMode, setChartMode] = useState<'candles' | 'area'>('candles');

  // Screener Filters
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'SHARIAH' | 'ENERGY' | 'TECH' | 'BANK'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Averaging Desk Inputs
  const [existingQty, setExistingQty] = useState('');
  const [existingPrice, setExistingPrice] = useState('');
  const [newQty, setNewQty] = useState('');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [customPrice, setCustomPrice] = useState('');
  const [includeBrokerage, setIncludeBrokerage] = useState(true);

  // Tabs
  const [centerTab, setCenterTab] = useState<'news' | 'financials'>('news');

  const fetchData = async (sym: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/stock?symbol=${sym}`);
      const data = await res.json();
      setStockData(data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedSymbol);
    const interval = setInterval(() => fetchData(selectedSymbol), 10000);
    return () => clearInterval(interval);
  }, [selectedSymbol]);

  const activeStock = PSX_UNIVERSE.find((s) => s.symbol === selectedSymbol) || PSX_UNIVERSE[0];
  const currentLive = stockData?.currentPrice || activeStock.price;

  // Averaging Logic
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

  const filteredStocks = useMemo(() => {
    return PSX_UNIVERSE.filter((s) => {
      const match = s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || s.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (!match) return false;
      if (activeCategory === 'SHARIAH') return s.shariah;
      if (activeCategory === 'ENERGY') return s.sector.includes('Oil') || s.sector.includes('Power') || s.sector.includes('Refinery');
      if (activeCategory === 'TECH') return s.sector === 'Technology' || s.sector === 'Telecom';
      if (activeCategory === 'BANK') return s.sector.includes('Bank');
      return true;
    });
  }, [searchQuery, activeCategory]);

  // Chart Dimensions & Calculations
  const candles = stockData?.candles || [];
  const minPrice = candles.length > 0 ? Math.min(...candles.map((c: any) => c.low)) * 0.995 : 100;
  const maxPrice = candles.length > 0 ? Math.max(...candles.map((c: any) => c.high)) * 1.005 : 200;
  const priceRange = maxPrice - minPrice || 1;

  return (
    <div className="min-h-screen bg-[#0a0705] text-stone-200 flex font-sans selection:bg-orange-500 selection:text-white">
      
      {/* 1. SLIM FINTECH SIDEBAR */}
      <aside className="w-14 md:w-16 bg-[#110c09] border-r border-orange-500/10 flex flex-col justify-between items-center py-4 z-20">
        <div className="flex flex-col items-center gap-6">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-amber-700 flex items-center justify-center shadow-lg shadow-orange-500/20 cursor-pointer">
            <span className="font-black text-white text-base">NX</span>
          </div>

          <nav className="flex flex-col gap-3 text-stone-400">
            <button className="w-9 h-9 rounded-lg bg-orange-500/15 text-orange-400 border border-orange-500/30 flex items-center justify-center text-sm">
              ⚡
            </button>
            <button className="w-9 h-9 rounded-lg hover:bg-stone-800/40 hover:text-white flex items-center justify-center text-sm transition">
              📊
            </button>
            <button className="w-9 h-9 rounded-lg hover:bg-stone-800/40 hover:text-white flex items-center justify-center text-sm transition">
              💼
            </button>
            <button className="w-9 h-9 rounded-lg hover:bg-stone-800/40 hover:text-white flex items-center justify-center text-sm transition">
              📰
            </button>
          </nav>
        </div>

        <div className="w-8 h-8 rounded-lg bg-stone-900 border border-orange-500/20 flex items-center justify-center text-[10px] font-bold text-orange-400 font-mono">
          PK
        </div>
      </aside>

      {/* 2. WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP STATUS BAR */}
        <header className="border-b border-orange-500/10 bg-[#100b08] px-4 py-2.5 flex flex-wrap justify-between items-center gap-3 text-xs sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black tracking-wide text-white">NAFAX <span className="text-orange-500 font-bold">TERMINAL</span></h1>
              <span className="text-[10px] bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded font-bold">
                PSX ACTIVE
              </span>
            </div>
            <span className="text-stone-500 hidden sm:inline">|</span>
            <span className="text-[11px] text-stone-400 hidden sm:inline">Pakistan Stock Exchange Financial Suite</span>
          </div>

          <div className="flex items-center gap-2.5 font-mono text-[11px]">
            <div className="bg-[#17110d] border border-orange-500/10 px-2.5 py-1 rounded-md flex items-center gap-2">
              <span className="text-stone-500">MARKET:</span>
              <span className="font-bold text-amber-500">● {stockData?.market?.status || 'Closed'}</span>
            </div>

            <div className="bg-[#17110d] border border-orange-500/10 px-2.5 py-1 rounded-md flex items-center gap-2">
              <span className="text-stone-500">KSE-100:</span>
              <span className="text-white font-bold">{stockData?.kse100?.current?.toLocaleString() || '112,450'}</span>
              <span className="text-orange-400 font-bold">▲ +845.60 (+0.76%)</span>
            </div>

            <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold px-3 py-1 rounded-md shadow-sm">
              {selectedSymbol} PKR {currentLive.toFixed(2)}
            </div>
          </div>
        </header>

        {/* 3-COLUMN LAYOUT */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 p-3 overflow-hidden">
          
          {/* ================= COLUMN 1: LEFT AVERAGING DESK ================= */}
          <div className="lg:col-span-3 flex flex-col justify-between bg-[#130e0b] border border-orange-500/10 rounded-xl p-4 shadow-xl space-y-3">
            <div>
              <div className="flex justify-between items-center border-b border-stone-800/80 pb-2.5">
                <div>
                  <h2 className="text-xs font-black uppercase text-white tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                    Averaging & Buy Desk
                  </h2>
                  <span className="text-[10px] text-stone-400">Position Down-Averaging Tool</span>
                </div>
                <span className="text-xs font-bold font-mono text-orange-400 bg-orange-500/10 border border-orange-500/25 px-2 py-0.5 rounded">
                  {selectedSymbol}
                </span>
              </div>

              {/* Input Form */}
              <div className="space-y-3 mt-3">
                <div>
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">1. Current Holding</span>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div>
                      <span className="text-[10px] text-stone-500">Shares Count</span>
                      <input
                        type="number"
                        placeholder="e.g. 1000"
                        value={existingQty}
                        onChange={(e) => setExistingQty(e.target.value)}
                        className="w-full bg-[#1b140f] border border-orange-500/15 rounded-lg p-2 text-xs font-mono font-bold text-white outline-none focus:border-orange-500 transition"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500">Avg Cost (PKR)</span>
                      <input
                        type="number"
                        placeholder="e.g. 185.0"
                        value={existingPrice}
                        onChange={(e) => setExistingPrice(e.target.value)}
                        className="w-full bg-[#1b140f] border border-orange-500/15 rounded-lg p-2 text-xs font-mono font-bold text-white outline-none focus:border-orange-500 transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Execution Mode */}
                <div>
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">2. Execution Type</span>
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
                      🎯 Target Limit
                    </button>
                  </div>
                </div>

                {orderType === 'limit' && (
                  <div className="bg-orange-500/10 border border-orange-500/25 p-2 rounded-lg">
                    <label className="text-[10px] text-orange-400 font-bold block uppercase">Your Bid Limit (PKR)</label>
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
                    className="w-full bg-[#1b140f] border border-orange-500/15 rounded-lg p-2 text-xs font-mono font-bold text-white outline-none focus:border-orange-500 transition"
                  />
                </div>

                <div className="flex items-center justify-between bg-[#1b140f] p-2 rounded-lg border border-orange-500/10">
                  <div>
                    <span className="text-[11px] text-stone-300 font-bold block">PSX Charges (+0.18%)</span>
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

            {/* Sharp Glowing Output Box */}
            <div className="bg-[#18110e] border border-orange-500/15 rounded-lg p-3 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-stone-800 text-stone-400">
                <span>Total Capital Needed:</span>
                <span className="font-mono font-bold text-amber-400">PKR {totalRequiredCapital.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-800 text-stone-400">
                <span>Final Share Count:</span>
                <span className="font-bold text-white">{totalShares} shares</span>
              </div>

              <div className="bg-gradient-to-br from-[#231711] to-[#150f0c] border border-orange-500/30 p-3 rounded-md text-center mt-2 shadow-md">
                <span className="text-[10px] font-black uppercase text-orange-400 tracking-wider block">Projected New Average</span>
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

          {/* ================= COLUMN 2: CENTER TRADINGVIEW ENGINE ================= */}
          <div className="lg:col-span-6 flex flex-col space-y-3">
            
            {/* Main Interactive Chart Card */}
            <div className="bg-[#130e0b] border border-orange-500/10 rounded-xl p-4 shadow-xl flex flex-col">
              
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800/80 pb-2.5 mb-2">
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
                      ▲ +{stockData?.change || activeStock.change} (+{stockData?.changePercent || 2.45}%)
                    </span>
                  </div>
                </div>

                {/* Sleek Mode Switcher */}
                <div className="flex items-center gap-1 bg-[#18110d] p-1 rounded-md border border-orange-500/10 text-xs font-bold">
                  <button
                    onClick={() => setChartMode('candles')}
                    className={`px-2.5 py-1 rounded transition ${chartMode === 'candles' ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white' : 'text-stone-400 hover:text-white'}`}
                  >
                    🕯️ Candles
                  </button>
                  <button
                    onClick={() => setChartMode('area')}
                    className={`px-2.5 py-1 rounded transition ${chartMode === 'area' ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white' : 'text-stone-400 hover:text-white'}`}
                  >
                    📈 Area Line
                  </button>
                </div>
              </div>

              {/* Built-in Guaranteed Native Trading Engine (Canvas / SVG) */}
              <div className="relative w-full h-[360px] bg-[#0c0806] rounded-lg p-3 border border-orange-500/10 overflow-hidden flex flex-col justify-between">
                
                {/* Horizontal Level Guides */}
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 opacity-10">
                  <div className="border-b border-dashed border-orange-400 w-full"></div>
                  <div className="border-b border-dashed border-orange-400 w-full"></div>
                  <div className="border-b border-dashed border-orange-400 w-full"></div>
                  <div className="border-b border-dashed border-orange-400 w-full"></div>
                </div>

                {/* Range Labels */}
                <div className="flex justify-between text-[11px] font-mono text-stone-400 z-10">
                  <span>HIGH: <strong className="text-orange-400">PKR {maxPrice.toFixed(2)}</strong></span>
                  <span>LOW: <strong className="text-stone-300">PKR {minPrice.toFixed(2)}</strong></span>
                </div>

                {/* Chart Graphic Display */}
                {chartMode === 'candles' ? (
                  <div className="w-full h-[280px] flex items-end justify-between px-2 z-10">
                    {candles.slice(-32).map((c: any, idx: number) => {
                      const isUp = c.close >= c.open;
                      const bodyHeight = Math.max(4, (Math.abs(c.close - c.open) / priceRange) * 220);
                      const wickHeight = Math.max(bodyHeight, ((c.high - c.low) / priceRange) * 240);
                      return (
                        <div key={idx} className="flex flex-col items-center justify-center relative w-full h-full group cursor-crosshair">
                          {/* Candle Wick */}
                          <div className={`w-[1px] ${isUp ? 'bg-orange-500' : 'bg-stone-500'}`} style={{ height: `${wickHeight}px` }}></div>
                          {/* Candle Body */}
                          <div
                            className={`w-[6px] md:w-[8px] rounded-[1px] ${isUp ? 'bg-gradient-to-t from-orange-600 to-amber-500 shadow-sm shadow-orange-500/30' : 'bg-[#2b1f18] border border-stone-600'} absolute`}
                            style={{ height: `${bodyHeight}px` }}
                          ></div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="w-full h-[280px] flex items-center z-10">
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

                {/* Bottom Timeline */}
                <div className="flex justify-between text-[10px] text-stone-500 font-mono z-10 border-t border-stone-900 pt-1">
                  <span>09:15 AM (Open)</span>
                  <span>11:30 AM</span>
                  <span>01:30 PM</span>
                  <span>03:30 PM (Close)</span>
                </div>
              </div>

              {/* Daily Statistics */}
              <div className="grid grid-cols-4 gap-2 pt-2.5 text-center font-mono text-[11px]">
                <div className="bg-[#17110d] p-1.5 rounded-md border border-orange-500/10">
                  <span className="text-stone-500 block text-[9px] uppercase">Open</span>
                  <span className="font-bold text-white">PKR {stockData?.open || '171.0'}</span>
                </div>
                <div className="bg-[#17110d] p-1.5 rounded-md border border-orange-500/10">
                  <span className="text-stone-500 block text-[9px] uppercase">High</span>
                  <span className="font-bold text-orange-400">PKR {stockData?.high || '175.5'}</span>
                </div>
                <div className="bg-[#17110d] p-1.5 rounded-md border border-orange-500/10">
                  <span className="text-stone-500 block text-[9px] uppercase">Low</span>
                  <span className="font-bold text-stone-300">PKR {stockData?.low || '170.2'}</span>
                </div>
                <div className="bg-[#17110d] p-1.5 rounded-md border border-orange-500/10">
                  <span className="text-stone-500 block text-[9px] uppercase">Volume</span>
                  <span className="font-bold text-white">{stockData?.volume ? stockData.volume.toLocaleString() : '14.2M'}</span>
                </div>
              </div>
            </div>

            {/* Bottom News & Valuation Tabs */}
            <div className="bg-[#130e0b] border border-orange-500/10 rounded-xl p-3 shadow-xl flex-1 flex flex-col">
              <div className="flex gap-4 border-b border-stone-800 pb-2 mb-2 text-xs font-bold">
                <button
                  onClick={() => setCenterTab('news')}
                  className={`pb-1 transition ${centerTab === 'news' ? 'text-orange-400 border-b-2 border-orange-400' : 'text-stone-400 hover:text-white'}`}
                >
                  📰 Market News & Regulatory Filings
                </button>
                <button
                  onClick={() => setCenterTab('financials')}
                  className={`pb-1 transition ${centerTab === 'financials' ? 'text-orange-400 border-b-2 border-orange-400' : 'text-stone-400 hover:text-white'}`}
                >
                  📊 Valuation & Fundamentals
                </button>
              </div>

              {centerTab === 'news' ? (
                <div className="space-y-1.5 overflow-y-auto max-h-[140px] pr-1">
                  {MARKET_NEWS.map((n) => (
                    <div key={n.id} className="p-2 rounded-lg bg-[#18110d] border border-orange-500/5 flex justify-between items-center hover:border-orange-500/20 transition">
                      <div>
                        <p className="text-xs text-stone-200 font-semibold">{n.title}</p>
                        <span className="text-[10px] text-stone-500">{n.time}</span>
                      </div>
                      <span className="text-[10px] bg-orange-500/15 text-orange-400 px-2 py-0.5 rounded font-mono font-bold">
                        {n.category}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                  <div className="bg-[#18110d] p-2.5 rounded-lg border border-orange-500/10">
                    <span className="text-stone-500 text-[10px] block uppercase">P/E Ratio</span>
                    <span className="font-bold text-white text-sm">{activeStock.pe}x</span>
                  </div>
                  <div className="bg-[#18110d] p-2.5 rounded-lg border border-orange-500/10">
                    <span className="text-stone-500 text-[10px] block uppercase">Market Cap</span>
                    <span className="font-bold text-white text-sm">PKR {activeStock.mktCap}</span>
                  </div>
                  <div className="bg-[#18110d] p-2.5 rounded-lg border border-orange-500/10">
                    <span className="text-stone-500 text-[10px] block uppercase">Sector</span>
                    <span className="font-bold text-orange-400 text-xs">{activeStock.sector}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ================= COLUMN 3: RIGHT SCREENER ================= */}
          <div className="lg:col-span-3 bg-[#130e0b] border border-orange-500/10 rounded-xl p-3 shadow-xl flex flex-col space-y-2.5">
            <div className="border-b border-stone-800 pb-2 space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span className="text-orange-400">🔥</span> PSX Screener
                </h3>
                <span className="text-[10px] bg-[#18110d] text-orange-400 px-2 py-0.5 rounded font-mono border border-orange-500/10">
                  {filteredStocks.length}
                </span>
              </div>

              <input
                type="text"
                placeholder="Search Stocks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#18110d] border border-orange-500/15 rounded-md px-2.5 py-1.5 text-xs text-white placeholder-stone-500 outline-none focus:border-orange-500 transition"
              />

              <div className="flex flex-wrap gap-1 text-[10px] font-bold">
                {(['ALL', 'SHARIAH', 'ENERGY', 'TECH', 'BANK'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-2 py-0.5 rounded transition ${activeCategory === cat ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white' : 'bg-[#18110d] text-stone-400 hover:text-white'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1 overflow-y-auto max-h-[670px] pr-1">
              {filteredStocks.map((stk) => {
                const isSelected = stk.symbol === selectedSymbol;

                return (
                  <div
                    key={stk.symbol}
                    onClick={() => {
                      setSelectedSymbol(stk.symbol);
                      fetchData(stk.symbol);
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
                      <p className="text-[10px] text-stone-400 truncate max-w-[95px]">{stk.name}</p>
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
    </div>
  );
}
