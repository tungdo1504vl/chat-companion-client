"use client";

import { Calendar, Gift, Map, MapPin } from "lucide-react";

type ActionButton = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

const ACTION_BUTTONS: ActionButton[] = [
  { id: "ask-out", label: "Ask her out", icon: <Calendar /> },
  { id: "plan-date", label: "Plan a date", icon: <Map /> },
  { id: "find-places", label: "Find date places", icon: <MapPin /> },
  { id: "suggest-gift", label: "Suggest a small gift", icon: <Gift /> },
] as const;

export function AlternativeActionsSection() {
  const handleActionClick = (actionId: string) => {
    // Placeholder for now
    console.log(`Action clicked: ${actionId}`);
  };

  return (
    <section className="pl-8 mb-12">
      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
        If you want to take it slower...
      </h3>
      <div className="flex py-1 gap-3 overflow-x-auto hide-scrollbar pr-8">
        {ACTION_BUTTONS.map((button) => (
          <button
            key={button.id}
            onClick={() => handleActionClick(button.id)}
            className="flex-shrink-0 flex items-center gap-2 bg-white/60 border border-romantic-100/50 px-5 py-3 rounded-2xl shadow-sm hover:bg-white transition-colors"
          >
            <span className="material-symbols-outlined text-lg text-romantic-400">
              {button.icon}
            </span>
            <span className="text-sm font-semibold text-slate-700 whitespace-nowrap">
              {button.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
