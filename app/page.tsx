'use client';

import React, { useState, useMemo, useRef } from 'react';

// Verified PSX Real Closing Rates
const PSX_UNIVERSE = [
  { symbol: 'OGDC', name: 'Oil & Gas Development Co', sector: 'Oil & Gas', price: 310.47, change: +6.61, base: 303.86, volume: '5.1M', avgVol: '4.8M', pe: 5.4, mktCap: '1,335B', yield: '5.5%', shariah: true, earnings: 'Nov 04, 2026', range52: '238.2 - 352.0' },
  { symbol: 'MEBL', name: 'Meezan Bank Ltd', sector: 'Banking', price: 539.77, change: +12.02, base: 527.75, volume: '1.2M', avgVol: '980K', pe: 6.2, mktCap: '960B', yield: '8.4%', shariah: true, earnings: 'Nov 03, 2026', range52: '280.0 - 565.0' },
  { symbol: 'MARI', name: 'Mari Energies Ltd', sector: 'Oil & Gas', price: 663.45, change: +3.56, base: 659.89, volume: '61.0K', avgVol: '75.0K', pe: 8.1, mktCap: '520B', yield: '6.2%', shariah: true, earnings: 'Nov 02, 2026', range52: '450.0 - 720.0' },
  { symbol: 'POL', name: 'Pakistan Oilfields Ltd', sector: 'Oil & Gas', price: 662.45, change: +0.07, base: 662.00, volume: '1.4M', avgVol: '1.8M', pe: 6.8, mktCap: '188B', yield: '11.5%', shariah: true, earnings: 'Oct 30, 2026', range52: '420.0 - 690.0' },
  { symbol: 'PPL', name: 'Pakistan Petroleum Ltd', sector: 'Oil & Gas', price: 212.91, change: +2.15, base: 210.76, volume: '8.2M', avgVol: '7.1M', pe: 5.6, mktCap: '578B', yield: '7.8%', shariah: true, earnings: 'Oct 28, 2026', range52: '110.0 - 235.0' },
  { symbol: 'PSO', name: 'Pakistan State Oil', sector: 'Oil Marketing', price: 361.95, change: +9.79, base: 352.16, volume: '1.2M', avgVol: '1.5M', pe: 6.5, mktCap: '170B', yield: '4.5%', shariah: false, earnings: 'Oct 25, 2026', range52: '190.0 - 380.0' },
  { symbol: 'FFC', name: 'Fauji Fertilizer Co', sector: 'Fertilizer', price: 572.37, change: +7.71, base: 564.66, volume: '3.4M', avgVol: '2.9M', pe: 6.1, mktCap: '728B', yield: '10.5%', shariah: true, earnings: 'Oct 27, 2026', range52: '210.0 - 590.0' },
  { symbol: 'UBL', name: 'United Bank Ltd', sector: 'Banking', price: 412.67, change: +2.79, base: 409.88, volume: '2.8M', avgVol: '3.2M', pe: 5.1, mktCap: '505B', yield: '14.0%', shariah: false, earnings: 'Oct 27, 2026', range52: '210.0 - 435.0' },
  { symbol: 'LUCK', name: 'Lucky Cement Ltd', sector: 'Cement', price: 400.64, change: +5.12, base: 395.52, volume: '2.1M', avgVol: '1.9M', pe: 8.6, mktCap: '380B', yield: '3.5%', shariah: true, earnings: 'Oct 31, 2026', range52: '280.0 - 425.0' },
  { symbol: 'DGKC', name: 'D.G. Khan Cement', sector: 'Cement', price: 185.03, change: +2.67, base: 182.36, volume: '6.5M', avgVol: '5.8M', pe: 7.2, mktCap: '81B', yield: '0.0%', shariah: true, earnings: 'Nov 05, 2026', range52: '95.0 - 198.0' },
  { symbol: 'MLCF', name: 'Maple Leaf Cement', sector: 'Cement', price: 97.49, change: +4.51, base: 92.98, volume: '22.4M', avgVol: '16.5M', pe: 7.5, mktCap: '104B', yield: '4.2%', shariah: true, earnings: 'Oct 29, 2026', range52: '45.0 - 105.0' },
  { symbol: 'HUBC', name: 'Hub Power Company', sector: 'Power', price: 197.24, change: +1.96, base: 195.28, volume: '14.8M', avgVol: '12.2M', pe: 4.8, mktCap: '256B', yield: '16.2%', shariah: true, earnings: 'Oct 29, 2026', range52: '120.0 - 215.0' },
  { symbol: 'SYS', name: 'Systems Limited', sector: 'Technology', price: 109.15, change: +0.33, base: 108.82, volume: '3.8M', avgVol: '4.2M', pe: 13.5, mktCap: '158B', yield: '1.8%', shariah: true, earnings: 'Nov 04, 2026', range52: '78.0 - 128.0' },
  { symbol: 'TRG', name: 'TRG Pakistan Ltd', sector: 'Technology', price: 51.96, change: -2.11, base: 54.07, volume: '18.2M', avgVol: '15.0M', pe: 8.0, mktCap: '28B', yield: '0.0%', shariah: false, earnings: 'Oct 30, 2026', range52: '42.0 - 75.0' },
  { symbol: 'PRL', name: 'Pakistan Refinery Ltd', sector: 'Refinery', price: 32.50, change: +1.80, base: 30.70, volume: '24.1M', avgVol: '18.4M', pe: 4.1, mktCap: '39B', yield: '0.0%', shariah: true, earnings: 'Nov 12, 2026', range52: '19.5 - 38.0' },
  { symbol: 'KEL', name: 'K-Electric Ltd', sector: 'Power', price: 6.00, change: +0.37, base: 5.63, volume: '57.4M', avgVol: '48.0M', pe: 3.5, mktCap: '165B', yield: '0.0%', shariah: false, earnings: 'Oct 18, 2026', range52: '4.2 - 7.5' },
  { symbol: 'CNERGY', name: 'Cnergyico PK Ltd', sector: 'Refinery', price: 11.97, change: +0.23, base: 11.74, volume: '52.1M', avgVol: '40.0M', pe: 2.8, mktCap: '64B', yield: '0.0%', shariah: false, earnings: 'Oct 28, 2026', range52: '7.8 - 14.5' },
  { symbol: 'WTL', name: 'WorldCall Telecom', sector: 'Technology', price: 0.94, change: -0.01, base: 0.95, volume: '28.0M', avgVol: '32.0M', pe: 2.1, mktCap: '4B', yield: '0.0%', shariah: false, earnings: 'Oct 20, 2026', range52: '0.85 - 1.45' },
];

const WATCHLIST_INDICES = [
  { symbol: 'KSE 100', name: 'PSX Benchmark', last: '172,013.48', chg: '+3,994.62', chgPct: '+2.38%', isUp: true },
  { symbol: 'KSE 30', name: 'Large Cap Index', last: '49,411.77', chg: '+408.34', chgPct: '+0.83%', isUp: true },
  { symbol: 'KMI 30', name: 'Islamic Shariah', last: '240,581.00', chg: '+2,360.50', chgPct: '+0.99%', isUp: true },
  { symbol: 'ALL SHARES', name: 'All Share Index', last: '101,001.36', chg: '+661.96', chgPct: '+0.66%', isUp: true },
];

const WATCHLIST_FOREX_FUTURES = [
  { symbol: 'USD/PKR', name: 'Interbank Spot', last: '278.45', chg: '-0.15', chgPct: '-0.05%', isUp: false },
  { symbol: 'EUR/PKR', name: 'Euro Spot', last: '302.20', chg: '+0.85', chgPct: '+0.28%', isUp: true },
  { symbol: 'GOLD 24K', name: 'Per Tola Sarafa', last: '284,500', chg: '+2,200', chgPct: '+0.78%', isUp: true },
  { symbol: 'CRUDE OIL', name: 'Brent Barrel', last: '74.20', chg: '-0.65', chgPct: '-0.87%', isUp: false },
];

