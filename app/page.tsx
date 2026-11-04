'use client';

import React, { useState, useMemo, useRef } from 'react';

// Comprehensive PSX 50+ Stock Directory
const PSX_UNIVERSE = [
  // Oil & Gas Exploration & Refineries
  { symbol: 'OGDC', name: 'Oil & Gas Dev Co', sector: 'Oil & Gas', price: 174.50, change: +3.85, base: 170.0, volume: '18.4M', pe: 4.8, mktCap: '750B', yield: '9.2%', shariah: true },
  { symbol: 'PPL', name: 'Pakistan Petroleum Ltd', sector: 'Oil & Gas', price: 126.20, change: +2.15, base: 123.0, volume: '11.2M', pe: 5.2, mktCap: '343B', yield: '8.4%', shariah: true },
  { symbol: 'MARI', name: 'Mari Energies Ltd', sector: 'Oil & Gas', price: 2840.00, change: +4.10, base: 2780.0, volume: '1.2M', pe: 7.9, mktCap: '422B', yield: '6.1%', shariah: true },
  { symbol: 'POL', name: 'Pakistan Oilfields Ltd', sector: 'Oil & Gas', price: 485.00, change: +1.40, base: 478.0, volume: '2.4M', pe: 6.2, mktCap: '138B', yield: '14.5%', shariah: true },
  { symbol: 'PSO', name: 'Pakistan State Oil', sector: 'Oil Marketing', price: 218.30, change: -1.75, base: 221.0, volume: '4.8M', pe: 6.1, mktCap: '102B', yield: '4.8%', shariah: false },
  { symbol: 'PRL', name: 'Pakistan Refinery Ltd', sector: 'Refinery', price: 30.15, change: +5.30, base: 28.5, volume: '28.9M', pe: 3.9, mktCap: '36B', yield: '0.0%', shariah: true },
  { symbol: 'ATRL', name: 'Attock Refinery Ltd', sector: 'Refinery', price: 395.00, change: +2.60, base: 385.0, volume: '3.6M', pe: 4.1, mktCap: '42B', yield: '7.8%', shariah: true },

  // Commercial Banks
  { symbol: 'MEBL', name: 'Meezan Bank Ltd', sector: 'Banking', price: 236.00, change: +1.95, base: 231.0, volume: '6.8M', pe: 5.6, mktCap: '412B', yield: '11.8%', shariah: true },
  { symbol: 'HBL', name: 'Habib Bank Ltd', sector: 'Banking', price: 132.50, change: -0.85, base: 133.5, volume: '5.2M', pe: 4.2, mktCap: '194B', yield: '10.5%', shariah: false },
  { symbol: 'MCB', name: 'MCB Bank Ltd', sector: 'Banking', price: 229.40, change: +0.40, base: 228.0, volume: '3.1M', pe: 5.1, mktCap: '271B', yield: '13.2%', shariah: false },
  { symbol: 'UBL', name: 'United Bank Ltd', sector: 'Banking', price: 288.00, change: +2.10, base: 282.0, volume: '4.9M', pe: 4.9, mktCap: '352B', yield: '15.6%', shariah: false },
  { symbol: 'BAFL', name: 'Bank Alfalah Ltd', sector: 'Banking', price: 68.50, change: +1.20, base: 67.5, volume: '7.4M', pe: 4.4, mktCap: '108B', yield: '12.0%', shariah: false },
  { symbol: 'BIPL', name: 'BankIslami Pakistan', sector: 'Banking', price: 24.80, change: +3.10, base: 24.0, volume: '8.2M', pe: 4.1, mktCap: '27B', yield: '9.0%', shariah: true },

  // Cement
  { symbol: 'LUCK', name: 'Lucky Cement Ltd', sector: 'Cement', price: 935.00, change: +2.80, base: 910.0, volume: '2.1M', pe: 8.4, mktCap: '292B', yield: '3.5%', shariah: true },
  { symbol: 'DGKC', name: 'D.G. Khan Cement', sector: 'Cement', price: 85.50, change: +1.70, base: 84.0, volume: '9.5M', pe: 6.8, mktCap: '37B', yield: '0.0%', shariah: true },
  { symbol: 'MLCF', name: 'Maple Leaf Cement', sector: 'Cement', price: 42.60, change: -1.20, base: 43.1, volume: '14.2M', pe: 7.1, mktCap: '45B', yield: '4.8%', shariah: true },
  { symbol: 'CHCC', name: 'Cherat Cement Co', sector: 'Cement', price: 182.00, change: +3.40, base: 176.0, volume: '3.8M', pe: 7.6, mktCap: '35B', yield: '5.2%', shariah: true },

  // Technology & Telecom
  { symbol: 'SYS', name: 'Systems Limited', sector: 'Technology', price: 452.00, change: -2.30, base: 462.0, volume: '4.1M', pe: 14.5, mktCap: '128B', yield: '1.8%', shariah: true },
  { symbol: 'TRG', name: 'TRG Pakistan Ltd', sector: 'Technology', price: 59.80, change: -3.60, base: 62.0, volume: '16.5M', pe: 8.2, mktCap: '32B', yield: '0.0%', shariah: false },
  { symbol: 'AIRLINK', name: 'Air Link Communication', sector: 'Technology', price: 114.50, change: +3.20, base: 111.0, volume: '8.4M', pe: 11.0, mktCap: '45B', yield: '3.5%', shariah: true },
  { symbol: 'WTL', name: 'WorldCall Telecom', sector: 'Technology', price: 1.39, change: +0.00, base: 1.39, volume: '42.1M', pe: 2.1, mktCap: '6B', yield: '0.0%', shariah: false },

  // Fertilizer & Power
  { symbol: 'ENGRO', name: 'Engro Corporation', sector: 'Fertilizer', price: 348.00, change: +1.20, base: 343.0, volume: '3.4M', pe: 6.3, mktCap: '188B', yield: '12.5%', shariah: true },
  { symbol: 'FFC', name: 'Fauji Fertilizer Co', sector: 'Fertilizer', price: 204.50, change: +0.65, base: 203.0, volume: '5.1M', pe: 5.8, mktCap: '260B', yield: '14.2%', shariah: true },
  { symbol: 'HUBC', name: 'Hub Power Company', sector: 'Power', price: 146.20, change: +4.20, base: 140.0, volume: '19.8M', pe: 4.5, mktCap: '189B', yield: '17.5%', shariah: true },
  { symbol: 'KEL', name: 'K-Electric Ltd', sector: 'Power', price: 4.95, change: +2.10, base: 4.85, volume: '58.2M', pe: 3.2, mktCap: '136B', yield: '0.0%', shariah: false },

  // Automobile
  { symbol: 'INDU', name: 'Indus Motor Co Ltd', sector: 'Automobile', price: 1640.00, change: +4.50, base: 1570.0, volume: '380K', pe: 10.2, mktCap: '129B', yield: '5.2%', shariah: true },
  { symbol: 'MTL', name: 'Millat Tractors Ltd', sector: 'Automobile', price: 618.00, change: -1.40, base: 626.0, volume: '950K', pe: 9.4, mktCap: '118B', yield: '8.5%', shariah: true },
];

