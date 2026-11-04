'use client';

import React, { useState, useMemo, useRef } from 'react';

// Comprehensive PSX 50+ Stock Directory
const PSX_UNIVERSE = [
  // Oil & Gas Exploration & Refineries
  { symbol: 'OGDC', name: 'Oil & Gas Development Co', sector: 'Oil & Gas', price: 174.50, change: +3.85, base: 170.0, volume: '18.4M', avgVol: '14.2M', pe: 4.8, mktCap: '750B', yield: '9.2%', shariah: true, earnings: 'Nov 08, 2026', range52: '110.0 - 182.5' },
  { symbol: 'PPL', name: 'Pakistan Petroleum Ltd', sector: 'Oil & Gas', price: 126.20, change: +2.15, base: 123.0, volume: '11.2M', avgVol: '9.1M', pe: 5.2, mktCap: '343B', yield: '8.4%', shariah: true, earnings: 'Oct 28, 2026', range52: '82.0 - 134.0' },
  { symbol: 'MARI', name: 'Mari Energies Ltd', sector: 'Oil & Gas', price: 2840.00, change: +4.10, base: 2780.0, volume: '1.2M', avgVol: '850K', pe: 7.9, mktCap: '422B', yield: '6.1%', shariah: true, earnings: 'Nov 02, 2026', range52: '1680.0 - 2950.0' },
  { symbol: 'POL', name: 'Pakistan Oilfields Ltd', sector: 'Oil & Gas', price: 485.00, change: +1.40, base: 478.0, volume: '2.4M', avgVol: '1.9M', pe: 6.2, mktCap: '138B', yield: '14.5%', shariah: true, earnings: 'Oct 30, 2026', range52: '380.0 - 510.0' },
  { symbol: 'PSO', name: 'Pakistan State Oil', sector: 'Oil Marketing', price: 218.30, change: -1.75, base: 221.0, volume: '4.8M', avgVol: '5.2M', pe: 6.1, mktCap: '102B', yield: '4.8%', shariah: false, earnings: 'Oct 25, 2026', range52: '150.0 - 238.0' },
  { symbol: 'PRL', name: 'Pakistan Refinery Ltd', sector: 'Refinery', price: 30.15, change: +5.30, base: 28.5, volume: '28.9M', avgVol: '20.1M', pe: 3.9, mktCap: '36B', yield: '0.0%', shariah: true, earnings: 'Nov 12, 2026', range52: '18.2 - 34.5' },
  { symbol: 'ATRL', name: 'Attock Refinery Ltd', sector: 'Refinery', price: 395.00, change: +2.60, base: 385.0, volume: '3.6M', avgVol: '2.8M', pe: 4.1, mktCap: '42B', yield: '7.8%', shariah: true, earnings: 'Oct 29, 2026', range52: '290.0 - 425.0' },

  // Commercial Banks
  { symbol: 'MEBL', name: 'Meezan Bank Ltd', sector: 'Banking', price: 236.00, change: +1.95, base: 231.0, volume: '6.8M', avgVol: '5.4M', pe: 5.6, mktCap: '412B', yield: '11.8%', shariah: true, earnings: 'Nov 03, 2026', range52: '142.0 - 248.0' },
  { symbol: 'HBL', name: 'Habib Bank Ltd', sector: 'Banking', price: 132.50, change: -0.85, base: 133.5, volume: '5.2M', avgVol: '6.1M', pe: 4.2, mktCap: '194B', yield: '10.5%', shariah: false, earnings: 'Oct 26, 2026', range52: '98.0 - 146.0' },
  { symbol: 'MCB', name: 'MCB Bank Ltd', sector: 'Banking', price: 229.40, change: +0.40, base: 228.0, volume: '3.1M', avgVol: '3.8M', pe: 5.1, mktCap: '271B', yield: '13.2%', shariah: false, earnings: 'Oct 24, 2026', range52: '172.0 - 240.0' },
  { symbol: 'UBL', name: 'United Bank Ltd', sector: 'Banking', price: 288.00, change: +2.10, base: 282.0, volume: '4.9M', avgVol: '4.2M', pe: 4.9, mktCap: '352B', yield: '15.6%', shariah: false, earnings: 'Oct 27, 2026', range52: '185.0 - 302.0' },
  { symbol: 'BAFL', name: 'Bank Alfalah Ltd', sector: 'Banking', price: 68.50, change: +1.20, base: 67.5, volume: '7.4M', avgVol: '6.2M', pe: 4.4, mktCap: '108B', yield: '12.0%', shariah: false, earnings: 'Nov 01, 2026', range52: '46.0 - 74.0' },

  // Cement
  { symbol: 'LUCK', name: 'Lucky Cement Ltd', sector: 'Cement', price: 935.00, change: +2.80, base: 910.0, volume: '2.1M', avgVol: '1.8M', pe: 8.4, mktCap: '292B', yield: '3.5%', shariah: true, earnings: 'Oct 31, 2026', range52: '680.0 - 990.0' },
  { symbol: 'DGKC', name: 'D.G. Khan Cement', sector: 'Cement', price: 85.50, change: +1.70, base: 84.0, volume: '9.5M', avgVol: '7.8M', pe: 6.8, mktCap: '37B', yield: '0.0%', shariah: true, earnings: 'Nov 05, 2026', range52: '58.0 - 92.0' },
  { symbol: 'MLCF', name: 'Maple Leaf Cement', sector: 'Cement', price: 42.60, change: -1.20, base: 43.1, volume: '14.2M', avgVol: '12.5M', pe: 7.1, mktCap: '45B', yield: '4.8%', shariah: true, earnings: 'Oct 29, 2026', range52: '32.0 - 46.5' },

  // Technology & Telecom
  { symbol: 'SYS', name: 'Systems Limited', sector: 'Technology', price: 452.00, change: -2.30, base: 462.0, volume: '4.1M', avgVol: '3.4M', pe: 14.5, mktCap: '128B', yield: '1.8%', shariah: true, earnings: 'Nov 04, 2026', range52: '380.0 - 495.0' },
  { symbol: 'TRG', name: 'TRG Pakistan Ltd', sector: 'Technology', price: 59.80, change: -3.60, base: 62.0, volume: '16.5M', avgVol: '18.2M', pe: 8.2, mktCap: '32B', yield: '0.0%', shariah: false, earnings: 'Oct 30, 2026', range52: '48.0 - 82.0' },
  { symbol: 'AIRLINK', name: 'Air Link Communication', sector: 'Technology', price: 114.50, change: +3.20, base: 111.0, volume: '8.4M', avgVol: '6.9M', pe: 11.0, mktCap: '45B', yield: '3.5%', shariah: true, earnings: 'Nov 06, 2026', range52: '65.0 - 124.0' },
  { symbol: 'WTL', name: 'WorldCall Telecom', sector: 'Technology', price: 1.39, change: +0.00, base: 1.39, volume: '42.1M', avgVol: '38.0M', pe: 2.1, mktCap: '6B', yield: '0.0%', shariah: false, earnings: 'Oct 20, 2026', range52: '1.15 - 1.65' },

  // Fertilizer & Power
  { symbol: 'ENGRO', name: 'Engro Corporation', sector: 'Fertilizer', price: 348.00, change: +1.20, base: 343.0, volume: '3.4M', avgVol: '2.9M', pe: 6.3, mktCap: '188B', yield: '12.5%', shariah: true, earnings: 'Oct 28, 2026', range52: '280.0 - 370.0' },
  { symbol: 'FFC', name: 'Fauji Fertilizer Co', sector: 'Fertilizer', price: 204.50, change: +0.65, base: 203.0, volume: '5.1M', avgVol: '4.4M', pe: 5.8, mktCap: '260B', yield: '14.2%', shariah: true, earnings: 'Oct 27, 2026', range52: '115.0 - 218.0' },
  { symbol: 'HUBC', name: 'Hub Power Company', sector: 'Power', price: 146.20, change: +4.20, base: 140.0, volume: '19.8M', avgVol: '15.2M', pe: 4.5, mktCap: '189B', yield: '17.5%', shariah: true, earnings: 'Oct 29, 2026', range52: '98.0 - 158.0' },
  { symbol: 'KEL', name: 'K-Electric Ltd', sector: 'Power', price: 4.95, change: +2.10, base: 4.85, volume: '58.2M', avgVol: '48.0M', pe: 3.2, mktCap: '136B', yield: '0.0%', shariah: false, earnings: 'Oct 18, 2026', range52: '3.8 - 6.2' },

  // Automobile
  { symbol: 'INDU', name: 'Indus Motor Co Ltd', sector: 'Automobile', price: 1640.00, change: +4.50, base: 1570.0, volume: '380K', avgVol: '290K', pe: 10.2, mktCap: '129B', yield: '5.2%', shariah: true, earnings: 'Oct 31, 2026', range52: '1250.0 - 1720.0' },
  { symbol: 'MTL', name: 'Millat Tractors Ltd', sector: 'Automobile', price: 618.00, change: -1.40, base: 626.0, volume: '950K', avgVol: '820K', pe: 9.4, mktCap: '118B', yield: '8.5%', shariah: true, earnings: 'Oct 26, 2026', range52: '490.0 - 680.0' },
];

