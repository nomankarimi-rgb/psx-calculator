'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts';

// Full PSX Multi-Sector List
const PSX_UNIVERSE = [
  // Oil & Gas / Energy
  { symbol: 'OGDC', name: 'Oil & Gas Dev Co', sector: 'Oil & Gas', pe: 4.8, mktCap: '745B', shariah: true, price: 174.50, change: +3.85 },
  { symbol: 'PPL', name: 'Pak Petroleum Ltd', sector: 'Oil & Gas', pe: 5.2, mktCap: '340B', shariah: true, price: 126.20, change: +2.15 },
  { symbol: 'PSO', name: 'Pak State Oil', sector: 'Oil & Gas', pe: 6.1, mktCap: '102B', shariah: false, price: 218.30, change: -1.75 },
  { symbol: 'MARI', name: 'Mari Energies Ltd', sector: 'Oil & Gas', pe: 7.9, mktCap: '420B', shariah: true, price: 2840.00, change: +4.10 },
  { symbol: 'HUBC', name: 'Hub Power Company', sector: 'Power Gen', pe: 4.5, mktCap: '185B', shariah: true, price: 146.20, change: +4.20 },
  { symbol: 'PRL', name: 'Pak Refinery Ltd', sector: 'Refinery', pe: 3.9, mktCap: '35B', shariah: true, price: 30.15, change: +5.30 },

  // Tech & Telecom
  { symbol: 'SYS', name: 'Systems Limited', sector: 'Technology', pe: 14.5, mktCap: '128B', shariah: true, price: 452.00, change: -2.30 },
  { symbol: 'TRG', name: 'TRG Pakistan Ltd', sector: 'Technology', pe: 8.2, mktCap: '32B', shariah: false, price: 59.80, change: -3.60 },
  { symbol: 'AIRLINK', name: 'Air Link Communication', sector: 'Technology', pe: 11.0, mktCap: '44B', shariah: true, price: 114.50, change: +3.20 },
  { symbol: 'WTL', name: 'WorldCall Telecom', sector: 'Telecom', pe: 2.1, mktCap: '6B', shariah: false, price: 1.39, change: +0.00 },

  // Banking
  { symbol: 'MEBL', name: 'Meezan Bank Ltd', sector: 'Islamic Bank', pe: 5.6, mktCap: '410B', shariah: true, price: 236.00, change: +1.95 },
  { symbol: 'HBL', name: 'Habib Bank Limited', sector: 'Banking', pe: 4.2, mktCap: '190B', shariah: false, price: 132.50, change: -0.85 },
  { symbol: 'MCB', name: 'MCB Bank Limited', sector: 'Banking', pe: 5.1, mktCap: '270B', shariah: false, price: 229.40, change: +0.40 },
  { symbol: 'UBL', name: 'United Bank Limited', sector: 'Banking', pe: 4.9, mktCap: '345B', shariah: false, price: 288.00, change: +2.10 },

  // Cement & Fertilizer
  { symbol: 'LUCK', name: 'Lucky Cement Ltd', sector: 'Cement', pe: 8.4, mktCap: '290B', shariah: true, price: 935.00, change: +2.80 },
  { symbol: 'DGKC', name: 'D.G. Khan Cement', sector: 'Cement', pe: 6.8, mktCap: '37B', shariah: true, price: 85.50, change: +1.70 },
  { symbol: 'ENGRO', name: 'Engro Corporation', sector: 'Fertilizer', pe: 6.3, mktCap: '188B', shariah: true, price: 348.00, change: +1.20 },
  { symbol: 'FFC', name: 'Fauji Fertilizer Co', sector: 'Fertilizer', pe: 5.8, mktCap: '260B', shariah: true, price: 204.50, change: +0.65 },
];

