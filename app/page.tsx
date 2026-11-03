'use client';

import React, { useState, useEffect } from 'react';

export default function StockAverageDashboard() {
  const [symbol, setSymbol] = useState('OGDC');
  const [livePrice, setLivePrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // Price Mode: 'live' or 'limit'
  const [priceMode, setPriceMode] = useState('live'); 
  const [customLimitPrice, setCustomLimitPrice] = useState('');

  // Brokerage Toggle (PSX Avg: ~0.15% commission + 13% SST = ~0.18% total trade charges)
  const [includeBrokerage, setIncludeBrokerage] = useState(true);
  const BROKERAGE_PERCENTAGE = 0.0018; 

  // Holding Inputs
  const [existingQty, setExistingQty] = useState('');
  const [existingPrice, setExistingPrice] = useState('');
  const [newQty, setNewQty] = useState('');

  // PSX Live Data Fetching
  const fetchLivePrice = async () => {
    if (!symbol) return;
    try {
      setLoading(true);
      setFetchError(null);
      const res = await fetch(`/api/stock?symbol=${symbol}`);
      const data = await res.json();
      
      if (data.currentPrice) {
        setLivePrice(data.currentPrice);
      } else {
        setFetchError('Stock data not found or market closed');
      }
    } catch (err) {
      setFetchError('Failed to fetch PSX data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLivePrice();
    const interval = setInterval(fetchLivePrice, 5000); // 5 sec live polling
    return () => clearInterval(interval);
  }, [symbol]);

  // Calculations Logic
  const eQty = parseFloat(existingQty) || 0;
  const ePrice = parseFloat(existingPrice) || 0;
  const nQty = parseFloat(newQty) || 0;

  // Decide effective buying price: Live vs Limit
  const effectiveBuyPrice = priceMode === 'limit' && customLimitPrice 
    ? parseFloat(customLimitPrice) || 0 
    : (livePrice || 0);

  // Brokerage Calculation
  const rawBuyCost = nQty * effectiveBuyPrice;
  const brokerageCharges = includeBrokerage ? rawBuyCost * BROKERAGE_PERCENTAGE : 0;
  const totalNewInvestment = rawBuyCost + brokerageCharges;

  // Total Portfolio after buying
  const totalShares = eQty + nQty;
  const existingInvestment = eQty * ePrice;
  
  // New Average Price Calculation
  const newAveragePrice = totalShares > 0 
    ? (existingInvestment + totalNewInvestment) / totalShares 
    : 0;

  const avgDifference = ePrice > 0 ? (newAveragePrice - ePrice) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-emerald-400 tracking-tight">PSX Smart Average Portal</h1>
            <p className="text-slate-400 text-sm">Real-time Pakistan Stock Exchange Down/Up Average Calculator</p>
          </div>

          <div className="flex items-center gap-4 bg-slate-950 px-5 py-3 rounded-xl border border-slate-800">
            <div>
              <span className="text-xs text-slate-400 font-semibold block uppercase">PSX Live Price</span>
              <div className="text-2xl font-extrabold text-emerald-400">
                {livePrice ? `PKR ${livePrice.toFixed(2)}` : 'Fetching...'}
              </div>
            </div>
            {loading && <span className="animate-spin text-emerald-500 text-xl">↻</span>}
          </div>
        </div>

        {/* Stock Search Bar */}
        <div className="flex gap-2">
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="Symbol (e.g. OGDC, HUBC, SYS, PSO)"
            className="bg-slate-900 border border-slate-700 px-4 py-2.5 rounded-xl uppercase font-bold text-white tracking-wider outline-none focus:border-emerald-500 w-64"
          />
          <button 
            onClick={fetchLivePrice}
            className="bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 rounded-xl font-bold transition text-sm"
          >
            Refresh Price
          </button>
          {fetchError && <p className="text-red-400 text-sm self-center ml-2">{fetchError}</p>}
        </div>

        {/* Main Dashboard Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Input Controls */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-5">
            <h2 className="text-lg font-bold text-slate-200 border-b border-slate-800 pb-2">1. Existing Holding</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 font-medium">Existing Shares (Qty)</label>
                <input
                  type="number"
                  placeholder="e.g. 1000"
                  value={existingQty}
                  onChange={(e) => setExistingQty(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 mt-1 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium">Existing Avg Price (PKR)</label>
                <input
                  type="number"
                  placeholder="e.g. 125.00"
                  value={existingPrice}
                  onChange={(e) => setExistingPrice(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 mt-1 focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            <h2 className="text-lg font-bold text-slate-200 border-b border-slate-800 pb-2 pt-2">2. New Buying Strategy</h2>

            {/* Price Selection Mode (Live vs Limit) */}
            <div>
              <label className="text-xs text-slate-400 block mb-2 font-medium">Select Buying Rate Type</label>
              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setPriceMode('live')}
                  className={`py-2 text-xs font-bold rounded-lg transition ${
                    priceMode === 'live' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ⚡ Live Price ({livePrice ? `Rs. ${livePrice.toFixed(2)}` : 'Wait'})
                </button>

                <button
                  type="button"
                  onClick={() => setPriceMode('limit')}
                  className={`py-2 text-xs font-bold rounded-lg transition ${
                    priceMode === 'limit' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🎯 Custom Limit Order
                </button>
              </div>
            </div>

            {/* Custom Limit Input (Conditional) */}
            {priceMode === 'limit' && (
              <div className="bg-slate-950 p-3 rounded-xl border border-amber-500/50">
                <label className="text-xs text-amber-400 font-semibold">Your Target Limit Price (PKR)</label>
                <input
                  type="number"
                  placeholder="e.g. 110"
                  value={customLimitPrice}
                  onChange={(e) => setCustomLimitPrice(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 mt-1 text-white focus:border-amber-400 outline-none font-bold"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">Live rate chal raha hai: PKR {livePrice}</span>
              </div>
            )}

            <div>
              <label className="text-xs text-slate-400 font-medium">New Shares To Buy (Qty)</label>
              <input
                type="number"
                placeholder="e.g. 500"
                value={newQty}
                onChange={(e) => setNewQty(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 mt-1 focus:border-emerald-500 outline-none font-bold"
              />
            </div>

            {/* Brokerage Charges Toggle */}
            <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div>
                <span className="text-xs font-semibold block text-slate-300">PSX Brokerage & Taxes (+0.18%)</span>
                <span className="text-[10px] text-slate-500">Includes Commission + CDC + SECP + SST</span>
              </div>
              <input
                type="checkbox"
                checked={includeBrokerage}
                onChange={(e) => setIncludeBrokerage(e.target.checked)}
                className="w-5 h-5 accent-emerald-500 cursor-pointer"
              />
            </div>

          </div>

          {/* Live Calculated Output */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-200 border-b border-slate-800 pb-2">3. Impact Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Target Buy Price:</span>
                  <span className="font-bold text-emerald-400">PKR {effectiveBuyPrice.toFixed(2)}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Total Shares (Old + New):</span>
                  <span className="font-bold">{totalShares} shares</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Trade Raw Value:</span>
                  <span>PKR {rawBuyCost.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>

                {includeBrokerage && (
                  <div className="flex justify-between py-1 border-b border-slate-800 text-xs text-amber-400">
                    <span>Est. Brokerage & Taxes:</span>
                    <span>+ PKR {brokerageCharges.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between py-1 border-b border-slate-800 font-bold text-amber-400">
                  <span>Total Cash Required:</span>
                  <span>PKR {totalNewInvestment.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
              </div>

              {/* Big Highlight Box for New Average */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-emerald-500/40 text-center mt-6">
                <span className="text-xs uppercase font-extrabold text-emerald-400 tracking-wider">
                  Resulting New Average Price
                </span>
                <div className="text-4xl font-black text-white mt-2">
                  PKR {newAveragePrice.toFixed(2)}
                </div>

                {ePrice > 0 && nQty > 0 && (
                  <div className={`text-xs mt-3 font-bold ${avgDifference < 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {avgDifference < 0 
                      ? `📉 Average Down ho gaya: PKR ${Math.abs(avgDifference).toFixed(2)} per share` 
                      : `📈 Average Up ho gaya: PKR ${avgDifference.toFixed(2)} per share`}
                  </div>
                )}
              </div>
            </div>

            <p className="text-[11px] text-slate-500 text-center mt-4">
              Market Open Timings: Mon-Fri 09:15 AM - 03:30 PM PKT
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}