"use client";

const WHAT_MATTERS_ITEMS = [
  "Soft & caring words",
  "Needs reassurance",
  "Loves calm, aesthetic places",
  "Notices small gestures",
] as const;

export function WhatMattersSection() {
  return (
    <section className="px-8 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-px flex-1 bg-romantic-100"></div>
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
          What matters to her
        </h3>
        <div className="h-px flex-1 bg-romantic-100"></div>
      </div>
      <div className="grid grid-cols-2 gap-y-3 gap-x-4">
        {WHAT_MATTERS_ITEMS.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-romantic-300"></div>
            <span className="text-xs text-slate-600 font-medium">{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
