"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import type { BreadcrumbItem } from "@/types/portfolio-hierarchy";

interface AdminBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function AdminBreadcrumb({ items, className = "" }: AdminBreadcrumbProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav className={`flex items-center gap-2 text-xs ${className}`}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight className="h-3 w-3 text-black/30" />
          )}
          {item.href ? (
            <a
              href={item.href}
              className="text-black/50 hover:text-black transition-colors"
            >
              {item.label}
            </a>
          ) : (
            <span className="font-bold text-black">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