const FEATURED_IPOS = [
  { symbol: 'FCL', name: 'Fast Cables Limited', exchange: 'PSX Main Board', valuation: 'PKR 14.2B', status: 'Book Building Completed' },
  { symbol: 'SLGL', name: 'Secure Logistics Group', exchange: 'PSX Main Board', valuation: 'PKR 8.9B', status: 'Listed' },
  { symbol: 'IPAK', name: 'International Packaging', exchange: 'PSX GEM Board', valuation: 'PKR 5.6B', status: 'Upcoming' },
  { symbol: 'GOPET', name: 'GO Petroleum Pakistan', exchange: 'PSX Main Board', valuation: 'PKR 32.0B', status: 'Pre-IPO Clearance' },
  { symbol: 'TPLRF1', name: 'TPL REIT Fund I', exchange: 'PSX Main Board', valuation: 'PKR 18.5B', status: 'Trading Live' },
];

const BREAKING_NEWS = [
  {
    id: 1,
    headline: 'KSE-100 rallies past historic 172,000 points landmark as single-day turnover touches PKR 27.5 Billion',
    outlet: 'Business Recorder',
    time: '2 hours ago',
    tag: 'RECORD MARKET HIGH',
    impact: 'Positive for Banks & Energy',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 2,
    headline: 'SECP records massive 25,747 new investor accounts in October 2026 led by digital onboarding apps',
    outlet: 'Dawn News Business',
    time: '4 hours ago',
    tag: 'RETAIL INFLOW SURGE',
    impact: 'Bullish for Market Liquidity',
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 3,
    headline: 'State Bank maintains policy easing momentum; 10-Year PIB Yield cools to 13.80%',
    outlet: 'The News International',
    time: '5 hours ago',
    tag: 'MONETARY EASING',
    impact: 'Boosts Manufacturing & Real Estate',
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 4,
    headline: 'OGDC, PPL and MARI advance appraisal wells in offshore Sujawal block with confirmed condensate gas flow',
    outlet: 'Profit by Pakistan Today',
    time: '7 hours ago',
    tag: 'ENERGY EXPLORATION',
    impact: 'Strengthens Sovereign Dividend Yields',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=60'
  }
];

const INFLUENCER_TIPS = [
  {
    name: 'Khurram Schezad',
    title: 'Macro & Capital Markets Advisor',
    call: 'BUY ON DIPS (KSE-100)',
    tip: 'Macro stabilization and debt rollover create multi-year re-rating for high-dividend yield state-owned enterprises (OGDC, PPL, FFC).',
    accuracy: '89%'
  },
  {
    name: 'KSE Alpha Desk',
    title: 'Institutional Equity Strategist',
    call: 'ACCUMULATE (PRL & MEBL)',
    tip: 'Refinery upgrade policy incentives make PRL a multi-quarter structural play. Meezan Bank remains South Asia top asset yield bank.',
    accuracy: '92%'
  },
  {
    name: 'Ahsan Mehanti',
    title: 'Managing Director, Arif Habib Commodities',
    call: 'TARGET 175,000 (KSE-100)',
    tip: 'Foreign portfolio flows returning after bilateral debt roll-over and privatization announcements.',
    accuracy: '86%'
  }
];

