import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NafaX Terminal | Pakistan Stock Exchange Live Intelligence",
  description: "TradingView-Grade PSX Market Watch, Screener, Technical Analysis & Smart Cost-Averaging Desk",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script src="https://cdn.tailwindcss.com"></script>
        <style>{`
          /* Official TradingView typography stack */
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Trebuchet MS", Roboto, Ubuntu, sans-serif;
            margin: 0;
            padding: 0;
            width: 75%;
          }
          .font-num {
            font-family: 'JetBrains Mono', -apple-system, monospace;
            font-feature-settings: 'tnum' on, 'lnum' on;
          }
        `}</style>
      </head>
      <body className="w-full min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
