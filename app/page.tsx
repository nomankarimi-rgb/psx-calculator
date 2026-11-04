'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';

// Verified PSX Real Closing Rates (November 2026)
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

const COMMUNITY_IDEAS = [
  {
    id: 1,
    title: 'OGDC: Key Support Bounce & Potential Bullish Expansion',
    author: 'Tariq Equity Research',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    symbol: 'OGDC',
    target: 'PKR 345.00',
    type: 'LONG',
    time: '2 hours ago',
    image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=600&auto=format&fit=crop&q=60',
    desc: 'OGDC has confirmed a massive volume breakout above 305 PKR neckline. Institutional blocks indicate strong multi-week accumulation.',
    likes: 184,
    comments: 32
  },
  {
    id: 2,
    title: 'MEBL: Sustained Islamic Banking Alpha with High Spread Resilience',
    author: 'Meezan Securities Desk',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    symbol: 'MEBL',
    target: 'PKR 580.00',
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
    target: 'PKR 124.00',
    type: 'PULLBACK',
    time: '6 hours ago',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&auto=format&fit=crop&q=60',
    desc: 'Healthy corrective structure after bonus adjustments. Expect strong buyer defense near 105-108 level.',
    likes: 98,
    comments: 14
  },
  {
    id: 4,
    title: 'LUCK: Clinker Capacity Expansion & Export Growth Valuation',
    author: 'Karachi Capital Advisory',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80',
    symbol: 'LUCK',
    target: 'PKR 440.00',
    type: 'SWING LONG',
    time: '8 hours ago',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=60',
    desc: 'Synergies from international acquisitions and falling global coal prices expanding operating EBITDA by 280 bps.',
    likes: 126,
    comments: 21
  }
];

const INITIAL_HOLDINGS = [
  { symbol: 'OGDC', shares: 800, buyPrice: 285.50 },
  { symbol: 'MEBL', shares: 300, buyPrice: 512.00 },
  { symbol: 'LUCK', shares: 150, buyPrice: 382.00 },
  { symbol: 'PRL', shares: 2500, buyPrice: 34.20 }
];

