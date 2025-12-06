"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <div className="p-6">
                <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
                <p>Добро пожаловать! Авторизация работает корректно.</p>
            </div>
        </ProtectedRoute>
    );
}
