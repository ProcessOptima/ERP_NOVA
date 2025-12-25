// src/app/(admin)/settings/layout.tsx
import { ReactNode } from "react";
import SettingsBreadcrumbs from "@/components/admin/SettingsBreadcrumbs";

export default function SettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <SettingsBreadcrumbs />
        </div>
      </div>

      {/* 🔑 ОБЯЗАТЕЛЬНЫЙ ВНУТРЕННИЙ ОТСТУП */}
      <div className="px-4 sm:px-6">
        {children}
      </div>
    </div>
  );
}
