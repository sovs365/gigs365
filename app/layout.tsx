import type { Metadata } from "next";
import AuthProvider from "@/components/providers/AuthProvider";
import ThemeProvider from "@/components/providers/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Campus Task Hive - Academic & Tech Taskshare Platform",
  description:
    "Connect with students for academic help, tech projects, and campus services—all in one hive",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white text-slate-900 antialiased min-h-dvh transition-colors duration-200">
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
