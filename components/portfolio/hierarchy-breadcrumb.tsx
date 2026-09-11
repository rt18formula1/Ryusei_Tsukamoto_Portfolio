import Link from "next/link";
import type { BreadcrumbItem } from "@/types/portfolio-hierarchy";

interface HierarchyBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function HierarchyBreadcrumb({ items, className = "" }: HierarchyBreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex flex-wrap items-center gap-1.5 sm:gap-2 text-[9px] sm:text-xs font-bold uppercase tracking-widest text-gray-600 ${className}`}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={`${item.label}-${index}`} className="flex items-center gap-1.5 sm:gap-2">
            {index > 0 && <span className="text-gray-300">/</span>}
            {item.href && !isLast ? (
              <Link href={item.href} className="hover:text-black transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-black" : ""}>{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