const MARKET_NEWS = [
  { id: 1, title: 'PSX sets historical milestone as KSE-100 rallies past resistance with heavy corporate buying', time: '10m ago', category: 'Equities' },
  { id: 2, title: 'OGDC & PPL joint offshore survey reaches phase-2 appraisal with commercial reserves', time: '35m ago', category: 'Energy' },
  { id: 3, title: 'Meezan Bank records record quarterly asset surge driven by trade finance expansion', time: '2h ago', category: 'Banking' },
  { id: 4, title: 'SBP reserves hit multi-month peak; market liquidity bolsters dividend expectations', time: '4h ago', category: 'Economy' },
];

export default function NafaXTerminal() {
  const [selectedSymbol, setSelectedSymbol] = useState('OGDC');
  const [stockData, setStockData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Chart References & State
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
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

  // Tabs for Center Bottom
  const [centerTab, setCenterTab] = useState<'news' | 'financials'>('news');

  // Fetch real-time PSX data
  const fetchData = async (sym: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/stock?symbol=${sym}`);
      const data = await res.json();
      setStockData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedSymbol);
    const interval = setInterval(() => fetchData(selectedSymbol), 10000);
    return () => clearInterval(interval);
  }, [selectedSymbol]);

  // Amber / Warm Obsidian TradingView Chart Engine
  useEffect(() => {
    if (!chartContainerRef.current || !stockData?.candles || stockData.candles.length === 0) return;

    if (chartRef.current) {
      chartRef.current.remove();
    }

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 380,
      layout: {
        background: { color: '#120d0b' },
        textColor: '#a8a29e',
      },
      grid: {
        vertLines: { color: 'rgba(249, 115, 22, 0.05)' },
        horzLines: { color: 'rgba(249, 115, 22, 0.05)' },
      },
      crosshair: {
        vertLine: { color: '#ea580c', width: 1, style: 2 },
        horzLine: { color: '#ea580c', width: 1, style: 2 },
      },
      rightPriceScale: {
        borderColor: '#291e18',
      },
      timeScale: {
        borderColor: '#291e18',
        timeVisible: true,
      },
    });

    if (chartMode === 'candles') {
      // Matches reference image: Bright Orange Bullish & Smoky Charcoal Bearish
      const candleSeries = chart.addCandlestickSeries({
        upColor: '#f97316',
        downColor: '#261c16',
        borderUpColor: '#fb923c',
        borderDownColor: '#78716c',
        wickUpColor: '#f97316',
        wickDownColor: '#78716c',
      });
      candleSeries.setData(stockData.candles);
    } else {
      const areaSeries = chart.addAreaSeries({
        topColor: 'rgba(249, 115, 22, 0.45)',
        bottomColor: 'rgba(249, 115, 22, 0.0)',
        lineColor: '#f97316',
        lineWidth: 2.5,
      });
      const areaData = stockData.candles.map((c: any) => ({ time: c.time, value: c.close }));
      areaSeries.setData(areaData);
    }

    chart.timeScale().fitContent();
    chartRef.current = chart;

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [stockData, chartMode]);

  // Averaging Calculations
  const eQty = parseFloat(existingQty) || 0;
  const ePrice = parseFloat(existingPrice) || 0;
  const nQty = parseFloat(newQty) || 0;
  const currentLive = stockData?.currentPrice || 174.50;
  const executionPrice = orderType === 'limit' && customPrice ? parseFloat(customPrice) || 0 : currentLive;

  const rawCost = nQty * executionPrice;
  const brokerage = includeBrokerage ? rawCost * 0.0018 : 0;
  const totalRequiredCapital = rawCost + brokerage;
  const totalShares = eQty + nQty;
  const newAverage = totalShares > 0 ? (eQty * ePrice + totalRequiredCapital) / totalShares : 0;
  const delta = ePrice > 0 ? newAverage - ePrice : 0;

  // Filtered Screener List
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

  const activeStock = PSX_UNIVERSE.find((s) => s.symbol === selectedSymbol) || PSX_UNIVERSE[0];

  return (
    <div className="min-h-screen bg-[#0c0908] text-stone-200 flex font-sans selection:bg-orange-500 selection:text-white relative overflow-x-hidden">
      
      {/* Background Ambient Warm Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[350px] bg-gradient-to-br from-orange-600/10 via-amber-700/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[500px] h-[400px] bg-gradient-to-tl from-amber-600/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      {/* ================= LEFT SLIM NAVIGATION SIDEBAR (Inspired by Image 2 TradiX) ================= */}
      <aside className="w-16 md:w-20 bg-[#120d0a]/90 border-r border-orange-500/10 flex flex-col justify-between items-center py-5 z-20 backdrop-blur-xl">
        <div className="flex flex-col items-center gap-7">
          {/* Logo Brand Icon */}
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-700 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.4)] cursor-pointer">
            <span className="font-black text-white text-lg tracking-tighter">NX</span>
          </div>

          {/* Navigation Pill Icons */}
          <nav className="flex flex-col gap-4 text-stone-400">
            <button className="w-10 h-10 rounded-xl bg-orange-500/15 text-orange-400 border border-orange-500/30 flex items-center justify-center transition shadow-sm">
              ⚡
            </button>
            <button className="w-10 h-10 rounded-xl hover:bg-stone-800/50 hover:text-white flex items-center justify-center transition">
              📊
            </button>
            <button className="w-10 h-10 rounded-xl hover:bg-stone-800/50 hover:text-white flex items-center justify-center transition">
              💼
            </button>
            <button className="w-10 h-10 rounded-xl hover:bg-stone-800/50 hover:text-white flex items-center justify-center transition">
              📰
            </button>
          </nav>
        </div>

        <div className="flex flex-col items-center gap-3 text-stone-500">
          <div className="w-9 h-9 rounded-full bg-stone-900 border border-orange-500/20 flex items-center justify-center text-xs font-bold text-orange-400">
            PK
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        
        {/* TOP BAR: Brand, Market State & Indices */}
        <header className="border-b border-orange-500/10 bg-[#130e0c]/80 backdrop-blur-md px-5 py-3 flex flex-wrap justify-between items-center gap-3 text-xs sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black tracking-wide text-white">NAFAX <span className="text-orange-500 text-xs font-bold">TERMINAL</span></h1>
                <span className="text-[10px] bg-orange-500/15 text-orange-400 border border-orange-500/25 px-2 py-0.5 rounded-full font-bold">
                  PSX LIVE
                </span>
              </div>
              <p className="text-[11px] text-stone-400">Pakistan Stock Exchange • Smart Averaging Intelligence</p>
            </div>
          </div>

          {/* Market Status & Index Chips (Image 1 & 2 inspired) */}
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <div className="bg-[#1c1511] border border-orange-500/15 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-inner">
              <span className="text-stone-400">MARKET:</span>
              <span className={`font-bold ${stockData?.market?.isOpen ? 'text-emerald-400' : 'text-amber-500'}`}>
                ● {stockData?.market?.status || 'Closed (Weekend)'}
              </span>
            </div>

            <div className="bg-[#1c1511] border border-orange-500/15 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-inner">
              <span className="text-stone-400">KSE-100:</span>
              <span className="text-white font-bold">{stockData?.kse100?.current ? stockData.kse100.current.toLocaleString() : '112,450'}</span>
              <span className="text-orange-400 font-bold">▲ +845.60 (+0.76%)</span>
            </div>

            <div className="hidden sm:flex bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold px-3 py-1.5 rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.3)]">
              {selectedSymbol} PKR {currentLive.toFixed(2)}
            </div>
          </div>
        </header>

        {/* 3-COLUMN WORKSPACE */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3.5 p-3.5 overflow-hidden">
          
          {/* ================= COLUMN 1: LEFT SMART AVERAGING DESK ================= */}
          <div className="lg:col-span-3 flex flex-col justify-between bg-[#16100d]/90 border border-orange-500/15 rounded-3xl p-5 shadow-2xl backdrop-blur-xl space-y-4">
            <div>
              <div className="flex justify-between items-center border-b border-stone-800/80 pb-3">
                <div>
                  <h2 className="text-xs font-black uppercase text-white tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
                    Smart Averaging Desk
                  </h2>
                  <span className="text-[10px] text-stone-400">Position Down-Averaging Tool</span>
                </div>
                <span className="text-xs font-bold font-mono text-orange-400 bg-orange-500/10 border border-orange-500/25 px-2.5 py-1 rounded-xl">
                  {selectedSymbol}
                </span>
              </div>

              {/* Form Controls */}
              <div className="space-y-3.5 mt-4">
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
                        className="w-full bg-[#1e1713] border border-orange-500/15 rounded-xl p-2.5 text-xs font-mono font-bold text-white outline-none focus:border-orange-500 transition"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500">Avg Cost (PKR)</span>
                      <input
                        type="number"
                        placeholder="e.g. 185.0"
                        value={existingPrice}
                        onChange={(e) => setExistingPrice(e.target.value)}
                        className="w-full bg-[#1e1713] border border-orange-500/15 rounded-xl p-2.5 text-xs font-mono font-bold text-white outline-none focus:border-orange-500 transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Live vs Limit Toggle */}
                <div>
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">2. Execution Type</span>
                  <div className="grid grid-cols-2 gap-1.5 mt-1 bg-[#1a130f] p-1 rounded-xl border border-orange-500/10 text-xs font-bold">
                    <button
                      onClick={() => setOrderType('market')}
                      className={`py-2 rounded-lg transition ${orderType === 'market' ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md' : 'text-stone-400 hover:text-white'}`}
                    >
                      ⚡ Market Rate
                    </button>
                    <button
                      onClick={() => setOrderType('limit')}
                      className={`py-2 rounded-lg transition ${orderType === 'limit' ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md' : 'text-stone-400 hover:text-white'}`}
                    >
                      🎯 Target Limit
                    </button>
                  </div>
                </div>

                {orderType === 'limit' && (
                  <div className="bg-orange-500/10 border border-orange-500/30 p-2.5 rounded-xl">
                    <label className="text-[10px] text-orange-400 font-bold block uppercase">Your Bid Limit (PKR)</label>
                    <input
                      type="number"
                      placeholder="e.g. 165"
                      value={customPrice}
                      onChange={(e) => setCustomPrice(e.target.value)}
                      className="w-full bg-[#1a130f] border border-orange-500/20 rounded-lg p-2 mt-1 text-xs font-mono font-bold text-white outline-none focus:border-orange-400"
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
                    className="w-full bg-[#1e1713] border border-orange-500/15 rounded-xl p-2.5 mt-1 text-xs font-mono font-bold text-white outline-none focus:border-orange-500 transition"
                  />
                </div>

                {/* Charges Toggle */}
                <div className="flex items-center justify-between bg-[#1e1713] p-2.5 rounded-xl border border-orange-500/10">
                  <div>
                    <span className="text-[11px] text-stone-300 font-bold block">Include PSX Charges (+0.18%)</span>
                    <span className="text-[9px] text-stone-500">Brokerage, CVT, CDC & SECP</span>
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

            {/* Glowing Result Box (Warm Ember Aesthetics) */}
            <div className="bg-[#1f1712] border border-orange-500/20 rounded-2xl p-4 space-y-2 text-xs shadow-inner">
              <div className="flex justify-between py-1 border-b border-stone-800 text-stone-400">
                <span>Total Capital Needed:</span>
                <span className="font-mono font-bold text-amber-400">PKR {totalRequiredCapital.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-800 text-stone-400">
                <span>Final Share Count:</span>
                <span className="font-bold text-white">{totalShares} shares</span>
              </div>

              {/* Big Highlight Glow */}
              <div className="bg-gradient-to-br from-[#2a1c14] to-[#1a120c] border border-orange-500/40 p-4 rounded-xl text-center mt-3 shadow-[0_0_20px_rgba(249,115,22,0.15)]">
                <span className="text-[10px] font-black uppercase text-orange-400 tracking-widest block">Projected New Average</span>
                <div className="text-3xl font-black font-mono text-white mt-1">
                  PKR {newAverage.toFixed(2)}
                </div>
                {ePrice > 0 && nQty > 0 && (
                  <span className={`text-[11px] font-bold block mt-1.5 ${delta < 0 ? 'text-orange-400' : 'text-amber-300'}`}>
                    {delta < 0 ? `📉 Averaged Down by PKR ${Math.abs(delta).toFixed(2)} per share` : `📈 Averaged Up by PKR ${delta.toFixed(2)} per share`}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ================= COLUMN 2: CENTER TRADINGVIEW EMBER CHART ================= */}
          <div className="lg:col-span-6 flex flex-col space-y-3.5">
            
            {/* Chart Container */}
            <div className="bg-[#16100d]/90 border border-orange-500/15 rounded-3xl p-5 shadow-2xl backdrop-blur-xl flex flex-col">
              
              {/* Asset Header + Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800/80 pb-3 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black text-white">{selectedSymbol}</h2>
                    <span className="text-xs text-stone-400">{activeStock.name}</span>
                    {activeStock.shariah && (
                      <span className="text-[9px] bg-orange-500/15 text-orange-400 border border-orange-500/30 px-1.5 py-0.5 rounded font-bold">
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

                {/* Candles vs Area Switch (Reference style pill) */}
                <div className="flex items-center gap-1.5 bg-[#1e1713] p-1 rounded-xl border border-orange-500/15 text-xs font-bold">
                  <button
                    onClick={() => setChartMode('candles')}
                    className={`px-3 py-1.5 rounded-lg transition ${chartMode === 'candles' ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md' : 'text-stone-400 hover:text-white'}`}
                  >
                    🕯️ Candles
                  </button>
                  <button
                    onClick={() => setChartMode('area')}
                    className={`px-3 py-1.5 rounded-lg transition ${chartMode === 'area' ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md' : 'text-stone-400 hover:text-white'}`}
                  >
                    📈 Area Line
                  </button>
                </div>
              </div>

              {/* TradingView Canvas */}
              <div ref={chartContainerRef} className="w-full rounded-2xl overflow-hidden min-h-[380px]"></div>

              {/* Daily Stat Strip */}
              <div className="grid grid-cols-4 gap-2 pt-3 border-t border-stone-800/80 text-center font-mono text-[11px]">
                <div className="bg-[#1c1511] p-2 rounded-xl border border-orange-500/10">
                  <span className="text-stone-500 block text-[9px] uppercase">Open</span>
                  <span className="font-bold text-white">PKR {stockData?.open || '171.0'}</span>
                </div>
                <div className="bg-[#1c1511] p-2 rounded-xl border border-orange-500/10">
                  <span className="text-stone-500 block text-[9px] uppercase">High</span>
                  <span className="font-bold text-orange-400">PKR {stockData?.high || '175.5'}</span>
                </div>
                <div className="bg-[#1c1511] p-2 rounded-xl border border-orange-500/10">
                  <span className="text-stone-500 block text-[9px] uppercase">Low</span>
                  <span className="font-bold text-stone-300">PKR {stockData?.low || '170.2'}</span>
                </div>
                <div className="bg-[#1c1511] p-2 rounded-xl border border-orange-500/10">
                  <span className="text-stone-500 block text-[9px] uppercase">Volume</span>
                  <span className="font-bold text-white">{stockData?.volume ? stockData.volume.toLocaleString() : '12.4M'}</span>
                </div>
              </div>
            </div>

            {/* Bottom Section: Market News & Fundamentals */}
            <div className="bg-[#16100d]/90 border border-orange-500/15 rounded-3xl p-5 shadow-2xl backdrop-blur-xl flex-1 flex flex-col">
              <div className="flex gap-4 border-b border-stone-800 pb-2 mb-3 text-xs font-bold">
                <button
                  onClick={() => setCenterTab('news')}
                  className={`pb-1 transition ${centerTab === 'news' ? 'text-orange-400 border-b-2 border-orange-400' : 'text-stone-400 hover:text-white'}`}
                >
                  📰 PSX Intelligence & News
                </button>
                <button
                  onClick={() => setCenterTab('financials')}
                  className={`pb-1 transition ${centerTab === 'financials' ? 'text-orange-400 border-b-2 border-orange-400' : 'text-stone-400 hover:text-white'}`}
                >
                  📊 Valuation & Fundamentals
                </button>
              </div>

              {centerTab === 'news' ? (
                <div className="space-y-2 overflow-y-auto max-h-[145px] pr-1">
                  {MARKET_NEWS.map((n) => (
                    <div key={n.id} className="p-2.5 rounded-xl bg-[#1e1713] border border-orange-500/10 flex justify-between items-center hover:border-orange-500/30 transition">
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
                <div className="grid grid-cols-3 gap-3 font-mono text-xs">
                  <div className="bg-[#1e1713] p-3 rounded-xl border border-orange-500/10">
                    <span className="text-stone-500 text-[10px] block uppercase">P/E Ratio</span>
                    <span className="font-bold text-white text-base">{activeStock.pe}x</span>
                  </div>
                  <div className="bg-[#1e1713] p-3 rounded-xl border border-orange-500/10">
                    <span className="text-stone-500 text-[10px] block uppercase">Market Cap</span>
                    <span className="font-bold text-white text-base">PKR {activeStock.mktCap}</span>
                  </div>
                  <div className="bg-[#1e1713] p-3 rounded-xl border border-orange-500/10">
                    <span className="text-stone-500 text-[10px] block uppercase">Sector Classification</span>
                    <span className="font-bold text-orange-400 text-xs">{activeStock.sector}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ================= COLUMN 3: RIGHT PSX MARKET WATCH ================= */}
          <div className="lg:col-span-3 bg-[#16100d]/90 border border-orange-500/15 rounded-3xl p-5 shadow-2xl backdrop-blur-xl flex flex-col space-y-3.5">
            <div className="border-b border-stone-800 pb-3 space-y-2.5">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span className="text-orange-400">🔥</span> PSX Market Screener
                </h3>
                <span className="text-[10px] bg-[#1e1713] text-orange-400 px-2.5 py-0.5 rounded-full font-mono border border-orange-500/15">
                  {filteredStocks.length}
                </span>
              </div>

              {/* Search Bar */}
              <input
                type="text"
                placeholder="Search PSX Stocks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1e1713] border border-orange-500/15 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-500 outline-none focus:border-orange-500 transition"
              />

              {/* Category Pills */}
              <div className="flex flex-wrap gap-1 text-[10px] font-bold">
                {(['ALL', 'SHARIAH', 'ENERGY', 'TECH', 'BANK'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg transition ${activeCategory === cat ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-sm' : 'bg-[#1e1713] text-stone-400 hover:text-white'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Screener Items List */}
            <div className="space-y-1.5 overflow-y-auto max-h-[690px] pr-1">
              {filteredStocks.map((stk) => {
                const isSelected = stk.symbol === selectedSymbol;

                return (
                  <div
                    key={stk.symbol}
                    onClick={() => {
                      setSelectedSymbol(stk.symbol);
                      fetchData(stk.symbol);
                    }}
                    className={`p-2.5 rounded-2xl border cursor-pointer transition flex items-center justify-between group ${
                      isSelected
                        ? 'bg-gradient-to-r from-orange-500/20 to-amber-600/10 border-orange-500/50 shadow-lg'
                        : 'bg-[#1a130f] border-orange-500/5 hover:border-orange-500/25 hover:bg-[#201813]'
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
    </div>
  );
}
