'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';

// Comprehensive PSX 50+ Stock Directory
const PSX_UNIVERSE = [
  // Oil & Gas
  { symbol: 'OGDC', name: 'Oil & Gas Dev Co', sector: 'Oil & Gas', price: 174.50, change: +3.85, base: 170.0, pe: 4.8, mktCap: '750B', yield: '9.2%', shariah: true },
  { symbol: 'PPL', name: 'Pakistan Petroleum Ltd', sector: 'Oil & Gas', price: 126.20, change: +2.15, base: 123.0, pe: 5.2, mktCap: '343B', yield: '8.4%', shariah: true },
  { symbol: 'MARI', name: 'Mari Energies Ltd', sector: 'Oil & Gas', price: 2840.00, change: +4.10, base: 2780.0, pe: 7.9, mktCap: '422B', yield: '6.1%', shariah: true },
  { symbol: 'POL', name: 'Pakistan Oilfields Ltd', sector: 'Oil & Gas', price: 485.00, change: +1.40, base: 478.0, pe: 6.2, mktCap: '138B', yield: '14.5%', shariah: true },
  { symbol: 'PSO', name: 'Pakistan State Oil', sector: 'Oil Marketing', price: 218.30, change: -1.75, base: 221.0, pe: 6.1, mktCap: '102B', yield: '4.8%', shariah: false },
  { symbol: 'PRL', name: 'Pakistan Refinery Ltd', sector: 'Refinery', price: 30.15, change: +5.30, base: 28.5, pe: 3.9, mktCap: '36B', yield: '0.0%', shariah: true },
  { symbol: 'ATRL', name: 'Attock Refinery Ltd', sector: 'Refinery', price: 395.00, change: +2.60, base: 385.0, pe: 4.1, mktCap: '42B', yield: '7.8%', shariah: true },
  
  // Banking
  { symbol: 'MEBL', name: 'Meezan Bank Ltd', sector: 'Banking', price: 236.00, change: +1.95, base: 231.0, pe: 5.6, mktCap: '412B', yield: '11.8%', shariah: true },
  { symbol: 'HBL', name: 'Habib Bank Ltd', sector: 'Banking', price: 132.50, change: -0.85, base: 133.5, pe: 4.2, mktCap: '194B', yield: '10.5%', shariah: false },
  { symbol: 'MCB', name: 'MCB Bank Ltd', sector: 'Banking', price: 229.40, change: +0.40, base: 228.0, pe: 5.1, mktCap: '271B', yield: '13.2%', shariah: false },
  { symbol: 'UBL', name: 'United Bank Ltd', sector: 'Banking', price: 288.00, change: +2.10, base: 282.0, pe: 4.9, mktCap: '352B', yield: '15.6%', shariah: false },
  { symbol: 'BAFL', name: 'Bank Alfalah Ltd', sector: 'Banking', price: 68.50, change: +1.20, base: 67.5, pe: 4.4, mktCap: '108B', yield: '12.0%', shariah: false },
  { symbol: 'BIPL', name: 'BankIslami Pakistan', sector: 'Banking', price: 24.80, change: +3.10, base: 24.0, pe: 4.1, mktCap: '27B', yield: '9.0%', shariah: true },

  // Cement
  { symbol: 'LUCK', name: 'Lucky Cement Ltd', sector: 'Cement', price: 935.00, change: +2.80, base: 910.0, pe: 8.4, mktCap: '292B', yield: '3.5%', shariah: true },
  { symbol: 'DGKC', name: 'D.G. Khan Cement', sector: 'Cement', price: 85.50, change: +1.70, base: 84.0, pe: 6.8, mktCap: '37B', yield: '0.0%', shariah: true },
  { symbol: 'MLCF', name: 'Maple Leaf Cement', sector: 'Cement', price: 42.60, change: -1.20, base: 43.1, pe: 7.1, mktCap: '45B', yield: '4.8%', shariah: true },
  { symbol: 'CHCC', name: 'Cherat Cement Co', sector: 'Cement', price: 182.00, change: +3.40, base: 176.0, pe: 7.6, mktCap: '35B', yield: '5.2%', shariah: true },

  // Technology & Telecom
  { symbol: 'SYS', name: 'Systems Limited', sector: 'Technology', price: 452.00, change: -2.30, base: 462.0, pe: 14.5, mktCap: '128B', yield: '1.8%', shariah: true },
  { symbol: 'TRG', name: 'TRG Pakistan Ltd', sector: 'Technology', price: 59.80, change: -3.60, base: 62.0, pe: 8.2, mktCap: '32B', yield: '0.0%', shariah: false },
  { symbol: 'AIRLINK', name: 'Air Link Communication', sector: 'Technology', price: 114.50, change: +3.20, base: 111.0, pe: 11.0, mktCap: '45B', yield: '3.5%', shariah: true },
  { symbol: 'PTC', name: 'Pak Telecom Co', sector: 'Telecom', price: 15.20, change: -0.80, base: 15.3, pe: 7.5, mktCap: '74B', yield: '0.0%', shariah: false },

  // Fertilizer & Power
  { symbol: 'ENGRO', name: 'Engro Corporation', sector: 'Fertilizer', price: 348.00, change: +1.20, base: 343.0, pe: 6.3, mktCap: '188B', yield: '12.5%', shariah: true },
  { symbol: 'FFC', name: 'Fauji Fertilizer Co', sector: 'Fertilizer', price: 204.50, change: +0.65, base: 203.0, pe: 5.8, mktCap: '260B', yield: '14.2%', shariah: true },
  { symbol: 'HUBC', name: 'Hub Power Company', sector: 'Power', price: 146.20, change: +4.20, base: 140.0, pe: 4.5, mktCap: '189B', yield: '17.5%', shariah: true },
  { symbol: 'KEL', name: 'K-Electric Ltd', sector: 'Power', price: 4.95, change: +2.10, base: 4.85, pe: 3.2, mktCap: '136B', yield: '0.0%', shariah: false },

  // Automobile
  { symbol: 'INDU', name: 'Indus Motor Co Ltd', sector: 'Automobile', price: 1640.00, change: +4.50, base: 1570.0, pe: 10.2, mktCap: '129B', yield: '5.2%', shariah: true },
  { symbol: 'MTL', name: 'Millat Tractors Ltd', sector: 'Automobile', price: 618.00, change: -1.40, base: 626.0, pe: 9.4, mktCap: '118B', yield: '8.5%', shariah: true },
];