const MAJOR_INDICES = [
  { symbol: 'KSE 100', name: 'PSX Benchmark Index', value: '112,450.25', change: '+845.60', percent: '+0.76%', isUp: true },
  { symbol: 'KMI 30', name: 'Islamic Shariah Index', value: '38,120.40', change: '+412.30', percent: '+1.09%', isUp: true },
  { symbol: 'KSE 30', name: 'Large Cap Index', value: '34,980.70', change: '-110.20', percent: '-0.31%', isUp: false },
  { symbol: 'ALL SHARES', name: 'PSX All Shares Index', value: '72,890.10', change: '+320.15', percent: '+0.44%', isUp: true },
  { symbol: 'OGTI', name: 'Oil & Gas Tradable Index', value: '18,450.80', change: '+240.50', percent: '+1.32%', isUp: true },
  { symbol: 'BKTI', name: 'Banking Tradable Index', value: '24,190.20', change: '+180.10', percent: '+0.75%', isUp: true },
];

// Community Ideas with High-Resolution Charts & Certified Analysts
const COMMUNITY_IDEAS = [
  {
    id: 1,
    title: 'OGDC: Key Support Bounce & Potential Bullish Expansion',
    author: 'Tariq Equity Research',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    symbol: 'OGDC',
    target: 'PKR 198.00',
    type: 'LONG',
    time: '2 hours ago',
    image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=600&auto=format&fit=crop&q=60',
    desc: 'OGDC has formed a textbook cup-and-handle above 172 PKR neckline. Institutional blocks indicate strong multi-week accumulation.',
    likes: 184,
    comments: 32
  },
  {
    id: 2,
    title: 'MEBL: Sustained Islamic Banking Alpha with High Spread Resilience',
    author: 'Meezan Securities Desk',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    symbol: 'MEBL',
    target: 'PKR 265.00',
    type: 'ACCUMULATE',
    time: '4 hours ago',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=60',
    desc: 'Return on Equity (ROE) remains unmatched at 46%. Low cost of deposit mix shields margins against monetary easing cycle.',
    likes: 142,
    comments: 19
  },
  {
    id: 3,
    title: 'SYS: Re-testing 50 EMA Support Zone before Continuation Leg',
    author: 'PSX Alpha Technicians',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    symbol: 'SYS',
    target: 'PKR 430.00',
    type: 'PULLBACK',
    time: '6 hours ago',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&auto=format&fit=crop&q=60',
    desc: 'Healthy corrective structure after hitting 462 resistance. Expect strong buyer defense near 428-432 level.',
    likes: 98,
    comments: 14
  },
  {
    id: 4,
    title: 'LUCK: Clinker Capacity Expansion & Export Growth Valuation',
    author: 'Karachi Capital Advisory',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80',
    symbol: 'LUCK',
    target: 'PKR 1020.00',
    type: 'SWING LONG',
    time: '8 hours ago',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=60',
    desc: 'Synergies from international acquisitions and falling global coal prices expanding operating EBITDA by 280 bps.',
    likes: 126,
    comments: 21
  }
];

