import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NafaX Terminal | Pakistan Stock Exchange Live Intelligence",
  description: "TradingView-Grade PSX Platform, Paper Trading Simulator & Smart Cost-Averaging Desk",
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script src="https://cdn.tailwindcss.com"></script>
        <script>{`
          tailwind.config = {
            darkMode: 'class',
          }
        `}</script>
        <style>{`
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            margin: 0;
            padding: 0;
            width: 100%;
          }
          .font-num {
            font-family: 'JetBrains Mono', monospace;
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
