// src/app/dashboard/page.tsx
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      {/* ВАЖНО: Шапка + сайдбар придут из (dashboard)/layout.tsx */}
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
        <p className="text-gray-600">
          Здесь потом появятся наши CFO-метрики / фин. дэшборд.
        </p>
      </div>
    </ProtectedRoute>
  );
}