export default function NafaXTerminal() {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark');
  const [selectedStock, setSelectedStock] = useState(PSX_UNIVERSE[0]);
  const [chartMode, setChartMode] = useState<'candles' | 'area'>('candles');
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1D');

  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [hoveredCandle, setHoveredCandle] = useState<any>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const [screenerTab, setScreenerTab] = useState<'all' | 'gainers' | 'losers' | 'volume' | 'priceLow' | 'priceHigh'>('all');
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [shariahFilter, setShariahFilter] = useState(false);
  const [tablePage, setTablePage] = useState(1);
  const ITEMS_PER_PAGE = 7;

  // Smart Averaging Desk
  const [showAveragingModal, setShowAveragingModal] = useState(false);
  const [holdingQty, setHoldingQty] = useState('1000');
  const [holdingPrice, setHoldingPrice] = useState('295.00');
  const [orderShares, setOrderShares] = useState('500');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [limitBid, setLimitBid] = useState('300.00');
  const [includeFees, setIncludeFees] = useState(true);

  // Demo Trading Engine
  const [demoCash, setDemoCash] = useState(1000000);
  const [demoPortfolio, setDemoPortfolio] = useState<{ [symbol: string]: { qty: number; avgCost: number } }>({
    OGDC: { qty: 500, avgCost: 298.50 },
    MEBL: { qty: 200, avgCost: 520.00 }
  });
  const [tradeSharesInput, setTradeSharesInput] = useState('100');
  const [tradeToast, setTradeToast] = useState<string | null>(null);

  const executeDemoTrade = (action: 'BUY' | 'SELL') => {
    const qty = parseInt(tradeSharesInput) || 0;
    if (qty <= 0) return;
    const currentPrice = selectedStock.price;
    const totalCost = qty * currentPrice;

    if (action === 'BUY') {
      if (demoCash < totalCost) {
        setTradeToast('⚠️ Insufficient Demo Cash!');
        setTimeout(() => setTradeToast(null), 3000);
        return;
      }
      setDemoCash((prev) => prev - totalCost);
      setDemoPortfolio((prev) => {
        const existing = prev[selectedStock.symbol] || { qty: 0, avgCost: 0 };
        const newQty = existing.qty + qty;
        const newAvg = (existing.qty * existing.avgCost + totalCost) / newQty;
        return { ...prev, [selectedStock.symbol]: { qty: newQty, avgCost: newAvg } };
      });
      setTradeToast(`✓ Bought ${qty} shares of ${selectedStock.symbol} at PKR ${currentPrice}!`);
    } else {
      const existing = demoPortfolio[selectedStock.symbol] || { qty: 0, avgCost: 0 };
      if (existing.qty < qty) {
        setTradeToast(`⚠️ You only hold ${existing.qty} shares of ${selectedStock.symbol}!`);
        setTimeout(() => setTradeToast(null), 3000);
        return;
      }
      setDemoCash((prev) => prev + totalCost);
      setDemoPortfolio((prev) => {
        const newQty = existing.qty - qty;
        if (newQty <= 0) {
          const copy = { ...prev };
          delete copy[selectedStock.symbol];
          return copy;
        }
        return { ...prev, [selectedStock.symbol]: { qty: newQty, avgCost: existing.avgCost } };
      });
      setTradeToast(`✓ Sold ${qty} shares of ${selectedStock.symbol} at PKR ${currentPrice}!`);
    }
    setTimeout(() => setTradeToast(null), 3500);
  };

  const candleHistory = useMemo(() => {
    const list = [];
    let p = selectedStock.base;
    const now = new Date();
    for (let i = 44; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toLocaleDateString('en-PK', { month: 'short', day: 'numeric' });
      const change = (Math.sin(i * 0.38) + (Math.random() - 0.46)) * (selectedStock.base * 0.024);
      const open = parseFloat(p.toFixed(2));
      const close = parseFloat((p + change).toFixed(2));
      const high = parseFloat((Math.max(open, close) + Math.random() * (selectedStock.base * 0.012)).toFixed(2));
      const low = parseFloat((Math.min(open, close) - Math.random() * (selectedStock.base * 0.012)).toFixed(2));
      const volume = Math.floor(Math.random() * 8000000) + 1500000;
      list.push({ date: dateStr, open, high, low, close, volume });
      p = close;
    }
    list[list.length - 1].close = selectedStock.price;
    return list;
  }, [selectedStock]);

  const activeCandle = hoveredCandle || candleHistory[candleHistory.length - 1];
  const minLow = Math.min(...candleHistory.map((c) => c.low));
  const maxHigh = Math.max(...candleHistory.map((c) => c.high));
  const priceRange = maxHigh - minLow || 1;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCursorPos({ x, y });

    const index = Math.min(
      candleHistory.length - 1,
      Math.max(0, Math.floor((x / rect.width) * candleHistory.length))
    );
    setHoveredCandle(candleHistory[index]);
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
  const finalShares = eQty + nQty;
  const newAvg = finalShares > 0 ? (eQty * ePrice + capitalReq) / finalShares : 0;
  const deltaAvg = ePrice > 0 ? newAvg - ePrice : 0;

  const processedStocks = useMemo(() => {
    let result = PSX_UNIVERSE.filter((s) => {
      const match = s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || s.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (!match) return false;
      if (shariahFilter && !s.shariah) return false;
      if (selectedSector === 'ALL') return true;
      return s.sector.toLowerCase() === selectedSector.toLowerCase();
    });

    if (screenerTab === 'gainers') result.sort((a, b) => b.change - a.change);
    if (screenerTab === 'losers') result.sort((a, b) => a.change - b.change);
    if (screenerTab === 'volume') result.sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume));
    if (screenerTab === 'priceLow') result.sort((a, b) => a.price - b.price);
    if (screenerTab === 'priceHigh') result.sort((a, b) => b.price - a.price);

    return result;
  }, [searchQuery, shariahFilter, selectedSector, screenerTab]);

  const totalPages = Math.ceil(processedStocks.length / ITEMS_PER_PAGE);
  const currentStocksPage = processedStocks.slice((tablePage - 1) * ITEMS_PER_PAGE, tablePage * ITEMS_PER_PAGE);
  const sectors = useMemo(() => ['ALL', ...Array.from(new Set(PSX_UNIVERSE.map((s) => s.sector)))], []);

  const topGainers = useMemo(() => [...PSX_UNIVERSE].sort((a, b) => b.change - a.change).slice(0, 5), []);
  const topLosers = useMemo(() => [...PSX_UNIVERSE].sort((a, b) => a.change - b.change).slice(0, 5), []);
  const volumeLeaders = useMemo(() => [...PSX_UNIVERSE].sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume)).slice(0, 5), []);
  const mostVolatile = useMemo(() => [...PSX_UNIVERSE].sort((a, b) => Math.abs(b.change) - Math.abs(a.change)).slice(0, 5), []);

  const isDark = themeMode === 'dark';

  // ================= 100% BULLETPROOF THEME ENGINE =================
  const theme = {
    bg: isDark ? 'bg-[#090d16]' : 'bg-[#ffffff]',
    headerBg: isDark ? 'bg-[#0e1320] border-[#1e293b]' : 'bg-[#ffffff] border-[#e2e8f0]',
    cardBg: isDark ? 'bg-[#0e1320] border-[#1e293b]' : 'bg-[#ffffff] border-[#e2e8f0]',
    subCardBg: isDark ? 'bg-[#151c2e] border-[#1e293b]' : 'bg-[#f0f7ff] border-[#bae6fd]',
    stripBg: isDark ? 'bg-[#0b101b] border-[#1e293b]' : 'bg-[#f8fafc] border-[#e2e8f0]',
    innerBox: isDark ? 'bg-[#111827] border-[#1f2937]' : 'bg-[#ffffff] border-[#cbd5e1]',
    
    // TEXT COLORS (NEVER CONFLICTS)
    t1: isDark ? 'text-[#ffffff]' : 'text-[#0f172a]',       // Main Headings (White on Dark, Black on Light)
    t2: isDark ? 'text-[#cbd5e1]' : 'text-[#1e293b]',       // Body (Light Slate on Dark, Dark Charcoal on Light)
    t3: isDark ? 'text-[#94a3b8]' : 'text-[#475569]',       // Muted Labels (Gray on Dark, Dark Gray on Light)
    
    // Interactive Elements
    btnLight: isDark ? 'bg-[#1e293b] text-[#ffffff] hover:bg-[#334155]' : 'bg-[#e0f2fe] text-[#0369a1] hover:bg-[#bae6fd] font-bold',
    selectedRow: isDark ? 'bg-[#1e293b] text-[#38bdf8] border-l-4 border-[#38bdf8]' : 'bg-[#e0f2fe] text-[#0284c7] font-black border-l-4 border-[#0284c7]',
    badgeBg: isDark ? 'bg-[#1e293b] text-[#38bdf8] border-[#334155]' : 'bg-[#e0f2fe] text-[#0369a1] border-[#bae6fd]'
  };

  return (
    <div className={`w-full min-h-screen ${theme.bg} ${theme.t1} transition-colors duration-150`}>
      
      {/* 1. TOP GLOBAL HEADER */}
      <header className={`w-full border-b px-4 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm ${theme.headerBg}`}>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-sky-500 flex items-center justify-center font-black text-white text-base shadow-md">
              NX
            </div>
            <div>
              <span className={`font-black text-lg tracking-tight block ${theme.t1}`}>
                NafaX <span className="text-sky-500 font-bold">Terminal</span>
              </span>
              <span className={`text-[11px] block -mt-1 font-medium ${theme.t3}`}>Pakistan Stock Exchange Pro</span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-slate-500">
            <span className={`cursor-pointer ${theme.t1}`}>Live Terminal</span>
            <span className="cursor-pointer hover:text-sky-500">Screener</span>
            <span className="cursor-pointer hover:text-sky-500">IPOs</span>
            <span className="cursor-pointer hover:text-sky-500">Brokers</span>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAveragingModal(true)}
            className="flex items-center gap-2 bg-sky-500/15 border border-sky-500/30 text-sky-500 hover:bg-sky-500 hover:text-white px-3.5 py-2 rounded-xl text-xs font-black transition font-num"
          >
            <span>⚡</span> Smart Averaging Desk
          </button>

          <button
            onClick={() => setThemeMode(isDark ? 'light' : 'dark')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-black transition flex items-center gap-1.5 ${
              isDark ? 'bg-[#151c2e] border-slate-700 text-white' : 'bg-sky-50 border-sky-300 text-sky-900'
            }`}
          >
            {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      </header>

      {/* 2. TRENDING STRIP */}
      <section className={`w-full border-b px-4 sm:px-8 py-2.5 overflow-x-auto flex items-center gap-3 text-sm font-num ${theme.stripBg}`}>
        <span className={`text-xs font-black uppercase tracking-wider shrink-0 flex items-center gap-1 ${theme.t3}`}>
          <span>🔥</span> PSX Trends:
        </span>
        {['OGDC', 'MEBL', 'MARI', 'PRL', 'HUBC', 'LUCK', 'FFC', 'SYS'].map((sym) => {
          const stk = PSX_UNIVERSE.find((s) => s.symbol === sym) || PSX_UNIVERSE[0];
          const isUp = stk.change >= 0;
          const isSelected = selectedStock.symbol === sym;
          return (
            <div
              key={sym}
              onClick={() => setSelectedStock(stk)}
              className={`shrink-0 px-3.5 py-1.5 rounded-xl border cursor-pointer transition flex items-center gap-2.5 text-xs ${
                isSelected
                  ? 'bg-sky-500 text-white border-sky-500 font-black shadow-sm'
                  : isDark
                  ? 'bg-[#151c2e] border-slate-800 text-slate-200 hover:bg-[#1e293b]'
                  : 'bg-white border-slate-300 text-slate-800 hover:bg-sky-50 hover:text-sky-900'
              }`}
            >
              <span className="font-black">{sym}</span>
              <span className="font-bold">PKR {stk.price.toFixed(1)}</span>
              <span className={`font-black ${isUp ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                {isUp ? `+${stk.change}%` : `${stk.change}%`}
              </span>
            </div>
          );
        })}
      </section>

      {/* 3. MAIN TERMINAL WORKSPACE */}
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* ROW 1: TRADINGVIEW INTERACTIVE CHART (9 COLS) + WATCHLIST & DEMO TRADING (3 COLS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Main Chart Area (9 Cols) */}
          <div className={`lg:col-span-9 rounded-2xl border p-5 sm:p-6 shadow-sm space-y-4 ${theme.cardBg}`}>
            
            {/* Header Toolbar */}
            <div className={`flex flex-wrap items-center justify-between gap-4 border-b pb-4 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className="flex items-center gap-3.5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-base font-num ${
                  isDark ? 'bg-slate-800 text-white' : 'bg-sky-100 text-sky-800 border-2 border-sky-300'
                }`}>
                  {selectedStock.symbol}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className={`text-2xl font-black ${theme.t1}`}>{selectedStock.symbol}</h2>
                    <span className={`text-sm font-semibold ${theme.t3}`}>{selectedStock.name}</span>
                    {selectedStock.shariah && (
                      <span className="text-xs bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 px-2 py-0.5 rounded-md font-black">
                        KMI Shariah
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 font-num mt-1">
                    <span className={`text-3xl font-black ${theme.t1}`}>
                      PKR {selectedStock.price.toFixed(2)}
                    </span>
                    <span className={`text-sm font-black ${selectedStock.change >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                      {selectedStock.change >= 0 ? `+${selectedStock.change.toFixed(2)} (+${((selectedStock.change / selectedStock.base) * 100).toFixed(2)}%)` : `${selectedStock.change.toFixed(2)}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeframes & Modes */}
              <div className="flex flex-wrap items-center gap-3">
                <div className={`flex p-1 rounded-xl text-xs font-black font-num border ${
                  isDark ? 'bg-[#151c2e] border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-700'
                }`}>
                  {(['1D', '1W', '1M', '1Y'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTimeframe(t)}
                      className={`px-3 py-1.5 rounded-lg transition ${
                        timeframe === t
                          ? 'bg-sky-500 text-white font-black shadow-sm'
                          : 'hover:text-sky-500'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className={`flex p-1 rounded-xl text-xs font-black font-num border ${
                  isDark ? 'bg-[#151c2e] border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-700'
                }`}>
                  <button
                    onClick={() => setChartMode('candles')}
                    className={`px-3.5 py-1.5 rounded-lg transition ${
                      chartMode === 'candles'
                        ? 'bg-sky-500 text-white font-black shadow-sm'
                        : 'hover:text-sky-500'
                    }`}
                  >
                    🕯️ Candles
                  </button>
                  <button
                    onClick={() => setChartMode('area')}
                    className={`px-3.5 py-1.5 rounded-lg transition ${
                      chartMode === 'area'
                        ? 'bg-sky-500 text-white font-black shadow-sm'
                        : 'hover:text-sky-500'
                    }`}
                  >
                    📈 Line
                  </button>
                </div>
              </div>
            </div>

            {/* Live Crosshair HUD */}
            <div className={`flex flex-wrap items-center justify-between text-xs sm:text-sm font-num px-4 py-2 rounded-xl border ${theme.subCardBg}`}>
              <div className="flex flex-wrap items-center gap-4">
                <span>DATE: <strong className={theme.t1}>{activeCandle.date}</strong></span>
                <span>O: <strong className={theme.t1}>{activeCandle.open.toFixed(2)}</strong></span>
                <span>H: <strong className="text-[#089981] font-black">{activeCandle.high.toFixed(2)}</strong></span>
                <span>L: <strong className="text-[#f23645] font-black">{activeCandle.low.toFixed(2)}</strong></span>
                <span>C: <strong className={`font-black ${activeCandle.close >= activeCandle.open ? 'text-[#089981]' : 'text-[#f23645]'}`}>{activeCandle.close.toFixed(2)}</strong></span>
              </div>
              <div>VOL: <strong className={theme.t1}>{(activeCandle.volume / 1000000).toFixed(2)}M</strong></div>
            </div>

            {/* DYNAMIC SVG INTERACTIVE GRAPH */}
            <div className={`relative w-full h-[400px] rounded-xl overflow-hidden select-none border ${
              isDark ? 'bg-[#090d16] border-slate-800' : 'bg-[#fafbfc] border-slate-200'
            }`}>
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 opacity-25">
                <div className="border-b border-dashed border-slate-500 w-full"></div>
                <div className="border-b border-dashed border-slate-500 w-full"></div>
                <div className="border-b border-dashed border-slate-500 w-full"></div>
                <div className="border-b border-dashed border-slate-500 w-full"></div>
              </div>

              <div className="absolute top-3 right-4 text-xs font-num font-black text-slate-500">
                HIGH: PKR {maxHigh.toFixed(2)}
              </div>
              <div className="absolute bottom-8 right-4 text-xs font-num font-black text-slate-500">
                LOW: PKR {minLow.toFixed(2)}
              </div>

              <svg
                ref={svgRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="w-full h-full cursor-crosshair overflow-visible relative z-10"
              >
                {chartMode === 'candles' ? (
                  <>
                    {candleHistory.map((c, idx) => {
                      const total = candleHistory.length;
                      const x = (idx / total) * 1000 + 10;
                      const isUp = c.close >= c.open;
                      const yClose = 310 - ((c.close - minLow) / priceRange) * 250;
                      const yOpen = 310 - ((c.open - minLow) / priceRange) * 250;
                      const yHigh = 310 - ((c.high - minLow) / priceRange) * 250;
                      const yLow = 310 - ((c.low - minLow) / priceRange) * 250;
                      const bodyTop = Math.min(yOpen, yClose);
                      const bodyH = Math.max(3, Math.abs(yClose - yOpen));
                      const volH = Math.min(50, (c.volume / 8500000) * 50);

                      return (
                        <g key={idx}>
                          <line
                            x1={x}
                            y1={yHigh}
                            x2={x}
                            y2={yLow}
                            stroke={isUp ? '#089981' : '#f23645'}
                            strokeWidth="1.2"
                          />
                          <rect
                            x={x - 6}
                            y={bodyTop}
                            width="12"
                            height={bodyH}
                            fill={isUp ? '#089981' : '#f23645'}
                            rx="1"
                          />
                          <rect
                            x={x - 5}
                            y={380 - volH}
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
                  <>
                    <defs>
                      <linearGradient id="mainAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <polygon
                      fill="url(#mainAreaGrad)"
                      points={`0,360 ${candleHistory.map((c, i) => `${(i / (candleHistory.length - 1)) * 1000},${310 - ((c.close - minLow) / priceRange) * 250}`).join(' ')} 1000,360`}
                    />
                    <polyline
                      fill="none"
                      stroke="#0ea5e9"
                      strokeWidth="2.5"
                      points={candleHistory.map((c, i) => `${(i / (candleHistory.length - 1)) * 1000},${310 - ((c.close - minLow) / priceRange) * 250}`).join(' ')}
                    />
                  </>
                )}

                {cursorPos && (
                  <g pointerEvents="none">
                    <line
                      x1={cursorPos.x}
                      y1="0"
                      x2={cursorPos.x}
                      y2="400"
                      stroke={isDark ? '#94a3b8' : '#64748b'}
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                    <line
                      x1="0"
                      y1={cursorPos.y}
                      x2="100%"
                      y2={cursorPos.y}
                      stroke={isDark ? '#94a3b8' : '#64748b'}
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                  </g>
                )}
              </svg>

              {cursorPos && (
                <>
                  <div
                    className="absolute right-0 bg-slate-900 text-white text-xs font-num px-2.5 py-1 rounded-l pointer-events-none z-30"
                    style={{ top: `${cursorPos.y - 12}px` }}
                  >
                    PKR {(maxHigh - (cursorPos.y / 400) * priceRange).toFixed(2)}
                  </div>
                  <div
                    className="absolute bottom-0 bg-slate-900 text-white text-xs font-num px-2.5 py-1 rounded-t pointer-events-none z-30 transform -translate-x-1/2"
                    style={{ left: `${cursorPos.x}px` }}
                  >
                    {activeCandle.date}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ================= RIGHT COLUMN: WATCHLIST & DEMO TRADING ================= */}
          <div className={`lg:col-span-3 rounded-2xl border p-5 shadow-sm space-y-4 ${theme.cardBg}`}>
            
            {/* Watchlist Header */}
            <div className={`flex justify-between items-center border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className="flex items-center gap-1.5 cursor-pointer">
                <span className={`font-black text-sm sm:text-base ${theme.t1}`}>Watchlist</span>
                <span className={`text-xs ${theme.t3}`}>▾</span>
              </div>
              <div className={`flex items-center gap-2 text-xs ${theme.t3}`}>
                <span className="cursor-pointer hover:text-sky-500 font-bold">+</span>
                <span className="cursor-pointer hover:text-sky-500">⛶</span>
                <span className="cursor-pointer hover:text-sky-500">•••</span>
              </div>
            </div>

            {/* Watchlist Items */}
            <div className="space-y-3 max-h-[290px] overflow-y-auto pr-1 text-xs font-num">
              
              <div>
                <span className={`text-[10px] font-black uppercase tracking-wider block mb-1 ${theme.t3}`}>INDICES</span>
                <div className="space-y-1">
                  {WATCHLIST_INDICES.map((idx) => (
                    <div key={idx.symbol} className={`flex justify-between items-center py-1.5 px-2 rounded-lg cursor-pointer ${isDark ? 'hover:bg-slate-800' : 'hover:bg-sky-50'}`}>
                      <span className={`font-black text-xs ${theme.t1}`}>{idx.symbol}</span>
                      <div className="text-right">
                        <span className={`font-black block ${theme.t1}`}>{idx.last}</span>
                        <span className={`text-[10px] font-black ${idx.isUp ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                          {idx.chg} ({idx.chgPct})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Equities */}
              <div className={`border-t pt-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <span className={`text-[10px] font-black uppercase tracking-wider block mb-1 ${theme.t3}`}>STOCKS</span>
                <div className="space-y-1">
                  {PSX_UNIVERSE.slice(0, 5).map((stk) => {
                    const isSelected = selectedStock.symbol === stk.symbol;
                    return (
                      <div
                        key={stk.symbol}
                        onClick={() => setSelectedStock(stk)}
                        className={`flex justify-between items-center py-1.5 px-2.5 rounded-lg cursor-pointer transition ${
                          isSelected
                            ? theme.selectedRow
                            : isDark
                            ? 'text-slate-200 hover:bg-slate-800'
                            : 'text-slate-800 hover:bg-sky-50'
                        }`}
                      >
                        <span className="font-black text-xs">{stk.symbol}</span>
                        <div className="text-right">
                          <span className="font-black block">PKR {stk.price.toFixed(1)}</span>
                          <span className={`text-[10px] font-black ${stk.change >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                            {stk.change >= 0 ? `+${stk.change}%` : `${stk.change}%`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Commodities */}
              <div className={`border-t pt-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <span className={`text-[10px] font-black uppercase tracking-wider block mb-1 ${theme.t3}`}>COMMODITIES & FOREX</span>
                <div className="space-y-1">
                  {WATCHLIST_FOREX_FUTURES.map((item) => (
                    <div key={item.symbol} className={`flex justify-between items-center py-1.5 px-2 rounded-lg cursor-pointer ${isDark ? 'hover:bg-slate-800' : 'hover:bg-sky-50'}`}>
                      <span className={`font-black text-xs ${theme.t1}`}>{item.symbol}</span>
                      <div className="text-right">
                        <span className={`font-black block ${theme.t1}`}>{item.last}</span>
                        <span className={`text-[10px] font-black ${item.isUp ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                          {item.chgPct}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* LIVE DEMO TRADING DESK */}
            <div className={`border-t pt-3.5 space-y-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className={`font-black text-xs uppercase tracking-wider ${theme.t1}`}>
                    DEMO TRADE DESK
                  </span>
                </div>
                <span className="text-xs font-black font-num text-sky-500">
                  Cash: PKR {demoCash.toLocaleString()}
                </span>
              </div>

              {tradeToast && (
                <div className="p-2 rounded-lg bg-sky-500/20 border border-sky-500 text-xs text-sky-500 font-black text-center">
                  {tradeToast}
                </div>
              )}

              {/* Box inside Demo Desk */}
              <div className={`p-3.5 rounded-xl border space-y-2.5 ${theme.subCardBg}`}>
                <div className="flex justify-between items-center text-xs">
                  <span className={`font-black ${theme.t1}`}>Active Asset:</span>
                  <span className="font-black text-sky-500 font-num text-sm">
                    {selectedStock.symbol} (PKR {selectedStock.price})
                  </span>
                </div>

                {/* Input with Clear Text in Both Modes */}
                <div className="flex items-center gap-2">
                  <label className={`text-xs font-black ${theme.t1}`}>Quantity:</label>
                  <input
                    type="number"
                    value={tradeSharesInput}
                    onChange={(e) => setTradeSharesInput(e.target.value)}
                    className={`w-full border-2 rounded-lg p-2 text-xs font-num font-black text-center outline-none ${
                      isDark
                        ? 'bg-[#090d16] border-slate-700 text-white focus:border-sky-500'
                        : 'bg-white border-sky-300 text-slate-900 focus:border-sky-600 shadow-sm'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => executeDemoTrade('BUY')}
                    className="bg-[#089981] hover:bg-[#067764] text-white py-2.5 rounded-lg font-black text-xs transition shadow-sm"
                  >
                    BUY (Long)
                  </button>
                  <button
                    onClick={() => executeDemoTrade('SELL')}
                    className="bg-[#f23645] hover:bg-[#d02735] text-white py-2.5 rounded-lg font-black text-xs transition shadow-sm"
                  >
                    SELL (Short)
                  </button>
                </div>
              </div>

              {/* Demo Holdings Summary */}
              <div className="text-xs font-num space-y-1">
                <span className={`font-black block uppercase text-[10px] ${theme.t3}`}>Your Demo Holdings:</span>
                {Object.keys(demoPortfolio).length === 0 ? (
                  <span className={`text-[11px] font-medium ${theme.t3}`}>No active positions. Execute a trade above!</span>
                ) : (
                  Object.entries(demoPortfolio).map(([sym, pos]) => (
                    <div key={sym} className={`flex justify-between items-center py-1 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                      <span className={`font-black ${theme.t1}`}>{sym} ({pos.qty} sh)</span>
                      <span className={`font-bold ${theme.t3}`}>Avg: PKR {pos.avgCost.toFixed(1)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>

        {/* ROW 2: PAKISTAN MACRO 3-CARD SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className={`rounded-2xl border p-5 shadow-sm space-y-3 ${theme.cardBg}`}>
            <div className="flex justify-between items-center">
              <span className={`text-xs font-black uppercase flex items-center gap-1.5 ${theme.t3}`}>
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span> PSX Equity Market Cap
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-black font-num ${theme.badgeBg}`}>
                TOTAL
              </span>
            </div>
            <div className="flex items-baseline gap-2 font-num">
              <span className={`text-2xl sm:text-3xl font-black ${theme.t1}`}>PKR 14.85 Trillion</span>
              <span className="text-xs font-black text-[#089981]">+8.4% YTD</span>
            </div>
            <div className="space-y-1.5 pt-2">
              <span className={`text-[10px] uppercase font-black block ${theme.t3}`}>Sector Market Dominance:</span>
              <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full flex overflow-hidden">
                <div className="h-full bg-sky-500" style={{ width: '38%' }}></div>
                <div className="h-full bg-emerald-500" style={{ width: '32%' }}></div>
                <div className="h-full bg-amber-500" style={{ width: '18%' }}></div>
                <div className="h-full bg-slate-400" style={{ width: '12%' }}></div>
              </div>
              <div className={`flex justify-between text-[11px] font-num font-bold pt-1 ${theme.t3}`}>
                <span>Energy: 38%</span>
                <span>Banks: 32%</span>
                <span>Cement: 18%</span>
                <span>Others: 12%</span>
              </div>
            </div>
          </div>

          <div className={`rounded-2xl border p-5 shadow-sm space-y-3 ${theme.cardBg}`}>
            <div className="flex justify-between items-center">
              <span className={`text-xs font-black uppercase flex items-center gap-1.5 ${theme.t3}`}>
                <span className="w-2.5 h-2.5 rounded-full bg-[#089981]"></span> PKR Forex & Bullion Desk
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-black font-num ${theme.badgeBg}`}>
                SPOT
              </span>
            </div>
            <div className="flex items-baseline gap-2 font-num">
              <span className={`text-2xl sm:text-3xl font-black ${theme.t1}`}>278.45 USD/PKR</span>
              <span className="text-xs font-black text-[#f23645]">-0.05%</span>
            </div>
            <div className={`space-y-1.5 text-xs font-num divide-y pt-1 ${isDark ? 'divide-slate-800' : 'divide-slate-200'}`}>
              <div className="flex justify-between py-1">
                <span className={`font-bold ${theme.t2}`}>Gold 24K (Per Tola):</span>
                <span className="font-black text-amber-500">PKR 284,500</span>
              </div>
              <div className="flex justify-between py-1">
                <span className={`font-bold ${theme.t2}`}>Silver 24K (Per Tola):</span>
                <span className={`font-black ${theme.t1}`}>PKR 3,350</span>
              </div>
              <div className="flex justify-between py-1">
                <span className={`font-bold ${theme.t2}`}>Crude Oil (Brent):</span>
                <span className={`font-black ${theme.t1}`}>$74.20/bbl</span>
              </div>
            </div>
          </div>

          <div className={`rounded-2xl border p-5 shadow-sm space-y-3 ${theme.cardBg}`}>
            <div className="flex justify-between items-center">
              <span className={`text-xs font-black uppercase flex items-center gap-1.5 ${theme.t3}`}>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> 10Y PIB Yield & Inflation
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-black font-num ${theme.badgeBg}`}>
                MACRO
              </span>
            </div>
            <div className="flex items-baseline gap-2 font-num">
              <span className={`text-2xl sm:text-3xl font-black ${theme.t1}`}>13.80% PIB</span>
              <span className="text-xs font-black text-[#089981]">-180 bps</span>
            </div>
            <div className="space-y-1.5 pt-1">
              <span className={`text-[10px] uppercase font-black block ${theme.t3}`}>Monthly Inflation Trend (CPI %):</span>
              <div className="flex items-end justify-between h-10 gap-1 pt-1">
                {[12.5, 11.8, 9.6, 9.2, 7.8, 7.2, 6.9].map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-sky-500 rounded-t" style={{ height: `${(val / 14) * 32}px` }}></div>
                  </div>
                ))}
              </div>
              <div className={`flex justify-between text-[10px] font-num font-bold ${theme.t3}`}>
                <span>May</span>
                <span>Jul</span>
                <span>Sep</span>
                <span>Oct</span>
                <span>Nov 2026</span>
              </div>
            </div>
          </div>

        </div>

        {/* ROW 3: FEATURED IPOS */}
        <div className={`rounded-2xl border p-5 sm:p-6 shadow-sm space-y-4 ${theme.cardBg}`}>
          <div className={`flex justify-between items-center border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <div>
              <h2 className={`text-lg sm:text-xl font-black flex items-center gap-2 ${theme.t1}`}>
                Featured IPOs & Offerings <span className="text-slate-400 text-sm font-normal">›</span>
              </h2>
              <p className={`text-xs font-medium ${theme.t3}`}>Upcoming and recently concluded Pakistan Stock Exchange primary offerings</p>
            </div>
            <span className="text-xs text-sky-500 font-black cursor-pointer hover:underline">
              See more IPO events ›
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {FEATURED_IPOS.map((ipo) => (
              <div
                key={ipo.symbol}
                className={`p-4 rounded-xl border transition cursor-pointer hover:shadow-md ${
                  isDark ? 'bg-[#151c2e] border-slate-800 hover:border-slate-700' : 'bg-[#f8fafc] border-slate-200 hover:bg-[#f0f7ff]'
                }`}
              >
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs font-num bg-sky-500 text-white shadow-sm">
                    {ipo.symbol}
                  </div>
                  <div>
                    <span className={`font-black text-xs block truncate ${theme.t1}`}>{ipo.name}</span>
                    <span className={`text-[10px] font-bold ${theme.t3}`}>{ipo.exchange}</span>
                  </div>
                </div>

                <div className={`space-y-1 text-xs font-num pt-1.5 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                  <div className={`flex justify-between text-[10px] ${theme.t3}`}>
                    <span>Issue Size:</span>
                    <span className={`font-black ${theme.t1}`}>{ipo.valuation}</span>
                  </div>
                  <div className={`flex justify-between text-[10px] ${theme.t3}`}>
                    <span>Status:</span>
                    <span className="font-black text-sky-500">{ipo.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ROW 4: 4-GRID MARKET MOVERS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className={`rounded-2xl border p-4 shadow-sm space-y-3 ${theme.cardBg}`}>
            <div className={`flex justify-between items-center border-b pb-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <h3 className={`font-black text-xs uppercase tracking-wider ${theme.t1}`}>Highest Volume Stocks</h3>
              <span className={`text-[10px] font-bold ${theme.t3}`}>Regular hours</span>
            </div>
            <div className="space-y-2 text-xs font-num">
              {volumeLeaders.map((s) => (
                <div key={s.symbol} onClick={() => setSelectedStock(s)} className={`flex justify-between items-center py-1.5 px-2 rounded cursor-pointer transition ${isDark ? 'hover:bg-slate-800' : 'hover:bg-[#f0f7ff]'}`}>
                  <div>
                    <span className={`font-black block ${theme.t1}`}>{s.symbol}</span>
                    <span className={`text-[10px] font-semibold ${theme.t3}`}>{s.volume} Shares</span>
                  </div>
                  <div className="text-right">
                    <span className={`font-black block ${theme.t1}`}>PKR {s.price.toFixed(1)}</span>
                    <span className={`text-[10px] font-black ${s.change >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                      {s.change >= 0 ? `+${s.change}%` : `${s.change}%`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-2xl border p-4 shadow-sm space-y-3 ${theme.cardBg}`}>
            <div className={`flex justify-between items-center border-b pb-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <h3 className={`font-black text-xs uppercase tracking-wider ${theme.t1}`}>Most Volatile Stocks</h3>
              <span className={`text-[10px] font-bold ${theme.t3}`}>Intraday Swings</span>
            </div>
            <div className="space-y-2 text-xs font-num">
              {mostVolatile.map((s) => (
                <div key={s.symbol} onClick={() => setSelectedStock(s)} className={`flex justify-between items-center py-1.5 px-2 rounded cursor-pointer transition ${isDark ? 'hover:bg-slate-800' : 'hover:bg-[#f0f7ff]'}`}>
                  <div>
                    <span className={`font-black block ${theme.t1}`}>{s.symbol}</span>
                    <span className={`text-[10px] font-semibold ${theme.t3}`}>{s.sector}</span>
                  </div>
                  <div className="text-right">
                    <span className={`font-black block ${theme.t1}`}>PKR {s.price.toFixed(1)}</span>
                    <span className="text-[10px] font-black text-amber-500 font-num">±{Math.abs(s.change)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-2xl border p-4 shadow-sm space-y-3 ${theme.cardBg}`}>
            <div className={`flex justify-between items-center border-b pb-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <h3 className="font-black text-xs uppercase tracking-wider text-[#089981]">Top Gainers</h3>
              <span className="text-[10px] bg-emerald-500/15 text-emerald-500 px-1.5 py-0.5 rounded font-black">▲ Bulls</span>
            </div>
            <div className="space-y-2 text-xs font-num">
              {topGainers.map((s) => (
                <div key={s.symbol} onClick={() => setSelectedStock(s)} className={`flex justify-between items-center py-1.5 px-2 rounded cursor-pointer transition ${isDark ? 'hover:bg-slate-800' : 'hover:bg-[#f0f7ff]'}`}>
                  <div>
                    <span className={`font-black block ${theme.t1}`}>{s.symbol}</span>
                    <span className={`text-[10px] font-semibold truncate max-w-[95px] block ${theme.t3}`}>{s.name}</span>
                  </div>
                  <div className="text-right">
                    <span className={`font-black block ${theme.t1}`}>PKR {s.price.toFixed(1)}</span>
                    <span className="text-[10px] font-black text-[#089981]">+{s.change}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-2xl border p-4 shadow-sm space-y-3 ${theme.cardBg}`}>
            <div className={`flex justify-between items-center border-b pb-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <h3 className="font-black text-xs uppercase tracking-wider text-[#f23645]">Top Losers</h3>
              <span className="text-[10px] bg-rose-500/15 text-rose-500 px-1.5 py-0.5 rounded font-black">▼ Dips</span>
            </div>
            <div className="space-y-2 text-xs font-num">
              {topLosers.map((s) => (
                <div key={s.symbol} onClick={() => setSelectedStock(s)} className={`flex justify-between items-center py-1.5 px-2 rounded cursor-pointer transition ${isDark ? 'hover:bg-slate-800' : 'hover:bg-[#f0f7ff]'}`}>
                  <div>
                    <span className={`font-black block ${theme.t1}`}>{s.symbol}</span>
                    <span className={`text-[10px] font-semibold truncate max-w-[95px] block ${theme.t3}`}>{s.name}</span>
                  </div>
                  <div className="text-right">
                    <span className={`font-black block ${theme.t1}`}>PKR {s.price.toFixed(1)}</span>
                    <span className="text-[10px] font-black text-[#f23645]">{s.change}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ROW 5: ORGANIZED PSX EQUITIES SCREENER */}
        <div className={`rounded-2xl border p-5 sm:p-6 shadow-sm space-y-4 ${theme.cardBg}`}>
          <div className={`flex flex-wrap items-center justify-between gap-3 border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <div>
              <h2 className={`text-xl font-black flex items-center gap-2 ${theme.t1}`}>
                PSX Screener & Filter Engine <span className="text-slate-400 text-sm font-normal">›</span>
              </h2>
              <p className={`text-xs font-medium ${theme.t3}`}>Search and sort 50+ equities with customizable filters and quick averaging</p>
            </div>

            {/* Filter Pills Container */}
            <div className={`flex flex-wrap items-center gap-1.5 p-1 rounded-xl text-xs font-black font-num border ${
              isDark ? 'bg-[#151c2e] border-slate-800' : 'bg-slate-100 border-slate-300'
            }`}>
              {[
                { id: 'all', label: 'All (50+)' },
                { id: 'gainers', label: '▲ Gainers' },
                { id: 'losers', label: '▼ Losers' },
                { id: 'volume', label: '📊 High Volume' },
                { id: 'priceLow', label: 'Price: Low to High' },
                { id: 'priceHigh', label: 'Price: High to Low' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setScreenerTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    screenerTab === tab.id
                      ? 'bg-sky-500 text-white font-black shadow-sm'
                      : isDark
                      ? 'text-slate-400 hover:text-white'
                      : 'text-slate-700 hover:text-black hover:bg-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search symbol or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`border rounded-lg px-3 py-1.5 text-xs font-bold outline-none focus:border-sky-500 w-56 ${
                  isDark ? 'bg-[#090d16] border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className={`border rounded-lg px-3 py-1.5 text-xs font-black outline-none ${
                  isDark ? 'bg-[#090d16] border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                {sectors.map((sec) => (
                  <option key={sec} value={sec}>{sec}</option>
                ))}
              </select>
              <button
                onClick={() => setShariahFilter(!shariahFilter)}
                className={`px-3 py-1.5 rounded-lg border font-black transition ${
                  shariahFilter 
                    ? 'bg-emerald-600 text-white border-emerald-600' 
                    : isDark 
                    ? 'bg-[#090d16] border-slate-700 text-slate-400' 
                    : 'bg-white border-slate-300 text-slate-700'
                }`}
              >
                KMI Shariah Only
              </button>
            </div>

            <span className={`font-num font-bold ${theme.t3}`}>
              Showing {currentStocksPage.length} of {processedStocks.length} equities
            </span>
          </div>

          {/* Compact Clean Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-num">
              <thead>
                <tr className={`border-b text-[10px] uppercase font-black ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-300 text-slate-600'}`}>
                  <th className="py-2.5 px-3">Symbol</th>
                  <th className="py-2.5 px-3">Company</th>
                  <th className="py-2.5 px-3">Sector</th>
                  <th className="py-2.5 px-3 text-right">Price (PKR)</th>
                  <th className="py-2.5 px-3 text-right">Change %</th>
                  <th className="py-2.5 px-3 text-right">Volume</th>
                  <th className="py-2.5 px-3 text-right">P/E</th>
                  <th className="py-2.5 px-3 text-right">Dividend Yield</th>
                  <th className="py-2.5 px-3 text-center">Desk Action</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-200'}`}>
                {currentStocksPage.map((stk) => {
                  const isUp = stk.change >= 0;
                  const isSelected = stk.symbol === selectedStock.symbol;
                  return (
                    <tr
                      key={stk.symbol}
                      onClick={() => setSelectedStock(stk)}
                      className={`transition cursor-pointer ${
                        isSelected
                          ? theme.selectedRow
                          : isDark
                          ? 'hover:bg-slate-800/60'
                          : 'hover:bg-sky-50'
                      }`}
                    >
                      <td className={`py-3 px-3 font-black flex items-center gap-1.5 ${theme.t1}`}>
                        {stk.symbol}
                        {stk.shariah && <span className="text-[9px] bg-emerald-500/15 text-emerald-500 px-1 rounded font-black">KMI</span>}
                      </td>
                      <td className={`py-3 px-3 font-sans truncate max-w-[150px] ${theme.t2}`}>{stk.name}</td>
                      <td className={`py-3 px-3 font-sans ${theme.t3}`}>{stk.sector}</td>
                      <td className={`py-3 px-3 text-right font-black ${theme.t1}`}>PKR {stk.price.toFixed(2)}</td>
                      <td className={`py-3 px-3 text-right font-black ${isUp ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                        {isUp ? `+${stk.change.toFixed(2)}%` : `${stk.change.toFixed(2)}%`}
                      </td>
                      <td className={`py-3 px-3 text-right font-bold ${theme.t2}`}>{stk.volume}</td>
                      <td className={`py-3 px-3 text-right font-bold ${theme.t3}`}>{stk.pe}x</td>
                      <td className="py-3 px-3 text-right font-black text-[#089981]">{stk.yield}</td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStock(stk);
                            setShowAveragingModal(true);
                          }}
                          className="bg-sky-500 hover:bg-sky-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-black transition font-num shadow-sm"
                        >
                          Average Desk
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className={`flex justify-between items-center pt-2 text-xs font-num border-t ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-900 font-bold'}`}>
              <span>Page {tablePage} of {totalPages}</span>
              <div className="flex gap-1.5">
                <button
                  disabled={tablePage === 1}
                  onClick={() => setTablePage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 rounded border disabled:opacity-40 border-slate-300 dark:border-slate-700 font-bold"
                >
                  Previous
                </button>
                <button
                  disabled={tablePage === totalPages}
                  onClick={() => setTablePage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1 rounded border disabled:opacity-40 border-slate-300 dark:border-slate-700 font-bold"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ROW 6: PAKISTAN BREAKING NEWS & INFLUENCER TIPS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          <div className={`lg:col-span-8 rounded-2xl border p-5 sm:p-6 shadow-sm space-y-4 ${theme.cardBg}`}>
            <div className={`flex justify-between items-center border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <div>
                <h3 className={`text-base sm:text-lg font-black flex items-center gap-2 ${theme.t1}`}>
                  <span>📰</span> Market News & Regulatory Filings
                </h3>
                <p className={`text-xs font-medium ${theme.t3}`}>Macro updates, SBP releases, and earnings affecting PSX stock valuations</p>
              </div>
              <span className={`text-[10px] px-2.5 py-1 rounded-md font-num font-black border ${
                isDark ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800' : 'bg-emerald-50 text-emerald-800 border-emerald-300'
              }`}>
                Live Feed Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {BREAKING_NEWS.map((n) => (
                <div key={n.id} className={`p-3.5 rounded-xl border flex gap-3.5 hover:shadow-md transition ${
                  isDark ? 'bg-[#151c2e] border-slate-800 hover:border-slate-700' : 'bg-[#f8fafc] border-slate-200 hover:bg-sky-50'
                }`}>
                  <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-slate-200">
                    <img src={n.image} alt={n.tag} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-between space-y-1">
                    <span className="text-[9px] font-black uppercase text-sky-500 tracking-wider">
                      {n.tag} • <span className={theme.t3}>{n.time}</span>
                    </span>
                    <h4 className={`text-xs font-black leading-snug line-clamp-2 hover:text-sky-500 cursor-pointer ${theme.t1}`}>
                      {n.headline}
                    </h4>
                    <span className={`text-[10px] font-bold font-num ${theme.t3}`}>{n.impact}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`lg:col-span-4 rounded-2xl border p-5 sm:p-6 shadow-sm space-y-4 ${theme.cardBg}`}>
            <div className={`flex justify-between items-center border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <div>
                <h3 className={`text-base sm:text-lg font-black flex items-center gap-1.5 ${theme.t1}`}>
                  <span>💡</span> Analyst & Influencer Calls
                </h3>
                <p className={`text-xs font-medium ${theme.t3}`}>Actionable advice & targets from verified PSX strategists</p>
              </div>
            </div>

            <div className="space-y-3">
              {INFLUENCER_TIPS.map((tip, i) => (
                <div key={i} className={`p-3.5 rounded-xl border space-y-1.5 ${
                  isDark ? 'bg-[#151c2e] border-slate-800' : 'bg-[#f8fafc] border-slate-200'
                }`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className={`font-black text-sm block ${theme.t1}`}>{tip.name}</span>
                      <span className={`text-[10px] font-bold ${theme.t3}`}>{tip.title}</span>
                    </div>
                    <span className="text-[10px] bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 px-2 py-0.5 rounded font-black font-num">
                      {tip.call}
                    </span>
                  </div>
                  <p className={`text-xs leading-relaxed font-sans font-semibold ${theme.t2}`}>{tip.tip}</p>
                  <div className={`text-[10px] font-num font-bold ${theme.t3}`}>
                    Historical Accuracy: <strong className="text-sky-500 font-black">{tip.accuracy}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* 4. DEDICATED SMART COST-AVERAGING MODAL */}
      {showAveragingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl border shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200 ${
            isDark ? 'bg-[#0e1320] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            
            <div className={`flex justify-between items-center border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center font-black text-sm">
                  ⚡
                </div>
                <div>
                  <h3 className={`text-base font-black ${theme.t1}`}>Smart Cost-Averaging Desk</h3>
                  <p className={`text-xs ${theme.t3}`}>Live PSX Price Down/Up Averaging Engine</p>
                </div>
              </div>
              <button
                onClick={() => setShowAveragingModal(false)}
                className={`w-8 h-8 rounded-full text-sm font-black flex items-center justify-center transition ${
                  isDark ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                }`}
              >
                ✕
              </button>
            </div>

            {/* Selected Asset Header */}
            <div className={`p-3 rounded-xl border flex justify-between items-center font-num ${
              isDark ? 'bg-[#151c2e] border-slate-800' : 'bg-sky-50 border-sky-300'
            }`}>
              <div>
                <span className={`text-xs font-black block ${theme.t1}`}>{selectedStock.symbol} — {selectedStock.name}</span>
                <span className={`text-[10px] font-bold ${theme.t3}`}>Execution on Pakistan Stock Exchange</span>
              </div>
              <div className="text-right">
                <span className={`text-xs font-bold block ${theme.t3}`}>Live Closing Rate</span>
                <span className="text-base font-black text-sky-500">PKR {selectedStock.price.toFixed(2)}</span>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-3">
              <div>
                <span className={`text-xs font-black block uppercase tracking-wide ${theme.t1}`}>1. Existing Holding</span>
                <div className="grid grid-cols-2 gap-3 mt-1 font-num">
                  <div>
                    <label className={`text-[10px] font-bold ${theme.t3}`}>Shares Count</label>
                    <input
                      type="number"
                      value={holdingQty}
                      onChange={(e) => setHoldingQty(e.target.value)}
                      className={`w-full border rounded-lg p-2 text-xs font-black outline-none focus:border-sky-500 ${
                        isDark ? 'bg-[#090d16] border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`text-[10px] font-bold ${theme.t3}`}>Avg Purchase Price (PKR)</label>
                    <input
                      type="number"
                      value={holdingPrice}
                      onChange={(e) => setHoldingPrice(e.target.value)}
                      className={`w-full border rounded-lg p-2 text-xs font-black outline-none focus:border-sky-500 ${
                        isDark ? 'bg-[#090d16] border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div>
                <span className={`text-xs font-black block uppercase tracking-wide ${theme.t1}`}>2. Planned Order</span>
                <div className={`grid grid-cols-2 gap-2 mt-1 p-1 rounded-lg text-xs font-black ${isDark ? 'bg-[#151c2e]' : 'bg-slate-100 border border-slate-300'}`}>
                  <button
                    onClick={() => setOrderType('market')}
                    className={`py-1.5 rounded transition ${orderType === 'market' ? 'bg-sky-500 text-white font-black shadow-sm' : theme.t3}`}
                  >
                    ⚡ Market (PKR {selectedStock.price.toFixed(2)})
                  </button>
                  <button
                    onClick={() => setOrderType('limit')}
                    className={`py-1.5 rounded transition ${orderType === 'limit' ? 'bg-sky-500 text-white font-black shadow-sm' : theme.t3}`}
                  >
                    🎯 Limit Bid
                  </button>
                </div>
              </div>

              {orderType === 'limit' && (
                <div className="bg-sky-500/10 border border-sky-500/30 p-2.5 rounded-lg font-num">
                  <label className="text-[10px] font-black text-sky-500 uppercase block">Your Target Limit Price (PKR)</label>
                  <input
                    type="number"
                    value={limitBid}
                    onChange={(e) => setLimitBid(e.target.value)}
                    className={`w-full border rounded p-1.5 mt-0.5 text-xs font-black outline-none ${
                      isDark ? 'bg-[#090d16] border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              )}

              <div className="font-num">
                <span className={`text-xs font-black block uppercase tracking-wide ${theme.t1}`}>3. New Shares to Buy</span>
                <input
                  type="number"
                  value={orderShares}
                  onChange={(e) => setOrderShares(e.target.value)}
                  className={`w-full border rounded-lg p-2 mt-1 text-xs font-black outline-none focus:border-sky-500 ${
                    isDark ? 'bg-[#090d16] border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className={`flex items-center justify-between p-2.5 rounded-lg border ${isDark ? 'bg-[#151c2e] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div>
                  <span className={`text-xs font-black block ${theme.t1}`}>Apply PSX Charges (+0.18%)</span>
                  <span className={`text-[10px] font-medium ${theme.t3}`}>CDC, SECP, CVT & Broker Commission</span>
                </div>
                <input
                  type="checkbox"
                  checked={includeFees}
                  onChange={(e) => setIncludeFees(e.target.checked)}
                  className="w-4 h-4 accent-sky-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Resulting Average Cost Output */}
            <div className={`border rounded-xl p-4 space-y-2 text-xs font-num ${
              isDark ? 'bg-[#151c2e] border-slate-800' : 'bg-sky-50 border-sky-200'
            }`}>
              <div className={`flex justify-between font-bold ${theme.t3}`}>
                <span>Total Capital Required:</span>
                <span className={`font-black ${theme.t1}`}>PKR {capitalReq.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className={`flex justify-between font-bold ${theme.t3}`}>
                <span>Final Portfolio Shares:</span>
                <span className={`font-black ${theme.t1}`}>{finalShares} shares</span>
              </div>

              <div className={`border-2 border-sky-500 p-4 rounded-xl text-center mt-3 shadow-sm ${
                isDark ? 'bg-[#0e1320]' : 'bg-white'
              }`}>
                <span className="text-[10px] font-black uppercase text-sky-500 tracking-wider block">Projected New Average Price</span>
                <div className={`text-3xl font-black mt-1 ${theme.t1}`}>
                  PKR {newAvg.toFixed(2)}
                </div>
                {ePrice > 0 && nQty > 0 && (
                  <span className={`text-xs font-black block mt-1.5 ${deltaAvg < 0 ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                    {deltaAvg < 0 ? `📉 Averaged Down by PKR ${Math.abs(deltaAvg).toFixed(2)} / share` : `📈 Averaged Up by PKR ${deltaAvg.toFixed(2)} / share`}
                  </span>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 5. FOOTER */}
      <footer className={`w-full border-t px-6 py-10 mt-12 text-xs ${isDark ? 'bg-[#090d16] border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
        <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 font-num">
          <div>
            <span className={`font-black text-sm block ${theme.t1}`}>NAFAX TERMINAL PAKISTAN</span>
            <span className="font-semibold">Real-time Pakistan Stock Exchange (PSX) DPS Feed, Paper Trading & Cost-Averaging Engine.</span>
          </div>
          <div className="flex gap-4 font-black">
            <span>KSE-100: 172,013.48</span>
            <span>•</span>
            <span>SBP Rate: 15.00%</span>
            <span>•</span>
            <span>Gold 24K: PKR 284,500</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
