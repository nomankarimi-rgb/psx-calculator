import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol')?.toUpperCase() || 'OGDC';

  try {
    const res = await fetch(`https://dps.psx.com.pk/timeseries/intraday/${symbol}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      },
      cache: 'no-store' // Fresh live data on every request
    });

    const data = await res.json();
    const trades = data?.data;

    if (!trades || trades.length === 0) {
      return NextResponse.json({ error: 'No data' }, { status: 404 });
    }

    // Latest price is the last index
    const latestTrade = trades[trades.length - 1];
    const currentPrice = latestTrade[1];

    return NextResponse.json({ symbol, currentPrice });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}