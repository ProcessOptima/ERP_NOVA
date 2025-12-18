"use client";

import React, {useState, useRef, useEffect} from "react";
import Link from "next/link";
import Image from "next/image";
import {usePathname} from "next/navigation";
import {useSidebar} from "@/context/SidebarContext";

import {GridIcon, HorizontaLDots, ChevronDownIcon} from "@/icons";

export default function AppSidebar() {
    const {isExpanded, isMobileOpen, isHovered, setIsHovered} = useSidebar();
    const pathname = usePathname();

    const [open, setOpen] = useState(true); // открыто подменю Dashboard
    const showText = isExpanded || isHovered || isMobileOpen;
    const collapsed = !showText;

    const isActive = (path: string) => pathname === path;

    return (
        <aside
            className={`
        fixed top-0 left-0 z-50 h-full bg-white dark:bg-gray-900
        border-r border-gray-200 dark:border-gray-800
        transition-all duration-300 ease-in-out
        ${showText ? "w-[280px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        xl:translate-x-0
      `}
            onMouseEnter={() => !isExpanded && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >

            {/* ЛОГО */}
            <div className={`py-8 flex ${collapsed ? "justify-center" : "justify-start px-6"}`}>
                <Link href="/">
                    {collapsed ? (
                        <Image src="/images/logo/logo-icon.svg" width={32} height={32} alt="logo"/>
                    ) : (
                        <Image
                            src="/images/logo/logo.svg"
                            width={140}
                            height={40}
                            alt="logo"
                            className="dark:hidden"
                        />
                    )}
                </Link>
            </div>

            {/* МЕНЮ */}
            <div className="flex flex-col overflow-y-auto no-scrollbar px-2">

                {/* Заголовок "МЕНЮ" */}
                <h2
                    className={`
            mb-4 text-xs uppercase text-gray-400
            ${collapsed ? "flex justify-center" : "px-4"}
          `}
                >
                    {collapsed ? <HorizontaLDots className="w-5 h-5"/> : "Меню"}
                </h2>

                {/* ГРУППА Dashboard */}
                <div>
                    {/* Заголовок группы Dashboard */}
                    <button
                        onClick={() => setOpen(!open)}
                        className={`
              w-full flex items-center py-3 rounded-lg cursor-pointer transition-all
              ${collapsed ? "justify-center" : "px-4 space-x-3"}
              ${open ? "bg-gray-100 dark:bg-gray-800 text-brand-500" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"}
            `}
                    >
                        <GridIcon className="w-6 h-6"/>

                        {/* Текст DASHBOARD если expanded */}
                        {!collapsed && <span className="menu-item-text">Dashboard</span>}

                        {/* Стрелка */}
                        {!collapsed && (
                            <ChevronDownIcon
                                className={`
                  w-4 h-4 ml-auto transition-transform
                  ${open ? "rotate-180" : "rotate-0"}
                `}
                            />
                        )}
                    </button>

                    {/* Подменю CFO */}
                    {!collapsed && (
                        <ul className={`ml-10 mt-1 flex flex-col gap-1 transition-all duration-300 ${open ? "opacity-100" : "opacity-0 h-0 overflow-hidden"}`}>
                            <li>
                                <Link
                                    href="/dashboard/cfo"
                                    className={`
                    py-2 rounded-md transition-all
                    ${isActive("/dashboard/cfo")
                                        ? "text-brand-500 font-medium"
                                        : "text-gray-600 dark:text-gray-300 hover:text-brand-600"}
                  `}
                                >
                                    CFO
                                </Link>
                            </li>
                        </ul>
                    )}
                </div>
                {/* ===== PERSONS ===== */}
                <Link
                    href="/persons"
                    className={`
    mt-2 w-full flex items-center py-3 rounded-lg cursor-pointer transition-all
    ${collapsed ? "justify-center" : "px-4 space-x-3"}
    ${isActive("/persons")
                        ? "bg-gray-100 dark:bg-gray-800 text-brand-500"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"}
  `}
                >
                    <GridIcon className="w-6 h-6"/>
                    {!collapsed && <span className="menu-item-text">Persons</span>}
                </Link>
            </div>
        </aside>
    );
}