// Rich News Feed with Images
const BREAKING_NEWS = [
  {
    id: 1,
    title: 'KSE-100 scales historical milestone as institutional inflows cross $45M in energy & banking',
    source: 'Business Recorder',
    time: '8 mins ago',
    tag: 'MARKET RECORD',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 2,
    title: 'OGDC and PPL announce commercial gas flow discovery in offshore Sujawal exploratory block',
    source: 'Dawn News Business',
    time: '24 mins ago',
    tag: 'ENERGY SECTOR',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 3,
    title: 'State Bank of Pakistan holds foreign exchange reserves above $11.2 Billion after bilateral rollover',
    source: 'The News International',
    time: '1 hour ago',
    tag: 'MACRO ECONOMY',
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 4,
    title: 'Meezan Bank and Lucky Cement post double-digit profitability growth in quarterly financial filings',
    source: 'Profit by Pakistan Today',
    time: '3 hours ago',
    tag: 'CORPORATE EARNINGS',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60'
  }
];

// Community Trade Setups with Visual Charts & Avatars
const COMMUNITY_TRADE_SETUPS = [
  {
    id: 1,
    author: 'Hamza Khan, CMT',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    symbol: 'OGDC',
    direction: 'LONG SETUP',
    target: 'PKR 198.00',
    stop: 'PKR 168.00',
    chartThumb: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=500&auto=format&fit=crop&q=60',
    thesis: 'Confirmed inverse head-and-shoulders breakout above 172 neckline with 3x average daily volume expansion.',
    bullishPercent: 91,
    likes: 184
  },
  {
    id: 2,
    author: 'Zubair Shariah Securities',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    symbol: 'MEBL',
    direction: 'ACCUMULATE',
    target: 'PKR 265.00',
    stop: 'PKR 226.00',
    chartThumb: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&auto=format&fit=crop&q=60',
    thesis: 'Highest Islamic banking spreads in South Asia. Dividend payout sustainability above 50% guarantees capital defense.',
    bullishPercent: 88,
    likes: 142
  },
  {
    id: 3,
    author: 'Rehan Technical Insights',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    symbol: 'SYS',
    direction: 'RANGE PULLBACK',
    target: 'PKR 430.00',
    stop: 'PKR 466.00',
    chartThumb: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=500&auto=format&fit=crop&q=60',
    thesis: 'RSI negative divergence at 460 channel resistance. Looking to re-enter near 50 EMA at 430 PKR.',
    bullishPercent: 44,
    likes: 95
  }
];

