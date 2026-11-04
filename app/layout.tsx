import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NafaX Terminal | Pakistan Stock Exchange Live Intelligence",
  description: "TradingView-Grade PSX Trading Suite, Cost-Averaging Desk & Real-time Market Intelligence",
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
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script src="https://cdn.tailwindcss.com"></script>
        <style>{`
          body {
            font-family: 'Plus Jakarta Sans', sans-serif;
          }
          .font-num {
            font-family: 'JetBrains Mono', monospace;
            font-feature-settings: 'tnum' on, 'lnum' on;
          }
        `}</style>
      </head>
      <body className="bg-[#080c14] text-slate-100 min-h-screen antialiased selection:bg-lime-400 selection:text-black">
        {children}
      </body>
    </html>
  );
}
