'use client';

import React, { useState, useEffect, useMemo } from 'react';

const COMMUNITY_SETUPS = [
  {
    id: 1,
    analyst: 'Karachi Capital Advisory',
    symbol: 'OGDC',
    bias: 'STRONG BUY',
    target: 'PKR 196.00',
    stopLoss: 'PKR 168.00',
    timeframe: 'Swing (3-4 Weeks)',
    thesis: 'Breakout above horizontal neckline 172 backed by multi-week institutional accumulation. High dividend yield cushions downside.',
    sentiment: 88
  },
  {
    id: 2,
    analyst: 'Meezan Shariah Securities',
    symbol: 'MEBL',
    bias: 'ACCUMULATE',
    target: 'PKR 260.00',
    stopLoss: 'PKR 225.00',
    timeframe: 'Position Trade',
    thesis: 'Highest return on equity (ROE > 45%) among domestic banks. High net interest margins sustaining earnings velocity.',
    sentiment: 92
  },
  {
    id: 3,
    analyst: 'PSX Technicals Alpha',
    symbol: 'SYS',
    bias: 'TACTICAL PULLBACK',
    target: 'PKR 430.00',
    stopLoss: 'PKR 468.00',
    timeframe: 'Short Term',
    thesis: 'RSI bearish divergence near 462 resistance zone. Looking for mean reversion towards 50-day EMA before next upward leg.',
    sentiment: 42
  }
];

