'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts';

// Full PSX Multi-Sector List (KSE100, KMI30, Shariah compliant with fundamentals)
const PSX_UNIVERSE = [
  // Oil & Gas
  { symbol: 'OGDC', name: 'Oil & Gas Dev Co', sector: 'Oil & Gas', pe: 4.8, mktCap: '745B', shariah: true },
  { symbol: 'PPL', name: 'Pak Petroleum Ltd', sector: 'Oil & Gas', pe: 5.2, mktCap: '340B', shariah: true },
  { symbol: 'PSO', name: 'Pak State Oil', sector: 'Oil & Gas', pe: 6.1, mktCap: '102B', shariah: false },
  { symbol: 'MARI', name: 'Mari Energies Ltd', sector: 'Oil & Gas', pe: 7.9, mktCap: '420B', shariah: true },
  { symbol: 'SNGP', name: 'Sui Northern Gas', sector: 'Gas Utility', pe: 4.1, mktCap: '46B', shariah: false },
  { symbol: 'PRL', name: 'Pak Refinery Ltd', sector: 'Refinery', pe: 3.9, mktCap: '35B', shariah: true },

  // Tech & Telecom
  { symbol: 'SYS', name: 'Systems Limited', sector: 'Technology', pe: 14.5, mktCap: '128B', shariah: true },
  { symbol: 'TRG', name: 'TRG Pakistan Ltd', sector: 'Technology', pe: 8.2, mktCap: '32B', shariah: false },
  { symbol: 'AIRLINK', name: 'Air Link Communication', sector: 'Technology', pe: 11.0, mktCap: '44B', shariah: true },
  { symbol: 'PTC', name: 'Pak Telecom Co', sector: 'Telecom', pe: 7.5, mktCap: '72B', shariah: false },
  { symbol: 'WTL', name: 'WorldCall Telecom', sector: 'Telecom', pe: 2.1, mktCap: '6B', shariah: false },

  // Banking (Conventional & Islamic)
  { symbol: 'MEBL', name: 'Meezan Bank Ltd', sector: 'Islamic Bank', pe: 5.6, mktCap: '410B', shariah: true },
  { symbol: 'HBL', name: 'Habib Bank Limited', sector: 'Banking', pe: 4.2, mktCap: '190B', shariah: false },
  { symbol: 'MCB', name: 'MCB Bank Limited', sector: 'Banking', pe: 5.1, mktCap: '270B', shariah: false },
  { symbol: 'UBL', name: 'United Bank Limited', sector: 'Banking', pe: 4.9, mktCap: '345B', shariah: false },
  { symbol: 'BAFL', name: 'Bank Alfalah Ltd', sector: 'Banking', pe: 4.4, mktCap: '98B', shariah: false },

  // Cement
  { symbol: 'LUCK', name: 'Lucky Cement Ltd', sector: 'Cement', pe: 8.4, mktCap: '290B', shariah: true },
  { symbol: 'DGKC', name: 'D.G. Khan Cement', sector: 'Cement', pe: 6.8, mktCap: '37B', shariah: true },
  { symbol: 'MLCF', name: 'Maple Leaf Cement', sector: 'Cement', pe: 7.1, mktCap: '43B', shariah: true },
  { symbol: 'CHCC', name: 'Cherat Cement Co', sector: 'Cement', pe: 7.6, mktCap: '35B', shariah: true },

  // Fertilizer & Power
  { symbol: 'ENGRO', name: 'Engro Corporation', sector: 'Conglomerate', pe: 6.3, mktCap: '188B', shariah: true },
  { symbol: 'FFC', name: 'Fauji Fertilizer Co', sector: 'Fertilizer', pe: 5.8, mktCap: '260B', shariah: true },
  { symbol: 'EFERT', name: 'Engro Fertilizers', sector: 'Fertilizer', pe: 6.0, mktCap: '225B', shariah: true },
  { symbol: 'HUBC', name: 'Hub Power Company', sector: 'Power Gen', pe: 4.5, mktCap: '185B', shariah: true },
  { symbol: 'KEL', name: 'K-Electric Limited', sector: 'Power Gen', pe: 3.2, mktCap: '136B', shariah: false },
  
  // Autos & Pharma
  { symbol: 'INDU', name: 'Indus Motor Co', sector: 'Automobile', pe: 10.2, mktCap: '127B', shariah: true },
  { symbol: 'MTL', name: 'Millat Tractors', sector: 'Automobile', pe: 9.4, mktCap: '118B', shariah: true },
  { symbol: 'SEARL', name: 'The Searle Company', sector: 'Pharma', pe: 12.1, mktCap: '24B', shariah: true }
];

