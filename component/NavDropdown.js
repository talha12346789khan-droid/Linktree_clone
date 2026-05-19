"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { getNavItemHref } from "@/lib/navMenus";

const Chevron = ({ open, className = "" }) => (
  <svg
    className={`transition-transform ${open ? "rotate-180" : ""} ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 14l-7 7m0 0l-7-7m7 7V3"
    />
  </svg>
);

export function DesktopNavDropdown({ menu }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  return (
    <li
      ref={ref}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="relative group"
    >
      <Link
        href={`/${menu.key}`}
        className="flex items-center gap-1 text-xs transition hover:font-bold md:text-sm lg:text-lg"
      >
        {menu.label}
        <Chevron open={open} className="h-2.5 w-2.5 md:h-3 md:w-3 lg:h-4 lg:w-4" />
      </Link>

      {open && (
        <div
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          className="absolute left-0 mt-0 w-48 rounded-lg border border-gray-200 bg-white shadow-lg z-50"
        >
          <ul className="py-2">
            {menu.items.map((item) => (
              <li key={item.slug}>
                <Link
                  href={getNavItemHref(menu.key, item.slug)}
                  className={`block px-4 py-2 transition hover:bg-gray-100 ${
                    item.divider ? "border-t" : ""
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

export function MobileNavDropdown({ menu, onNavigate }) {
  const [open, setOpen] = useState(false);

  const close = () => {
    setOpen(false);
    onNavigate?.();
  };

  return (
    <li className="rounded px-2 py-1 text-sm hover:bg-gray-100">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left text-xs transition hover:font-bold"
      >
        <span>{menu.label}</span>
        <Chevron open={open} className="h-3 w-3" />
      </button>
      {open && (
        <div className="mt-1 overflow-hidden rounded-lg bg-gray-50">
          <ul className="py-1">
            {menu.items.map((item) => (
              <li key={item.slug}>
                <Link
                  href={getNavItemHref(menu.key, item.slug)}
                  onClick={close}
                  className={`block px-2 py-1 text-xs transition hover:bg-gray-200 ${
                    item.divider ? "border-t" : ""
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}