export default function NafaXTerminal() {
  const [selectedSymbol, setSelectedSymbol] = useState('OGDC');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Charting Workspace Options
  const [chartMode, setChartMode] = useState<'candles' | 'area'>('candles');
  const [showMA20, setShowMA20] = useState(true);
  const [showVolume, setShowVolume] = useState(true);
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1D');

  // Screener Filters
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [shariahOnly, setShariahOnly] = useState(false);

  // Core Differentiator: Smart Cost-Averaging Desk Inputs
  const [existingQty, setExistingQty] = useState('');
  const [existingPrice, setExistingPrice] = useState('');
  const [newQty, setNewQty] = useState('');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [limitBidPrice, setLimitBidPrice] = useState('');
  const [includePSXCharges, setIncludePSXCharges] = useState(true);

  // Bottom Workspace Tabs
  const [centerTab, setCenterTab] = useState<'macro' | 'setups' | 'financials'>('macro');

  const fetchTerminalData = async (sym: string) => {
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
    fetchTerminalData(selectedSymbol);
    const interval = setInterval(() => fetchTerminalData(selectedSymbol), 10000);
    return () => clearInterval(interval);
  }, [selectedSymbol]);

  const activeStock = data?.stockDetails || {
    name: 'Oil & Gas Dev Co',
    sector: 'Oil & Gas',
    price: 174.50,
    pe: 4.8,
    mktCap: '750B',
    yield: '9.2%',
    shariah: true
  };

  const currentLive = data?.currentPrice || activeStock.price;

  // Real-time Down-Averaging Calculations
  const eQty = parseFloat(existingQty) || 0;
  const ePrice = parseFloat(existingPrice) || 0;
  const nQty = parseFloat(newQty) || 0;
  const executionPrice = orderType === 'limit' && limitBidPrice ? parseFloat(limitBidPrice) || 0 : currentLive;
  const tradeValue = nQty * executionPrice;
  // PSX Standard: 0.15% broker + 13% provincial SST on commission + SECP/CDC fees = ~0.18%
  const fees = includePSXCharges ? tradeValue * 0.0018 : 0;
  const requiredCapital = tradeValue + fees;
  const totalShares = eQty + nQty;
  const projectedAvg = totalShares > 0 ? (eQty * ePrice + requiredCapital) / totalShares : 0;
  const delta = ePrice > 0 ? projectedAvg - ePrice : 0;

  // Filter 60+ Stock Directory
  const directory: any[] = data?.directory || [];
  const filteredStocks = useMemo(() => {
    return directory.filter((s) => {
      const match = s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || s.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (!match) return false;
      if (shariahOnly && !s.shariah) return false;
      if (selectedSector === 'ALL') return true;
      return s.sector.toLowerCase() === selectedSector.toLowerCase();
    });
  }, [directory, searchQuery, selectedSector, shariahOnly]);

  const sectors = useMemo(() => {
    const list = Array.from(new Set(directory.map((s: any) => s.sector)));
    return ['ALL', ...list];
  }, [directory]);

  // Chart Rendering Calculations
  const candles = data?.candles || [];
  const minPrice = candles.length > 0 ? Math.min(...candles.map((c: any) => c.low)) * 0.995 : 100;
  const maxPrice = candles.length > 0 ? Math.max(...candles.map((c: any) => c.high)) * 1.005 : 200;
  const range = maxPrice - minPrice || 1;

  // 20-Day Simple Moving Average
  const ma20Points = useMemo(() => {
    if (candles.length < 20) return [];
    return candles.map((_, idx, arr) => {
      if (idx < 19) return null;
      const slice = arr.slice(idx - 19, idx + 1);
      const avg = slice.reduce((acc, c) => acc + c.close, 0) / 20;
      return avg;
    });
  }, [candles]);

  return (
    <div className="min-h-screen bg-[#080604] text-stone-200 flex flex-col font-sans">
      
      {/* 1. TOP MACRO TICKER (TradingView Style Institutional Strip) */}
      <header className="border-b border-orange-500/10 bg-[#0e0a07] px-4 py-2 flex flex-wrap justify-between items-center gap-3 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-700 flex items-center justify-center font-extrabold text-white text-sm shadow-md shadow-orange-500/20">
              NX
            </div>
            <div>
              <span className="font-extrabold text-white tracking-tight text-sm block">
                NAFAX <span className="text-orange-500 font-bold">TERMINAL</span>
              </span>
              <span className="text-[10px] text-stone-400 block -mt-0.5">PSX Financial Intelligence & Averaging Desk</span>
            </div>
          </div>
        </div>

        {/* Real-time Pakistan Macro Stats */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-num">
          {data?.macroSummary?.indices?.map((idx: any) => (
            <div key={idx.symbol} className="bg-[#140e0a] border border-orange-500/10 px-2.5 py-1 rounded-md flex items-center gap-2 whitespace-nowrap">
              <span className="text-stone-400 font-semibold">{idx.name}:</span>
              <span className="text-white font-bold">{idx.value}</span>
              <span className="text-orange-400 font-bold">{idx.percent}</span>
            </div>
          ))}

          <div className="bg-[#140e0a] border border-orange-500/10 px-2.5 py-1 rounded-md flex items-center gap-2 whitespace-nowrap">
            <span className="text-stone-400 font-semibold">USD/PKR:</span>
            <span className="text-white font-bold">278.45</span>
            <span className="text-stone-400">-0.05%</span>
          </div>

          <div className="bg-[#140e0a] border border-orange-500/10 px-2.5 py-1 rounded-md flex items-center gap-2 whitespace-nowrap">
            <span className="text-stone-400 font-semibold">Gold 24K:</span>
            <span className="text-amber-400 font-bold">PKR 284,500</span>
          </div>

          <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold px-3 py-1 rounded-md whitespace-nowrap shadow-sm">
            {selectedSymbol} PKR {currentLive.toFixed(2)}
          </div>
        </div>
      </header>

      {/* 2. THREE-PANEL TRADING TERMINAL */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 p-3 overflow-hidden">
        
        {/* ================= LEFT PANEL: SMART AVERAGING BUY DESK ================= */}
        <div className="lg:col-span-3 flex flex-col justify-between bg-[#0f0b08] border border-orange-500/10 rounded-xl p-3.5 shadow-xl space-y-3">
          <div>
            <div className="flex justify-between items-center border-b border-stone-800 pb-2.5">
              <div>
                <h2 className="text-xs font-extrabold uppercase text-white tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                  SMART AVERAGING DESK
                </h2>
                <span className="text-[10px] text-stone-400">Position Down/Up Averaging Engine</span>
              </div>
              <span className="text-xs font-bold font-num text-orange-400 bg-orange-500/10 border border-orange-500/25 px-2 py-0.5 rounded">
                {selectedSymbol}
              </span>
            </div>

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
                      className="w-full bg-[#17100b] border border-orange-500/15 rounded-lg p-2 text-xs font-num font-bold text-white outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500">Avg Cost (PKR)</span>
                    <input
                      type="number"
                      placeholder="e.g. 185.0"
                      value={existingPrice}
                      onChange={(e) => setExistingPrice(e.target.value)}
                      className="w-full bg-[#17100b] border border-orange-500/15 rounded-lg p-2 text-xs font-num font-bold text-white outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">2. Planned Buy Order</span>
                <div className="grid grid-cols-2 gap-1.5 mt-1 bg-[#130d09] p-1 rounded-lg border border-orange-500/10 text-xs font-bold">
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
                  <label className="text-[10px] text-orange-400 font-bold block uppercase">Custom Limit Price (PKR)</label>
                  <input
                    type="number"
                    placeholder="e.g. 165"
                    value={limitBidPrice}
                    onChange={(e) => setLimitBidPrice(e.target.value)}
                    className="w-full bg-[#130d09] border border-orange-500/20 rounded-md p-1.5 mt-1 text-xs font-num font-bold text-white outline-none focus:border-orange-400"
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
                  className="w-full bg-[#17100b] border border-orange-500/15 rounded-lg p-2 text-xs font-num font-bold text-white outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex items-center justify-between bg-[#17100b] p-2 rounded-lg border border-orange-500/10">
                <div>
                  <span className="text-[11px] text-stone-300 font-bold block">Apply PSX Charges (+0.18%)</span>
                  <span className="text-[9px] text-stone-500">CVT, SECP, CDC, Commission</span>
                </div>
                <input
                  type="checkbox"
                  checked={includePSXCharges}
                  onChange={(e) => setIncludePSXCharges(e.target.checked)}
                  className="w-4 h-4 accent-orange-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Computed Averaging Output Box */}
          <div className="bg-[#140e0a] border border-orange-500/15 rounded-lg p-3 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-stone-800 text-stone-400">
              <span>Required Capital:</span>
              <span className="font-num font-bold text-amber-400">PKR {requiredCapital.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-800 text-stone-400">
              <span>Final Portfolio Shares:</span>
              <span className="font-bold text-white font-num">{totalShares} shares</span>
            </div>

            <div className="bg-gradient-to-br from-[#1f140e] to-[#120b08] border border-orange-500/30 p-3 rounded-md text-center mt-2 shadow-md">
              <span className="text-[10px] font-extrabold uppercase text-orange-400 tracking-wider block">Resulting New Average Cost</span>
              <div className="text-2xl font-extrabold font-num text-white mt-1">
                PKR {projectedAvg.toFixed(2)}
              </div>
              {ePrice > 0 && nQty > 0 && (
                <span className={`text-[11px] font-bold block mt-1 ${delta < 0 ? 'text-orange-400' : 'text-amber-300'}`}>
                  {delta < 0 ? `📉 Averaged Down by PKR ${Math.abs(delta).toFixed(2)}/sh` : `📈 Averaged Up by PKR ${delta.toFixed(2)}/sh`}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ================= CENTER PANEL: TRADINGVIEW INTERACTIVE CHART ENGINE ================= */}
        <div className="lg:col-span-6 flex flex-col space-y-3">
          
          <div className="bg-[#0f0b08] border border-orange-500/10 rounded-xl p-3.5 shadow-xl flex flex-col">
            
            {/* Asset Header Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 pb-2.5 mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-white">{selectedSymbol}</h2>
                  <span className="text-xs text-stone-400 font-medium">{activeStock.name}</span>
                  {activeStock.shariah && (
                    <span className="text-[9px] bg-orange-500/10 text-orange-400 border border-orange-500/20 px-1.5 py-0.2 rounded font-bold">
                      KMI Shariah
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-1 font-num text-xs">
                  <span className="text-2xl font-extrabold text-white">PKR {currentLive.toFixed(2)}</span>
                  <span className="text-orange-400 font-bold">
                    ▲ +{data?.change || 3.85} (+{data?.changePercent || 2.26}%)
                  </span>
                </div>
              </div>

              {/* Chart Toolbars (Indicators, Timeframes, Modes) */}
              <div className="flex items-center gap-1.5">
                {/* Indicator Toggles */}
                <button
                  onClick={() => setShowMA20(!showMA20)}
                  className={`px-2 py-1 rounded text-xs font-bold font-num transition border ${showMA20 ? 'bg-orange-500/15 text-orange-400 border-orange-500/30' : 'bg-[#140e0a] text-stone-500 border-stone-800'}`}
                >
                  MA 20
                </button>
                <button
                  onClick={() => setShowVolume(!showVolume)}
                  className={`px-2 py-1 rounded text-xs font-bold font-num transition border ${showVolume ? 'bg-orange-500/15 text-orange-400 border-orange-500/30' : 'bg-[#140e0a] text-stone-500 border-stone-800'}`}
                >
                  VOL
                </button>

                {/* Timeframes */}
                <div className="flex bg-[#140e0a] p-1 rounded-md border border-orange-500/10 text-xs font-bold">
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

                {/* Mode */}
                <div className="flex bg-[#140e0a] p-1 rounded-md border border-orange-500/10 text-xs font-bold">
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

            {/* TradingView Interactive SVG Canvas Engine */}
            <div className="relative w-full h-[320px] bg-[#070503] rounded-lg p-3 border border-orange-500/10 overflow-hidden flex flex-col justify-between">
              
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 opacity-10">
                <div className="border-b border-dashed border-orange-400 w-full"></div>
                <div className="border-b border-dashed border-orange-400 w-full"></div>
                <div className="border-b border-dashed border-orange-400 w-full"></div>
                <div className="border-b border-dashed border-orange-400 w-full"></div>
              </div>

              <div className="flex justify-between text-[11px] font-num text-stone-400 z-10">
                <span>HIGH: <strong className="text-orange-400">PKR {maxPrice.toFixed(2)}</strong></span>
                {showMA20 && <span className="text-amber-400">● MA(20): PKR {((maxPrice + minPrice) / 2).toFixed(2)}</span>}
                <span>LOW: <strong className="text-stone-300">PKR {minPrice.toFixed(2)}</strong></span>
              </div>

              {chartMode === 'candles' ? (
                <div className="w-full h-[230px] flex items-end justify-between px-2 z-10 relative">
                  {candles.slice(-32).map((c: any, idx: number) => {
                    const isUp = c.close >= c.open;
                    const bodyHeight = Math.max(4, (Math.abs(c.close - c.open) / range) * 180);
                    const wickHeight = Math.max(bodyHeight, ((c.high - c.low) / range) * 200);
                    const volHeight = Math.min(45, (c.volume / 12000000) * 45);

                    return (
                      <div key={idx} className="flex flex-col items-center justify-center relative w-full h-full cursor-crosshair group">
                        {/* Candlestick Wick */}
                        <div className={`w-[1px] ${isUp ? 'bg-orange-500' : 'bg-stone-500'}`} style={{ height: `${wickHeight}px` }}></div>
                        {/* Candlestick Body */}
                        <div
                          className={`w-[6px] md:w-[8px] rounded-[1px] ${isUp ? 'bg-gradient-to-t from-orange-600 to-amber-500 shadow-sm shadow-orange-500/30' : 'bg-[#2b1f18] border border-stone-600'} absolute`}
                          style={{ height: `${bodyHeight}px` }}
                        ></div>

                        {/* Volume Bar at bottom */}
                        {showVolume && (
                          <div
                            className={`w-[5px] absolute bottom-0 opacity-40 ${isUp ? 'bg-orange-400' : 'bg-stone-600'}`}
                            style={{ height: `${volHeight}px` }}
                          ></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="w-full h-[230px] flex items-center z-10">
                  <svg viewBox="0 0 500 180" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="amberGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f97316" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {candles.length > 1 && (
                      <>
                        <polygon
                          fill="url(#amberGlow)"
                          points={`0,180 ${candles.map((c: any, i: number) => `${(i / (candles.length - 1)) * 500},${180 - ((c.close - minPrice) / range) * 160}`).join(' ')} 500,180`}
                        />
                        <polyline
                          fill="none"
                          stroke="#f97316"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={candles.map((c: any, i: number) => `${(i / (candles.length - 1)) * 500},${180 - ((c.close - minPrice) / range) * 160}`).join(' ')}
                        />
                      </>
                    )}
                  </svg>
                </div>
              )}

              <div className="flex justify-between text-[10px] text-stone-500 font-num z-10 border-t border-stone-900 pt-1">
                <span>09:15 AM (Open)</span>
                <span>11:30 AM</span>
                <span>01:30 PM</span>
                <span>03:30 PM (Close)</span>
              </div>
            </div>

            {/* Daily Ticker Metrics */}
            <div className="grid grid-cols-4 gap-2 pt-2.5 text-center font-num text-[11px]">
              <div className="bg-[#140e0a] p-1.5 rounded-md border border-orange-500/10">
                <span className="text-stone-500 block text-[9px] uppercase">Open</span>
                <span className="font-bold text-white">PKR {data?.open || '171.0'}</span>
              </div>
              <div className="bg-[#140e0a] p-1.5 rounded-md border border-orange-500/10">
                <span className="text-stone-500 block text-[9px] uppercase">High</span>
                <span className="font-bold text-orange-400">PKR {data?.high || '176.0'}</span>
              </div>
              <div className="bg-[#140e0a] p-1.5 rounded-md border border-orange-500/10">
                <span className="text-stone-500 block text-[9px] uppercase">Low</span>
                <span className="font-bold text-stone-300">PKR {data?.low || '170.5'}</span>
              </div>
              <div className="bg-[#140e0a] p-1.5 rounded-md border border-orange-500/10">
                <span className="text-stone-500 block text-[9px] uppercase">Volume</span>
                <span className="font-bold text-white">{data?.volume ? data.volume.toLocaleString() : '16.5M'}</span>
              </div>
            </div>
          </div>

          {/* Bottom Tabs: Pakistan Macro, Setups, Fundamentals */}
          <div className="bg-[#0f0b08] border border-orange-500/10 rounded-xl p-3 shadow-xl flex-1 flex flex-col">
            <div className="flex gap-4 border-b border-stone-800 pb-2 mb-2 text-xs font-bold">
              <button
                onClick={() => setCenterTab('macro')}
                className={`pb-1 transition ${centerTab === 'macro' ? 'text-orange-400 border-b-2 border-orange-400' : 'text-stone-400 hover:text-white'}`}
              >
                📊 Pakistan Macro, Currencies & Sona
              </button>
              <button
                onClick={() => setCenterTab('setups')}
                className={`pb-1 transition ${centerTab === 'setups' ? 'text-orange-400 border-b-2 border-orange-400' : 'text-stone-400 hover:text-white'}`}
              >
                💡 Analyst Community Setups
              </button>
              <button
                onClick={() => setCenterTab('financials')}
                className={`pb-1 transition ${centerTab === 'financials' ? 'text-orange-400 border-b-2 border-orange-400' : 'text-stone-400 hover:text-white'}`}
              >
                📈 Company Valuation & Yield
              </button>
            </div>

            {/* TAB 1: Macro Summary (Inspired by TradingView screenshot) */}
            {centerTab === 'macro' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto max-h-[160px] pr-1">
                <div className="bg-[#140e0a] p-2.5 rounded-lg border border-orange-500/10">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1.5">Forex (Pakistani Rupee Spot Rates)</span>
                  <div className="space-y-1 text-xs font-num">
                    {data?.macroSummary?.currencies?.map((c: any) => (
                      <div key={c.pair} className="flex justify-between py-0.5 border-b border-stone-800/80">
                        <span className="text-stone-300">{c.pair}</span>
                        <span className="font-bold text-white">PKR {c.rate}</span>
                        <span className={c.isUp ? 'text-orange-400' : 'text-stone-400'}>{c.percent}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#140e0a] p-2.5 rounded-lg border border-orange-500/10">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1.5">Bullion & Key Commodities</span>
                  <div className="space-y-1 text-xs font-num">
                    {data?.macroSummary?.bullionCommodities?.map((m: any) => (
                      <div key={m.name} className="flex justify-between py-0.5 border-b border-stone-800/80">
                        <span className="text-stone-300">{m.name}</span>
                        <span className="font-bold text-white">{m.rate}</span>
                        <span className={m.isUp ? 'text-orange-400' : 'text-stone-400'}>{m.percent}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Analyst Setups */}
            {centerTab === 'setups' && (
              <div className="space-y-2 overflow-y-auto max-h-[160px] pr-1">
                {COMMUNITY_SETUPS.map((s) => (
                  <div key={s.id} className="p-2.5 rounded-lg bg-[#140e0a] border border-orange-500/10 flex flex-col space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{s.analyst}</span>
                        <span className="bg-orange-500/15 text-orange-400 px-1.5 py-0.2 rounded text-[10px] font-num font-bold">
                          {s.symbol} • {s.bias}
                        </span>
                      </div>
                      <span className="text-orange-400 font-num font-bold text-xs">Target: {s.target} (SL: {s.stopLoss})</span>
                    </div>
                    <p className="text-[11px] text-stone-300 leading-relaxed">{s.thesis}</p>
                    <div className="flex justify-between text-[10px] text-stone-500 pt-0.5">
                      <span>{s.timeframe}</span>
                      <span className="text-orange-400 font-num">Sentiment Score: {s.sentiment}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: Valuation */}
            {centerTab === 'financials' && (
              <div className="grid grid-cols-4 gap-2 font-num text-xs">
                <div className="bg-[#140e0a] p-2 rounded-lg border border-orange-500/10 text-center">
                  <span className="text-stone-500 text-[10px] block uppercase">P/E Ratio</span>
                  <span className="font-bold text-white text-base">{activeStock.pe}x</span>
                </div>
                <div className="bg-[#140e0a] p-2 rounded-lg border border-orange-500/10 text-center">
                  <span className="text-stone-500 text-[10px] block uppercase">Dividend Yield</span>
                  <span className="font-bold text-orange-400 text-base">{activeStock.yield}</span>
                </div>
                <div className="bg-[#140e0a] p-2 rounded-lg border border-orange-500/10 text-center">
                  <span className="text-stone-500 text-[10px] block uppercase">Market Cap</span>
                  <span className="font-bold text-white text-base">PKR {activeStock.mktCap}</span>
                </div>
                <div className="bg-[#140e0a] p-2 rounded-lg border border-orange-500/10 text-center">
                  <span className="text-stone-500 text-[10px] block uppercase">Shariah Status</span>
                  <span className="font-bold text-emerald-400 text-xs block">{activeStock.shariah ? '✓ KMI-30 Compliant' : 'Conventional'}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT PANEL: PSX UNIVERSAL SCREENER (60+ EQUITIES) ================= */}
        <div className="lg:col-span-3 bg-[#0f0b08] border border-orange-500/10 rounded-xl p-3 shadow-xl flex flex-col space-y-2.5">
          <div className="border-b border-stone-800 pb-2 space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                <span className="text-orange-400">🔥</span> PSX Equities Screener
              </h3>
              <span className="text-[10px] bg-[#140e0a] text-orange-400 px-2 py-0.5 rounded font-num border border-orange-500/10">
                {filteredStocks.length} Stocks
              </span>
            </div>

            <input
              type="text"
              placeholder="Search (e.g. MEBL, SYS, PRL, LUCK)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#140e0a] border border-orange-500/15 rounded-md px-2.5 py-1.5 text-xs text-white placeholder-stone-500 outline-none focus:border-orange-500"
            />

            <div className="flex justify-between items-center text-xs">
              <span className="text-stone-400 text-[11px]">KMI-30 Shariah Only</span>
              <input
                type="checkbox"
                checked={shariahOnly}
                onChange={(e) => setShariahOnly(e.target.checked)}
                className="accent-orange-500 cursor-pointer"
              />
            </div>

            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full bg-[#140e0a] border border-orange-500/15 text-stone-300 text-xs rounded-md p-1.5 outline-none font-medium"
            >
              {sectors.map((sec: string) => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>

          {/* Complete Stock List */}
          <div className="space-y-1 overflow-y-auto max-h-[660px] pr-1">
            {filteredStocks.map((stk) => {
              const isSelected = stk.symbol === selectedSymbol;

              return (
                <div
                  key={stk.symbol}
                  onClick={() => {
                    setSelectedSymbol(stk.symbol);
                    fetchTerminalData(stk.symbol);
                  }}
                  className={`p-2 rounded-lg border cursor-pointer transition flex items-center justify-between group ${
                    isSelected
                      ? 'bg-gradient-to-r from-orange-500/20 to-amber-600/10 border-orange-500/40 shadow-sm'
                      : 'bg-[#130d09] border-orange-500/5 hover:border-orange-500/20'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-xs text-white group-hover:text-orange-400 transition">{stk.symbol}</span>
                      {stk.shariah && (
                        <span className="text-[8px] bg-orange-500/15 text-orange-400 px-1 py-0.2 rounded font-bold">
                          KMI
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-stone-400 truncate max-w-[95px]">{stk.name}</p>
                  </div>

                  <div className="text-right font-num">
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
