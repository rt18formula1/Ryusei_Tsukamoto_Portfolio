"use client";

import React from "react";
import Image from "next/image";
import type { EquipmentSection } from "@/types/equipment";

interface EquipmentSectionDisplayProps {
  section: EquipmentSection;
}

export function EquipmentSectionDisplay({ section }: EquipmentSectionDisplayProps) {
  if (!section.items || section.items.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mb-10">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">{section.name}</h2>
          {section.description && (
            <p className="mt-3 text-base text-black/60 sm:text-lg">{section.description}</p>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {section.items
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((item) => (
              <div
                key={item.id}
                className="group rounded-2xl border border-black/8 bg-white p-5 shadow-sm hover:border-black/20 transition"
              >
                {item.imageUrl && (
                  <div className="aspect-square rounded-xl overflow-hidden bg-black/5 mb-4">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={400}
                      height={400}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <h3 className="text-lg font-bold text-black">{item.name}</h3>
                {item.description && (
                  <p className="mt-2 text-sm text-black/60 leading-relaxed">{item.description}</p>
                )}
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
