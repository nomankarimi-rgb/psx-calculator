import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol')?.toUpperCase() || 'OGDC';

  try {
    let price = null;
    let isLive = false;

    // 1. Try Intraday first (PSX real-time ticks: /timeseries/int/)
    try {
      const intRes = await fetch(`https://dps.psx.com.pk/timeseries/int/${symbol}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        },
        cache: 'no-store'
      });
      const intData = await intRes.json();
      if (intData?.data && Array.isArray(intData.data) && intData.data.length > 0) {
        // Latest trade find karne ke liye timestamp se sort karein
        const sorted = [...intData.data].sort((a, b) => b[0] - a[0]);
        price = parseFloat(sorted[0][1]);
        isLive = true;
      }
    } catch (e) {
      // Intraday fail hone par EOD try karega
    }

    // 2. Fallback: Agar market closed ho toh aakhri Closing Price (EOD) fetch karein
    if (!price || isNaN(price)) {
      const eodRes = await fetch(`https://dps.psx.com.pk/timeseries/eod/${symbol}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        },
        cache: 'no-store'
      });
      const eodData = await eodRes.json();
      if (eodData?.data && Array.isArray(eodData.data) && eodData.data.length > 0) {
        const sortedEod = [...eodData.data].sort((a, b) => b[0] - a[0]);
        const latest = sortedEod[0];
        // EOD: [timestamp, open, high, low, close, volume]
        price = parseFloat(latest[4] !== undefined ? latest[4] : latest[1]);
        isLive = false;
      }
    }

    if (price && !isNaN(price)) {
      return NextResponse.json({ symbol, currentPrice: price, isLive });
    }

    return NextResponse.json({ error: 'Stock not found' }, { status: 404 });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
