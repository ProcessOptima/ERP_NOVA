"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useAuth } from "@/context/AuthContext";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  // ✓ Собираем имя
  const fullName = user
    ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
    : "User";

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center dropdown-toggle text-gray-700 dark:text-gray-400"
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          <Image width={44} height={44} src="/images/user/owner.png" alt="User" />
        </span>

        <span className="block mr-1 font-medium text-theme-sm">
          {fullName}
        </span>

        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        {/* USER HEADER */}
        <div>
          <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
            {fullName}
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            {user?.email}
          </span>
        </div>

        {/* MENU BLOCK */}
        <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">

          {/* 1. Edit profile — всегда виден */}
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 text-theme-sm"
            >
              Edit profile
            </DropdownItem>
          </li>

          {/* 2. Account settings — только для ADMIN */}
          {user?.role === "admin" && (
            <li>
              <DropdownItem
                onItemClick={closeDropdown}
                tag="a"
                href="/settings"   // ← наша TailAdmin admin-panel
                className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 text-theme-sm"
              >
                Account settings
              </DropdownItem>
            </li>
          )}

          {/* 3. Support — всегда */}
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="/support"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 text-theme-sm"
            >
              Support
            </DropdownItem>
          </li>
        </ul>

        {/* SIGN OUT */}
        <Link
          href="/signin"
          className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 text-theme-sm"
        >
          Sign out
        </Link>
      </Dropdown>
    </div>
  );
}
