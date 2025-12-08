"use client";

import Link from "next/link";

export default function SettingsPage() {
    const modules = [
        {
            title: "Users",
            description: "Управление пользователями системы",
            href: "/settings/users",
            icon: (
                <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 20h5v-2a6 6 0 00-12 0v2h5M12 14a6 6 0 100-12 6 6 0 000 12z"
                    />
                </svg>
            ),
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {modules.map((module) => (
                <Link
                    key={module.title}
                    href={module.href}
                    className="p-6 rounded-xl bg-white shadow-theme-sm dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-theme-md transition-shadow"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                            {module.icon}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">{module.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                {module.description}
                            </p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
