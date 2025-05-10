"use client";

import { Button } from "@/components/ui/button";

const STYLES = [
  { id: "bro",      label: "🤝 Брат" },
  { id: "motivate", label: "💪 Мотивация" },
  { id: "therapy",  label: "🧘 Терапия" },
];

export function StylePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (s: string) => void;
}) {
  return (
    <div className="flex gap-2 mb-4">
      {STYLES.map((s) => (
        <Button
          key={s.id}
          variant={value === s.id ? "default" : "outline"}
          onClick={() => onChange(s.id)}
        >
          {s.label}
        </Button>
      ))}
    </div>
  );
}