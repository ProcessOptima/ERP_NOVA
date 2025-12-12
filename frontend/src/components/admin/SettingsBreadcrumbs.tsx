"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";

export default function SettingsBreadcrumbs() {
    const pathname = usePathname();

    const parts = pathname
        .replace("/settings", "")
        .split("/")
        .filter(Boolean);

    return (
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Link
                href="/settings"
                className="hover:text-brand-500 dark:hover:text-brand-400"
            >
                Settings
            </Link>

            {parts.map((part, i) => (
                <span key={i} className="flex items-center gap-2">
          <span>/</span>
          <span className="capitalize text-gray-800 dark:text-white">
            {part}
          </span>
        </span>
            ))}
        </nav>
    );
}
