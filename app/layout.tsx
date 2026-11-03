import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PSX Smart Average Portal",
  description: "Real-time PSX Down/Up Average Calculator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Is script se saara modern design 1 second me load ho jayega */}
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-slate-950 text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