// Curated Market News Feed
const MARKET_NEWS = [
  { id: 1, title: 'PSX sets historical milestone as KSE-100 crosses key resistance with robust foreign inflows', time: '12 mins ago', tag: 'KSE-100' },
  { id: 2, title: 'OGDC and PPL announce joint discovery in Western offshore block with high commercial potential', time: '45 mins ago', tag: 'Energy' },
  { id: 3, title: 'SBP holds policy review: Financial sector yields sustain healthy dividend pay-outs', time: '2 hours ago', tag: 'Economy' },
  { id: 4, title: 'Lucky Cement expands European operations via greenfield clinker capacity acquisition', time: '4 hours ago', tag: 'Corporate' }
];

export default function ProfessionalTerminal() {
  const [selectedSymbol, setSelectedSymbol] = useState('OGDC');
  const [stockData, setStockData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Chart References
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | ISeriesApi<'Area'> | null>(null);
  const [chartMode, setChartMode] = useState<'candles' | 'area'>('candles');

  // Market Watch state
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'SHARIAH' | 'TECH' | 'BANK' | 'ENERGY'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Averaging Desk State
  const [existingQty, setExistingQty] = useState('');
  const [existingPrice, setExistingPrice] = useState('');
  const [newQty, setNewQty] = useState('');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [customPrice, setCustomPrice] = useState('');
  const [includeBrokerage, setIncludeBrokerage] = useState(true);

  // Tab State for Center Bottom: News vs Fundamentals
  const [centerTab, setCenterTab] = useState<'news' | 'financials'>('news');

  // Fetch Stock Data
  const fetchData = async (sym: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/stock?symbol=${sym}`);
      const data = await res.json();
      setStockData(data);
    } catch (err) {
      console.error("API error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedSymbol);
    const interval = setInterval(() => fetchData(selectedSymbol), 10000);
    return () => clearInterval(interval);
  }, [selectedSymbol]);

  // TradingView Lightweight Chart Initialization & Updates
  useEffect(() => {
    if (!chartContainerRef.current || !stockData?.candles || stockData.candles.length === 0) return;

    if (chartRef.current) {
      chartRef.current.remove();
    }

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 380,
      layout: {
        background: { color: '#090d16' },
        textColor: '#94a3b8',
      },
      grid: {
        vertLines: { color: 'rgba(30, 41, 59, 0.5)' },
        horzLines: { color: 'rgba(30, 41, 59, 0.5)' },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: '#1e293b',
      },
      timeScale: {
        borderColor: '#1e293b',
        timeVisible: true,
      },
    });

    if (chartMode === 'candles') {
      const candleSeries = chart.addCandlestickSeries({
        upColor: '#10b981',
        downColor: '#f43f5e',
        borderVisible: false,
        wickUpColor: '#10b981',
        wickDownColor: '#f43f5e',
      });
      candleSeries.setData(stockData.candles);
      seriesRef.current = candleSeries;
    } else {
      const areaSeries = chart.addAreaSeries({
        topColor: 'rgba(16, 185, 129, 0.4)',
        bottomColor: 'rgba(16, 185, 129, 0.0)',
        lineColor: '#10b981',
        lineWidth: 2,
      });
      const areaData = stockData.candles.map((c: any) => ({ time: c.time, value: c.close }));
      areaSeries.setData(areaData);
      seriesRef.current = areaSeries;
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
  const currentLive = stockData?.currentPrice || 0;
  const executionPrice = orderType === 'limit' && customPrice ? parseFloat(customPrice) || 0 : currentLive;

  const rawCost = nQty * executionPrice;
  const brokerage = includeBrokerage ? rawCost * 0.0018 : 0;
  const totalRequiredCapital = rawCost + brokerage;
  const totalShares = eQty + nQty;
  const newAverage = totalShares > 0 ? (eQty * ePrice + totalRequiredCapital) / totalShares : 0;
  const delta = ePrice > 0 ? newAverage - ePrice : 0;

  // Stock Filter
  const filteredStocks = useMemo(() => {
    return PSX_UNIVERSE.filter((s) => {
      const match = s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || s.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (!match) return false;
      if (filterCategory === 'SHARIAH') return s.shariah;
      if (filterCategory === 'TECH') return s.sector === 'Technology' || s.sector === 'Telecom';
      if (filterCategory === 'BANK') return s.sector.includes('Bank');
      if (filterCategory === 'ENERGY') return s.sector.includes('Oil') || s.sector.includes('Power') || s.sector.includes('Gas');
      return true;
    });
  }, [searchQuery, filterCategory]);

  const activeStockInfo = PSX_UNIVERSE.find(s => s.symbol === selectedSymbol) || PSX_UNIVERSE[0];

  return (
    <div className="min-h-screen bg-[#040711] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      
      {/* 1. TOP TICKER & MARKET STATUS BAR */}
      <header className="border-b border-slate-800/80 bg-[#070b16] px-4 py-2.5 flex flex-wrap justify-between items-center gap-3 text-xs sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-black text-white text-sm tracking-wider">INVESTIFY <span className="text-emerald-400">PRO</span></span>
          </div>

          <div className="h-4 w-px bg-slate-800"></div>

          {/* Real-time PSX Market Status */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400">PSX Market:</span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${stockData?.market?.isOpen ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
              {stockData?.market?.status || 'Checking...'}
            </span>
            <span className="text-[11px] text-slate-500 hidden sm:inline">(Trading: Mon-Thu 09:15-15:30 | Fri: Split)</span>
          </div>
        </div>

        {/* Indices Points */}
        <div className="flex items-center gap-4 font-mono text-[11px]">
          <div className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg flex items-center gap-2">
            <span className="text-slate-400">KSE-100:</span>
            <span className="text-white font-bold">{stockData?.kse100?.current?.toLocaleString()}</span>
            <span className="text-emerald-400 font-bold">▲ +{stockData?.kse100?.change || 845.6} (+{stockData?.kse100?.percent || 0.76}%)</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg hidden md:flex items-center gap-2">
            <span className="text-slate-400">Active Asset:</span>
            <span className="text-emerald-400 font-bold font-mono">{selectedSymbol} PKR {currentLive.toFixed(2)}</span>
          </div>
        </div>
      </header>

      {/* 2. MAIN 3-PANEL PROFESSIONAL TRADING VIEW */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 p-3">
        
        {/* ================= LEFT: COMMERCIAL SMART AVERAGING DESK ================= */}
        <section className="lg:col-span-3 bg-[#070b16] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-xl space-y-4">
          <div>
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-sm font-black text-white flex items-center gap-2">
                  <span>⚡</span> AVERAGING & ORDER DESK
                </h2>
                <p className="text-[11px] text-slate-400">Live Cost-Down & Yield Optimizer</p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                {selectedSymbol}
              </span>
            </div>

            {/* Inputs */}
            <div className="mt-4 space-y-3.5">
              <div>
                <span className="text-[11px] text-slate-400 font-semibold block uppercase">1. Existing Holding</span>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div>
                    <label className="text-[10px] text-slate-500">Shares Owned</label>
                    <input
                      type="number"
                      placeholder="e.g. 1000"
                      value={existingQty}
                      onChange={(e) => setExistingQty(e.target.value)}
                      className="w-full bg-[#040711] border border-slate-800 rounded-xl p-2 text-xs font-mono font-bold text-white outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500">Avg Buy Price (PKR)</label>
                    <input
                      type="number"
                      placeholder="e.g. 180.0"
                      value={existingPrice}
                      onChange={(e) => setExistingPrice(e.target.value)}
                      className="w-full bg-[#040711] border border-slate-800 rounded-xl p-2 text-xs font-mono font-bold text-white outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 font-semibold block uppercase">2. Order Mode</span>
                <div className="grid grid-cols-2 gap-2 mt-1 bg-[#040711] p-1 rounded-xl border border-slate-800 text-xs font-bold">
                  <button
                    onClick={() => setOrderType('market')}
                    className={`py-1.5 rounded-lg transition ${orderType === 'market' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
                  >
                    ⚡ Market (PKR {currentLive.toFixed(2)})
                  </button>
                  <button
                    onClick={() => setOrderType('limit')}
                    className={`py-1.5 rounded-lg transition ${orderType === 'limit' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
                  >
                    🎯 Limit Bid
                  </button>
                </div>
              </div>

              {orderType === 'limit' && (
                <div className="bg-amber-950/20 border border-amber-500/40 p-2.5 rounded-xl">
                  <label className="text-[10px] text-amber-400 font-bold block uppercase">Custom Limit Price (PKR)</label>
                  <input
                    type="number"
                    placeholder="e.g. 165"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    className="w-full bg-[#040711] border border-slate-800 rounded-lg p-2 mt-1 text-xs font-mono font-bold text-white outline-none focus:border-amber-400"
                  />
                </div>
              )}

              <div>
                <label className="text-[11px] text-slate-400 font-semibold block uppercase">3. Quantity to Purchase</label>
                <input
                  type="number"
                  placeholder="e.g. 500"
                  value={newQty}
                  onChange={(e) => setNewQty(e.target.value)}
                  className="w-full bg-[#040711] border border-slate-800 rounded-xl p-2.5 mt-1 text-xs font-mono font-bold text-white outline-none focus:border-emerald-500"
                />
              </div>

              {/* Commission Toggle */}
              <div className="flex items-center justify-between bg-[#040711] p-2.5 rounded-xl border border-slate-800/80">
                <div>
                  <span className="text-[11px] text-slate-300 font-bold block">Apply PSX Charges (+0.18%)</span>
                  <span className="text-[9px] text-slate-500">CDC, CVT, SECP & Brokerage fee</span>
                </div>
                <input
                  type="checkbox"
                  checked={includeBrokerage}
                  onChange={(e) => setIncludeBrokerage(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Computed Output Card */}
          <div className="bg-[#090d16] border border-slate-800/90 rounded-2xl p-4 space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/60 text-slate-400">
              <span>Required Capital:</span>
              <span className="font-mono font-bold text-amber-400">PKR {totalRequiredCapital.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60 text-slate-400">
              <span>Shares After Order:</span>
              <span className="font-bold text-white">{totalShares} shares</span>
            </div>

            <div className="bg-[#040711] border border-emerald-500/40 p-3.5 rounded-xl text-center mt-2">
              <span className="text-[10px] uppercase font-black text-emerald-400 tracking-wider">Resulting Average Cost</span>
              <div className="text-2xl font-black font-mono text-white mt-1">
                PKR {newAverage.toFixed(2)}
              </div>
              {ePrice > 0 && nQty > 0 && (
                <span className={`text-[11px] font-bold block mt-1.5 ${delta < 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {delta < 0 ? `📉 Averaged Down by PKR ${Math.abs(delta).toFixed(2)}/sh` : `📈 Averaged Up by PKR ${delta.toFixed(2)}/sh`}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* ================= CENTER: TRADINGVIEW CHART ENGINE & FINANCIALS ================= */}
        <section className="lg:col-span-6 flex flex-col space-y-3">
          
          {/* Main Chart Card */}
          <div className="bg-[#070b16] border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col">
            
            {/* Header: Stock Stats & Toolbars */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3 mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-white">{selectedSymbol}</h2>
                  <span className="text-[11px] text-slate-400">{activeStockInfo.name}</span>
                  {activeStockInfo.shariah && (
                    <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800/50 px-1.5 py-0.2 rounded font-bold">KMI Shariah</span>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-1 font-mono text-xs">
                  <span className="text-2xl font-extrabold text-white">PKR {currentLive.toFixed(2)}</span>
                  <span className={`font-bold ${stockData?.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {stockData?.change >= 0 ? `▲ +${stockData.change}` : `▼ ${stockData?.change || 0}`} ({stockData?.changePercent || 0}%)
                  </span>
                </div>
              </div>

              {/* Chart Modes Switch */}
              <div className="flex items-center gap-2">
                <div className="flex bg-[#040711] p-1 rounded-xl border border-slate-800 text-xs font-bold">
                  <button
                    onClick={() => setChartMode('candles')}
                    className={`px-3 py-1 rounded-lg transition ${chartMode === 'candles' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'}`}
                  >
                    🕯️ Candles
                  </button>
                  <button
                    onClick={() => setChartMode('area')}
                    className={`px-3 py-1 rounded-lg transition ${chartMode === 'area' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'}`}
                  >
                    📈 Area
                  </button>
                </div>
              </div>
            </div>

            {/* TradingView Chart Container */}
            <div ref={chartContainerRef} className="w-full rounded-xl overflow-hidden min-h-[380px]"></div>

            {/* Intraday Technical Bar */}
            <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-800/80 text-center font-mono text-[11px]">
              <div className="bg-[#040711] p-2 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[9px] uppercase">Open</span>
                <span className="font-bold text-white">PKR {stockData?.open || '--'}</span>
              </div>
              <div className="bg-[#040711] p-2 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[9px] uppercase">High</span>
                <span className="font-bold text-emerald-400">PKR {stockData?.high || '--'}</span>
              </div>
              <div className="bg-[#040711] p-2 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[9px] uppercase">Low</span>
                <span className="font-bold text-rose-400">PKR {stockData?.low || '--'}</span>
              </div>
              <div className="bg-[#040711] p-2 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[9px] uppercase">Volume</span>
                <span className="font-bold text-white">{stockData?.volume ? stockData.volume.toLocaleString() : '--'}</span>
              </div>
            </div>
          </div>

          {/* Bottom Tabs: Live Market News & Fundamentals */}
          <div className="bg-[#070b16] border border-slate-800 rounded-2xl p-4 shadow-xl flex-1 flex flex-col">
            <div className="flex gap-4 border-b border-slate-800 pb-2 mb-3 text-xs font-bold">
              <button
                onClick={() => setCenterTab('news')}
                className={`pb-1 transition ${centerTab === 'news' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-slate-400'}`}
              >
                📰 PSX Market & Company News
              </button>
              <button
                onClick={() => setCenterTab('financials')}
                className={`pb-1 transition ${centerTab === 'financials' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-slate-400'}`}
              >
                📊 Financials & Fundamentals
              </button>
            </div>

            {centerTab === 'news' ? (
              <div className="space-y-2.5 overflow-y-auto max-h-[160px] pr-1">
                {MARKET_NEWS.map(n => (
                  <div key={n.id} className="p-2.5 rounded-xl bg-[#040711] border border-slate-800/80 flex justify-between items-center hover:border-slate-700 transition">
                    <div>
                      <p className="text-xs text-slate-200 font-semibold">{n.title}</p>
                      <span className="text-[10px] text-slate-500">{n.time}</span>
                    </div>
                    <span className="text-[10px] bg-slate-800 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">
                      {n.tag}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3 font-mono text-xs">
                <div className="bg-[#040711] p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">P/E Ratio</span>
                  <span className="font-bold text-white text-base">{activeStockInfo.pe}x</span>
                </div>
                <div className="bg-[#040711] p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Market Cap</span>
                  <span className="font-bold text-white text-base">PKR {activeStockInfo.mktCap}</span>
                </div>
                <div className="bg-[#040711] p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Sector</span>
                  <span className="font-bold text-emerald-400 text-xs">{activeStockInfo.sector}</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ================= RIGHT: COMPLETE PSX MARKET WATCH ================= */}
        <section className="lg:col-span-3 bg-[#070b16] border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col space-y-3">
          <div className="border-b border-slate-800 pb-3 space-y-2.5">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <span>📈</span> PSX Equities Screener
              </h3>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
                {filteredStocks.length}
              </span>
            </div>

            {/* Live Search */}
            <input
              type="text"
              placeholder="Search Symbol (e.g. MEBL, SYS, PRL)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#040711] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500"
            />

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1 text-[10px] font-bold">
              {(['ALL', 'SHARIAH', 'TECH', 'BANK', 'ENERGY'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-2 py-1 rounded-md transition ${filterCategory === cat ? 'bg-emerald-600 text-white' : 'bg-[#040711] text-slate-400 hover:text-white'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Stocks Scrollable List */}
          <div className="space-y-1.5 overflow-y-auto max-h-[700px] pr-1">
            {filteredStocks.map((stk) => {
              const isSelected = stk.symbol === selectedSymbol;

              return (
                <div
                  key={stk.symbol}
                  onClick={() => {
                    setSelectedSymbol(stk.symbol);
                    fetchData(stk.symbol);
                  }}
                  className={`p-2.5 rounded-xl border cursor-pointer transition flex items-center justify-between group ${
                    isSelected ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg' : 'bg-[#040711] border-slate-800/80 hover:bg-slate-800/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-xs text-white group-hover:text-emerald-400 transition">{stk.symbol}</span>
                      {stk.shariah && <span className="text-[8px] bg-emerald-950 text-emerald-400 px-1 rounded font-black">KMI</span>}
                    </div>
                    <p className="text-[10px] text-slate-400 truncate max-w-[110px]">{stk.name}</p>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-xs font-bold text-white block">P/E: {stk.pe}x</span>
                    <span className="text-[10px] text-slate-400">{stk.sector}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}