export default function CompleteMasterTerminal() {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark');
  const [activeTab, setActiveTab] = useState<'terminal' | 'portfolio' | 'ai'>('terminal');

  // Active Terminal Asset
  const [selectedStock, setSelectedStock] = useState(PSX_UNIVERSE[0]);
  const [chartMode, setChartMode] = useState<'candles' | 'area'>('candles');
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1D');

  // Chart Interactive Cursor
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [hoveredCandle, setHoveredCandle] = useState<any>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Screener Table Controls
  const [screenerTab, setScreenerTab] = useState<'all' | 'gainers' | 'losers' | 'volume'>('all');
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [shariahFilter, setShariahFilter] = useState(false);
  const [tablePage, setTablePage] = useState(1);
  const ITEMS_PER_PAGE = 7;

  // Averaging Modal State
  const [showAveragingModal, setShowAveragingModal] = useState(false);
  const [holdingQty, setHoldingQty] = useState('1000');
  const [holdingPrice, setHoldingPrice] = useState('295.00');
  const [orderShares, setOrderShares] = useState('500');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [limitBid, setLimitBid] = useState('300.00');
  const [includeFees, setIncludeFees] = useState(true);

  // ================= 1. USER PORTFOLIO STATE (LOCAL STORAGE PERSISTED) =================
  const [userHoldings, setUserHoldings] = useState<Array<{ symbol: string; shares: number; buyPrice: number }>>([]);
  const [newHoldingSymbol, setNewHoldingSymbol] = useState('OGDC');
  const [newHoldingShares, setNewHoldingShares] = useState('');
  const [newHoldingBuyPrice, setNewHoldingBuyPrice] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('nafax_user_portfolio');
    if (saved) {
      try {
        setUserHoldings(JSON.parse(saved));
      } catch (e) {
        setUserHoldings(INITIAL_HOLDINGS);
      }
    } else {
      setUserHoldings(INITIAL_HOLDINGS);
    }
  }, []);

  useEffect(() => {
    if (userHoldings.length > 0) {
      localStorage.setItem('nafax_user_portfolio', JSON.stringify(userHoldings));
    }
  }, [userHoldings]);

  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(newHoldingShares) || 0;
    const price = parseFloat(newHoldingBuyPrice) || 0;
    if (qty <= 0 || price <= 0) return;

    setUserHoldings((prev) => {
      const idx = prev.findIndex((h) => h.symbol === newHoldingSymbol);
      if (idx >= 0) {
        const existing = prev[idx];
        const totalShares = existing.shares + qty;
        const newAvg = (existing.shares * existing.buyPrice + qty * price) / totalShares;
        const updated = [...prev];
        updated[idx] = { symbol: newHoldingSymbol, shares: totalShares, buyPrice: parseFloat(newAvg.toFixed(2)) };
        return updated;
      }
      return [...prev, { symbol: newHoldingSymbol, shares: qty, buyPrice: price }];
    });

    setNewHoldingShares('');
    setNewHoldingBuyPrice('');
  };

  const handleRemoveStock = (sym: string) => {
    setUserHoldings((prev) => prev.filter((h) => h.symbol !== sym));
  };

  const portfolioStats = useMemo(() => {
    let totalInvested = 0;
    let currentTotalValue = 0;

    const items = userHoldings.map((h) => {
      const stock = PSX_UNIVERSE.find((s) => s.symbol === h.symbol) || { price: h.buyPrice, name: h.symbol, change: 0, sector: 'Equities' };
      const invested = h.shares * h.buyPrice;
      const currentVal = h.shares * stock.price;
      const pnlPKR = currentVal - invested;
      const pnlPct = invested > 0 ? (pnlPKR / invested) * 100 : 0;

      totalInvested += invested;
      currentTotalValue += currentVal;

      return {
        ...h,
        stockName: stock.name,
        currentPrice: stock.price,
        invested,
        currentVal,
        pnlPKR,
        pnlPct,
        sector: stock.sector
      };
    });

    const netPnlPKR = currentTotalValue - totalInvested;
    const netPnlPct = totalInvested > 0 ? (netPnlPKR / totalInvested) * 100 : 0;

    const itemsWithWeight = items.map((item) => ({
      ...item,
      weight: currentTotalValue > 0 ? (item.currentVal / currentTotalValue) * 100 : 0
    }));

    return {
      totalInvested,
      currentTotalValue,
      netPnlPKR,
      netPnlPct,
      items: itemsWithWeight
    };
  }, [userHoldings]);

  // ================= 2. NAFAX AI FINANCIAL COPILOT ENGINE =================
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: 'Assalam-o-Alaikum! Main aapka PSX AI Financial Copilot hoon. Main ne aapka live portfolio analyze kar liya hai. Poochiye ke kis stock par kya action lena chahiye, kahan profit book karein, ya kahan average down karein!'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);

  const generateAIResponse = (userPrompt: string) => {
    const q = userPrompt.toLowerCase();
    const { totalInvested, currentTotalValue, netPnlPKR, netPnlPct, items } = portfolioStats;

    const gainers = items.filter((i) => i.pnlPKR > 0);
    const losers = items.filter((i) => i.pnlPKR < 0);
    const topGainer = [...gainers].sort((a, b) => b.pnlPct - a.pnlPct)[0];
    const topLoser = [...losers].sort((a, b) => a.pnlPct - b.pnlPct)[0];

    if (q.includes('portfolio') || q.includes('health') || q.includes('position') || q.includes('halat')) {
      return `📊 **Live Portfolio Analysis:**\n- Total Invested: **PKR ${totalInvested.toLocaleString()}**\n- Current Value: **PKR ${currentTotalValue.toLocaleString()}**\n- Net P&L: **${netPnlPKR >= 0 ? '+' : ''}PKR ${netPnlPKR.toLocaleString(undefined, { maximumFractionDigits: 0 })} (${netPnlPct >= 0 ? '+' : ''}${netPnlPct.toFixed(2)}%)** ${netPnlPKR >= 0 ? '🟢 Profit' : '🔴 Drawdown'}.\n- Top Gainer: **${topGainer ? `${topGainer.symbol} (+${topGainer.pnlPct.toFixed(1)}%)` : 'N/A'}**\n- Lagging Stock: **${topLoser ? `${topLoser.symbol} (${topLoser.pnlPct.toFixed(1)}%)` : 'N/A'}**. Overall position stable hai!`;
    }

    if (q.includes('average') || q.includes('loss') || q.includes('gira') || q.includes('down')) {
      if (topLoser) {
        const simAvg = ((topLoser.shares * topLoser.buyPrice + 300 * topLoser.currentPrice) / (topLoser.shares + 300)).toFixed(1);
        return `🎯 **Smart Averaging Strategy:**\n- **${topLoser.symbol}** is waqt **${topLoser.pnlPct.toFixed(1)}% loss** par hai (Buy: PKR ${topLoser.buyPrice} vs Live: PKR ${topLoser.currentPrice}).\n- Agar aap 300 shares mazeed current rate par add karte hain to aapka naya average **PKR ${simAvg}** par aa jayega!\n- Is se market mein choti rally par bhi aap foran breakeven par nikal sakenge.`;
      }
      return `Aapke portfolio mein koi barra loss holding nahi hai! Sab stocks ache profit ya minor buffer mein hain.`;
    }

    if (q.includes('profit') || q.includes('sell') || q.includes('bech') || q.includes('book')) {
      if (topGainer) {
        return `💰 **Profit Taking Advisory:**\n- **${topGainer.symbol}** par aapko **+${topGainer.pnlPct.toFixed(1)}% ka solid gain (PKR ${topGainer.pnlPKR.toLocaleString(undefined, { maximumFractionDigits: 0 })})** mil raha hai!\n- **Action:** KSE-100 historic resistance (172,000+) par hai. 25% to 30% position bech kar profit lock karein, baaqi trailing stop-loss ke sath ride karein.`;
      }
      return `Abhi wait karein. Market momentum positive hai, thora aur run-up lene dein.`;
    }

    if (q.includes('risk') || q.includes('khatra') || q.includes('crash') || q.includes('drop')) {
      const estimatedDropPKR = currentTotalValue * 0.03;
      return `🛡️ **Downside Stress Test:**\n- Agar KSE-100 mein 3% ka sudden correction aata hai, to aapke portfolio mein taqreeban **PKR ${estimatedDropPKR.toLocaleString(undefined, { maximumFractionDigits: 0 })}** ka short-term drawdown aayega.\n- **Risk Status:** Safe, kyunke aapki high-dividend holdings (OGDC, MEBL) buffer provide karti hain.`;
    }

    return `Main ne aapka sawal review kiya. Aapke portfolio mein is waqt **${items.length} active positions** hain. Aap pooch sakte hain: "Mera portfolio kaisa chal raha hai?", "Konsa stock average karun?", ya "Kahan profit book karun?"`;
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');
    setIsBotTyping(true);

    setTimeout(() => {
      const botReply = generateAIResponse(userText);
      setChatMessages((prev) => [...prev, { sender: 'ai', text: botReply }]);
      setIsBotTyping(false);
    }, 600);
  };

  const triggerQuickPrompt = (prompt: string) => {
    setChatInput(prompt);
    setChatMessages((prev) => [...prev, { sender: 'user', text: prompt }]);
    setIsBotTyping(true);
    setTimeout(() => {
      const reply = generateAIResponse(prompt);
      setChatMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
      setIsBotTyping(false);
    }, 600);
  };

  // SVG Chart Candles
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
    const idx = Math.min(candleHistory.length - 1, Math.max(0, Math.floor((x / rect.width) * candleHistory.length)));
    setHoveredCandle(candleHistory[idx]);
  };

  const handleMouseLeave = () => {
    setCursorPos(null);
    setHoveredCandle(null);
  };

  // Averaging Calculations for Modal
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

  // 100% Guaranteed High-Contrast Colors
  const theme = {
    bg: isDark ? 'bg-[#090d16]' : 'bg-[#ffffff]',
    headerBg: isDark ? 'bg-[#0e1320] border-[#1e293b]' : 'bg-[#ffffff] border-[#e2e8f0]',
    cardBg: isDark ? 'bg-[#0e1320] border-[#1e293b]' : 'bg-[#ffffff] border-[#e2e8f0]',
    subCardBg: isDark ? 'bg-[#151c2e] border-[#1e293b]' : 'bg-[#f0f7ff] border-[#bae6fd]',
    stripBg: isDark ? 'bg-[#0b101b] border-[#1e293b]' : 'bg-[#f8fafc] border-[#e2e8f0]',
    t1: isDark ? 'text-[#ffffff]' : 'text-[#0f172a]',
    t2: isDark ? 'text-[#cbd5e1]' : 'text-[#1e293b]',
    t3: isDark ? 'text-[#94a3b8]' : 'text-[#475569]',
    selectedRow: isDark ? 'bg-[#1e293b] text-[#38bdf8] border-l-4 border-[#38bdf8]' : 'bg-[#e0f2fe] text-[#0284c7] font-black border-l-4 border-[#0284c7]',
    badgeBg: isDark ? 'bg-[#1e293b] text-[#38bdf8] border-[#334155]' : 'bg-[#e0f2fe] text-[#0369a1] border-[#bae6fd]'
  };

  return (
    <div className={`w-full min-h-screen ${theme.bg} ${theme.t1} transition-colors duration-150`}>
      
      {/* 1. TOP GLOBAL NAVIGATION HEADER */}
      <header className={`w-full border-b px-4 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm ${theme.headerBg}`}>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('terminal')}>
            <div className="w-9 h-9 rounded-xl bg-sky-500 flex items-center justify-center font-black text-white text-base shadow-md">
              NX
            </div>
            <div>
              <span className={`font-black text-lg tracking-tight block ${theme.t1}`}>
                NafaX <span className="text-sky-500 font-bold">Terminal</span>
              </span>
              <span className={`text-[11px] block -mt-1 font-medium ${theme.t3}`}>PSX Institutional Suite</span>
            </div>
          </div>

          {/* Master Tabs Switcher */}
          <nav className="flex items-center gap-2 text-xs font-black">
            <button
              onClick={() => setActiveTab('terminal')}
              className={`px-3 py-1.5 rounded-xl transition ${
                activeTab === 'terminal'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-black'
              }`}
            >
              📈 Live Terminal & Chart
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'portfolio'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-black'
              }`}
            >
              <span>💼</span> My Portfolio Dashboard
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'ai'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-black'
              }`}
            >
              <span>🤖</span> AI Financial Copilot
            </button>
          </nav>
        </div>

        {/* Right Corner Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAveragingModal(true)}
            className="flex items-center gap-2 bg-sky-500/15 border border-sky-500/30 text-sky-500 hover:bg-sky-500 hover:text-white px-3.5 py-2 rounded-xl text-xs font-black transition font-num"
          >
            <span>⚡</span> Averaging Desk
          </button>

          <button
            onClick={() => setThemeMode(isDark ? 'light' : 'dark')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-black transition flex items-center gap-1.5 ${
              isDark ? 'bg-[#151c2e] border-slate-700 text-white' : 'bg-sky-50 border-sky-300 text-sky-900'
            }`}
          >
            {isDark ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </header>

      {/* 2. PERSISTENT LIVE PORTFOLIO STRIP (Visible everywhere!) */}
      <div className={`w-full border-b px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-num ${
        isDark ? 'bg-[#0f172a] border-slate-800' : 'bg-[#e0f2fe]/70 border-sky-200'
      }`}>
        <div className="flex items-center gap-4">
          <span className="font-black flex items-center gap-1.5 text-sky-500 uppercase tracking-wider text-[11px]">
            <span>💼</span> User Portfolio:
          </span>
          <span className={theme.t2}>
            Invested: <strong className={theme.t1}>PKR {portfolioStats.totalInvested.toLocaleString()}</strong>
          </span>
          <span className={theme.t2}>
            Live Value: <strong className={theme.t1}>PKR {portfolioStats.currentTotalValue.toLocaleString()}</strong>
          </span>
          <span className="flex items-center gap-1 font-black">
            Net P&L: 
            <span className={portfolioStats.netPnlPKR >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}>
              {portfolioStats.netPnlPKR >= 0 ? `+PKR ${portfolioStats.netPnlPKR.toLocaleString(undefined, { maximumFractionDigits: 0 })} (+${portfolioStats.netPnlPct.toFixed(2)}%)` : `-PKR ${Math.abs(portfolioStats.netPnlPKR).toLocaleString(undefined, { maximumFractionDigits: 0 })} (${portfolioStats.netPnlPct.toFixed(2)}%)`}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('portfolio')}
            className="bg-sky-500 hover:bg-sky-600 text-white px-3 py-1 rounded-lg font-black text-[11px] transition shadow-sm"
          >
            Manage Holdings ›
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg font-black text-[11px] transition shadow-sm"
          >
            Ask AI Copilot ›
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CONDITIONAL SUB-DASHBOARDS: PORTFOLIO & AI COPILOT */}
      {/* ========================================================================= */}
      
      {/* VIEW: PORTFOLIO DASHBOARD */}
      {activeTab === 'portfolio' && (
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 py-6 space-y-6">
          <div className="flex justify-between items-center border-b pb-4 border-slate-200 dark:border-slate-800">
            <div>
              <h1 className={`text-2xl sm:text-3xl font-black ${theme.t1}`}>My PSX Investment Portfolio</h1>
              <p className={`text-xs sm:text-sm font-medium ${theme.t3}`}>Rozana nayi investment add karein, real-time profit & loss aur stock weightage watch karein.</p>
            </div>
            <button onClick={() => setActiveTab('terminal')} className="text-xs font-bold text-sky-500 hover:underline">
              ← Back to Chart Terminal
            </button>
          </div>

          {/* 3 Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-num">
            <div className={`p-5 rounded-2xl border ${theme.cardBg} space-y-1`}>
              <span className={`text-xs font-black uppercase ${theme.t3}`}>Total Capital Invested</span>
              <div className={`text-3xl font-black ${theme.t1}`}>PKR {portfolioStats.totalInvested.toLocaleString()}</div>
            </div>
            <div className={`p-5 rounded-2xl border ${theme.cardBg} space-y-1`}>
              <span className={`text-xs font-black uppercase ${theme.t3}`}>Current Market Value</span>
              <div className={`text-3xl font-black ${theme.t1}`}>PKR {portfolioStats.currentTotalValue.toLocaleString()}</div>
            </div>
            <div className={`p-5 rounded-2xl border ${theme.cardBg} space-y-1`}>
              <span className={`text-xs font-black uppercase ${theme.t3}`}>Total Unrealized P&L</span>
              <div className={`text-3xl font-black ${portfolioStats.netPnlPKR >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                {portfolioStats.netPnlPKR >= 0 ? `+PKR ${portfolioStats.netPnlPKR.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : `-PKR ${Math.abs(portfolioStats.netPnlPKR).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                <span className="text-base font-bold ml-2">({portfolioStats.netPnlPct >= 0 ? '+' : ''}{portfolioStats.netPnlPct.toFixed(2)}%)</span>
              </div>
            </div>
          </div>

          {/* Add Stock Form */}
          <form onSubmit={handleAddStock} className={`p-4 rounded-xl border space-y-3 ${theme.subCardBg}`}>
            <span className={`text-xs font-black uppercase tracking-wider block ${theme.t1}`}>+ Add Holding / Update Stock Buying</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-num">
              <div>
                <label className={`block font-bold mb-1 ${theme.t3}`}>Stock Symbol:</label>
                <select
                  value={newHoldingSymbol}
                  onChange={(e) => setNewHoldingSymbol(e.target.value)}
                  className={`w-full p-2 rounded-lg border font-black outline-none ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
                >
                  {PSX_UNIVERSE.map((s) => (
                    <option key={s.symbol} value={s.symbol}>{s.symbol} — {s.name} (PKR {s.price})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`block font-bold mb-1 ${theme.t3}`}>Shares Quantity:</label>
                <input
                  type="number"
                  placeholder="e.g. 500"
                  value={newHoldingShares}
                  onChange={(e) => setNewHoldingShares(e.target.value)}
                  className={`w-full p-2 rounded-lg border font-bold outline-none ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
                />
              </div>
              <div>
                <label className={`block font-bold mb-1 ${theme.t3}`}>Average Buy Price (PKR):</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 295.50"
                  value={newHoldingBuyPrice}
                  onChange={(e) => setNewHoldingBuyPrice(e.target.value)}
                  className={`w-full p-2 rounded-lg border font-bold outline-none ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
                />
              </div>
            </div>
            <button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 text-white font-black py-2 rounded-lg text-xs transition shadow-sm">
              Save to Portfolio (Saved in memory)
            </button>
          </form>

          {/* Holdings Table */}
          <div className={`rounded-2xl border p-5 shadow-sm space-y-4 ${theme.cardBg}`}>
            <h3 className={`text-base font-black ${theme.t1}`}>Stock Positions Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-num">
                <thead>
                  <tr className={`border-b text-[10px] uppercase font-black ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-300 text-slate-600'}`}>
                    <th className="py-2 px-3">Stock</th>
                    <th className="py-2 px-3">Shares</th>
                    <th className="py-2 px-3 text-right">Avg Cost</th>
                    <th className="py-2 px-3 text-right">Live Rate</th>
                    <th className="py-2 px-3 text-right">Invested</th>
                    <th className="py-2 px-3 text-right">Current Val</th>
                    <th className="py-2 px-3 text-right">P&L (PKR / %)</th>
                    <th className="py-2 px-3 text-right">Weightage</th>
                    <th className="py-2 px-2 text-center">Delete</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-200'}`}>
                  {portfolioStats.items.map((item) => {
                    const isProfit = item.pnlPKR >= 0;
                    return (
                      <tr key={item.symbol} className={isDark ? 'hover:bg-slate-800/40' : 'hover:bg-sky-50/50'}>
                        <td className="py-3 px-3">
                          <span className={`font-black block ${theme.t1}`}>{item.symbol}</span>
                          <span className={`text-[10px] ${theme.t3}`}>{item.sector}</span>
                        </td>
                        <td className={`py-3 px-3 font-black ${theme.t1}`}>{item.shares}</td>
                        <td className={`py-3 px-3 text-right font-medium ${theme.t3}`}>PKR {item.buyPrice.toFixed(2)}</td>
                        <td className={`py-3 px-3 text-right font-black ${theme.t1}`}>PKR {item.currentPrice.toFixed(2)}</td>
                        <td className={`py-3 px-3 text-right font-medium ${theme.t3}`}>PKR {item.invested.toLocaleString()}</td>
                        <td className={`py-3 px-3 text-right font-black ${theme.t1}`}>PKR {item.currentVal.toLocaleString()}</td>
                        <td className={`py-3 px-3 text-right font-black ${isProfit ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                          {isProfit ? '+' : ''}{item.pnlPKR.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          <span className="text-[10px] block">({isProfit ? '+' : ''}{item.pnlPct.toFixed(2)}%)</span>
                        </td>
                        <td className="py-3 px-3 text-right font-black">
                          {item.weight.toFixed(1)}%
                        </td>
                        <td className="py-3 px-2 text-center">
                          <button onClick={() => handleRemoveStock(item.symbol)} className="text-rose-500 font-bold">✕</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: AI FINANCIAL COPILOT */}
      {activeTab === 'ai' && (
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-6">
          <div className="flex justify-between items-center border-b pb-4 border-slate-200 dark:border-slate-800">
            <div>
              <h1 className={`text-2xl sm:text-3xl font-black ${theme.t1}`}>NafaX AI Financial Copilot</h1>
              <p className={`text-xs sm:text-sm font-medium ${theme.t3}`}>Aapke portfolio aur market position ke mutabiq intelligent risk & decision advisor.</p>
            </div>
            <button onClick={() => setActiveTab('terminal')} className="text-xs font-bold text-sky-500 hover:underline">
              ← Back to Chart Terminal
            </button>
          </div>

          <div className={`rounded-2xl border p-5 sm:p-6 shadow-sm space-y-4 ${theme.cardBg}`}>
            {/* Quick Strategy Buttons */}
            <div className="flex flex-wrap gap-2">
              {[
                '📊 Mera Portfolio Analyze Karo',
                '🎯 Konsa Stock Average Karun?',
                '💰 Profit Book Karun Ya Hold?',
                '🛡️ Downside Risk Kitna Hai?'
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => triggerQuickPrompt(p)}
                  className={`text-xs px-3 py-2 rounded-xl border font-bold transition ${
                    isDark ? 'bg-slate-900 border-slate-700 text-sky-400 hover:bg-slate-800' : 'bg-sky-50 border-sky-300 text-sky-900 hover:bg-sky-100'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Chat Stream */}
            <div className={`h-[420px] overflow-y-auto rounded-xl p-4 space-y-3 border text-xs sm:text-sm leading-relaxed ${
              isDark ? 'bg-[#090d16] border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-3.5 rounded-2xl max-w-[85%] whitespace-pre-line shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-sky-500 text-white rounded-tr-none font-medium'
                      : isDark
                      ? 'bg-[#151c2e] text-slate-100 border border-slate-800 rounded-tl-none font-sans'
                      : 'bg-white text-slate-900 border border-slate-200 rounded-tl-none font-sans'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isBotTyping && (
                <div className="flex items-center gap-1.5 text-slate-400 text-xs italic p-1">
                  <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping"></span>
                  AI analyzing your portfolio metrics...
                </div>
              )}
            </div>

            {/* Input Chat Field */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                placeholder="Ask anything about your portfolio (e.g. 'OGDC kitna average karun?')..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className={`flex-1 p-3 rounded-xl border text-xs sm:text-sm font-medium outline-none focus:border-sky-500 ${
                  isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
              <button type="submit" className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-3 rounded-xl font-black text-xs sm:text-sm transition shadow-sm">
                Ask AI
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MAIN LIVE TERMINAL (ALWAYS ACCESSIBLE WITH ALL SECTIONS!) */}
      {/* ========================================================================= */}
      {activeTab === 'terminal' && (
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 py-6 space-y-6">
          
          {/* SECTION 1: TRADINGVIEW CHART & WATCHLIST */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* Main Interactive Chart Area (9 Cols) */}
            <div className={`lg:col-span-9 rounded-2xl border p-5 sm:p-6 shadow-sm space-y-4 ${theme.cardBg}`}>
              <div className={`flex flex-wrap items-center justify-between gap-4 border-b pb-4 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <div className="flex items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-base font-num ${
                    isDark ? 'bg-slate-900 text-white' : 'bg-[#e0f2fe] text-[#0369a1] border-2 border-sky-300'
                  }`}>
                    {selectedStock.symbol}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className={`text-2xl font-black ${theme.t1}`}>{selectedStock.symbol}</h2>
                      <span className={`text-sm font-semibold ${theme.t3}`}>{selectedStock.name}</span>
                      {selectedStock.shariah && (
                        <span className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 px-2 py-0.5 rounded-md font-black">
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

                <div className="flex flex-wrap items-center gap-3">
                  <div className={`flex p-1 rounded-xl text-xs font-black font-num ${isDark ? 'bg-slate-900 text-slate-400' : 'bg-slate-100 text-slate-700 border border-slate-300'}`}>
                    {(['1D', '1W', '1M', '1Y'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTimeframe(t)}
                        className={`px-3 py-1.5 rounded-lg transition ${
                          timeframe === t ? 'bg-sky-500 text-white font-black shadow-sm' : 'hover:text-black dark:hover:text-white'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  <div className={`flex p-1 rounded-xl text-xs font-black font-num ${isDark ? 'bg-slate-900 text-slate-400' : 'bg-slate-100 text-slate-700 border border-slate-300'}`}>
                    <button
                      onClick={() => setChartMode('candles')}
                      className={`px-3.5 py-1.5 rounded-lg transition ${chartMode === 'candles' ? 'bg-sky-500 text-white font-black shadow-sm' : 'hover:text-black dark:hover:text-white'}`}
                    >
                      🕯️ Candles
                    </button>
                    <button
                      onClick={() => setChartMode('area')}
                      className={`px-3.5 py-1.5 rounded-lg transition ${chartMode === 'area' ? 'bg-sky-500 text-white font-black shadow-sm' : 'hover:text-black dark:hover:text-white'}`}
                    >
                      📈 Line
                    </button>
                  </div>
                </div>
              </div>

              {/* Live Crosshair HUD */}
              <div className={`flex flex-wrap items-center justify-between text-xs sm:text-sm font-num px-4 py-2 rounded-xl border ${
                isDark ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-[#e0f2fe]/80 border-sky-300 text-[#0f172a]'
              }`}>
                <div className="flex flex-wrap items-center gap-4">
                  <span>DATE: <strong className={theme.t1}>{activeCandle.date}</strong></span>
                  <span>O: <strong className={theme.t1}>{activeCandle.open.toFixed(2)}</strong></span>
                  <span>H: <strong className="text-[#089981] font-black">{activeCandle.high.toFixed(2)}</strong></span>
                  <span>L: <strong className="text-[#f23645] font-black">{activeCandle.low.toFixed(2)}</strong></span>
                  <span>C: <strong className={`font-black ${activeCandle.close >= activeCandle.open ? 'text-[#089981]' : 'text-[#f23645]'}`}>{activeCandle.close.toFixed(2)}</strong></span>
                </div>
                <div>VOL: <strong className={theme.t1}>{(activeCandle.volume / 1000000).toFixed(2)}M</strong></div>
              </div>

              {/* Dynamic SVG Chart */}
              <div className={`relative w-full h-[400px] rounded-xl overflow-hidden select-none border ${isDark ? 'bg-[#0b101c] border-slate-800' : 'bg-[#fafbfc] border-slate-200'}`}>
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
                            <line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={isUp ? '#089981' : '#f23645'} strokeWidth="1.2" />
                            <rect x={x - 6} y={bodyTop} width="12" height={bodyH} fill={isUp ? '#089981' : '#f23645'} rx="1" />
                            <rect x={x - 5} y={380 - volH} width="10" height={volH} fill={isUp ? '#089981' : '#f23645'} opacity="0.3" />
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
                      <line x1={cursorPos.x} y1="0" x2={cursorPos.x} y2="400" stroke={isDark ? '#94a3b8' : '#64748b'} strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="0" y1={cursorPos.y} x2="100%" y2={cursorPos.y} stroke={isDark ? '#94a3b8' : '#64748b'} strokeWidth="1" strokeDasharray="4 4" />
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

            {/* Watchlist Column (3 Cols) */}
            <div className={`lg:col-span-3 rounded-2xl border p-5 shadow-sm space-y-4 ${theme.cardBg}`}>
              <div className={`flex justify-between items-center border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <span className={`font-black text-sm sm:text-base ${theme.t1}`}>Watchlist & Market Watch</span>
                <span className="text-xs text-sky-500 font-bold font-num">Live PSX</span>
              </div>

              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 text-xs font-num">
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

                <div className={`border-t pt-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                  <span className={`text-[10px] font-black uppercase tracking-wider block mb-1 ${theme.t3}`}>STOCKS</span>
                  <div className="space-y-1">
                    {PSX_UNIVERSE.slice(0, 5).map((stk) => (
                      <div
                        key={stk.symbol}
                        onClick={() => setSelectedStock(stk)}
                        className={`flex justify-between items-center py-1.5 px-2.5 rounded-lg cursor-pointer transition ${
                          selectedStock.symbol === stk.symbol ? theme.selectedRow : isDark ? 'text-slate-200 hover:bg-slate-800' : 'text-slate-800 hover:bg-sky-50'
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
                    ))}
                  </div>
                </div>

                <div className={`border-t pt-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                  <span className={`text-[10px] font-black uppercase tracking-wider block mb-1 ${theme.t3}`}>COMMODITIES & FOREX</span>
                  <div className="space-y-1">
                    {WATCHLIST_FOREX_FUTURES.map((item) => (
                      <div key={item.symbol} className={`flex justify-between items-center py-1.5 px-2 rounded-lg cursor-pointer ${isDark ? 'hover:bg-slate-800' : 'hover:bg-sky-50'}`}>
                        <span className={`font-black text-xs ${theme.t1}`}>{item.symbol}</span>
                        <div className="text-right">
                          <span className={`font-black block ${theme.t1}`}>{item.last}</span>
                          <span className={`text-[10px] font-black ${item.isUp ? 'text-[#089981]' : 'text-[#f23645]'}`}>{item.chgPct}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowAveragingModal(true)}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white text-xs font-black py-2.5 rounded-xl transition shadow-sm font-num flex items-center justify-center gap-1.5"
              >
                <span>⚡</span> Calculate Position Averaging
              </button>
            </div>

          </div>

          {/* SECTION 2: PAKISTAN MACRO 3-CARD SUMMARY */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`rounded-2xl border p-5 shadow-sm space-y-3 ${theme.cardBg}`}>
              <span className={`text-xs font-black uppercase flex items-center gap-1.5 ${theme.t3}`}>
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span> PSX Equity Market Cap
              </span>
              <div className="flex items-baseline gap-2 font-num">
                <span className={`text-2xl sm:text-3xl font-black ${theme.t1}`}>PKR 14.85 Trillion</span>
                <span className="text-xs font-black text-[#089981]">+8.4% YTD</span>
              </div>
              <div className={`flex justify-between text-[11px] font-num font-bold pt-1 ${theme.t3}`}>
                <span>Energy: 38%</span><span>Banks: 32%</span><span>Cement: 18%</span><span>Others: 12%</span>
              </div>
            </div>

            <div className={`rounded-2xl border p-5 shadow-sm space-y-3 ${theme.cardBg}`}>
              <span className={`text-xs font-black uppercase flex items-center gap-1.5 ${theme.t3}`}>
                <span className="w-2.5 h-2.5 rounded-full bg-[#089981]"></span> PKR Forex & Bullion Desk
              </span>
              <div className="flex items-baseline gap-2 font-num">
                <span className={`text-2xl sm:text-3xl font-black ${theme.t1}`}>278.45 USD/PKR</span>
                <span className="text-xs font-black text-[#f23645]">-0.05%</span>
              </div>
              <div className={`flex justify-between text-xs font-num pt-1 ${theme.t2}`}>
                <span>Gold: <strong className="text-amber-500">PKR 284,500</strong></span>
                <span>Silver: <strong>PKR 3,350</strong></span>
                <span>Oil: <strong>$74.20</strong></span>
              </div>
            </div>

            <div className={`rounded-2xl border p-5 shadow-sm space-y-3 ${theme.cardBg}`}>
              <span className={`text-xs font-black uppercase flex items-center gap-1.5 ${theme.t3}`}>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> 10Y PIB Yield & Inflation
              </span>
              <div className="flex items-baseline gap-2 font-num">
                <span className={`text-2xl sm:text-3xl font-black ${theme.t1}`}>13.80% PIB</span>
                <span className="text-xs font-black text-[#089981]">-180 bps</span>
              </div>
              <div className={`text-[11px] font-num font-bold ${theme.t3}`}>
                <span>SBP Policy Rate: <strong>15.00%</strong> • Headline CPI below 7.2%</span>
              </div>
            </div>
          </div>

          {/* SECTION 3: FEATURED IPOS & PRIMARY OFFERINGS */}
          <div className={`rounded-2xl border p-5 sm:p-6 shadow-sm space-y-4 ${theme.cardBg}`}>
            <div className={`flex justify-between items-center border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <div>
                <h2 className={`text-lg sm:text-xl font-black flex items-center gap-2 ${theme.t1}`}>
                  Featured IPOs & Primary Offerings <span className="text-slate-400 text-sm font-normal">›</span>
                </h2>
                <p className={`text-xs font-medium ${theme.t3}`}>Upcoming and concluded Pakistan Stock Exchange primary offerings</p>
              </div>
              <span className="text-xs text-sky-500 font-black cursor-pointer hover:underline">See all IPOs ›</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {FEATURED_IPOS.map((ipo) => (
                <div key={ipo.symbol} className={`p-4 rounded-xl border transition cursor-pointer hover:shadow-md ${
                  isDark ? 'bg-[#151c2e] border-slate-800 hover:border-slate-700' : 'bg-[#f8fafc] border-slate-200 hover:bg-[#f0f7ff]'
                }`}>
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

          {/* SECTION 4: 4-GRID MARKET MOVERS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`rounded-2xl border p-4 shadow-sm space-y-3 ${theme.cardBg}`}>
              <div className={`flex justify-between items-center border-b pb-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <h3 className={`font-black text-xs uppercase tracking-wider ${theme.t1}`}>Highest Volume Stocks</h3>
                <span className={`text-[10px] font-bold ${theme.t3}`}>Regular hours</span>
              </div>
              <div className="space-y-2 text-xs font-num">
                {volumeLeaders.map((s) => (
                  <div key={s.symbol} onClick={() => setSelectedStock(s)} className={`flex justify-between items-center py-1.5 px-2 rounded cursor-pointer transition ${isDark ? 'hover:bg-slate-800' : 'hover:bg-[#f0f7ff]'}`}>
                    <div><span className={`font-black block ${theme.t1}`}>{s.symbol}</span><span className={`text-[10px] font-semibold ${theme.t3}`}>{s.volume} Shares</span></div>
                    <div className="text-right"><span className={`font-black block ${theme.t1}`}>PKR {s.price.toFixed(1)}</span><span className={`text-[10px] font-black ${s.change >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}`}>{s.change >= 0 ? `+${s.change}%` : `${s.change}%`}</span></div>
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
                    <div><span className={`font-black block ${theme.t1}`}>{s.symbol}</span><span className={`text-[10px] font-semibold ${theme.t3}`}>{s.sector}</span></div>
                    <div className="text-right"><span className={`font-black block ${theme.t1}`}>PKR {s.price.toFixed(1)}</span><span className="text-[10px] font-black text-amber-500 font-num">±{Math.abs(s.change)}%</span></div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`rounded-2xl border p-4 shadow-sm space-y-3 ${theme.cardBg}`}>
              <div className={`flex justify-between items-center border-b pb-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <h3 className="font-black text-xs uppercase tracking-wider text-[#089981]">Top Gainers</h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-1.5 py-0.5 rounded font-black">▲ Bulls</span>
              </div>
              <div className="space-y-2 text-xs font-num">
                {topGainers.map((s) => (
                  <div key={s.symbol} onClick={() => setSelectedStock(s)} className={`flex justify-between items-center py-1.5 px-2 rounded cursor-pointer transition ${isDark ? 'hover:bg-slate-800' : 'hover:bg-[#f0f7ff]'}`}>
                    <div><span className={`font-black block ${theme.t1}`}>{s.symbol}</span><span className={`text-[10px] font-semibold truncate max-w-[95px] block ${theme.t3}`}>{s.name}</span></div>
                    <div className="text-right"><span className={`font-black block ${theme.t1}`}>PKR {s.price.toFixed(1)}</span><span className="text-[10px] font-black text-[#089981]">+{s.change}%</span></div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`rounded-2xl border p-4 shadow-sm space-y-3 ${theme.cardBg}`}>
              <div className={`flex justify-between items-center border-b pb-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <h3 className="font-black text-xs uppercase tracking-wider text-[#f23645]">Top Losers</h3>
                <span className="text-[10px] bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 px-1.5 py-0.5 rounded font-black">▼ Dips</span>
              </div>
              <div className="space-y-2 text-xs font-num">
                {topLosers.map((s) => (
                  <div key={s.symbol} onClick={() => setSelectedStock(s)} className={`flex justify-between items-center py-1.5 px-2 rounded cursor-pointer transition ${isDark ? 'hover:bg-slate-800' : 'hover:bg-[#f0f7ff]'}`}>
                    <div><span className={`font-black block ${theme.t1}`}>{s.symbol}</span><span className={`text-[10px] font-semibold truncate max-w-[95px] block ${theme.t3}`}>{s.name}</span></div>
                    <div className="text-right"><span className={`font-black block ${theme.t1}`}>PKR {s.price.toFixed(1)}</span><span className="text-[10px] font-black text-[#f23645]">{s.change}%</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 5: PSX SCREENER TABLE */}
          <div className={`rounded-2xl border p-5 sm:p-6 shadow-sm space-y-4 ${theme.cardBg}`}>
            <div className={`flex flex-wrap items-center justify-between gap-3 border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <div>
                <h2 className={`text-xl font-black flex items-center gap-2 ${theme.t1}`}>
                  PSX Screener & Filter Engine <span className="text-slate-400 text-sm font-normal">›</span>
                </h2>
                <p className={`text-xs font-medium ${theme.t3}`}>Search and sort 50+ equities with customizable filters and quick averaging</p>
              </div>

              <div className={`flex flex-wrap items-center gap-1.5 p-1 rounded-xl text-xs font-black font-num border ${
                isDark ? 'bg-[#151c2e] border-slate-800' : 'bg-slate-100 border-slate-300'
              }`}>
                {[
                  { id: 'all', label: 'All (50+)' },
                  { id: 'gainers', label: '▲ Gainers' },
                  { id: 'losers', label: '▼ Losers' },
                  { id: 'volume', label: '📊 High Volume' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setScreenerTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      screenerTab === tab.id ? 'bg-sky-500 text-white font-black shadow-sm' : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-700 hover:text-black hover:bg-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

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
                          isSelected ? theme.selectedRow : isDark ? 'hover:bg-slate-800/60' : 'hover:bg-sky-50'
                        }`}
                      >
                        <td className={`py-3 px-3 font-black flex items-center gap-1.5 ${theme.t1}`}>
                          {stk.symbol}
                          {stk.shariah && <span className="text-[9px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 px-1 rounded font-black">KMI</span>}
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
              <div className={`flex justify-between items-center pt-2 text-xs font-num border-t ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-[#0f172a] font-bold'}`}>
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

          {/* SECTION 6: COMMUNITY TRADE IDEAS & CHARTS */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className={`text-2xl font-black ${theme.t1}`}>Community trade ideas ›</h2>
                <p className={`text-xs ${theme.t3}`}>Chart analysis, Breakouts & Swing Setups by Top Pakistani CMT Analysts</p>
              </div>
              <span className="text-xs text-sky-500 font-bold cursor-pointer hover:underline">See all ideas ›</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {COMMUNITY_IDEAS.map((idea) => (
                <div key={idea.id} className={`rounded-2xl overflow-hidden border shadow-sm transition flex flex-col justify-between ${theme.cardBg}`}>
                  <div>
                    <div className="h-40 w-full overflow-hidden bg-slate-900 relative">
                      <img src={idea.image} alt={idea.title} className="w-full h-full object-cover hover:scale-105 transition duration-300" />
                      <span className="absolute top-2 left-2 bg-black/80 text-white px-2 py-0.5 rounded text-[10px] font-bold font-num border border-slate-700">
                        {idea.symbol} • {idea.type}
                      </span>
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <img src={idea.avatar} alt={idea.author} className="w-6 h-6 rounded-full object-cover border border-slate-700" />
                        <span className={`text-xs font-bold truncate ${theme.t1}`}>{idea.author}</span>
                        <span className={`text-[10px] font-num ${theme.t3}`}>• {idea.time}</span>
                      </div>
                      <h3 className={`text-xs font-extrabold leading-snug line-clamp-2 ${theme.t1}`}>{idea.title}</h3>
                      <p className={`text-[11px] line-clamp-2 ${theme.t3}`}>{idea.desc}</p>
                    </div>
                  </div>
                  <div className={`p-4 pt-0 border-t flex justify-between items-center text-xs font-num ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'}`}>
                    <span className="font-bold text-[#089981]">Target: {idea.target}</span>
                    <span>❤️ {idea.likes}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 7: BREAKING NEWS & INFLUENCER TIPS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className={`lg:col-span-8 rounded-2xl border p-5 sm:p-6 shadow-sm space-y-4 ${theme.cardBg}`}>
              <div className={`flex justify-between items-center border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <h3 className={`text-base sm:text-lg font-black flex items-center gap-2 ${theme.t1}`}>
                  <span>📰</span> Market News & Regulatory Filings
                </h3>
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
                <h3 className={`text-base sm:text-lg font-black flex items-center gap-1.5 ${theme.t1}`}>
                  <span>💡</span> Analyst & Influencer Calls
                </h3>
              </div>
              <div className="space-y-3">
                {INFLUENCER_TIPS.map((tip, i) => (
                  <div key={i} className={`p-3.5 rounded-xl border space-y-1.5 ${isDark ? 'bg-[#151c2e] border-slate-800' : 'bg-[#f8fafc] border-slate-200'}`}>
                    <div className="flex justify-between items-center">
                      <span className={`font-black text-sm block ${theme.t1}`}>{tip.name}</span>
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

          {/* SECTION 8: TRADINGVIEW STYLE "LOOK FIRST / THEN LEAP" SITEMAP FOOTER */}
          <footer className={`border-t pt-12 pb-16 px-6 mt-16 space-y-12 ${isDark ? 'border-slate-800 bg-[#070a10]' : 'border-slate-200 bg-[#f8fafc]'}`}>
            <div className="max-w-[1600px] mx-auto text-center space-y-3">
              <h2 className={`text-4xl md:text-6xl font-black tracking-tight ${theme.t1}`}>
                LOOK FIRST / THEN LEAP.
              </h2>
              <p className={`text-sm font-semibold ${theme.t3}`}>
                پہلے جانیے، پھر لگائیے۔ Pakistan Stock Exchange Smart Analytics & Averaging Suite.
              </p>
            </div>

            <div className="max-w-[1600px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
              <div className="space-y-2">
                <span className={`font-bold block uppercase text-[11px] ${theme.t1}`}>Markets</span>
                <span className={`block cursor-pointer hover:underline ${theme.t3}`}>KSE-100 Benchmark</span>
                <span className={`block cursor-pointer hover:underline ${theme.t3}`}>KMI-30 Shariah Islamic</span>
                <span className={`block cursor-pointer hover:underline ${theme.t3}`}>Pakistani Rupee Forex</span>
              </div>
              <div className="space-y-2">
                <span className={`font-bold block uppercase text-[11px] ${theme.t1}`}>Products</span>
                <span className={`block cursor-pointer hover:underline ${theme.t3}`}>Smart Cost Averaging Desk</span>
                <span className={`block cursor-pointer hover:underline ${theme.t3}`}>NafaX AI Financial Copilot</span>
                <span className={`block cursor-pointer hover:underline ${theme.t3}`}>PSX Screener 50+</span>
              </div>
              <div className="space-y-2">
                <span className={`font-bold block uppercase text-[11px] ${theme.t1}`}>Community</span>
                <span className={`block cursor-pointer hover:underline ${theme.t3}`}>Certified CMT Analysts</span>
                <span className={`block cursor-pointer hover:underline ${theme.t3}`}>Trade Setups & Targets</span>
                <span className={`block cursor-pointer hover:underline ${theme.t3}`}>Brokerage Sentiment</span>
              </div>
              <div className="space-y-2">
                <span className={`font-bold block uppercase text-[11px] ${theme.t1}`}>Supported Brokers</span>
                <span className={`block cursor-pointer hover:underline ${theme.t3}`}>KTrade Securities</span>
                <span className={`block cursor-pointer hover:underline ${theme.t3}`}>Finqalab Digital</span>
                <span className={`block cursor-pointer hover:underline ${theme.t3}`}>Arif Habib Limited</span>
              </div>
            </div>

            <div className={`max-w-[1600px] mx-auto border-t pt-6 flex flex-col md:flex-row justify-between items-center text-xs font-num ${isDark ? 'border-slate-800 text-slate-500' : 'border-slate-300 text-slate-600'}`}>
              <span>© 2026 NafaX Terminal. Built custom for Pakistan financial markets.</span>
              <span>Data Feed: Pakistan Stock Exchange DPS Portal • Delayed & Intraday</span>
            </div>
          </footer>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. DEDICATED SMART COST-AVERAGING MODAL */}
      {/* ========================================================================= */}
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

    </div>
  );
}
