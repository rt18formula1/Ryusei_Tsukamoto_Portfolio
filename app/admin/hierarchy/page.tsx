"use client";

import { HierarchyTree } from "@/components/admin/hierarchy-tree";

export default function HierarchyPage() {
  return (
    <div className="p-6 md:p-10 max-w-4xl">
      <h1 className="text-2xl font-black mb-1">Hierarchy</h1>
      <p className="text-sm text-gray-400 mb-8">
        Discipline → Activity → Project / Content → Detail
      </p>
      <HierarchyTree />
    </div>
  );
}
