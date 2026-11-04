import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NafaX | Pakistan Stock Exchange & Market Intelligence Terminal",
  description: "TradingView-Grade PSX Trading Platform, Interactive Screener & Smart Cost-Averaging Desk",
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script src="https://cdn.tailwindcss.com"></script>
        <style>{`
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif;
            background-color: #ffffff;
            color: #131722;
          }
          .font-num {
            font-family: 'JetBrains Mono', monospace;
            font-feature-settings: 'tnum' on, 'lnum' on;
          }
        `}</style>
      </head>
      <body className="bg-white text-[#131722] antialiased selection:bg-[#2962ff] selection:text-white">
        {children}
      </body>
    </html>
  );
}
