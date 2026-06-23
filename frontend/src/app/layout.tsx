'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ProjectProvider } from "@/components/ProjectProvider";
import React, { useState } from 'react';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ProjectProvider>
            <div className="flex flex-col md:flex-row min-h-screen">
              <MobileHeader isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
              <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
              <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 transition-all duration-300">
                {children}
              </main>
            </div>
          </ProjectProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