export default function NafaXTerminal() {
  const [selectedSymbol, setSelectedSymbol] = useState('OGDC');
  const [activeStock, setActiveStock] = useState(PSX_UNIVERSE[0]);
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1D');
  const [chartMode, setChartMode] = useState<'candles' | 'area'>('candles');

  // Screener Filters
  const [sectorFilter, setSectorFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyShariah, setOnlyShariah] = useState(false);

  // Compact Averaging Calculator Inputs
  const [holdingQty, setHoldingQty] = useState('1000');
  const [holdingPrice, setHoldingPrice] = useState('182.50');
  const [orderShares, setOrderShares] = useState('500');
  const [orderMode, setOrderMode] = useState<'market' | 'limit'>('market');
  const [customBid, setCustomBid] = useState('168.00');
  const [includeFees, setIncludeFees] = useState(true);

  // Dynamic Chart Tooltip Hover State
  const [hoveredCandle, setHoveredCandle] = useState<any>(null);

  // Generate Realistic Candles for dynamic interactive charting
  const candleHistory = useMemo(() => {
    const list = [];
    let price = activeStock.base;
    const now = new Date();
    for (let i = 42; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toLocaleDateString('en-PK', { month: 'short', day: 'numeric' });
      const change = (Math.sin(i * 0.4) + (Math.random() - 0.46)) * (activeStock.base * 0.022);
      const open = parseFloat(price.toFixed(2));
      const close = parseFloat((price + change).toFixed(2));
      const high = parseFloat((Math.max(open, close) + Math.random() * (activeStock.base * 0.014)).toFixed(2));
      const low = parseFloat((Math.min(open, close) - Math.random() * (activeStock.base * 0.014)).toFixed(2));
      const volume = Math.floor(Math.random() * 8500000) + 1200000;
      list.push({ date: dateStr, open, high, low, close, volume });
      price = close;
    }
    list[list.length - 1].close = activeStock.price;
    return list;
  }, [activeStock]);

  // Current Displayed Candle on Tooltip
  const activeCandle = hoveredCandle || candleHistory[candleHistory.length - 1];

  // Smart Averaging Calculations
  const eQty = parseFloat(holdingQty) || 0;
  const ePrice = parseFloat(holdingPrice) || 0;
  const nQty = parseFloat(orderShares) || 0;
  const execPrice = orderMode === 'limit' && customBid ? parseFloat(customBid) || 0 : activeStock.price;
  const tradeValue = nQty * execPrice;
  const charges = includeFees ? tradeValue * 0.0018 : 0; // PSX standard 0.18%
  const capitalRequired = tradeValue + charges;
  const finalShares = eQty + nQty;
  const newAverage = finalShares > 0 ? (eQty * ePrice + capitalRequired) / finalShares : 0;
  const averageDelta = ePrice > 0 ? newAverage - ePrice : 0;

  // Filter 50+ Stock Universe
  const filteredStocks = useMemo(() => {
    return PSX_UNIVERSE.filter((s) => {
      const matchSearch = s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || s.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchSearch) return false;
      if (onlyShariah && !s.shariah) return false;
      if (sectorFilter === 'ALL') return true;
      return s.sector.toLowerCase() === sectorFilter.toLowerCase();
    });
  }, [searchQuery, sectorFilter, onlyShariah]);

  const sectors = useMemo(() => {
    const list = Array.from(new Set(PSX_UNIVERSE.map((s) => s.sector)));
    return ['ALL', ...list];
  }, []);

  // Top Movers
  const topGainers = useMemo(() => [...PSX_UNIVERSE].sort((a, b) => b.change - a.change).slice(0, 3), []);
  const topLosers = useMemo(() => [...PSX_UNIVERSE].sort((a, b) => a.change - b.change).slice(0, 3), []);

  const minLow = Math.min(...candleHistory.map((c) => c.low));
  const maxHigh = Math.max(...candleHistory.map((c) => c.high));
  const priceRange = maxHigh - minLow || 1;

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans">
      
      {/* 1. TOP MARQUEE GLOBAL TICKER TAPE (TradingView Institutional Style) */}
      <div className="bg-[#0b101c] border-b border-slate-800/80 px-4 py-1.5 flex items-center justify-between text-xs overflow-x-auto gap-4 z-40 sticky top-0">
        <div className="flex items-center gap-2 pr-4 border-r border-slate-800 shrink-0">
          <div className="w-6 h-6 rounded-md bg-lime-400 flex items-center justify-center font-black text-black text-xs shadow-md shadow-lime-400/20">
            NX
          </div>
          <span className="font-extrabold tracking-wider text-white text-xs">NAFAX <span className="text-lime-400">PRO</span></span>
          <span className="text-[10px] bg-lime-400/10 text-lime-400 border border-lime-400/25 px-1.5 py-0.2 rounded font-bold">PSX</span>
        </div>

        {/* Global Macro Strip */}
        <div className="flex items-center gap-4 text-[11px] font-num shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">KSE-100:</span>
            <span className="text-white font-bold">112,450.25</span>
            <span className="text-lime-400 font-bold">▲ +0.76%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">KMI-30 (Islamic):</span>
            <span className="text-white font-bold">38,120.40</span>
            <span className="text-lime-400 font-bold">▲ +1.09%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">USD/PKR:</span>
            <span className="text-white font-bold">278.45</span>
            <span className="text-rose-400 font-bold">▼ -0.05%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Gold (24K Tola):</span>
            <span className="text-amber-300 font-bold">PKR 284,500</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">SBP Policy Rate:</span>
            <span className="text-white font-bold">15.00%</span>
          </div>
        </div>

        <div className="bg-lime-400 text-black font-extrabold text-[11px] px-3 py-1 rounded-md shrink-0 font-num">
          {activeStock.symbol} PKR {activeStock.price.toFixed(2)}
        </div>
      </div>

      {/* 2. MAIN TRADING TERMINAL WORKSPACE */}
      <main className="flex-1 p-3 md:p-4 space-y-4 max-w-[1720px] mx-auto w-full">
        
        {/* ROW 1: TRADINGVIEW INTERACTIVE CHART + COMPACT AVERAGING DESK + SCREENER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
          
          {/* ================= CENTER MAIN TRADINGVIEW DYNAMIC CHART (7 Cols) ================= */}
          <div className="lg:col-span-7 bg-[#0d1321] border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col justify-between">
            
            {/* Header: Asset Bar, Timeframe & Modes */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#141d30] border border-slate-700/80 flex items-center justify-center font-black text-lime-400 text-sm font-num">
                  {activeStock.symbol}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg font-black text-white">{activeStock.symbol}</h1>
                    <span className="text-xs text-slate-400 font-medium">{activeStock.name}</span>
                    {activeStock.shariah && (
                      <span className="text-[9px] bg-lime-400/10 text-lime-400 border border-lime-400/30 px-1.5 py-0.2 rounded font-bold">
                        KMI Shariah
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-num mt-0.5">
                    <span className="text-xl font-black text-white">PKR {activeStock.price.toFixed(2)}</span>
                    <span className={`font-bold ${activeStock.change >= 0 ? 'text-lime-400' : 'text-rose-400'}`}>
                      {activeStock.change >= 0 ? `▲ +${activeStock.change}%` : `▼ ${activeStock.change}%`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeframes & Candlestick Modes (Screenshot Pill Aesthetic) */}
              <div className="flex items-center gap-2">
                <div className="flex bg-[#12192a] p-1 rounded-lg border border-slate-800 text-xs font-bold font-num">
                  {(['1D', '1W', '1M', '1Y'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTimeframe(t)}
                      className={`px-2.5 py-1 rounded-md transition ${timeframe === t ? 'bg-lime-400 text-black font-extrabold shadow-sm' : 'text-slate-400 hover:text-white'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="flex bg-[#12192a] p-1 rounded-lg border border-slate-800 text-xs font-bold font-num">
                  <button
                    onClick={() => setChartMode('candles')}
                    className={`px-2.5 py-1 rounded-md transition ${chartMode === 'candles' ? 'bg-lime-400 text-black font-extrabold' : 'text-slate-400 hover:text-white'}`}
                  >
                    🕯️ Candles
                  </button>
                  <button
                    onClick={() => setChartMode('area')}
                    className={`px-2.5 py-1 rounded-md transition ${chartMode === 'area' ? 'bg-lime-400 text-black font-extrabold' : 'text-slate-400 hover:text-white'}`}
                  >
                    📈 Line
                  </button>
                </div>
              </div>
            </div>

            {/* Dynamic Interactive SVG Canvas Chart with Mouse Crosshair & Live Hover Tooltip */}
            <div className="relative w-full h-[360px] bg-[#090d17] rounded-lg p-3 border border-slate-800/90 overflow-hidden flex flex-col justify-between">
              
              {/* Dynamic Crosshair Floating Live Tooltip */}
              <div className="flex flex-wrap items-center justify-between text-xs font-num z-20 bg-[#0f1627]/90 backdrop-blur-md p-2 rounded-lg border border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">DATE: <strong className="text-white">{activeCandle.date}</strong></span>
                  <span className="text-slate-400">O: <strong className="text-white">{activeCandle.open}</strong></span>
                  <span className="text-slate-400">H: <strong className="text-lime-400">{activeCandle.high}</strong></span>
                  <span className="text-slate-400">L: <strong className="text-rose-400">{activeCandle.low}</strong></span>
                  <span className="text-slate-400">C: <strong className={activeCandle.close >= activeCandle.open ? 'text-lime-400' : 'text-rose-400'}>{activeCandle.close}</strong></span>
                </div>
                <div className="text-slate-400">
                  VOL: <strong className="text-white">{(activeCandle.volume / 1000000).toFixed(2)}M</strong>
                </div>
              </div>

              {/* Grid Background */}
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 opacity-10">
                <div className="border-b border-dashed border-slate-400 w-full"></div>
                <div className="border-b border-dashed border-slate-400 w-full"></div>
                <div className="border-b border-dashed border-slate-400 w-full"></div>
                <div className="border-b border-dashed border-slate-400 w-full"></div>
              </div>

              {/* Chart Render: Interactive Candles vs Area */}
              {chartMode === 'candles' ? (
                <div className="w-full h-[250px] flex items-end justify-between px-2 z-10 relative">
                  {candleHistory.map((c, idx) => {
                    const isBullish = c.close >= c.open;
                    const bodyHeight = Math.max(5, (Math.abs(c.close - c.open) / priceRange) * 200);
                    const wickHeight = Math.max(bodyHeight, ((c.high - c.low) / priceRange) * 220);
                    const volHeight = Math.min(45, (c.volume / 10000000) * 45);

                    return (
                      <div
                        key={idx}
                        onMouseEnter={() => setHoveredCandle(c)}
                        className="flex flex-col items-center justify-center relative w-full h-full cursor-crosshair group py-2"
                      >
                        {/* Candlestick Wick */}
                        <div className={`w-[1px] ${isBullish ? 'bg-lime-400' : 'bg-rose-500'}`} style={{ height: `${wickHeight}px` }}></div>
                        
                        {/* Candlestick Body */}
                        <div
                          className={`w-[6px] md:w-[8px] rounded-[1px] ${isBullish ? 'bg-lime-400 shadow-sm shadow-lime-400/40' : 'bg-rose-500 shadow-sm shadow-rose-500/40'} absolute transition-transform group-hover:scale-125`}
                          style={{ height: `${bodyHeight}px` }}
                        ></div>

                        {/* Bottom Volume Indicator */}
                        <div
                          className={`w-[4px] absolute bottom-0 opacity-40 ${isBullish ? 'bg-lime-400' : 'bg-rose-500'}`}
                          style={{ height: `${volHeight}px` }}
                        ></div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="w-full h-[250px] flex items-center z-10">
                  <svg viewBox="0 0 500 180" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="limeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a3e635" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#a3e635" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <polygon
                      fill="url(#limeGradient)"
                      points={`0,180 ${candleHistory.map((c, i) => `${(i / (candleHistory.length - 1)) * 500},${180 - ((c.close - minLow) / priceRange) * 160}`).join(' ')} 500,180`}
                    />
                    <polyline
                      fill="none"
                      stroke="#a3e635"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={candleHistory.map((c, i) => `${(i / (candleHistory.length - 1)) * 500},${180 - ((c.close - minLow) / priceRange) * 160}`).join(' ')}
                    />
                  </svg>
                </div>
              )}

              {/* Time Scale Axis */}
              <div className="flex justify-between text-[10px] text-slate-500 font-num z-10 border-t border-slate-900 pt-1">
                <span>09:15 AM (Open)</span>
                <span>11:30 AM</span>
                <span>01:30 PM</span>
                <span>03:30 PM (Close)</span>
              </div>
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-4 gap-2 pt-2.5 text-center font-num text-xs">
              <div className="bg-[#12192a] p-2 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-[10px] block uppercase">P/E RATIO</span>
                <span className="font-bold text-white">{activeStock.pe}x</span>
              </div>
              <div className="bg-[#12192a] p-2 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-[10px] block uppercase">MARKET CAP</span>
                <span className="font-bold text-white">PKR {activeStock.mktCap}</span>
              </div>
              <div className="bg-[#12192a] p-2 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-[10px] block uppercase">DIVIDEND YIELD</span>
                <span className="font-bold text-lime-400">{activeStock.yield}</span>
              </div>
              <div className="bg-[#12192a] p-2 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-[10px] block uppercase">SECTOR</span>
                <span className="font-bold text-slate-300 truncate block">{activeStock.sector}</span>
              </div>
            </div>
          </div>

          {/* ================= COMPACT SMART COST-AVERAGING DESK (3 Cols) ================= */}
          <div className="lg:col-span-3 bg-[#0d1321] border border-slate-800 rounded-xl p-3.5 shadow-xl flex flex-col justify-between space-y-3">
            <div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
                <div>
                  <h2 className="text-xs font-black uppercase text-white tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse"></span>
                    SMART COST AVERAGING
                  </h2>
                  <span className="text-[10px] text-slate-400">Position Down/Up Averaging</span>
                </div>
                <span className="text-xs font-bold font-num bg-lime-400/10 text-lime-400 border border-lime-400/30 px-2 py-0.5 rounded">
                  {activeStock.symbol}
                </span>
              </div>

              {/* Compact Form */}
              <div className="space-y-2.5 mt-2.5">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">1. Owned Holding</span>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div>
                      <span className="text-[10px] text-slate-500">Shares</span>
                      <input
                        type="number"
                        value={holdingQty}
                        onChange={(e) => setHoldingQty(e.target.value)}
                        className="w-full bg-[#12192a] border border-slate-700/80 rounded-md p-1.5 text-xs font-num font-bold text-white outline-none focus:border-lime-400"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500">Avg Cost</span>
                      <input
                        type="number"
                        value={holdingPrice}
                        onChange={(e) => setHoldingPrice(e.target.value)}
                        className="w-full bg-[#12192a] border border-slate-700/80 rounded-md p-1.5 text-xs font-num font-bold text-white outline-none focus:border-lime-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Execution Type */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">2. Planned Order</span>
                  <div className="grid grid-cols-2 gap-1.5 mt-1 bg-[#12192a] p-1 rounded-md border border-slate-800 text-xs font-bold">
                    <button
                      onClick={() => setOrderMode('market')}
                      className={`py-1 rounded transition ${orderMode === 'market' ? 'bg-lime-400 text-black font-extrabold' : 'text-slate-400 hover:text-white'}`}
                    >
                      ⚡ Market
                    </button>
                    <button
                      onClick={() => setOrderMode('limit')}
                      className={`py-1 rounded transition ${orderMode === 'limit' ? 'bg-lime-400 text-black font-extrabold' : 'text-slate-400 hover:text-white'}`}
                    >
                      🎯 Limit Bid
                    </button>
                  </div>
                </div>

                {orderMode === 'limit' && (
                  <div className="bg-lime-400/10 border border-lime-400/20 p-2 rounded-md">
                    <span className="text-[10px] text-lime-400 font-bold uppercase block">Limit Bid Price (PKR)</span>
                    <input
                      type="number"
                      value={customBid}
                      onChange={(e) => setCustomBid(e.target.value)}
                      className="w-full bg-[#0d1321] border border-slate-700 rounded p-1 mt-0.5 text-xs font-num font-bold text-white outline-none focus:border-lime-400"
                    />
                  </div>
                )}

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">3. New Shares Quantity</span>
                  <input
                    type="number"
                    value={orderShares}
                    onChange={(e) => setOrderShares(e.target.value)}
                    className="w-full bg-[#12192a] border border-slate-700/80 rounded-md p-1.5 text-xs font-num font-bold text-white outline-none focus:border-lime-400"
                  />
                </div>

                <div className="flex items-center justify-between bg-[#12192a] p-2 rounded-md border border-slate-800">
                  <span className="text-[11px] text-slate-300 font-medium">PSX Taxes & Charges (+0.18%)</span>
                  <input
                    type="checkbox"
                    checked={includeFees}
                    onChange={(e) => setIncludeFees(e.target.checked)}
                    className="w-4 h-4 accent-lime-400 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Glowing Average Output Card */}
            <div className="bg-[#12192a] border border-slate-800 rounded-lg p-3 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Capital Required:</span>
                <span className="font-num font-bold text-white">PKR {capitalRequired.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Total Shares:</span>
                <span className="font-num font-bold text-white">{finalShares}</span>
              </div>

              <div className="bg-gradient-to-br from-[#1b263b] to-[#101726] border border-lime-400/30 p-3 rounded-md text-center mt-2 shadow-lg">
                <span className="text-[10px] font-black uppercase text-lime-400 tracking-wider block">Projected New Average Cost</span>
                <div className="text-2xl font-black font-num text-white mt-1">
                  PKR {newAverage.toFixed(2)}
                </div>
                {ePrice > 0 && nQty > 0 && (
                  <span className={`text-[11px] font-bold block mt-1 ${averageDelta < 0 ? 'text-lime-400' : 'text-rose-400'}`}>
                    {averageDelta < 0 ? `📉 Averaged Down by PKR ${Math.abs(averageDelta).toFixed(2)}/sh` : `📈 Averaged Up by PKR ${averageDelta.toFixed(2)}/sh`}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ================= RIGHT SCREENER & WATCHLIST (2 Cols) ================= */}
          <div className="lg:col-span-2 bg-[#0d1321] border border-slate-800 rounded-xl p-3 shadow-xl flex flex-col space-y-2.5">
            <div className="border-b border-slate-800 pb-2 space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black uppercase text-white flex items-center gap-1">
                  <span>🔥</span> PSX DIRECTORY
                </h3>
                <span className="text-[10px] bg-[#12192a] text-lime-400 px-1.5 py-0.5 rounded font-num border border-slate-800">
                  {filteredStocks.length}
                </span>
              </div>

              <input
                type="text"
                placeholder="Search PSX Stocks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#12192a] border border-slate-700/80 rounded-md px-2 py-1 text-xs text-white placeholder-slate-500 outline-none focus:border-lime-400"
              />

              <select
                value={sectorFilter}
                onChange={(e) => setSectorFilter(e.target.value)}
                className="w-full bg-[#12192a] border border-slate-700/80 text-slate-300 text-xs rounded-md p-1 outline-none font-medium"
              >
                {sectors.map((sec) => (
                  <option key={sec} value={sec}>{sec}</option>
                ))}
              </select>
            </div>

            {/* Scrollable Stocks List */}
            <div className="space-y-1 overflow-y-auto max-h-[480px] pr-1">
              {filteredStocks.map((stk) => {
                const isSelected = stk.symbol === activeStock.symbol;
                const isUp = stk.change >= 0;

                return (
                  <div
                    key={stk.symbol}
                    onClick={() => {
                      setActiveStock(stk);
                      setSelectedSymbol(stk.symbol);
                    }}
                    className={`p-2 rounded-lg border cursor-pointer transition flex items-center justify-between group ${
                      isSelected
                        ? 'bg-lime-400/15 border-lime-400/50 shadow-md'
                        : 'bg-[#12192a] border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-black text-xs text-white group-hover:text-lime-400 transition">{stk.symbol}</span>
                        {stk.shariah && <span className="text-[8px] bg-lime-400/20 text-lime-400 px-1 rounded font-bold">KMI</span>}
                      </div>
                      <p className="text-[10px] text-slate-400 truncate max-w-[80px]">{stk.name}</p>
                    </div>

                    <div className="text-right font-num">
                      <span className="text-xs font-bold text-white block">PKR {stk.price.toFixed(1)}</span>
                      <span className={`text-[10px] font-bold ${isUp ? 'text-lime-400' : 'text-rose-400'}`}>
                        {isUp ? `+${stk.change}%` : `${stk.change}%`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* ROW 2: CRISP WHITE CONTRAST ELEMENT (As requested in user screenshot) */}
        {/* A high-contrast white container hosting Pakistani Bullion, Currency, & Market Movers */}
        <div className="bg-white text-slate-900 rounded-2xl p-5 shadow-2xl border border-slate-200">
          
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-4">
            <div>
              <span className="text-xs uppercase font-black text-lime-600 tracking-wider block">Institutional Overview</span>
              <h2 className="text-xl font-extrabold text-slate-900">Pakistan Sovereign & Commodity Desk</h2>
              <p className="text-xs text-slate-500">Live Forex Interbank vs Open Market • SBP Saraf Bullion Association Rates</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 font-num">
                State Bank Target Rate: 15.00%
              </span>
              <span className="text-xs font-bold bg-lime-500 text-black px-3 py-1.5 rounded-lg font-num shadow-sm">
                Active Trading Session
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Currency Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-black uppercase text-slate-700 tracking-wide">Forex Spot Rates</span>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-bold">Interbank</span>
              </div>
              <div className="space-y-2 font-num text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="font-bold text-slate-700">USD / PKR (Interbank)</span>
                  <span className="font-black text-slate-900">278.45</span>
                  <span className="text-rose-600 font-bold">-0.05%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="font-bold text-slate-700">USD / PKR (Open Market)</span>
                  <span className="font-black text-slate-900">280.20</span>
                  <span className="text-lime-600 font-bold">+0.04%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="font-bold text-slate-700">GBP / PKR</span>
                  <span className="font-black text-slate-900">358.90</span>
                  <span className="text-lime-600 font-bold">+0.31%</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-bold text-slate-700">AED / PKR (Dirham)</span>
                  <span className="font-black text-slate-900">75.82</span>
                  <span className="text-rose-600 font-bold">-0.05%</span>
                </div>
              </div>
            </div>

            {/* Sona & Chandi Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-black uppercase text-slate-700 tracking-wide">Bullion Market (Pakistan)</span>
                <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold font-num">Gold 24K</span>
              </div>
              <div className="space-y-2 font-num text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="font-bold text-slate-700">Gold 24K (Per Tola)</span>
                  <span className="font-black text-slate-900">PKR 284,500</span>
                  <span className="text-lime-600 font-bold">+0.78%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="font-bold text-slate-700">Gold 10 Grams (24K)</span>
                  <span className="font-black text-slate-900">PKR 243,912</span>
                  <span className="text-lime-600 font-bold">+0.78%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="font-bold text-slate-700">Silver 24K (Per Tola)</span>
                  <span className="font-black text-slate-900">PKR 3,350</span>
                  <span className="text-lime-600 font-bold">+1.21%</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-bold text-slate-700">Crude Oil (Brent)</span>
                  <span className="font-black text-slate-900">$74.20/bbl</span>
                  <span className="text-rose-600 font-bold">-0.87%</span>
                </div>
              </div>
            </div>

            {/* Top PSX Leaders Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-black uppercase text-slate-700 tracking-wide">Market Momentum Movers</span>
                <span className="text-[10px] bg-lime-100 text-lime-800 px-1.5 py-0.5 rounded font-bold">Top Tickers</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs font-num">
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold text-lime-700 block uppercase">Top Gainer</span>
                  <span className="font-extrabold text-slate-900 block">{topGainers[0]?.symbol}</span>
                  <span className="text-lime-600 font-bold">+{topGainers[0]?.change}%</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold text-rose-700 block uppercase">Top Dip</span>
                  <span className="font-extrabold text-slate-900 block">{topLosers[0]?.symbol}</span>
                  <span className="text-rose-600 font-bold">{topLosers[0]?.change}%</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 block uppercase">Volume King</span>
                  <span className="font-extrabold text-slate-900 block">PRL (Refinery)</span>
                  <span className="text-slate-700 font-bold">22.4M Volume</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 block uppercase">Benchmark</span>
                  <span className="font-extrabold text-slate-900 block">KSE-100</span>
                  <span className="text-lime-600 font-bold">+845 Pts</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ROW 3: COMMUNITY TRADINGVIEW IDEAS & BROKER TRADE SETUPS (With Images & Avatars) */}
        <div className="bg-[#0d1321] border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-lime-400"></span>
                <h3 className="text-base font-black text-white">TradingView Style Community Ideas & Breakout Setups</h3>
              </div>
              <p className="text-xs text-slate-400">Daily Trade Theses, Fibonacci Targets & Stop-Loss Levels by Certified Analysts</p>
            </div>
            <button className="text-xs font-bold text-black bg-lime-400 px-3 py-1.5 rounded-lg hover:bg-lime-300 transition">
              + Share Your Trade Idea
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {COMMUNITY_TRADE_SETUPS.map((idea) => (
              <div key={idea.id} className="bg-[#12192a] border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition flex flex-col justify-between">
                <div>
                  {/* Thumbnail Image */}
                  <div className="h-36 w-full relative overflow-hidden bg-slate-900">
                    <img src={idea.chartThumb} alt={idea.symbol} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition duration-300 hover:scale-105" />
                    <div className="absolute top-2 left-2 bg-[#0d1321]/90 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-black text-lime-400 border border-slate-700 font-num">
                      {idea.symbol} • {idea.direction}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-3.5 space-y-2">
                    <div className="flex items-center gap-2">
                      <img src={idea.avatar} alt={idea.author} className="w-7 h-7 rounded-full object-cover border border-slate-700" />
                      <div>
                        <span className="text-xs font-bold text-white block leading-tight">{idea.author}</span>
                        <span className="text-[10px] text-slate-400 font-num">Target: {idea.target} (SL: {idea.stop})</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{idea.thesis}</p>
                  </div>
                </div>

                <div className="p-3.5 pt-0 border-t border-slate-800/80 flex justify-between items-center text-xs text-slate-400 font-num">
                  <span className="text-lime-400 font-bold">Bullish Sentiment: {idea.bullishPercent}%</span>
                  <span>❤️ {idea.likes} Traders</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ROW 4: BREAKING FINANCIAL NEWS WITH IMAGES (To make the page full & rich) */}
        <div className="bg-[#0d1321] border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-lime-400"></span>
                <h3 className="text-base font-black text-white">PSX Intelligence Wire & Corporate Regulatory Filings</h3>
              </div>
              <p className="text-xs text-slate-400">Live Corporate Announcements, SECP Notifications & Macro Coverage</p>
            </div>
            <span className="text-xs bg-[#12192a] text-slate-400 border border-slate-800 px-2.5 py-1 rounded-md font-num">
              Live Feed Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {BREAKING_NEWS.map((news) => (
              <div key={news.id} className="bg-[#12192a] border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition flex flex-col justify-between">
                <div>
                  <div className="h-32 w-full overflow-hidden bg-slate-900">
                    <img src={news.image} alt={news.title} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition duration-300 hover:scale-105" />
                  </div>
                  <div className="p-3 space-y-1.5">
                    <span className="text-[9px] bg-lime-400/15 text-lime-400 border border-lime-400/30 px-1.5 py-0.5 rounded font-black tracking-wider uppercase">
                      {news.tag}
                    </span>
                    <h4 className="text-xs font-bold text-white leading-snug line-clamp-2 hover:text-lime-400 cursor-pointer transition">
                      {news.title}
                    </h4>
                  </div>
                </div>

                <div className="p-3 pt-0 flex justify-between items-center text-[10px] text-slate-500 font-num">
                  <span>{news.source}</span>
                  <span>{news.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* 3. FOOTER */}
      <footer className="border-t border-slate-800/80 bg-[#070a10] px-6 py-6 text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <span className="font-extrabold text-white text-sm">NAFAX TERMINAL</span> — Pakistan Stock Exchange Live Analytics & Cost-Averaging Engine.
        </div>
        <div className="flex gap-4 font-num">
          <span>Data Feed: PSX Portal (Delayed & Intraday)</span>
          <span>•</span>
          <span>Currency: SBP Interbank</span>
          <span>•</span>
          <span>Bullion: All Pakistan Sarafa Association</span>
        </div>
      </footer>

    </div>
  );
}
