"use client";

import React, {useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {usePathname} from "next/navigation";
import {useSidebar} from "../context/SidebarContext";

import {
    GridIcon,
    HorizontaLDots,      // ✔ правильное имя иконки
    ChevronDownIcon,     // ✔ правильная стрелка из TailAdmin
} from "../icons";

export default function AppSidebar() {
    const {isExpanded, isMobileOpen, isHovered, setIsHovered} = useSidebar();
    const pathname = usePathname();
    const [open, setOpen] = useState(true);

    const showText = isExpanded || isHovered || isMobileOpen;
    const collapsed = !showText;

    const isActive = (path: string) => pathname === path;

    return (
        <aside
            className={`
        fixed flex flex-col top-0 left-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
        h-full z-50 transition-all duration-300 ease-in-out
        ${showText ? "w-[270px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        xl:translate-x-0
      `}
            onMouseEnter={() => !isExpanded && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* LOGO */}
            <div
                className={`py-8 flex ${showText ? "justify-start" : "xl:justify-center"}`}
            >
                <Link href="/">
                    {showText ? (
                        <Image src="/images/logo/logo.svg" alt="logo" width={150} height={40}/>
                    ) : (
                        <Image src="/images/logo/logo-icon.svg" alt="logo" width={32} height={32}/>
                    )}
                </Link>
            </div>

            {/* MENU */}
            <div className="flex flex-col overflow-y-auto no-scrollbar px-2">
                <h2
                    className={`mb-4 text-xs uppercase flex leading-5 text-gray-400 ${
                        collapsed ? "xl:justify-center" : "justify-start"
                    }`}
                >
                    {showText ? "Меню" : <HorizontaLDots className="w-5 h-5"/>}
                </h2>

                {/* DASHBOARD GROUP */}
                <div>
                    <div
                        className={`menu-item group cursor-pointer ${
                            open ? "menu-item-active" : "menu-item-inactive"
                        }`}
                        onClick={() => setOpen(!open)}
                    >
            <span
                className={open ? "menu-item-icon-active" : "menu-item-icon-inactive"}
            >
              <GridIcon/>
            </span>

                        {showText && (
                            <>
                                <span className="menu-item-text">Dashboard</span>

                                <ChevronDownIcon
                                    className={`
                    w-4 h-4 ml-auto transition-transform duration-300
                    ${open ? "rotate-180" : "rotate-0"}
                  `}
                                />
                            </>
                        )}
                    </div>

                    {/* SUBMENU */}
                    {open && (
                        <ul className="ml-8 mt-1 flex flex-col gap-1">
                            <li>
                                <Link
                                    href="/dashboard/cfo"
                                    className={`menu-item group ${
                                        isActive("/dashboard/cfo")
                                            ? "menu-item-active"
                                            : "menu-item-inactive"
                                    }`}
                                >
                                    {showText && <span className="menu-item-text">CFO</span>}
                                </Link>
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </aside>
    );
}