const WATCHLIST_INDICES = [
  { symbol: 'KSE 100', last: '172,013.48', chg: '+3,994.62', chgPct: '+2.38%', isUp: true },
  { symbol: 'KMI 30', last: '38,120.40', chg: '+412.30', chgPct: '+1.09%', isUp: true },
  { symbol: 'KSE 30', last: '34,980.70', chg: '-110.20', chgPct: '-0.31%', isUp: false },
  { symbol: 'ALL SHARES', last: '72,890.10', chg: '+320.15', chgPct: '+0.44%', isUp: true },
];

const WATCHLIST_FOREX_FUTURES = [
  { symbol: 'USD/PKR', last: '278.45', chg: '-0.15', chgPct: '-0.05%', isUp: false },
  { symbol: 'EUR/PKR', last: '302.20', chg: '+0.85', chgPct: '+0.28%', isUp: true },
  { symbol: 'GOLD 24K', last: '284,500', chg: '+2,200', chgPct: '+0.78%', isUp: true },
  { symbol: 'CRUDE OIL', last: '74.20', chg: '-0.65', chgPct: '-0.87%', isUp: false },
];

// Featured IPOs (PSX Specific)
const FEATURED_IPOS = [
  { symbol: 'FCL', name: 'Fast Cables Limited', exchange: 'PSX', valuation: 'PKR 14.2B', status: 'Book Building Closed', subRatio: '2.4x' },
  { symbol: 'SLGL', name: 'Secure Logistics Group', exchange: 'PSX', valuation: 'PKR 8.9B', status: 'Listed', subRatio: '1.8x' },
  { symbol: 'IPAK', name: 'International Packaging', exchange: 'PSX', valuation: 'PKR 5.6B', status: 'Upcoming', subRatio: 'Opening' },
  { symbol: 'GOPET', name: 'GO Petroleum Pakistan', exchange: 'PSX', valuation: 'PKR 32.0B', status: 'Pre-IPO Appraisal', subRatio: 'Approved' },
  { symbol: 'TPLR', name: 'TPL REIT Fund I', exchange: 'PSX', valuation: 'PKR 18.5B', status: 'Listed', subRatio: '1.5x' },
];

// Breaking Economic News impacting Pakistan Stocks
const MARKET_NEWS_FEED = [
  {
    id: 1,
    headline: 'Young Pakistanis drive record surge at PSX; SECP reports 25,747 new accounts opened in October 2026',
    outlet: 'ProPakistani & Dawn',
    time: '2 hours ago',
    tag: 'RETAIL INFLOWS',
    impact: 'Bullish for Financials & Tech',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 2,
    headline: 'State Bank maintains aggressive monetary easing cycle as headline CPI stabilizes below 7.5%',
    outlet: 'Business Recorder',
    time: '4 hours ago',
    tag: 'MONETARY POLICY',
    impact: 'Positive for Cement & Autos',
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 3,
    headline: 'Energy circular debt settlement plan enters phase 2 with sovereign guarantees for OGDC and PPL',
    outlet: 'The News International',
    time: '6 hours ago',
    tag: 'ENERGY DIVIDENDS',
    impact: 'High Cashflow Clearance',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 4,
    headline: 'Tech exports cross $3.4 Billion annualized benchmark led by Systems Ltd and Air Link expansion',
    outlet: 'Profit by Pakistan Today',
    time: '8 hours ago',
    tag: 'TECH GROWTH',
    impact: 'IT Export Resilience',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60'
  }
];

// Analyst & Influencer Trading Tips
const INFLUENCER_TIPS = [
  {
    name: 'Khurram Schezad',
    title: 'Macro & Capital Markets Advisor',
    handle: '@khurramschezad',
    call: 'BUY ON DIPS (KSE-100)',
    tip: 'Macro stabilization, fiscal consolidation and falling interest rates create historical re-rating for high-dividend yield state-owned enterprises (OGDC, PPL, FFC).',
    accuracy: '89%'
  },
  {
    name: 'KSE Alpha Desk',
    title: 'Institutional Equity Strategist',
    handle: '@kse_alpha',
    call: 'ACCUMULATE (PRL & MEBL)',
    tip: 'Refinery upgrade policy incentives make PRL a multi-quarter structural play. Meezan Bank remains South Asia top asset yield bank.',
    accuracy: '92%'
  },
  {
    name: 'Ahsan Mehanti',
    title: 'Managing Director, Arif Habib Commodities',
    handle: '@ahsanmehanti',
    call: 'TARGET 175,000 (KSE-100)',
    tip: 'Foreign portfolio flows returning after Pakistan bilateral loan extensions and structural privatization announcements.',
    accuracy: '86%'
  }
];

