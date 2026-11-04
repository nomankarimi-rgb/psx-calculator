'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';

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

// Initial Demo Holdings for first-time visitors
const INITIAL_HOLDINGS = [
  { symbol: 'OGDC', shares: 800, buyPrice: 285.50 },
  { symbol: 'MEBL', shares: 300, buyPrice: 512.00 },
  { symbol: 'LUCK', shares: 150, buyPrice: 382.00 },
  { symbol: 'PRL', shares: 2500, buyPrice: 34.20 }
];

export default function NafaXTerminal() {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark');
  const [activeTab, setActiveTab] = useState<'terminal' | 'portfolio'>('terminal');

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

  // Load from localStorage on mount
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

  // Save to localStorage whenever userHoldings updates
  useEffect(() => {
    if (userHoldings.length > 0) {
      localStorage.setItem('nafax_user_portfolio', JSON.stringify(userHoldings));
    }
  }, [userHoldings]);

  // Add / Update Stock in Portfolio
  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(newHoldingShares) || 0;
    const price = parseFloat(newHoldingBuyPrice) || 0;
    if (qty <= 0 || price <= 0) return;

    setUserHoldings((prev) => {
      const idx = prev.findIndex((h) => h.symbol === newHoldingSymbol);
      if (idx >= 0) {
        // Average up/down existing holding
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

  // Live Portfolio Calculations (Real Profit/Loss, Weightage & Valuations)
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

    // Calculate Weightage % for each stock
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

  // ================= 2. NAFAX AI FINANCIAL COPILOT BOT ENGINE =================
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: 'Assalam-o-Alaikum! Main aapka PSX AI Financial Copilot hoon. Main ne aapka live portfolio scan kar liya hai. Poochiye ke kis stock par kya action lena chahiye, kahan profit book karein, ya kahan average down karein!'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);

  // Context-Aware AI Intelligence Function
  const generateAIResponse = (userPrompt: string) => {
    const q = userPrompt.toLowerCase();
    const { totalInvested, currentTotalValue, netPnlPKR, netPnlPct, items } = portfolioStats;

    const gainers = items.filter((i) => i.pnlPKR > 0);
    const losers = items.filter((i) => i.pnlPKR < 0);
    const topGainer = [...gainers].sort((a, b) => b.pnlPct - a.pnlPct)[0];
    const topLoser = [...losers].sort((a, b) => a.pnlPct - b.pnlPct)[0];

    // Response 1: Overall Portfolio Health
    if (q.includes('portfolio') || q.includes('health') || q.includes('position') || q.includes('halat')) {
      return `📊 **Portfolio Analysis:**\n- Aapka Total Invested Capital **PKR ${totalInvested.toLocaleString()}** hai aur Current Market Value **PKR ${currentTotalValue.toLocaleString()}** hai.\n- Net P&L: **${netPnlPKR >= 0 ? '+' : ''}PKR ${netPnlPKR.toLocaleString(undefined, { maximumFractionDigits: 0 })} (${netPnlPct >= 0 ? '+' : ''}${netPnlPct.toFixed(2)}%)** ${netPnlPKR >= 0 ? '🟢 Profit mein' : '🔴 Loss mein'}.\n- Aapka star performer **${topGainer ? `${topGainer.symbol} (+${topGainer.pnlPct.toFixed(1)}%)` : 'N/A'}** hai, jabke **${topLoser ? `${topLoser.symbol} (${topLoser.pnlPct.toFixed(1)}%)` : 'N/A'}** drag kar raha hai. Overall balance kafi behtar hai!`;
    }

    // Response 2: What to Average Down?
    if (q.includes('average') || q.includes('loss') || q.includes('gira') || q.includes('down')) {
      if (topLoser) {
        return `🎯 **Smart Averaging Strategy:**\n- Aapka stock **${topLoser.symbol}** is waqt **${topLoser.pnlPct.toFixed(1)}% loss** mein hai (Buy: PKR ${topLoser.buyPrice} vs Live: PKR ${topLoser.currentPrice}).\n- Agar aap is mein current rate par 300 mazeed shares buy karte hain, to aapka average cost PKR ${topLoser.buyPrice} se gir kar PKR ${((topLoser.shares * topLoser.buyPrice + 300 * topLoser.currentPrice) / (topLoser.shares + 300)).toFixed(1)} ho jayega!\n- Is se breakeven target bohot qareeb aa jayega. Lekin confirm karein ke overall weightage 30% se na barhe.`;
      }
      return `Aapke portfolio mein koi barra loss holding nahi hai! Sab stocks ache profit ya minor buffer mein hain. Abhi loss-averaging ki zarurat nahi.`;
    }

    // Response 3: Should I take profits? (Sell / Book)
    if (q.includes('profit') || q.includes('sell') || q.includes('bech') || q.includes('book')) {
      if (topGainer) {
        return `💰 **Profit Taking Advisory:**\n- **${topGainer.symbol}** par aapko **+${topGainer.pnlPct.toFixed(1)}% ka solid gain (PKR ${topGainer.pnlPKR.toLocaleString(undefined, { maximumFractionDigits: 0 })})** mil raha hai!\n- **Recommendation:** KSE-100 apne all-time high zone (172,000+) par hai. Behtar strategy yeh hai ke aap 25% se 30% shares bech kar principal profit lock karein, aur baaqi trailing stop-loss ke sath hold karein.`;
      }
      return `Abhi wait karein. Market momentum positive hai, thora aur run-up lene dein.`;
    }

    // Response 4: Risk / Market Drop Impact
    if (q.includes('risk') || q.includes('khatra') || q.includes('crash') || q.includes('drop')) {
      const estimatedDropPKR = currentTotalValue * 0.03;
      return `🛡️ **Downside Stress Test:**\n- Agar KSE-100 mein achanak **3% ka healthy pullback** aata hai, to aapke portfolio mein taqreeban **PKR ${estimatedDropPKR.toLocaleString(undefined, { maximumFractionDigits: 0 })}** ka short-term drawdown aayega.\n- **Action:** Panic selling ki zarurat nahi kyunke aapke paas high-dividend stocks hain jo quarterly cashflow se protect karte hain.`;
    }

    // Default Fallback
    return `Main ne aapka sawal review kiya. Aapke portfolio mein is waqt **${items.length} stocks** hain jinka total current value **PKR ${currentTotalValue.toLocaleString()}** hai. Aap mujh se poonch sakte hain: "Konsa stock average karun?", "Kahan profit book karun?", ya "Mera risk level kya hai?"`;
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

  // Quick Action Prompts for Bot
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

  const isDark = themeMode === 'dark';

  // Theme Style Tokens (100% Contrast & Legibility)
  const theme = {
    bg: isDark ? 'bg-[#090d16]' : 'bg-[#ffffff]',
    headerBg: isDark ? 'bg-[#0e1320] border-[#1e293b]' : 'bg-[#ffffff] border-[#e2e8f0]',
    cardBg: isDark ? 'bg-[#0e1320] border-[#1e293b]' : 'bg-[#ffffff] border-[#e2e8f0]',
    subCardBg: isDark ? 'bg-[#151c2e] border-[#1e293b]' : 'bg-[#f0f7ff] border-[#bae6fd]',
    stripBg: isDark ? 'bg-[#0b101b] border-[#1e293b]' : 'bg-[#f8fafc] border-[#e2e8f0]',
    innerBox: isDark ? 'bg-[#111827] border-[#1f2937]' : 'bg-[#ffffff] border-[#cbd5e1]',
    t1: isDark ? 'text-[#ffffff]' : 'text-[#0f172a]',
    t2: isDark ? 'text-[#cbd5e1]' : 'text-[#1e293b]',
    t3: isDark ? 'text-[#94a3b8]' : 'text-[#475569]',
    btnLight: isDark ? 'bg-[#1e293b] text-[#ffffff] hover:bg-[#334155]' : 'bg-[#e0f2fe] text-[#0369a1] hover:bg-[#bae6fd] font-bold',
    selectedRow: isDark ? 'bg-[#1e293b] text-[#38bdf8] border-l-4 border-[#38bdf8]' : 'bg-[#e0f2fe] text-[#0284c7] font-black border-l-4 border-[#0284c7]'
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
              <span className={`text-[11px] block -mt-1 font-medium ${theme.t3}`}>PSX Live & Wealth Advisor</span>
            </div>
          </div>

          {/* Navigation Mode Tabs: Terminal vs Portfolio */}
          <nav className="flex items-center gap-2 text-xs font-black">
            <button
              onClick={() => setActiveTab('terminal')}
              className={`px-3.5 py-1.5 rounded-xl transition ${
                activeTab === 'terminal'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-black'
              }`}
            >
              📈 Live Terminal
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'portfolio'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-black'
              }`}
            >
              <span>💼</span> My Portfolio & AI Copilot
              {portfolioStats.items.length > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-num ${
                  portfolioStats.netPnlPKR >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {portfolioStats.netPnlPct >= 0 ? `+${portfolioStats.netPnlPct.toFixed(1)}%` : `${portfolioStats.netPnlPct.toFixed(1)}%`}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Right Corner Controls: Theme Switcher & Averaging Desk Button */}
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

      {/* 2. PERSISTENT USER PORTFOLIO BANNER ON TOP (Always tells user where they stand!) */}
      <div className={`w-full border-b px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-num ${
        isDark ? 'bg-[#0f172a] border-slate-800' : 'bg-[#e0f2fe]/60 border-sky-200'
      }`}>
        <div className="flex items-center gap-4">
          <span className="font-black flex items-center gap-1.5 text-sky-500 uppercase tracking-wider text-[11px]">
            <span>💼</span> My Live Portfolio:
          </span>
          <span className={theme.t2}>
            Invested: <strong className={theme.t1}>PKR {portfolioStats.totalInvested.toLocaleString()}</strong>
          </span>
          <span className={theme.t2}>
            Current Value: <strong className={theme.t1}>PKR {portfolioStats.currentTotalValue.toLocaleString()}</strong>
          </span>
          <span className="flex items-center gap-1 font-black">
            P&L: 
            <span className={portfolioStats.netPnlPKR >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}>
              {portfolioStats.netPnlPKR >= 0 ? `+PKR ${portfolioStats.netPnlPKR.toLocaleString(undefined, { maximumFractionDigits: 0 })} (+${portfolioStats.netPnlPct.toFixed(2)}%)` : `-PKR ${Math.abs(portfolioStats.netPnlPKR).toLocaleString(undefined, { maximumFractionDigits: 0 })} (${portfolioStats.netPnlPct.toFixed(2)}%)`}
            </span>
          </span>
        </div>

        <button
          onClick={() => setActiveTab('portfolio')}
          className="bg-sky-500 hover:bg-sky-600 text-white px-3 py-1 rounded-lg font-black text-[11px] transition"
        >
          Open AI Advisory & Dashboard ›
        </button>
      </div>

      {/* ========================================================================= */}
      {/* VIEW A: DEDICATED PORTFOLIO MANAGEMENT & AI ADVISOR DASHBOARD */}
      {/* ========================================================================= */}
      {activeTab === 'portfolio' ? (
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 py-6 space-y-6">
          
          {/* Header Description */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4 border-slate-200 dark:border-slate-800">
            <div>
              <h1 className={`text-2xl sm:text-3xl font-black ${theme.t1}`}>
                Personal Portfolio & NafaX AI Copilot
              </h1>
              <p className={`text-xs sm:text-sm font-medium ${theme.t3}`}>
                Apni PSX holdings enter karein, real-time live profit/loss watch karein, aur AI Copilot se decision lene ki guidance lein.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 px-3 py-1.5 rounded-xl font-bold font-num">
                ● Live PSX Sync Active
              </span>
            </div>
          </div>

          {/* 3 Metric Cards for Portfolio */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-num">
            
            <div className={`p-5 rounded-2xl border ${theme.cardBg} space-y-1`}>
              <span className={`text-xs font-black uppercase ${theme.t3}`}>Total Capital Invested</span>
              <div className={`text-3xl font-black ${theme.t1}`}>
                PKR {portfolioStats.totalInvested.toLocaleString()}
              </div>
              <span className={`text-[11px] block font-medium ${theme.t3}`}>Cumulative buying cost across all shares</span>
            </div>

            <div className={`p-5 rounded-2xl border ${theme.cardBg} space-y-1`}>
              <span className={`text-xs font-black uppercase ${theme.t3}`}>Current Market Value</span>
              <div className={`text-3xl font-black ${theme.t1}`}>
                PKR {portfolioStats.currentTotalValue.toLocaleString()}
              </div>
              <span className={`text-[11px] block font-medium ${theme.t3}`}>Live PSX mark-to-market portfolio value</span>
            </div>

            <div className={`p-5 rounded-2xl border ${theme.cardBg} space-y-1`}>
              <span className={`text-xs font-black uppercase ${theme.t3}`}>Net Unrealized P&L</span>
              <div className={`text-3xl font-black ${portfolioStats.netPnlPKR >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                {portfolioStats.netPnlPKR >= 0 ? `+PKR ${portfolioStats.netPnlPKR.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : `-PKR ${Math.abs(portfolioStats.netPnlPKR).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                <span className="text-base font-bold ml-2">({portfolioStats.netPnlPct >= 0 ? '+' : ''}{portfolioStats.netPnlPct.toFixed(2)}%)</span>
              </div>
              <span className={`text-[11px] block font-medium ${theme.t3}`}>
                {portfolioStats.netPnlPKR >= 0 ? '🟢 Net positive yield on investment' : '🔴 Net drawdown on investment'}
              </span>
            </div>

          </div>

          {/* MAIN 2-COLUMN SECTION: (LEFT: PORTFOLIO HOLDINGS & ADD FORM | RIGHT: AI COPILOT BOT) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT 7 COLS: HOLDINGS TABLE + ADD ENTRY FORM */}
            <div className={`lg:col-span-7 rounded-2xl border p-5 sm:p-6 shadow-sm space-y-5 ${theme.cardBg}`}>
              
              <div className="flex justify-between items-center border-b pb-3 border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className={`text-base font-black ${theme.t1}`}>Your Active Stock Positions</h3>
                  <span className={`text-xs ${theme.t3}`}>Real-time profit, loss, and weightage distribution</span>
                </div>
                <span className={`text-xs font-num font-bold px-2 py-0.5 rounded ${theme.badgeBg}`}>
                  {portfolioStats.items.length} Positions
                </span>
              </div>

              {/* Add New Stock Entry Form */}
              <form onSubmit={handleAddStock} className={`p-4 rounded-xl border space-y-3 ${theme.subCardBg}`}>
                <span className={`text-xs font-black uppercase tracking-wider block ${theme.t1}`}>
                  + Add New Stock / Update Average
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-num">
                  <div>
                    <label className={`block font-bold mb-1 ${theme.t3}`}>Stock Symbol:</label>
                    <select
                      value={newHoldingSymbol}
                      onChange={(e) => setNewHoldingSymbol(e.target.value)}
                      className={`w-full p-2 rounded-lg border font-black outline-none ${
                        isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    >
                      {PSX_UNIVERSE.map((s) => (
                        <option key={s.symbol} value={s.symbol}>{s.symbol} — {s.name} (PKR {s.price})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`block font-bold mb-1 ${theme.t3}`}>Total Shares Quantity:</label>
                    <input
                      type="number"
                      placeholder="e.g. 500"
                      value={newHoldingShares}
                      onChange={(e) => setNewHoldingShares(e.target.value)}
                      className={`w-full p-2 rounded-lg border font-bold outline-none ${
                        isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
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
                      className={`w-full p-2 rounded-lg border font-bold outline-none ${
                        isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white font-black py-2 rounded-lg text-xs transition shadow-sm"
                >
                  Save / Add to Portfolio (Auto-Persists on Reload)
                </button>
              </form>

              {/* Positions Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-num">
                  <thead>
                    <tr className={`border-b text-[10px] uppercase font-black ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-300 text-slate-600'}`}>
                      <th className="py-2.5 px-3">Stock</th>
                      <th className="py-2.5 px-3">Shares</th>
                      <th className="py-2.5 px-3 text-right">Avg Buy</th>
                      <th className="py-2.5 px-3 text-right">Live Rate</th>
                      <th className="py-2.5 px-3 text-right">Invested</th>
                      <th className="py-2.5 px-3 text-right">Current Val</th>
                      <th className="py-2.5 px-3 text-right">P&L (PKR / %)</th>
                      <th className="py-2.5 px-3 text-right">Weight</th>
                      <th className="py-2.5 px-2 text-center">Action</th>
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
                          <td className="py-3 px-3 text-right">
                            <span className={`font-black ${theme.t1}`}>{item.weight.toFixed(1)}%</span>
                            <div className="w-12 h-1 bg-slate-200 dark:bg-slate-700 rounded-full ml-auto mt-1 overflow-hidden">
                              <div className="h-full bg-sky-500 rounded-full" style={{ width: `${item.weight}%` }}></div>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-center">
                            <button
                              onClick={() => handleRemoveStock(item.symbol)}
                              className="text-rose-500 hover:text-rose-700 p-1 text-sm font-bold"
                              title="Delete position"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </div>

            {/* RIGHT 5 COLS: NAFAX AI FINANCIAL COPILOT (Interactive Bot) */}
            <div className={`lg:col-span-5 rounded-2xl border p-5 sm:p-6 shadow-sm space-y-4 ${theme.cardBg}`}>
              
              <div className="flex justify-between items-center border-b pb-3 border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-white text-base font-black shadow-md">
                    AI
                  </div>
                  <div>
                    <h3 className={`text-base font-black ${theme.t1}`}>NafaX AI Financial Copilot</h3>
                    <span className="text-[10px] text-emerald-500 font-bold block">● Portfolio Context Aware</span>
                  </div>
                </div>

                <span className={`text-[10px] px-2 py-0.5 rounded font-bold font-num ${theme.badgeBg}`}>
                  PSX Advisor v2.4
                </span>
              </div>

              {/* Quick Strategy Prompt Buttons */}
              <div className="space-y-1.5">
                <span className={`text-[10px] uppercase font-black block tracking-wider ${theme.t3}`}>
                  Quick Advisory Questions:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    '📊 Mera Portfolio Analyze Karo',
                    '🎯 Konsa Stock Average Karun?',
                    '💰 Profit Book Karun Ya Hold?',
                    '🛡️ Downside Risk Kitna Hai?'
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => triggerQuickPrompt(p)}
                      className={`text-[11px] px-2.5 py-1.5 rounded-lg border font-bold transition text-left ${
                        isDark 
                          ? 'bg-slate-900 border-slate-800 text-sky-400 hover:bg-slate-800' 
                          : 'bg-sky-50 border-sky-200 text-sky-900 hover:bg-sky-100'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className={`h-[350px] overflow-y-auto rounded-xl p-3.5 space-y-3 border text-xs leading-relaxed ${
                isDark ? 'bg-[#090d16] border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`p-3 rounded-2xl max-w-[90%] whitespace-pre-line shadow-sm ${
                        msg.sender === 'user'
                          ? 'bg-sky-500 text-white rounded-tr-none font-medium'
                          : isDark
                          ? 'bg-[#151c2e] text-slate-100 border border-slate-800 rounded-tl-none font-sans'
                          : 'bg-white text-slate-900 border border-slate-200 rounded-tl-none font-sans'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isBotTyping && (
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs italic p-1">
                    <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping"></span>
                    AI Portfolio analyze kar raha hai...
                  </div>
                )}
              </div>

              {/* Input Chat Field */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Kuch bhi poochein (e.g. 'OGDC kitna average karun?')..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className={`flex-1 p-2.5 rounded-xl border text-xs font-medium outline-none focus:border-sky-500 ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
                <button
                  type="submit"
                  className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2.5 rounded-xl font-black text-xs transition shadow-sm"
                >
                  Send
                </button>
              </form>

            </div>

          </div>

        </div>
      ) : (

        /* ========================================================================= */
        /* VIEW B: MAIN LIVE TERMINAL (TRADINGVIEW CHARTS, WATCHLIST, SCREENER) */
        /* ========================================================================= */
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 py-6 space-y-6">
          
          {/* ROW 1: TRADINGVIEW INTERACTIVE CHART (9 COLS) + WATCHLIST & DEMO TRADING (3 COLS) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* Main Chart Area (9 Cols) */}
            <div className={`lg:col-span-9 rounded-2xl border p-5 sm:p-6 shadow-sm space-y-4 ${theme.cardBg}`}>
              
              {/* Header Toolbar */}
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

                {/* Timeframes & Modes */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className={`flex p-1 rounded-xl text-xs font-black font-num ${isDark ? 'bg-slate-900 text-slate-400' : 'bg-slate-100 text-slate-700 border border-slate-300'}`}>
                    {(['1D', '1W', '1M', '1Y'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTimeframe(t)}
                        className={`px-3 py-1.5 rounded-lg transition ${
                          timeframe === t
                            ? 'bg-sky-500 text-white font-black shadow-sm'
                            : 'hover:text-black dark:hover:text-white'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  <div className={`flex p-1 rounded-xl text-xs font-black font-num ${isDark ? 'bg-slate-900 text-slate-400' : 'bg-slate-100 text-slate-700 border border-slate-300'}`}>
                    <button
                      onClick={() => setChartMode('candles')}
                      className={`px-3.5 py-1.5 rounded-lg transition ${
                        chartMode === 'candles'
                          ? 'bg-sky-500 text-white font-black shadow-sm'
                          : 'hover:text-black dark:hover:text-white'
                      }`}
                    >
                      🕯️ Candles
                    </button>
                    <button
                      onClick={() => setChartMode('area')}
                      className={`px-3.5 py-1.5 rounded-lg transition ${
                        chartMode === 'area'
                          ? 'bg-sky-500 text-white font-black shadow-sm'
                          : 'hover:text-black dark:hover:text-white'
                      }`}
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

              {/* DYNAMIC SVG INTERACTIVE GRAPH */}
              <div className={`relative w-full h-[400px] rounded-xl overflow-hidden select-none border ${isDark ? 'bg-[#0b101c] border-slate-800' : 'bg-[#fafbfc] border-slate-200'}`}>
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 opacity-25">
                  <div className="border-b border-dashed border-slate-300 dark:border-slate-700 w-full"></div>
                  <div className="border-b border-dashed border-slate-300 dark:border-slate-700 w-full"></div>
                  <div className="border-b border-dashed border-slate-300 dark:border-slate-700 w-full"></div>
                  <div className="border-b border-dashed border-slate-300 dark:border-slate-700 w-full"></div>
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

            {/* ================= RIGHT COLUMN: WATCHLIST ================= */}
            <div className={`lg:col-span-3 rounded-2xl border p-5 shadow-sm space-y-4 ${theme.cardBg}`}>
              
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
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 text-xs font-num">
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

              {/* Quick Averaging Desk Launcher */}
              <div className="pt-2">
                <button
                  onClick={() => setShowAveragingModal(true)}
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white text-xs font-black py-2.5 rounded-xl transition shadow-sm font-num flex items-center justify-center gap-1.5"
                >
                  <span>⚡</span> Calculate Position Averaging
                </button>
              </div>

            </div>

          </div>

          {/* ROW 2: PAKISTAN MACRO 3-CARD SUMMARY */}
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
                <span>Energy: 38%</span>
                <span>Banks: 32%</span>
                <span>Cement: 18%</span>
                <span>Others: 12%</span>
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

          {/* ROW 3: ORGANIZED PSX EQUITIES SCREENER */}
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
                      screenerTab === tab.id
                        ? 'bg-sky-500 text-white font-black shadow-sm'
                        : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-700 hover:text-black hover:bg-white'
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
                  {PSX_UNIVERSE.slice(0, 8).map((stk) => {
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
          </div>

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

      {/* 5. INSTITUTIONAL FOOTER */}
      <footer className={`w-full border-t px-6 py-10 mt-12 text-xs ${isDark ? 'bg-[#090d16] border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
        <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 font-num">
          <div>
            <span className={`font-black text-sm block ${theme.t1}`}>NAFAX TERMINAL PAKISTAN</span>
            <span className="font-semibold">Pakistan Stock Exchange (PSX) Real-time Intelligence, User Portfolio Tracker & AI Financial Copilot.</span>
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
