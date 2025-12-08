"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // константы, совпадающие с Sidebar
  const SIDEBAR_EXPANDED = 280;
  const SIDEBAR_COLLAPSED = 90;

  const sidebarWidth =
    isExpanded || isHovered || isMobileOpen
      ? SIDEBAR_EXPANDED
      : SIDEBAR_COLLAPSED;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <AppSidebar />
      <Backdrop />

      {/* MAIN CONTENT */}
      <div
        className="transition-all duration-300 ease-in-out"
        style={{
          marginLeft: `${sidebarWidth}px`,   // ВОТ ЭТО ГЛАВНЫЙ ФИКС
        }}
      >
        <AppHeader />

        <main className="p-6 mx-auto max-w-[1600px]">
          {children}
        </main>
      </div>
    </div>
  );
}