export default function CompleteTradingViewPlatform() {
  // Theme Controls
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [accentColor, setAccentColor] = useState<'sky' | 'teal' | 'lime' | 'violet'>('sky');

  // Active Asset
  const [selectedStock, setSelectedStock] = useState(PSX_UNIVERSE[0]);
  const [chartMode, setChartMode] = useState<'candles' | 'area'>('candles');
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1D');

  // Interactive Chart Crosshair State
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [hoveredCandle, setHoveredCandle] = useState<any>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Screener Table Organization & Filters
  const [screenerTab, setScreenerTab] = useState<'all' | 'gainers' | 'losers' | 'volume' | 'priceLow' | 'priceHigh'>('all');
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [shariahFilter, setShariahFilter] = useState(false);
  const [tablePage, setTablePage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  // Smart Averaging Desk (Floating / Docked Component)
  const [showAveragingModal, setShowAveragingModal] = useState(false);
  const [holdingQty, setHoldingQty] = useState('1000');
  const [holdingPrice, setHoldingPrice] = useState('180.00');
  const [orderShares, setOrderShares] = useState('500');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [limitBid, setLimitBid] = useState('168.00');
  const [includeFees, setIncludeFees] = useState(true);

  // Accent Colors Mapping (Custom Light Blue / Sky Blue included!)
  const ACCENT_STYLES = {
    sky: {
      btn: 'bg-sky-600 hover:bg-sky-700 text-white',
      badge: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800',
      activeTab: 'bg-sky-500 text-white shadow-sm',
      text: 'text-sky-600 dark:text-sky-400',
      line: '#0284c7'
    },
    teal: {
      btn: 'bg-[#089981] hover:bg-[#067764] text-white',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
      activeTab: 'bg-[#089981] text-white shadow-sm',
      text: 'text-[#089981]',
      line: '#089981'
    },
    lime: {
      btn: 'bg-lime-500 hover:bg-lime-600 text-black font-extrabold',
      badge: 'bg-lime-50 text-lime-800 border-lime-300 dark:bg-lime-950/50 dark:text-lime-300 dark:border-lime-800',
      activeTab: 'bg-lime-400 text-black font-bold shadow-sm',
      text: 'text-lime-600 dark:text-lime-400',
      line: '#84cc16'
    },
    violet: {
      btn: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      badge: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800',
      activeTab: 'bg-indigo-600 text-white shadow-sm',
      text: 'text-indigo-600 dark:text-indigo-400',
      line: '#6366f1'
    }
  };

  const currentAccent = ACCENT_STYLES[accentColor];

  // 45 Continuous Daily Candlesticks
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

  // Crosshair Handler
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
  const charges = includeFees ? tradeVal * 0.0018 : 0; // PSX standard 0.18%
  const capitalReq = tradeVal + charges;
  const finalShares = eQty + nQty;
  const newAvg = finalShares > 0 ? (eQty * ePrice + capitalReq) / finalShares : 0;
  const deltaAvg = ePrice > 0 ? newAvg - ePrice : 0;

  // Filtered & Sorted Screener Directory
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

  // 4 Movers Grids Data
  const topGainers = useMemo(() => [...PSX_UNIVERSE].sort((a, b) => b.change - a.change).slice(0, 5), []);
  const topLosers = useMemo(() => [...PSX_UNIVERSE].sort((a, b) => a.change - b.change).slice(0, 5), []);
  const volumeLeaders = useMemo(() => [...PSX_UNIVERSE].sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume)).slice(0, 5), []);
  const mostVolatile = useMemo(() => [...PSX_UNIVERSE].sort((a, b) => Math.abs(b.change) - Math.abs(a.change)).slice(0, 5), []);

  const isDark = themeMode === 'dark';

  return (
    <div className={`w-full min-h-screen transition-colors duration-200 ${isDark ? 'bg-[#090d16] text-slate-100' : 'bg-[#ffffff] text-[#131722]'}`}>
      
      {/* 1. TOP GLOBAL HEADER WITH FULL WIDTH & CONTROLS */}
      <header className={`w-full border-b px-4 sm:px-6 py-2.5 flex items-center justify-between sticky top-0 z-50 transition-colors ${isDark ? 'bg-[#0f1422] border-slate-800' : 'bg-white border-[#e0e3eb]'}`}>
        
        {/* Brand & Left Navigation */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-[#0284c7] flex items-center justify-center font-black text-white text-sm shadow-md">
              NX
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight block">
                NafaX <span className="text-sky-500 font-bold">Terminal</span>
              </span>
              <span className="text-[10px] text-slate-400 block -mt-1">Pakistan Stock Exchange Pro</span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-400">
            <span className={`cursor-pointer transition ${isDark ? 'text-white' : 'text-slate-900'}`}>Markets</span>
            <span className="cursor-pointer hover:text-sky-500 transition">Screener</span>
            <span className="cursor-pointer hover:text-sky-500 transition">Community Ideas</span>
            <span className="cursor-pointer hover:text-sky-500 transition">IPOs</span>
            <span className="cursor-pointer hover:text-sky-500 transition">Brokers</span>
          </nav>
        </div>

        {/* Right Corner Controls: Theme Toggle & Accent Color Picker (As requested!) */}
        <div className="flex items-center gap-3">
          
          {/* Smart Averaging Desk Trigger */}
          <button
            onClick={() => setShowAveragingModal(true)}
            className="flex items-center gap-1.5 bg-sky-500/10 border border-sky-500/30 text-sky-600 dark:text-sky-400 hover:bg-sky-500 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm font-num"
          >
            <span>⚡</span> Averaging Desk
          </button>

          {/* Color Switcher Dropdown (Aap ke finalization ke liye) */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
            <span className="text-[10px] text-slate-400 px-1 font-semibold hidden sm:inline">Theme:</span>
            <button
              onClick={() => setAccentColor('sky')}
              className={`w-4 h-4 rounded-full bg-sky-500 border transition ${accentColor === 'sky' ? 'ring-2 ring-sky-400 scale-110' : 'opacity-70'}`}
              title="Ice Light Blue"
            />
            <button
              onClick={() => setAccentColor('teal')}
              className={`w-4 h-4 rounded-full bg-[#089981] border transition ${accentColor === 'teal' ? 'ring-2 ring-emerald-400 scale-110' : 'opacity-70'}`}
              title="TradingView Teal"
            />
            <button
              onClick={() => setAccentColor('lime')}
              className={`w-4 h-4 rounded-full bg-lime-400 border transition ${accentColor === 'lime' ? 'ring-2 ring-lime-400 scale-110' : 'opacity-70'}`}
              title="Electric Lime"
            />
            <button
              onClick={() => setAccentColor('violet')}
              className={`w-4 h-4 rounded-full bg-indigo-500 border transition ${accentColor === 'violet' ? 'ring-2 ring-indigo-400 scale-110' : 'opacity-70'}`}
              title="Royal Violet"
            />
          </div>

          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={() => setThemeMode(isDark ? 'light' : 'dark')}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold transition flex items-center gap-1"
            title="Toggle Light / Dark Mode"
          >
            {isDark ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </header>

      {/* 2. COMMUNITY TRENDS STRIP (Screenshot 6: Horizontal Pills) */}
      <section className={`w-full border-b px-4 sm:px-6 py-2 overflow-x-auto flex items-center gap-3 text-xs font-num ${isDark ? 'bg-[#0c101a] border-slate-800' : 'bg-[#f8fafd] border-[#e0e3eb]'}`}>
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <span>🔥</span> PSX Trends:
        </span>
        {['OGDC', 'MEBL', 'SYS', 'PRL', 'HUBC', 'LUCK', 'AIRLINK', 'ENGRO'].map((sym) => {
          const stk = PSX_UNIVERSE.find((s) => s.symbol === sym) || PSX_UNIVERSE[0];
          const isUp = stk.change >= 0;
          return (
            <div
              key={sym}
              onClick={() => setSelectedStock(stk)}
              className={`shrink-0 px-3 py-1.5 rounded-lg border cursor-pointer transition flex items-center gap-2 ${
                selectedStock.symbol === sym
                  ? `${currentAccent.badge} font-bold shadow-sm`
                  : isDark
                  ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="font-extrabold text-xs">{sym}</span>
              <span className="font-medium">PKR {stk.price.toFixed(1)}</span>
              <span className={`text-[11px] font-bold ${isUp ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                {isUp ? `+${stk.change}%` : `${stk.change}%`}
              </span>
            </div>
          );
        })}
      </section>

      {/* 3. MAIN TERMINAL WORKSPACE (FULL WIDTH 100% RESPONSIVE) */}
      <div className="w-full px-4 sm:px-6 py-4 space-y-6">
        
        {/* ROW 1: TRADINGVIEW INTERACTIVE CHART (LEFT 9 COLS) + WATCHLIST & KEY STATS (RIGHT 3 COLS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          
          {/* Main Chart Area (9 Cols) */}
          <div className={`lg:col-span-9 rounded-2xl border p-4 sm:p-5 shadow-sm space-y-4 ${isDark ? 'bg-[#0f1422] border-slate-800' : 'bg-white border-[#e0e3eb]'}`}>
            
            {/* Header Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-sm font-num">
                  {selectedStock.symbol}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black">{selectedStock.symbol}</h2>
                    <span className="text-xs text-slate-400 font-medium">{selectedStock.name}</span>
                    {selectedStock.shariah && (
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">
                        KMI Shariah
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 font-num mt-0.5">
                    <span className="text-2xl sm:text-3xl font-black">
                      PKR {selectedStock.price.toFixed(2)}
                    </span>
                    <span className={`text-sm font-bold ${selectedStock.change >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                      {selectedStock.change >= 0 ? `+${selectedStock.change.toFixed(2)} (+${((selectedStock.change / selectedStock.base) * 100).toFixed(2)}%)` : `${selectedStock.change.toFixed(2)}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeframes & Modes */}
              <div className="flex items-center gap-2">
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-bold font-num text-slate-500">
                  {(['1D', '1W', '1M', '1Y'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTimeframe(t)}
                      className={`px-2.5 py-1 rounded transition ${timeframe === t ? currentAccent.activeTab : 'hover:text-slate-900 dark:hover:text-white'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-bold font-num text-slate-500">
                  <button
                    onClick={() => setChartMode('candles')}
                    className={`px-2.5 py-1 rounded transition ${chartMode === 'candles' ? currentAccent.activeTab : 'hover:text-slate-900 dark:hover:text-white'}`}
                  >
                    🕯️ Candles
                  </button>
                  <button
                    onClick={() => setChartMode('area')}
                    className={`px-2.5 py-1 rounded transition ${chartMode === 'area' ? currentAccent.activeTab : 'hover:text-slate-900 dark:hover:text-white'}`}
                  >
                    📈 Line
                  </button>
                </div>
              </div>
            </div>

            {/* Live Crosshair HUD */}
            <div className={`flex flex-wrap items-center justify-between text-xs font-num px-3 py-1.5 rounded-lg border ${isDark ? 'bg-slate-900/60 border-slate-800 text-slate-400' : 'bg-[#f8fafd] border-[#e0e3eb] text-slate-600'}`}>
              <div className="flex items-center gap-4">
                <span>DATE: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{activeCandle.date}</strong></span>
                <span>O: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{activeCandle.open.toFixed(2)}</strong></span>
                <span>H: <strong className="text-[#089981]">{activeCandle.high.toFixed(2)}</strong></span>
                <span>L: <strong className="text-[#f23645]">{activeCandle.low.toFixed(2)}</strong></span>
                <span>C: <strong className={activeCandle.close >= activeCandle.open ? 'text-[#089981]' : 'text-[#f23645]'}>{activeCandle.close.toFixed(2)}</strong></span>
              </div>
              <div>VOL: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{(activeCandle.volume / 1000000).toFixed(2)}M</strong></div>
            </div>

            {/* DYNAMIC SVG INTERACTIVE GRAPH WITH REAL TIME CROSSHAIR LINES */}
            <div className={`relative w-full h-[380px] rounded-xl overflow-hidden select-none border ${isDark ? 'bg-[#0a0e17] border-slate-800' : 'bg-white border-[#e0e3eb]'}`}>
              
              {/* Grid Lines */}
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 opacity-25">
                <div className="border-b border-dashed border-slate-300 dark:border-slate-700 w-full"></div>
                <div className="border-b border-dashed border-slate-300 dark:border-slate-700 w-full"></div>
                <div className="border-b border-dashed border-slate-300 dark:border-slate-700 w-full"></div>
                <div className="border-b border-dashed border-slate-300 dark:border-slate-700 w-full"></div>
              </div>

              {/* High/Low Watermarks */}
              <div className="absolute top-2 right-3 text-[11px] font-num font-bold text-slate-400">
                HIGH: PKR {maxHigh.toFixed(2)}
              </div>
              <div className="absolute bottom-7 right-3 text-[11px] font-num font-bold text-slate-400">
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
                      const yClose = 290 - ((c.close - minLow) / priceRange) * 240;
                      const yOpen = 290 - ((c.open - minLow) / priceRange) * 240;
                      const yHigh = 290 - ((c.high - minLow) / priceRange) * 240;
                      const yLow = 290 - ((c.low - minLow) / priceRange) * 240;
                      const bodyTop = Math.min(yOpen, yClose);
                      const bodyH = Math.max(3, Math.abs(yClose - yOpen));
                      const volH = Math.min(48, (c.volume / 8500000) * 48);

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
                            y={360 - volH}
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
                        <stop offset="0%" stopColor={currentAccent.line} stopOpacity="0.35" />
                        <stop offset="100%" stopColor={currentAccent.line} stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <polygon
                      fill="url(#mainAreaGrad)"
                      points={`0,340 ${candleHistory.map((c, i) => `${(i / (candleHistory.length - 1)) * 1000},${290 - ((c.close - minLow) / priceRange) * 240}`).join(' ')} 1000,340`}
                    />
                    <polyline
                      fill="none"
                      stroke={currentAccent.line}
                      strokeWidth="2.5"
                      points={candleHistory.map((c, i) => `${(i / (candleHistory.length - 1)) * 1000},${290 - ((c.close - minLow) / priceRange) * 240}`).join(' ')}
                    />
                  </>
                )}

                {/* REAL CROSSHAIR LINES FOLLOWING MOUSE */}
                {cursorPos && (
                  <g pointerEvents="none">
                    <line
                      x1={cursorPos.x}
                      y1="0"
                      x2={cursorPos.x}
                      y2="380"
                      stroke={isDark ? '#94a3b8' : '#787b86'}
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                    <line
                      x1="0"
                      y1={cursorPos.y}
                      x2="100%"
                      y2={cursorPos.y}
                      stroke={isDark ? '#94a3b8' : '#787b86'}
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                  </g>
                )}
              </svg>

              {/* Dynamic Badges on Axes */}
              {cursorPos && (
                <>
                  <div
                    className="absolute right-0 bg-slate-900 text-white text-[10px] font-num px-2 py-0.5 rounded-l pointer-events-none z-30"
                    style={{ top: `${cursorPos.y - 10}px` }}
                  >
                    PKR {(maxHigh - (cursorPos.y / 380) * priceRange).toFixed(2)}
                  </div>
                  <div
                    className="absolute bottom-0 bg-slate-900 text-white text-[10px] font-num px-2 py-0.5 rounded-t pointer-events-none z-30 transform -translate-x-1/2"
                    style={{ left: `${cursorPos.x}px` }}
                  >
                    {activeCandle.date}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ================= RIGHT COLUMN: WATCHLIST & KEY STATS (Screenshot 2 exact replica) ================= */}
          <div className={`lg:col-span-3 rounded-2xl border p-4 shadow-sm space-y-4 ${isDark ? 'bg-[#0f1422] border-slate-800' : 'bg-white border-[#e0e3eb]'}`}>
            
            {/* Watchlist Header */}
            <div className="flex justify-between items-center border-b pb-2.5 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1.5 cursor-pointer">
                <span className="font-extrabold text-sm">Watchlist</span>
                <span className="text-xs text-slate-400">▾</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <span className="cursor-pointer hover:text-sky-500 font-bold">+</span>
                <span className="cursor-pointer hover:text-sky-500">⛶</span>
                <span className="cursor-pointer hover:text-sky-500">•••</span>
              </div>
            </div>

            {/* Watchlist Items */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 text-xs font-num">
              
              {/* Indices Group */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">INDICES</span>
                <div className="space-y-1">
                  {WATCHLIST_INDICES.map((idx) => (
                    <div key={idx.symbol} className="flex justify-between items-center py-1 px-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer">
                      <span className="font-bold">{idx.symbol}</span>
                      <div className="text-right">
                        <span className="font-semibold block">{idx.last}</span>
                        <span className={`text-[10px] font-bold ${idx.isUp ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                          {idx.chg} ({idx.chgPct})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Equities Group */}
              <div className="border-t pt-2 border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">STOCKS</span>
                <div className="space-y-1">
                  {PSX_UNIVERSE.slice(0, 4).map((stk) => (
                    <div
                      key={stk.symbol}
                      onClick={() => setSelectedStock(stk)}
                      className={`flex justify-between items-center py-1 px-1.5 rounded cursor-pointer ${selectedStock.symbol === stk.symbol ? 'bg-sky-50 dark:bg-sky-950/40 border border-sky-300 dark:border-sky-800' : 'hover:bg-slate-100 dark:hover:bg-slate-800/60'}`}
                    >
                      <span className="font-bold">{stk.symbol}</span>
                      <div className="text-right">
                        <span className="font-semibold block">PKR {stk.price.toFixed(1)}</span>
                        <span className={`text-[10px] font-bold ${stk.change >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                          {stk.change >= 0 ? `+${stk.change}%` : `${stk.change}%`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Commodities Group */}
              <div className="border-t pt-2 border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">COMMODITIES & FOREX</span>
                <div className="space-y-1">
                  {WATCHLIST_FOREX_FUTURES.map((item) => (
                    <div key={item.symbol} className="flex justify-between items-center py-1 px-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer">
                      <span className="font-bold">{item.symbol}</span>
                      <div className="text-right">
                        <span className="font-semibold block">{item.last}</span>
                        <span className={`text-[10px] font-bold ${item.isUp ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                          {item.chgPct}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* KEY STATS BLOCK FOR SELECTED STOCK (Screenshot 2 bottom exact replica) */}
            <div className={`border-t pt-3 space-y-2.5 ${isDark ? 'border-slate-800' : 'border-[#e0e3eb]'}`}>
              <div>
                <div className="flex justify-between items-center">
                  <h3 className="font-black text-sm">{selectedStock.symbol}</h3>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">{selectedStock.sector}</span>
                </div>
                <div className="flex items-baseline gap-2 font-num mt-0.5">
                  <span className="text-xl font-black">PKR {selectedStock.price.toFixed(2)}</span>
                  <span className={`text-xs font-bold ${selectedStock.change >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                    {selectedStock.change >= 0 ? `+${selectedStock.change}%` : `${selectedStock.change}%`}
                  </span>
                </div>
              </div>

              {/* Volume Progress Bar */}
              <div className="space-y-1 font-num text-[11px]">
                <div className="flex justify-between text-slate-400 text-[10px]">
                  <span>Volume: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{selectedStock.volume}</strong></span>
                  <span>Avg Vol: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{selectedStock.avgVol}</strong></span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-500 rounded-full" style={{ width: '68%' }}></div>
                </div>
              </div>

              {/* Key Facts Callout */}
              <div className="bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/60 p-2.5 rounded-xl text-[11px] leading-relaxed">
                <span className="font-extrabold text-sky-700 dark:text-sky-300 block mb-1">✦ Key Facts</span>
                {selectedStock.name} reported resilient operational earnings with sustained cash payouts. Market price trades comfortably within 52-week range ({selectedStock.range52}).
              </div>

              {/* Detailed Key Stats Table */}
              <div className="space-y-1 text-xs font-num divide-y divide-slate-100 dark:divide-slate-800">
                <div className="flex justify-between py-1 text-slate-400">
                  <span>Latest Earnings:</span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedStock.earnings}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-400">
                  <span>Market Cap:</span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>PKR {selectedStock.mktCap}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-400">
                  <span>Dividend Yield:</span>
                  <span className="font-bold text-[#089981]">{selectedStock.yield}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-400">
                  <span>P/E Ratio (TTM):</span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedStock.pe}x</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* ROW 2: PAKISTAN MACRO 3-CARD SUMMARY (Screenshot 3 exact replica) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: Pakistan Equity Market Cap */}
          <div className={`rounded-2xl border p-5 shadow-sm space-y-3 ${isDark ? 'bg-[#0f1422] border-slate-800' : 'bg-white border-[#e0e3eb]'}`}>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span> PSX Equity Market Cap
              </span>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-bold font-num">TOTAL</span>
            </div>

            <div className="flex items-baseline gap-2 font-num">
              <span className="text-2xl sm:text-3xl font-black">PKR 14.85 Trillion</span>
              <span className="text-xs font-bold text-[#089981]">+8.4% YTD</span>
            </div>

            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Sector Market Dominance:</span>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full flex overflow-hidden">
                <div className="h-full bg-sky-500" style={{ width: '38%' }} title="Energy 38%"></div>
                <div className="h-full bg-emerald-500" style={{ width: '32%' }} title="Banking 32%"></div>
                <div className="h-full bg-amber-500" style={{ width: '18%' }} title="Cement 18%"></div>
                <div className="h-full bg-slate-400" style={{ width: '12%' }} title="Others 12%"></div>
              </div>
              <div className="flex justify-between text-[10px] font-num text-slate-400 pt-1">
                <span>Energy: 38%</span>
                <span>Banks: 32%</span>
                <span>Cement: 18%</span>
                <span>Others: 12%</span>
              </div>
            </div>
          </div>

          {/* Card 2: PKR Dollar Index & Bullion */}
          <div className={`rounded-2xl border p-5 shadow-sm space-y-3 ${isDark ? 'bg-[#0f1422] border-slate-800' : 'bg-white border-[#e0e3eb]'}`}>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#089981]"></span> PKR Forex & Bullion Desk
              </span>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-bold font-num">SPOT</span>
            </div>

            <div className="flex items-baseline gap-2 font-num">
              <span className="text-2xl sm:text-3xl font-black">278.45 USD/PKR</span>
              <span className="text-xs font-bold text-[#f23645]">-0.05%</span>
            </div>

            <div className="space-y-1.5 text-xs font-num divide-y divide-slate-100 dark:divide-slate-800 pt-1">
              <div className="flex justify-between py-1 text-slate-400">
                <span>Gold 24K (Per Tola):</span>
                <span className="font-bold text-amber-500">PKR 284,500</span>
              </div>
              <div className="flex justify-between py-1 text-slate-400">
                <span>Silver 24K (Per Tola):</span>
                <span className="font-bold">PKR 3,350</span>
              </div>
              <div className="flex justify-between py-1 text-slate-400">
                <span>Crude Oil (Brent):</span>
                <span className="font-bold">$74.20/bbl</span>
              </div>
            </div>
          </div>

          {/* Card 3: 10Y Yield & Pakistan Inflation */}
          <div className={`rounded-2xl border p-5 shadow-sm space-y-3 ${isDark ? 'bg-[#0f1422] border-slate-800' : 'bg-white border-[#e0e3eb]'}`}>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> 10Y PIB Yield & Inflation
              </span>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-bold font-num">MACRO</span>
            </div>

            <div className="flex items-baseline gap-2 font-num">
              <span className="text-2xl sm:text-3xl font-black">13.80% PIB</span>
              <span className="text-xs font-bold text-[#089981]">-180 bps</span>
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Monthly Inflation Trend (CPI %):</span>
              <div className="flex items-end justify-between h-10 gap-1 pt-1">
                {[12.5, 11.8, 9.6, 9.2, 7.8, 7.2, 6.9].map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-sky-500 rounded-t" style={{ height: `${(val / 14) * 32}px` }}></div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[9px] font-num text-slate-400">
                <span>May</span>
                <span>Jul</span>
                <span>Sep</span>
                <span>Oct</span>
                <span>Nov 2026</span>
              </div>
            </div>
          </div>

        </div>

        {/* ROW 3: FEATURED IPOS & IPO CALENDAR (Screenshot 4 exact replica) */}
        <div className={`rounded-2xl border p-5 shadow-sm space-y-4 ${isDark ? 'bg-[#0f1422] border-slate-800' : 'bg-white border-[#e0e3eb]'}`}>
          <div className="flex justify-between items-center border-b pb-3 border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-black flex items-center gap-2">
                Featured IPOs & Listings <span className="text-slate-400 text-sm font-normal">›</span>
              </h2>
              <p className="text-xs text-slate-400">Upcoming and recently concluded Pakistan Stock Exchange primary offerings</p>
            </div>
            <span className="text-xs text-sky-600 dark:text-sky-400 font-bold cursor-pointer hover:underline">
              See more IPO events ›
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {FEATURED_IPOS.map((ipo) => (
              <div
                key={ipo.symbol}
                className={`p-3.5 rounded-xl border transition cursor-pointer hover:shadow-md ${isDark ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700' : 'bg-[#f8fafd] border-slate-200 hover:bg-white'}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-md bg-slate-900 text-white font-black text-xs flex items-center justify-center font-num">
                    {ipo.symbol}
                  </div>
                  <div>
                    <span className="font-extrabold text-xs block truncate">{ipo.name}</span>
                    <span className="text-[10px] text-slate-400 font-num">{ipo.exchange}</span>
                  </div>
                </div>

                <div className="space-y-1 text-xs font-num pt-1 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between text-slate-400 text-[10px]">
                    <span>Issue Size:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">{ipo.valuation}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[10px]">
                    <span>Status:</span>
                    <span className="font-bold text-sky-600 dark:text-sky-400">{ipo.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ROW 4: 4-GRID MARKET MOVERS (Screenshot 5 exact replica) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. Highest Volume Stocks */}
          <div className={`rounded-2xl border p-4 shadow-sm space-y-3 ${isDark ? 'bg-[#0f1422] border-slate-800' : 'bg-white border-[#e0e3eb]'}`}>
            <div className="flex justify-between items-center border-b pb-2 border-slate-200 dark:border-slate-800">
              <h3 className="font-extrabold text-xs uppercase tracking-wider">Highest Volume Stocks</h3>
              <span className="text-[10px] text-slate-400">Regular hours</span>
            </div>
            <div className="space-y-2 text-xs font-num">
              {volumeLeaders.map((s) => (
                <div key={s.symbol} onClick={() => setSelectedStock(s)} className="flex justify-between items-center py-1 hover:bg-slate-100 dark:hover:bg-slate-800 px-1.5 rounded cursor-pointer">
                  <div>
                    <span className="font-extrabold block">{s.symbol}</span>
                    <span className="text-[10px] text-slate-400">{s.volume} Shares</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold block">PKR {s.price.toFixed(1)}</span>
                    <span className={`text-[10px] font-bold ${s.change >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                      {s.change >= 0 ? `+${s.change}%` : `${s.change}%`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Most Volatile Stocks */}
          <div className={`rounded-2xl border p-4 shadow-sm space-y-3 ${isDark ? 'bg-[#0f1422] border-slate-800' : 'bg-white border-[#e0e3eb]'}`}>
            <div className="flex justify-between items-center border-b pb-2 border-slate-200 dark:border-slate-800">
              <h3 className="font-extrabold text-xs uppercase tracking-wider">Most Volatile Stocks</h3>
              <span className="text-[10px] text-slate-400">Intraday Swings</span>
            </div>
            <div className="space-y-2 text-xs font-num">
              {mostVolatile.map((s) => (
                <div key={s.symbol} onClick={() => setSelectedStock(s)} className="flex justify-between items-center py-1 hover:bg-slate-100 dark:hover:bg-slate-800 px-1.5 rounded cursor-pointer">
                  <div>
                    <span className="font-extrabold block">{s.symbol}</span>
                    <span className="text-[10px] text-slate-400">{s.sector}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold block">PKR {s.price.toFixed(1)}</span>
                    <span className="text-[10px] font-bold text-amber-500 font-num">±{Math.abs(s.change)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Top Gainers */}
          <div className={`rounded-2xl border p-4 shadow-sm space-y-3 ${isDark ? 'bg-[#0f1422] border-slate-800' : 'bg-white border-[#e0e3eb]'}`}>
            <div className="flex justify-between items-center border-b pb-2 border-slate-200 dark:border-slate-800">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#089981]">Top Gainers</h3>
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded font-bold">▲ Bulls</span>
            </div>
            <div className="space-y-2 text-xs font-num">
              {topGainers.map((s) => (
                <div key={s.symbol} onClick={() => setSelectedStock(s)} className="flex justify-between items-center py-1 hover:bg-slate-100 dark:hover:bg-slate-800 px-1.5 rounded cursor-pointer">
                  <div>
                    <span className="font-extrabold block">{s.symbol}</span>
                    <span className="text-[10px] text-slate-400 truncate max-w-[90px] block">{s.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold block">PKR {s.price.toFixed(1)}</span>
                    <span className="text-[10px] font-bold text-[#089981]">+{s.change}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Top Losers */}
          <div className={`rounded-2xl border p-4 shadow-sm space-y-3 ${isDark ? 'bg-[#0f1422] border-slate-800' : 'bg-white border-[#e0e3eb]'}`}>
            <div className="flex justify-between items-center border-b pb-2 border-slate-200 dark:border-slate-800">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#f23645]">Top Losers</h3>
              <span className="text-[10px] bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 px-1.5 py-0.5 rounded font-bold">▼ Dips</span>
            </div>
            <div className="space-y-2 text-xs font-num">
              {topLosers.map((s) => (
                <div key={s.symbol} onClick={() => setSelectedStock(s)} className="flex justify-between items-center py-1 hover:bg-slate-100 dark:hover:bg-slate-800 px-1.5 rounded cursor-pointer">
                  <div>
                    <span className="font-extrabold block">{s.symbol}</span>
                    <span className="text-[10px] text-slate-400 truncate max-w-[90px] block">{s.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold block">PKR {s.price.toFixed(1)}</span>
                    <span className="text-[10px] font-bold text-[#f23645]">{s.change}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ROW 5: ORGANIZED & COMPACT PSX EQUITIES SCREENER (Filter by Gainers, Losers, Volume, Price) */}
        <div className={`rounded-2xl border p-5 shadow-sm space-y-4 ${isDark ? 'bg-[#0f1422] border-slate-800' : 'bg-white border-[#e0e3eb]'}`}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-xl font-black flex items-center gap-2">
                PSX Screener & Filter Engine <span className="text-slate-400 text-sm font-normal">›</span>
              </h2>
              <p className="text-xs text-slate-400">Search and sort 50+ equities with customizable filters and quick averaging</p>
            </div>

            {/* Filter Pills: Gainers, Losers, Volume, Price High/Low */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold font-num">
              <button
                onClick={() => setScreenerTab('all')}
                className={`px-3 py-1 rounded-lg transition ${screenerTab === 'all' ? currentAccent.activeTab : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
              >
                All (50+)
              </button>
              <button
                onClick={() => setScreenerTab('gainers')}
                className={`px-3 py-1 rounded-lg transition ${screenerTab === 'gainers' ? currentAccent.activeTab : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
              >
                ▲ Gainers
              </button>
              <button
                onClick={() => setScreenerTab('losers')}
                className={`px-3 py-1 rounded-lg transition ${screenerTab === 'losers' ? currentAccent.activeTab : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
              >
                ▼ Losers
              </button>
              <button
                onClick={() => setScreenerTab('volume')}
                className={`px-3 py-1 rounded-lg transition ${screenerTab === 'volume' ? currentAccent.activeTab : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
              >
                📊 High Volume
              </button>
              <button
                onClick={() => setScreenerTab('priceLow')}
                className={`px-3 py-1 rounded-lg transition ${screenerTab === 'priceLow' ? currentAccent.activeTab : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
              >
                Price: Low to High
              </button>
              <button
                onClick={() => setScreenerTab('priceHigh')}
                className={`px-3 py-1 rounded-lg transition ${screenerTab === 'priceHigh' ? currentAccent.activeTab : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
              >
                Price: High to Low
              </button>
            </div>
          </div>

          {/* Secondary Controls: Search, Sector, Shariah */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search symbol or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`border rounded-lg px-3 py-1.5 text-xs outline-none focus:border-sky-500 w-52 ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'}`}
              />
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className={`border rounded-lg px-3 py-1.5 text-xs font-bold outline-none ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'}`}
              >
                {sectors.map((sec) => (
                  <option key={sec} value={sec}>{sec}</option>
                ))}
              </select>
              <button
                onClick={() => setShariahFilter(!shariahFilter)}
                className={`px-3 py-1.5 rounded-lg border font-bold transition ${shariahFilter ? 'bg-emerald-600 text-white border-emerald-600' : isDark ? 'bg-slate-900 border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-300 text-slate-700'}`}
              >
                KMI Shariah Only
              </button>
            </div>

            <span className="text-slate-400 font-num">
              Showing {currentStocksPage.length} of {processedStocks.length} equities
            </span>
          </div>

          {/* Compact Clean Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-num">
              <thead>
                <tr className={`border-b text-[10px] uppercase font-bold text-slate-400 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                  <th className="py-2 px-3">Symbol</th>
                  <th className="py-2 px-3">Company</th>
                  <th className="py-2 px-3">Sector</th>
                  <th className="py-2 px-3 text-right">Price (PKR)</th>
                  <th className="py-2 px-3 text-right">Change %</th>
                  <th className="py-2 px-3 text-right">Volume</th>
                  <th className="py-2 px-3 text-right">P/E</th>
                  <th className="py-2 px-3 text-right">Dividend Yield</th>
                  <th className="py-2 px-3 text-center">Desk Action</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800/80' : 'divide-slate-100'}`}>
                {currentStocksPage.map((stk) => {
                  const isUp = stk.change >= 0;
                  const isSelected = stk.symbol === selectedStock.symbol;
                  return (
                    <tr
                      key={stk.symbol}
                      onClick={() => setSelectedStock(stk)}
                      className={`hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition cursor-pointer ${isSelected ? 'bg-sky-50/60 dark:bg-sky-950/30' : ''}`}
                    >
                      <td className="py-2.5 px-3 font-extrabold flex items-center gap-1.5">
                        {stk.symbol}
                        {stk.shariah && <span className="text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1 rounded font-bold">KMI</span>}
                      </td>
                      <td className="py-2.5 px-3 font-sans text-slate-400 truncate max-w-[150px]">{stk.name}</td>
                      <td className="py-2.5 px-3 font-sans text-slate-400">{stk.sector}</td>
                      <td className="py-2.5 px-3 text-right font-black">PKR {stk.price.toFixed(2)}</td>
                      <td className={`py-2.5 px-3 text-right font-bold ${isUp ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                        {isUp ? `+${stk.change.toFixed(2)}%` : `${stk.change.toFixed(2)}%`}
                      </td>
                      <td className="py-2.5 px-3 text-right font-medium">{stk.volume}</td>
                      <td className="py-2.5 px-3 text-right text-slate-400">{stk.pe}x</td>
                      <td className="py-2.5 px-3 text-right font-bold text-[#089981]">{stk.yield}</td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStock(stk);
                            setShowAveragingModal(true);
                          }}
                          className={`${currentAccent.btn} px-2.5 py-1 rounded text-[10px] font-bold transition font-num`}
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center pt-2 text-xs font-num border-t border-slate-200 dark:border-slate-800">
              <span className="text-slate-400">Page {tablePage} of {totalPages}</span>
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

        {/* ROW 6: PAKISTAN BREAKING NEWS & INFLUENCER / ANALYST TIPS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Breaking News Feed (8 Cols) */}
          <div className={`lg:col-span-8 rounded-2xl border p-5 shadow-sm space-y-4 ${isDark ? 'bg-[#0f1422] border-slate-800' : 'bg-white border-[#e0e3eb]'}`}>
            <div className="flex justify-between items-center border-b pb-3 border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-black flex items-center gap-2">
                  <span>📰</span> Market News & Regulatory Filings
                </h3>
                <p className="text-xs text-slate-400">Macro updates, SBP releases, and earnings affecting PSX stock valuations</p>
              </div>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md font-num font-bold">
                Live Feed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {MARKET_NEWS_FEED.map((n) => (
                <div key={n.id} className={`p-3 rounded-xl border flex gap-3 hover:shadow-md transition ${isDark ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700' : 'bg-[#f8fafd] border-slate-200 hover:bg-white'}`}>
                  <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-slate-200">
                    <img src={n.image} alt={n.tag} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-between space-y-1">
                    <span className="text-[9px] font-black uppercase text-sky-600 dark:text-sky-400 tracking-wider">
                      {n.tag} • <span className="text-slate-400">{n.time}</span>
                    </span>
                    <h4 className="text-xs font-bold leading-snug line-clamp-2 hover:text-sky-500 cursor-pointer">
                      {n.headline}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-num">{n.impact}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Influencer & Market Analyst Tips (4 Cols) */}
          <div className={`lg:col-span-4 rounded-2xl border p-5 shadow-sm space-y-3.5 ${isDark ? 'bg-[#0f1422] border-slate-800' : 'bg-white border-[#e0e3eb]'}`}>
            <div className="flex justify-between items-center border-b pb-3 border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-black flex items-center gap-1.5">
                  <span>💡</span> Analyst & Influencer Calls
                </h3>
                <p className="text-xs text-slate-400">Actionable advice & targets from verified PSX strategists</p>
              </div>
            </div>

            <div className="space-y-3">
              {INFLUENCER_TIPS.map((tip, i) => (
                <div key={i} className={`p-3 rounded-xl border space-y-1.5 ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-[#f8fafd] border-slate-200'}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-extrabold text-xs block">{tip.name}</span>
                      <span className="text-[10px] text-slate-400">{tip.handle}</span>
                    </div>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold font-num">
                      {tip.call}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">{tip.tip}</p>
                  <div className="text-[10px] text-slate-400 font-num">
                    Historical Accuracy: <strong className="text-sky-500">{tip.accuracy}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* 4. DEDICATED SMART COST-AVERAGING MODAL / DOCK (Aapka Main Client Feature) */}
      {showAveragingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl border shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200 ${isDark ? 'bg-[#0f1422] border-slate-800 text-white' : 'bg-white border-[#e0e3eb] text-[#131722]'}`}>
            
            <div className="flex justify-between items-center border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center font-black text-sm">
                  ⚡
                </div>
                <div>
                  <h3 className="text-base font-black">Smart Cost-Averaging Desk</h3>
                  <p className="text-xs text-slate-400">Live PSX Price Down/Up Averaging Engine</p>
                </div>
              </div>
              <button
                onClick={() => setShowAveragingModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-bold flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            {/* Selected Asset Header */}
            <div className={`p-3 rounded-xl border flex justify-between items-center font-num ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div>
                <span className="text-xs font-bold block">{selectedStock.symbol} — {selectedStock.name}</span>
                <span className="text-[10px] text-slate-400">Execution on Pakistan Stock Exchange</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Live Rate</span>
                <span className="text-base font-black text-sky-500">PKR {selectedStock.price.toFixed(2)}</span>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-3">
              <div>
                <span className="text-xs font-bold block uppercase tracking-wide">1. Existing Holding</span>
                <div className="grid grid-cols-2 gap-3 mt-1 font-num">
                  <div>
                    <label className="text-[10px] text-slate-400">Shares Count</label>
                    <input
                      type="number"
                      value={holdingQty}
                      onChange={(e) => setHoldingQty(e.target.value)}
                      className={`w-full border rounded-lg p-2 text-xs font-bold outline-none focus:border-sky-500 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-300'}`}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">Avg Purchase Price (PKR)</label>
                    <input
                      type="number"
                      value={holdingPrice}
                      onChange={(e) => setHoldingPrice(e.target.value)}
                      className={`w-full border rounded-lg p-2 text-xs font-bold outline-none focus:border-sky-500 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-300'}`}
                    />
                  </div>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold block uppercase tracking-wide">2. Planned Order</span>
                <div className={`grid grid-cols-2 gap-2 mt-1 p-1 rounded-lg text-xs font-bold ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
                  <button
                    onClick={() => setOrderType('market')}
                    className={`py-1.5 rounded transition ${orderType === 'market' ? currentAccent.activeTab : 'text-slate-400'}`}
                  >
                    ⚡ Market (PKR {selectedStock.price.toFixed(2)})
                  </button>
                  <button
                    onClick={() => setOrderType('limit')}
                    className={`py-1.5 rounded transition ${orderType === 'limit' ? currentAccent.activeTab : 'text-slate-400'}`}
                  >
                    🎯 Limit Bid
                  </button>
                </div>
              </div>

              {orderType === 'limit' && (
                <div className="bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 p-2.5 rounded-lg font-num">
                  <label className="text-[10px] font-bold text-sky-700 dark:text-sky-300 uppercase block">Your Target Limit Price (PKR)</label>
                  <input
                    type="number"
                    value={limitBid}
                    onChange={(e) => setLimitBid(e.target.value)}
                    className={`w-full border rounded p-1.5 mt-0.5 text-xs font-bold outline-none ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'}`}
                  />
                </div>
              )}

              <div className="font-num">
                <span className="text-xs font-bold block uppercase tracking-wide">3. New Shares to Buy</span>
                <input
                  type="number"
                  value={orderShares}
                  onChange={(e) => setOrderShares(e.target.value)}
                  className={`w-full border rounded-lg p-2 mt-1 text-xs font-bold outline-none focus:border-sky-500 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-300'}`}
                />
              </div>

              <div className={`flex items-center justify-between p-2.5 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div>
                  <span className="text-xs font-bold block">Apply PSX Charges (+0.18%)</span>
                  <span className="text-[10px] text-slate-400">CDC, SECP, CVT & Broker Commission</span>
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
            <div className={`border rounded-xl p-4 space-y-2 text-xs font-num ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex justify-between text-slate-400">
                <span>Total Capital Required:</span>
                <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>PKR {capitalReq.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Final Portfolio Shares:</span>
                <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{finalShares} shares</span>
              </div>

              <div className="border border-sky-500/40 p-4 rounded-xl text-center mt-3 shadow-sm bg-sky-50/40 dark:bg-sky-950/30">
                <span className="text-[10px] font-black uppercase text-sky-600 dark:text-sky-400 tracking-wider block">Projected New Average Price</span>
                <div className="text-3xl font-black mt-1">
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

      {/* 5. INSTITUTIONAL SITEMAP FOOTER */}
      <footer className={`w-full border-t px-6 py-10 mt-12 text-xs transition-colors ${isDark ? 'bg-[#0b0f19] border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 font-num">
          <div>
            <span className="font-extrabold text-sm block">NAFAX TERMINAL PAKISTAN</span>
            <span>Real-time Pakistan Stock Exchange (PSX) DPS Feed & Cost-Averaging Engine.</span>
          </div>
          <div className="flex gap-4">
            <span>Interbank FX: SBP</span>
            <span>•</span>
            <span>Saraf Bullion: 24K Gold Association</span>
            <span>•</span>
            <span>Indices: KSE-100 & KMI-30</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
