// src/app/layout.tsx
import type {ReactNode} from "react";
import {Outfit} from "next/font/google";

import "./globals.css";
import "swiper/swiper-bundle.css";
import "simplebar-react/dist/simplebar.min.css";

import {SidebarProvider} from "@/context/SidebarContext";
import {ThemeProvider} from "@/context/ThemeContext";
import {AuthProvider} from "@/context/AuthContext";

const outfit = Outfit({
    subsets: ["latin"],
});

export default function RootLayout({children}: { children: ReactNode }) {
    return (
        <html lang="en">
        <body
            className={`${outfit.className} bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors`}
        >
        <ThemeProvider>
            <SidebarProvider>
                <AuthProvider>
                    {/* MAIN WRAPPER — важный элемент для TailAdmin */}
                    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
                        {children}
                    </div>
                </AuthProvider>
            </SidebarProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}