export default function TradingViewPortal() {
  const [selectedStock, setSelectedStock] = useState(PSX_UNIVERSE[0]);
  const [activeTab, setActiveTab] = useState<'chart' | 'screener'>('chart');
  const [chartMode, setChartMode] = useState<'candles' | 'area'>('candles');
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y' | 'ALL'>('1D');

  // Interactive Graph Crosshair State
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [hoveredCandle, setHoveredCandle] = useState<any>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Screener Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [sectorFilter, setSectorFilter] = useState('ALL');
  const [shariahOnly, setShariahOnly] = useState(false);

  // Dedicated Smart Averaging Desk (Floating / Docked Component)
  const [showAveragingModal, setShowAveragingModal] = useState(false);
  const [holdingQty, setHoldingQty] = useState('1000');
  const [holdingPrice, setHoldingPrice] = useState('180.00');
  const [orderShares, setOrderShares] = useState('500');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [limitBid, setLimitBid] = useState('168.00');
  const [includeFees, setIncludeFees] = useState(true);

  // Generate 45 realistic continuous daily candles for selected stock
  const candleData = useMemo(() => {
    const list = [];
    let p = selectedStock.base;
    const now = new Date();
    for (let i = 44; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const change = (Math.sin(i * 0.35) + (Math.random() - 0.46)) * (selectedStock.base * 0.022);
      const open = parseFloat(p.toFixed(2));
      const close = parseFloat((p + change).toFixed(2));
      const high = parseFloat((Math.max(open, close) + Math.random() * (selectedStock.base * 0.012)).toFixed(2));
      const low = parseFloat((Math.min(open, close) - Math.random() * (selectedStock.base * 0.012)).toFixed(2));
      const vol = Math.floor(Math.random() * 8000000) + 1500000;
      list.push({ date: dateStr, open, high, low, close, volume: vol });
      p = close;
    }
    list[list.length - 1].close = selectedStock.price;
    return list;
  }, [selectedStock]);

  const activeCandle = hoveredCandle || candleData[candleData.length - 1];

  // Chart Dimensions & Ranges
  const minLow = Math.min(...candleData.map((c) => c.low));
  const maxHigh = Math.max(...candleData.map((c) => c.high));
  const priceRange = maxHigh - minLow || 1;

  // Mouse Move Event on Chart for Crosshair
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCursorPos({ x, y });

    // Find nearest candle
    const index = Math.min(
      candleData.length - 1,
      Math.max(0, Math.floor((x / rect.width) * candleData.length))
    );
    setHoveredCandle(candleData[index]);
  };

  const handleMouseLeave = () => {
    setCursorPos(null);
    setHoveredCandle(null);
  };

  // Averaging Calculations
  const eQty = parseFloat(holdingQty) || 0;
  const ePrice = parseFloat(holdingPrice) || 0;
  const nQty = parseFloat(orderShares) || 0;
  const execPrice = orderType === 'limit' && limitBid ? parseFloat(limitBid) || 0 : selectedStock.price;
  const tradeVal = nQty * execPrice;
  const charges = includeFees ? tradeVal * 0.0018 : 0;
  const capitalReq = tradeVal + charges;
  const finalQty = eQty + nQty;
  const newAvg = finalQty > 0 ? (eQty * ePrice + capitalReq) / finalQty : 0;
  const deltaAvg = ePrice > 0 ? newAvg - ePrice : 0;

  // Filter Directory
  const filteredList = useMemo(() => {
    return PSX_UNIVERSE.filter((s) => {
      const match = s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || s.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (!match) return false;
      if (shariahOnly && !s.shariah) return false;
      if (sectorFilter === 'ALL') return true;
      return s.sector.toLowerCase() === sectorFilter.toLowerCase();
    });
  }, [searchQuery, sectorFilter, shariahOnly]);

  const sectors = useMemo(() => ['ALL', ...Array.from(new Set(PSX_UNIVERSE.map((s) => s.sector)))], []);

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#131722] flex flex-col font-sans">
      
      {/* 1. TOP GLOBAL NAVIGATION HEADER (TradingView Exact Style) */}
      <header className="border-b border-[#e0e3eb] bg-white px-5 py-2.5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-7">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="shrink-0">
              <rect width="28" height="28" rx="6" fill="#131722" />
              <path d="M7 19L11.5 10L16 16L21 8" stroke="#089981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-extrabold text-lg tracking-tight text-[#131722]">
              TradingView <span className="text-xs bg-[#f0f3fa] text-[#2962ff] px-2 py-0.5 rounded font-bold ml-1">PSX</span>
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-[#787b86]">
            <span className="text-[#131722] cursor-pointer hover:text-[#2962ff] transition">Markets</span>
            <span className="cursor-pointer hover:text-[#131722] transition">Community</span>
            <span className="cursor-pointer hover:text-[#131722] transition">Screener</span>
            <span className="cursor-pointer hover:text-[#131722] transition">Brokers</span>
            <span className="cursor-pointer hover:text-[#131722] transition">More</span>
          </nav>
        </div>

        {/* Right Action Icons & Averaging Desk Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAveragingModal(true)}
            className="flex items-center gap-2 bg-[#089981]/10 border border-[#089981]/30 text-[#089981] hover:bg-[#089981] hover:text-white px-3.5 py-1.5 rounded-full text-xs font-bold transition shadow-sm font-num"
          >
            <span>⚡</span> Smart Averaging Desk
          </button>

          <div className="h-5 w-[1px] bg-[#e0e3eb] hidden sm:block"></div>

          <button className="bg-[#2962ff] hover:bg-[#1e53e5] text-white text-xs font-bold px-4 py-2 rounded-full transition shadow-sm">
            Start Free Trial
          </button>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE / HERO: MARKET SUMMARY (TradingView Homepage Replica) */}
      <div className="max-w-[1600px] mx-auto w-full px-4 py-5 space-y-6">
        
        {/* Title Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-[#131722] flex items-center gap-2">
              Market summary <span className="text-[#787b86] text-xl font-normal">›</span>
            </h1>
            <p className="text-xs text-[#787b86]">Pakistan Stock Exchange, Benchmark Indices, Currencies, and Macro Trends</p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="text-[#089981] flex items-center gap-1">● Live Trading Session</span>
            <span className="text-[#787b86]">• 09:15 AM - 03:30 PM PKT</span>
          </div>
        </div>

        {/* BIG CHART HERO GRID (Exact TradingView Hero Section) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Main Chart Box (8 Cols) */}
          <div className="lg:col-span-8 bg-white border border-[#e0e3eb] rounded-2xl p-5 shadow-sm space-y-4">
            
            {/* Asset Header + Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f0f3fa] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#131722] text-white flex items-center justify-center font-extrabold text-sm shadow-sm font-num">
                  {selectedStock.symbol}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-[#131722]">{selectedStock.symbol}</h2>
                    <span className="text-xs text-[#787b86] font-medium">{selectedStock.name}</span>
                    {selectedStock.shariah && (
                      <span className="text-[10px] bg-[#089981]/10 text-[#089981] border border-[#089981]/20 px-2 py-0.5 rounded font-bold">
                        KMI Shariah
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 font-num mt-0.5">
                    <span className="text-3xl font-black text-[#131722]">
                      PKR {selectedStock.price.toFixed(2)}
                    </span>
                    <span className={`text-sm font-bold flex items-center ${selectedStock.change >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                      {selectedStock.change >= 0 ? `+${selectedStock.change.toFixed(2)} (+${((selectedStock.change / selectedStock.base) * 100).toFixed(2)}%)` : `${selectedStock.change.toFixed(2)}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeframes & Candlestick Modes */}
              <div className="flex items-center gap-2">
                <div className="flex bg-[#f0f3fa] p-1 rounded-lg text-xs font-bold font-num text-[#787b86]">
                  {(['1D', '1W', '1M', '1Y', 'ALL'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTimeframe(t)}
                      className={`px-2.5 py-1 rounded transition ${timeframe === t ? 'bg-white text-[#131722] shadow-sm' : 'hover:text-[#131722]'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="flex bg-[#f0f3fa] p-1 rounded-lg text-xs font-bold text-[#787b86]">
                  <button
                    onClick={() => setChartMode('candles')}
                    className={`px-2.5 py-1 rounded transition ${chartMode === 'candles' ? 'bg-white text-[#131722] shadow-sm' : 'hover:text-[#131722]'}`}
                  >
                    🕯️ Candles
                  </button>
                  <button
                    onClick={() => setChartMode('area')}
                    className={`px-2.5 py-1 rounded transition ${chartMode === 'area' ? 'bg-white text-[#131722] shadow-sm' : 'hover:text-[#131722]'}`}
                  >
                    📈 Line
                  </button>
                </div>
              </div>
            </div>

            {/* Live Crosshair HUD (Open, High, Low, Close, Volume) */}
            <div className="flex flex-wrap items-center justify-between text-xs font-num bg-[#f8fafd] border border-[#e0e3eb] px-3 py-1.5 rounded-lg text-[#787b86]">
              <div className="flex items-center gap-4">
                <span>DATE: <strong className="text-[#131722]">{activeCandle.date}</strong></span>
                <span>O: <strong className="text-[#131722]">{activeCandle.open.toFixed(2)}</strong></span>
                <span>H: <strong className="text-[#089981]">{activeCandle.high.toFixed(2)}</strong></span>
                <span>L: <strong className="text-[#f23645]">{activeCandle.low.toFixed(2)}</strong></span>
                <span>C: <strong className={activeCandle.close >= activeCandle.open ? 'text-[#089981]' : 'text-[#f23645]'}>{activeCandle.close.toFixed(2)}</strong></span>
              </div>
              <div>VOL: <strong className="text-[#131722]">{(activeCandle.volume / 1000000).toFixed(2)}M</strong></div>
            </div>

            {/* SVG INTERACTIVE GRAPH WITH REAL TIME CROSSHAIR TRACKING */}
            <div className="relative w-full h-[360px] bg-white border border-[#e0e3eb] rounded-xl overflow-hidden select-none">
              
              {/* Subtle Horizontal & Vertical Price Grid */}
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 opacity-30">
                <div className="border-b border-dashed border-[#e0e3eb] w-full"></div>
                <div className="border-b border-dashed border-[#e0e3eb] w-full"></div>
                <div className="border-b border-dashed border-[#e0e3eb] w-full"></div>
                <div className="border-b border-dashed border-[#e0e3eb] w-full"></div>
              </div>

              {/* Price Scale Indicators */}
              <div className="absolute top-2 right-2 text-[11px] font-num text-[#787b86] font-bold">
                PKR {maxHigh.toFixed(2)}
              </div>
              <div className="absolute bottom-6 right-2 text-[11px] font-num text-[#787b86] font-bold">
                PKR {minLow.toFixed(2)}
              </div>

              {/* Main SVG Area */}
              <svg
                ref={svgRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="w-full h-full cursor-crosshair overflow-visible relative z-10"
              >
                {/* Mode 1: TradingView Candlestick + Volume Profile */}
                {chartMode === 'candles' ? (
                  <>
                    {candleData.map((c, idx) => {
                      const total = candleData.length;
                      const x = (idx / total) * 1000 + 10;
                      const isUp = c.close >= c.open;
                      const yClose = 280 - ((c.close - minLow) / priceRange) * 230;
                      const yOpen = 280 - ((c.open - minLow) / priceRange) * 230;
                      const yHigh = 280 - ((c.high - minLow) / priceRange) * 230;
                      const yLow = 280 - ((c.low - minLow) / priceRange) * 230;
                      const bodyTop = Math.min(yOpen, yClose);
                      const bodyH = Math.max(3, Math.abs(yClose - yOpen));
                      const volH = Math.min(45, (c.volume / 9000000) * 45);

                      return (
                        <g key={idx}>
                          {/* Candle Wick */}
                          <line
                            x1={x}
                            y1={yHigh}
                            x2={x}
                            y2={yLow}
                            stroke={isUp ? '#089981' : '#f23645'}
                            strokeWidth="1.2"
                          />
                          {/* Candle Body */}
                          <rect
                            x={x - 6}
                            y={bodyTop}
                            width="12"
                            height={bodyH}
                            fill={isUp ? '#089981' : '#f23645'}
                            rx="1"
                          />
                          {/* Volume Bar */}
                          <rect
                            x={x - 5}
                            y={350 - volH}
                            width="10"
                            height={volH}
                            fill={isUp ? '#089981' : '#f23645'}
                            opacity="0.3"
                          />
                        </g>
                      );
                    })}
                  </>
                ) : (
                  /* Mode 2: TradingView Line/Area Mode */
                  <>
                    <defs>
                      <linearGradient id="tvGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2962ff" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#2962ff" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <polygon
                      fill="url(#tvGradient)"
                      points={`0,320 ${candleData.map((c, i) => `${(i / (candleData.length - 1)) * 1000},${280 - ((c.close - minLow) / priceRange) * 230}`).join(' ')} 1000,320`}
                    />
                    <polyline
                      fill="none"
                      stroke="#2962ff"
                      strokeWidth="2.5"
                      points={candleData.map((c, i) => `${(i / (candleData.length - 1)) * 1000},${280 - ((c.close - minLow) / priceRange) * 230}`).join(' ')}
                    />
                  </>
                )}

                {/* DYNAMIC TRADINGVIEW CROSSHAIR OVERLAY */}
                {cursorPos && (
                  <g pointerEvents="none">
                    {/* Vertical Crosshair Line */}
                    <line
                      x1={cursorPos.x}
                      y1="0"
                      x2={cursorPos.x}
                      y2="360"
                      stroke="#787b86"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                    {/* Horizontal Crosshair Line */}
                    <line
                      x1="0"
                      y1={cursorPos.y}
                      x2="100%"
                      y2={cursorPos.y}
                      stroke="#787b86"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                  </g>
                )}
              </svg>

              {/* Crosshair Floating Axis Labels */}
              {cursorPos && (
                <>
                  {/* Right Price Badge */}
                  <div
                    className="absolute right-0 bg-[#131722] text-white text-[10px] font-num px-2 py-0.5 rounded-l pointer-events-none z-30"
                    style={{ top: `${cursorPos.y - 10}px` }}
                  >
                    PKR {(maxHigh - (cursorPos.y / 360) * priceRange).toFixed(2)}
                  </div>
                  {/* Bottom Date Badge */}
                  <div
                    className="absolute bottom-0 bg-[#131722] text-white text-[10px] font-num px-2 py-0.5 rounded-t pointer-events-none z-30 transform -translate-x-1/2"
                    style={{ left: `${cursorPos.x}px` }}
                  >
                    {activeCandle.date}
                  </div>
                </>
              )}
            </div>

            {/* Bottom Intraday Stats */}
            <div className="grid grid-cols-4 gap-3 pt-2 text-center font-num text-xs border-t border-[#f0f3fa]">
              <div className="bg-[#f8fafd] p-2 rounded-lg border border-[#e0e3eb]">
                <span className="text-[#787b86] text-[10px] block uppercase">P/E RATIO</span>
                <span className="font-extrabold text-[#131722]">{selectedStock.pe}x</span>
              </div>
              <div className="bg-[#f8fafd] p-2 rounded-lg border border-[#e0e3eb]">
                <span className="text-[#787b86] text-[10px] block uppercase">MARKET CAP</span>
                <span className="font-extrabold text-[#131722]">PKR {selectedStock.mktCap}</span>
              </div>
              <div className="bg-[#f8fafd] p-2 rounded-lg border border-[#e0e3eb]">
                <span className="text-[#787b86] text-[10px] block uppercase">DIVIDEND YIELD</span>
                <span className="font-extrabold text-[#089981]">{selectedStock.yield}</span>
              </div>
              <div className="bg-[#f8fafd] p-2 rounded-lg border border-[#e0e3eb]">
                <span className="text-[#787b86] text-[10px] block uppercase">AVG VOLUME</span>
                <span className="font-extrabold text-[#131722]">{selectedStock.volume}</span>
              </div>
            </div>
          </div>

          {/* Major Indices Side Panel (4 Cols - Exact TradingView Right Card) */}
          <div className="lg:col-span-4 bg-white border border-[#e0e3eb] rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex justify-between items-center border-b border-[#f0f3fa] pb-3">
              <h2 className="text-base font-extrabold text-[#131722]">Major indices</h2>
              <span className="text-xs text-[#2962ff] font-bold cursor-pointer hover:underline">See all indices ›</span>
            </div>

            <div className="space-y-2">
              {MAJOR_INDICES.map((idx, i) => (
                <div
                  key={idx.symbol}
                  className="p-3 rounded-xl border border-[#e0e3eb] hover:bg-[#f8fafd] transition cursor-pointer flex justify-between items-center group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#f0f3fa] flex items-center justify-center font-extrabold text-xs text-[#131722] font-num">
                      {i + 1}
                    </div>
                    <div>
                      <span className="font-extrabold text-xs text-[#131722] group-hover:text-[#2962ff] transition block">
                        {idx.symbol}
                      </span>
                      <span className="text-[10px] text-[#787b86]">{idx.name}</span>
                    </div>
                  </div>

                  <div className="text-right font-num">
                    <span className="text-xs font-bold text-[#131722] block">{idx.value}</span>
                    <span className={`text-[11px] font-bold ${idx.isUp ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                      {idx.percent}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Switch to Stocks Screener */}
            <div className="pt-2">
              <button
                onClick={() => setShowAveragingModal(true)}
                className="w-full bg-[#131722] hover:bg-black text-white text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2 shadow-sm font-num"
              >
                <span>⚡</span> Open Smart Cost-Averaging Desk
              </button>
            </div>
          </div>

        </div>

        {/* 3. FOUR MACRO PILLARS (Exact TradingView Sub-cards: Crypto/Forex/Gold/Inflation) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Forex USD/PKR */}
          <div className="bg-white border border-[#e0e3eb] rounded-2xl p-4 shadow-sm hover:border-[#2962ff] transition cursor-pointer">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-[#787b86] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#089981]"></span> USD / PKR (Interbank)
              </span>
              <span className="text-[10px] bg-[#f0f3fa] text-[#787b86] px-1.5 py-0.5 rounded font-bold font-num">FOREX</span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-black font-num text-[#131722]">278.45</span>
              <span className="text-xs font-bold text-[#f23645] font-num">-0.05%</span>
            </div>
            <p className="text-[11px] text-[#787b86] mt-1">Open Market: 280.20 PKR • SBP Forex Reserves $11.2B</p>
          </div>

          {/* Card 2: Gold 24K per Tola */}
          <div className="bg-white border border-[#e0e3eb] rounded-2xl p-4 shadow-sm hover:border-[#2962ff] transition cursor-pointer">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-[#787b86] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Gold (24K / Tola)
              </span>
              <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-bold font-num">SARAFA</span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-black font-num text-[#131722]">PKR 284,500</span>
              <span className="text-xs font-bold text-[#089981] font-num">+0.78%</span>
            </div>
            <p className="text-[11px] text-[#787b86] mt-1">10 Grams: PKR 243,912 • Silver: PKR 3,350/Tola</p>
          </div>

          {/* Card 3: SBP Policy Rate */}
          <div className="bg-white border border-[#e0e3eb] rounded-2xl p-4 shadow-sm hover:border-[#2962ff] transition cursor-pointer">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-[#787b86] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#2962ff]"></span> SBP Target Policy Rate
              </span>
              <span className="text-[10px] bg-[#f0f3fa] text-[#787b86] px-1.5 py-0.5 rounded font-bold font-num">CENTRAL BANK</span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-black font-num text-[#131722]">15.00%</span>
              <span className="text-xs font-bold text-[#787b86] font-num">Monetary Yield</span>
            </div>
            <p className="text-[11px] text-[#787b86] mt-1">Next MPC Review: Scheduled Q2 • Yield Curve Easing</p>
          </div>

          {/* Card 4: Brent Crude Oil */}
          <div className="bg-white border border-[#e0e3eb] rounded-2xl p-4 shadow-sm hover:border-[#2962ff] transition cursor-pointer">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-[#787b86] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-700"></span> Crude Oil (Brent)
              </span>
              <span className="text-[10px] bg-[#f0f3fa] text-[#787b86] px-1.5 py-0.5 rounded font-bold font-num">ENERGY</span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-black font-num text-[#131722]">$74.20 <span className="text-xs font-normal">/bbl</span></span>
              <span className="text-xs font-bold text-[#f23645] font-num">-0.87%</span>
            </div>
            <p className="text-[11px] text-[#787b86] mt-1">Directly impacts OGDC, PPL, and PSO pricing dynamics</p>
          </div>

        </div>

        {/* 4. PSX STOCKS SCREENER & DIRECTORY TABLE (TradingView Equities Screener) */}
        <div className="bg-white border border-[#e0e3eb] rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#f0f3fa] pb-4">
            <div>
              <h2 className="text-xl font-black text-[#131722] flex items-center gap-2">
                PSX Equities & Screener <span className="text-[#787b86] text-sm font-normal">›</span>
              </h2>
              <p className="text-xs text-[#787b86]">Search 50+ Top Traded Stocks across Karachi Stock Exchange</p>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              <input
                type="text"
                placeholder="Search symbol (e.g. MEBL, SYS, PRL)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#f8fafd] border border-[#e0e3eb] rounded-xl px-3 py-1.5 text-xs text-[#131722] outline-none focus:border-[#2962ff] w-56 font-medium"
              />

              <select
                value={sectorFilter}
                onChange={(e) => setSectorFilter(e.target.value)}
                className="bg-[#f8fafd] border border-[#e0e3eb] text-xs font-bold text-[#131722] rounded-xl px-3 py-1.5 outline-none"
              >
                {sectors.map((sec) => (
                  <option key={sec} value={sec}>{sec}</option>
                ))}
              </select>

              <button
                onClick={() => setShariahOnly(!shariahOnly)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${shariahOnly ? 'bg-[#089981] text-white border-[#089981]' : 'bg-[#f8fafd] text-[#787b86] border-[#e0e3eb]'}`}
              >
                KMI Shariah Only
              </button>
            </div>
          </div>

          {/* Stocks Grid Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-num">
              <thead>
                <tr className="border-b border-[#e0e3eb] text-[#787b86] uppercase font-bold text-[10px]">
                  <th className="py-2.5 px-3">Symbol</th>
                  <th className="py-2.5 px-3">Company Name</th>
                  <th className="py-2.5 px-3">Sector</th>
                  <th className="py-2.5 px-3 text-right">Price (PKR)</th>
                  <th className="py-2.5 px-3 text-right">Change %</th>
                  <th className="py-2.5 px-3 text-right">Volume</th>
                  <th className="py-2.5 px-3 text-right">P/E Ratio</th>
                  <th className="py-2.5 px-3 text-right">Dividend Yield</th>
                  <th className="py-2.5 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f3fa]">
                {filteredList.map((stk) => {
                  const isUp = stk.change >= 0;
                  const isSelected = stk.symbol === selectedStock.symbol;

                  return (
                    <tr
                      key={stk.symbol}
                      onClick={() => setSelectedStock(stk)}
                      className={`hover:bg-[#f8fafd] transition cursor-pointer ${isSelected ? 'bg-[#f0f3fa]' : ''}`}
                    >
                      <td className="py-3 px-3 font-extrabold text-[#131722] flex items-center gap-1.5">
                        {stk.symbol}
                        {stk.shariah && <span className="text-[9px] bg-[#089981]/15 text-[#089981] px-1 rounded font-bold">KMI</span>}
                      </td>
                      <td className="py-3 px-3 font-sans font-medium text-[#787b86]">{stk.name}</td>
                      <td className="py-3 px-3 font-sans text-[#787b86]">{stk.sector}</td>
                      <td className="py-3 px-3 text-right font-black text-[#131722]">PKR {stk.price.toFixed(2)}</td>
                      <td className={`py-3 px-3 text-right font-bold ${isUp ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                        {isUp ? `+${stk.change.toFixed(2)}%` : `${stk.change.toFixed(2)}%`}
                      </td>
                      <td className="py-3 px-3 text-right text-[#131722]">{stk.volume}</td>
                      <td className="py-3 px-3 text-right text-[#787b86]">{stk.pe}x</td>
                      <td className="py-3 px-3 text-right font-bold text-[#089981]">{stk.yield}</td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStock(stk);
                            setShowAveragingModal(true);
                          }}
                          className="bg-[#131722] hover:bg-[#2962ff] text-white px-2.5 py-1 rounded text-[10px] font-bold transition font-num"
                        >
                          Average
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. COMMUNITY IDEAS (Exact TradingView Community Ideas Grid) */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black text-[#131722] flex items-center gap-2">
                Community ideas <span className="text-[#787b86] text-xl font-normal">›</span>
              </h2>
              <p className="text-xs text-[#787b86]">Chart analysis, Breakouts & Swing Setups by Top Pakistani CMT Analysts</p>
            </div>
            <span className="text-xs text-[#2962ff] font-bold cursor-pointer hover:underline">See all ideas ›</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {COMMUNITY_IDEAS.map((idea) => (
              <div
                key={idea.id}
                className="bg-white border border-[#e0e3eb] rounded-2xl overflow-hidden shadow-sm hover:border-[#2962ff] transition flex flex-col justify-between"
              >
                <div>
                  {/* Chart Thumbnail */}
                  <div className="h-40 w-full overflow-hidden bg-[#f0f3fa] relative">
                    <img src={idea.image} alt={idea.title} className="w-full h-full object-cover hover:scale-105 transition duration-300" />
                    <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold font-num text-[#131722] border border-[#e0e3eb]">
                      {idea.symbol} • {idea.type}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <img src={idea.avatar} alt={idea.author} className="w-6 h-6 rounded-full object-cover border border-[#e0e3eb]" />
                      <span className="text-xs font-bold text-[#131722] truncate">{idea.author}</span>
                      <span className="text-[10px] text-[#787b86] font-num">• {idea.time}</span>
                    </div>

                    <h3 className="text-xs font-extrabold text-[#131722] leading-snug line-clamp-2">
                      {idea.title}
                    </h3>

                    <p className="text-[11px] text-[#787b86] line-clamp-2">
                      {idea.desc}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-[#f0f3fa] flex justify-between items-center text-xs text-[#787b86] font-num">
                  <span className="font-bold text-[#089981]">Target: {idea.target}</span>
                  <div className="flex items-center gap-3">
                    <span>❤️ {idea.likes}</span>
                    <span>💬 {idea.comments}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. SUPPORTED PAKISTANI BROKERS (Trading & Brokers Integration) */}
        <div className="bg-white border border-[#e0e3eb] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-[#f0f3fa] pb-3">
            <div>
              <h2 className="text-xl font-black text-[#131722]">Trading & brokers in Pakistan</h2>
              <p className="text-xs text-[#787b86]">Direct execution verified brokers for Pakistan Stock Exchange</p>
            </div>
            <span className="text-xs text-[#2962ff] font-bold cursor-pointer hover:underline">All brokers ›</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { name: 'KTrade Securities', rating: '4.8 ★★★★★', tag: 'Fast Execution' },
              { name: 'Finqalab', rating: '4.7 ★★★★★', tag: 'Mobile First' },
              { name: 'Arif Habib Ltd', rating: '4.9 ★★★★★', tag: 'Institutional' },
              { name: 'AKD Securities', rating: '4.6 ★★★★☆', tag: 'Research Alpha' },
              { name: 'BMA Capital', rating: '4.7 ★★★★★', tag: 'Corporate' },
              { name: 'JS Global', rating: '4.8 ★★★★★', tag: 'Direct Market' },
            ].map((br) => (
              <div key={br.name} className="p-3.5 rounded-xl border border-[#e0e3eb] bg-[#f8fafd] hover:bg-white transition text-center space-y-1">
                <span className="font-black text-xs text-[#131722] block">{br.name}</span>
                <span className="text-[10px] text-[#089981] font-bold block">{br.rating}</span>
                <span className="text-[9px] text-[#787b86] bg-white border border-[#e0e3eb] px-1.5 py-0.5 rounded inline-block font-medium">
                  {br.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 7. DEDICATED SMART COST-AVERAGING MODAL / DOCK (Aapka Main Client Feature) */}
      {showAveragingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#e0e3eb] shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center border-b border-[#f0f3fa] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#089981] text-white flex items-center justify-center font-black text-sm">
                  ⚡
                </div>
                <div>
                  <h3 className="text-base font-black text-[#131722]">Smart Cost-Averaging Desk</h3>
                  <p className="text-xs text-[#787b86]">Live PSX Price Average Down Calculator</p>
                </div>
              </div>
              <button
                onClick={() => setShowAveragingModal(false)}
                className="w-8 h-8 rounded-full bg-[#f0f3fa] hover:bg-[#e0e3eb] text-sm font-bold flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            {/* Selected Asset Header */}
            <div className="bg-[#f8fafd] border border-[#e0e3eb] p-3 rounded-xl flex justify-between items-center font-num">
              <div>
                <span className="text-xs font-bold text-[#131722]">{selectedStock.symbol} — {selectedStock.name}</span>
                <span className="text-[10px] text-[#787b86] block">PSX Market Execution</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#787b86] block">Current Live Price</span>
                <span className="text-base font-black text-[#089981]">PKR {selectedStock.price.toFixed(2)}</span>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-3">
              <div>
                <span className="text-xs font-bold text-[#131722] block uppercase tracking-wide">1. Existing Holding</span>
                <div className="grid grid-cols-2 gap-3 mt-1 font-num">
                  <div>
                    <label className="text-[10px] text-[#787b86]">Shares Count</label>
                    <input
                      type="number"
                      value={holdingQty}
                      onChange={(e) => setHoldingQty(e.target.value)}
                      className="w-full bg-[#f8fafd] border border-[#e0e3eb] rounded-lg p-2 text-xs font-bold text-[#131722] outline-none focus:border-[#2962ff]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#787b86]">Avg Purchase Price (PKR)</label>
                    <input
                      type="number"
                      value={holdingPrice}
                      onChange={(e) => setHoldingPrice(e.target.value)}
                      className="w-full bg-[#f8fafd] border border-[#e0e3eb] rounded-lg p-2 text-xs font-bold text-[#131722] outline-none focus:border-[#2962ff]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-[#131722] block uppercase tracking-wide">2. Planned Order</span>
                <div className="grid grid-cols-2 gap-2 mt-1 bg-[#f0f3fa] p-1 rounded-lg text-xs font-bold">
                  <button
                    onClick={() => setOrderType('market')}
                    className={`py-1.5 rounded transition ${orderType === 'market' ? 'bg-white text-[#131722] shadow-sm' : 'text-[#787b86]'}`}
                  >
                    ⚡ Market (PKR {selectedStock.price.toFixed(2)})
                  </button>
                  <button
                    onClick={() => setOrderType('limit')}
                    className={`py-1.5 rounded transition ${orderType === 'limit' ? 'bg-white text-[#131722] shadow-sm' : 'text-[#787b86]'}`}
                  >
                    🎯 Limit Bid
                  </button>
                </div>
              </div>

              {orderType === 'limit' && (
                <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-lg font-num">
                  <label className="text-[10px] font-bold text-amber-800 uppercase block">Your Limit Target Price (PKR)</label>
                  <input
                    type="number"
                    value={limitBid}
                    onChange={(e) => setLimitBid(e.target.value)}
                    className="w-full bg-white border border-amber-300 rounded p-1.5 mt-0.5 text-xs font-bold text-[#131722] outline-none"
                  />
                </div>
              )}

              <div className="font-num">
                <span className="text-xs font-bold text-[#131722] block uppercase tracking-wide">3. New Shares to Buy</span>
                <input
                  type="number"
                  value={orderShares}
                  onChange={(e) => setOrderShares(e.target.value)}
                  className="w-full bg-[#f8fafd] border border-[#e0e3eb] rounded-lg p-2 mt-1 text-xs font-bold text-[#131722] outline-none focus:border-[#2962ff]"
                />
              </div>

              <div className="flex items-center justify-between bg-[#f8fafd] p-2.5 rounded-lg border border-[#e0e3eb]">
                <div>
                  <span className="text-xs font-bold text-[#131722] block">Include PSX Charges (+0.18%)</span>
                  <span className="text-[10px] text-[#787b86]">CDC, SECP, CVT & Broker Commission</span>
                </div>
                <input
                  type="checkbox"
                  checked={includeFees}
                  onChange={(e) => setIncludeFees(e.target.checked)}
                  className="w-4 h-4 accent-[#089981] cursor-pointer"
                />
              </div>
            </div>

            {/* Output Calculation Result */}
            <div className="bg-[#f0f3fa] border border-[#e0e3eb] rounded-xl p-4 space-y-2 text-xs font-num">
              <div className="flex justify-between text-[#787b86]">
                <span>Total Capital Required:</span>
                <span className="font-bold text-[#131722]">PKR {capitalReq.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-[#787b86]">
                <span>Total Portfolio Shares:</span>
                <span className="font-bold text-[#131722]">{finalQty} shares</span>
              </div>

              <div className="bg-white border border-[#089981]/40 p-4 rounded-xl text-center mt-3 shadow-sm">
                <span className="text-[10px] font-black uppercase text-[#089981] tracking-wider block">Projected New Average Price</span>
                <div className="text-3xl font-black text-[#131722] mt-1">
                  PKR {newAvg.toFixed(2)}
                </div>
                {ePrice > 0 && nQty > 0 && (
                  <span className={`text-xs font-bold block mt-1.5 ${deltaAvg < 0 ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                    {deltaAvg < 0 ? `📉 Averaged Down by PKR ${Math.abs(deltaAvg).toFixed(2)} / share` : `📈 Averaged Up by PKR ${deltaAvg.toFixed(2)} / share`}
                  </span>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 8. SLOGAN & INSTITUTIONAL FOOTER (Exact TradingView "LOOK FIRST / THEN LEAP") */}
      <footer className="border-t border-[#e0e3eb] bg-[#f8fafd] pt-12 pb-16 px-6 mt-16 space-y-12">
        <div className="max-w-[1600px] mx-auto text-center space-y-3">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-[#131722]">
            LOOK FIRST / THEN LEAP.
          </h2>
          <p className="text-sm font-semibold text-[#787b86]">
            پہلے جانیے، پھر لگائیے۔ Pakistan Stock Exchange Smart Analytics & Averaging Suite.
          </p>
        </div>

        <div className="max-w-[1600px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-xs text-[#787b86]">
          <div className="space-y-2">
            <span className="font-bold text-[#131722] block uppercase text-[11px]">Markets</span>
            <span className="block hover:text-[#131722] cursor-pointer">KSE-100 Benchmark</span>
            <span className="block hover:text-[#131722] cursor-pointer">KMI-30 Shariah Islamic</span>
            <span className="block hover:text-[#131722] cursor-pointer">Pakistani Rupee Forex</span>
            <span className="block hover:text-[#131722] cursor-pointer">Sona / Chandi Bullion</span>
          </div>
          <div className="space-y-2">
            <span className="font-bold text-[#131722] block uppercase text-[11px]">Products</span>
            <span className="block hover:text-[#131722] cursor-pointer">Smart Averaging Desk</span>
            <span className="block hover:text-[#131722] cursor-pointer">Lightweight Charts Engine</span>
            <span className="block hover:text-[#131722] cursor-pointer">PSX Screener 50+</span>
            <span className="block hover:text-[#131722] cursor-pointer">Volume Profile</span>
          </div>
          <div className="space-y-2">
            <span className="font-bold text-[#131722] block uppercase text-[11px]">Community</span>
            <span className="block hover:text-[#131722] cursor-pointer">Certified CMT Analysts</span>
            <span className="block hover:text-[#131722] cursor-pointer">Trade Setups & Targets</span>
            <span className="block hover:text-[#131722] cursor-pointer">Brokerage Sentiment</span>
            <span className="block hover:text-[#131722] cursor-pointer">Educational Guides</span>
          </div>
          <div className="space-y-2">
            <span className="font-bold text-[#131722] block uppercase text-[11px]">Integrations</span>
            <span className="block hover:text-[#131722] cursor-pointer">KTrade & Finqalab APIs</span>
            <span className="block hover:text-[#131722] cursor-pointer">State Bank of Pakistan Data</span>
            <span className="block hover:text-[#131722] cursor-pointer">Sarafa Bullion Association</span>
            <span className="block hover:text-[#131722] cursor-pointer">SECP Compliance Feed</span>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto border-t border-[#e0e3eb] pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-[#787b86] font-num">
          <span>© 2026 NafaX Terminal. Built custom for Pakistan financial markets.</span>
          <span>Data Feed: Pakistan Stock Exchange DPS Portal • Delayed & Intraday</span>
        </div>
      </footer>

    </div>
  );
}
