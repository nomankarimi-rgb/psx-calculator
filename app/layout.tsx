import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NafaX Terminal | Pakistan Stock Exchange Intelligence",
  description: "TradingView-grade PSX Screener, Smart Averaging & Real-time Market Intelligence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts: Plus Jakarta Sans for UI + JetBrains Mono for financial figures */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script src="https://cdn.tailwindcss.com"></script>
        <style>{`
          body {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          }
          .font-num {
            font-family: 'JetBrains Mono', monospace;
            font-feature-settings: 'tnum' on, 'lnum' on;
          }
        `}</style>
      </head>
      <body className="bg-[#090705] text-stone-200 min-h-screen antialiased selection:bg-orange-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
