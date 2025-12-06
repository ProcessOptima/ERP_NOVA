import "./globals.css";
import "swiper/swiper-bundle.css";
import "simplebar-react/dist/simplebar.min.css";

import {SidebarProvider} from "@/context/SidebarContext";
import {ThemeProvider} from "@/context/ThemeContext";
import {AuthProvider} from "@/context/AuthContext";

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className="dark:bg-gray-900">
        <ThemeProvider>
            <SidebarProvider>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </SidebarProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}
