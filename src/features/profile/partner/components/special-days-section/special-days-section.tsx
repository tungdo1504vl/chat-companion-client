"use client";

import { useState } from "react";
import {
  CheckSquare,
  Plus,
  Cake,
  Heart,
  TreePine,
  Venus,
  Calendar,
  X,
  Edit2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format, parseISO, differenceInDays } from "date-fns";
import ContentCard from "@/features/profile/common/content-card/content-card";
import type { SpecialDay, SpecialDayType } from "../../types";
import { cn } from "@/libs/tailwind/utils";

interface SpecialDaysSectionProps {
  specialDays?: SpecialDay[];
  onChange?: (days: SpecialDay[]) => void;
  className?: string;
}

// Icon mapping for dynamic icon rendering
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Cake,
  Heart,
  TreePine,
  Venus,
  Calendar,
};

function getDaysRemaining(dateString: string): number | null {
  try {
    const date = parseISO(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    // If the date has passed this year, check next year
    if (date < today) {
      date.setFullYear(date.getFullYear() + 1);
    }

    const diffDays = differenceInDays(date, today);
    return diffDays >= 0 ? diffDays : null;
  } catch {
    return null;
  }
}

function formatSpecialDate(dateString: string): string {
  try {
    return format(parseISO(dateString), "MMMM d");
  } catch {
    return dateString;
  }
}

export function SpecialDaysSection({
  specialDays = [],
  onChange,
  className,
}: SpecialDaysSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDay, setEditingDay] = useState<SpecialDay | null>(null);
  const [newDayName, setNewDayName] = useState("");
  const [newDayDate, setNewDayDate] = useState("");

  const handleToggleNotification = (dayId: string) => {
    if (!onChange) return;
    const updated = specialDays.map((day) =>
      day.id === dayId ? { ...day, notifyEnabled: !day.notifyEnabled } : day
    );
    onChange(updated);
  };

  const handleUpdateDate = (dayId: string, newDate: string) => {
    if (!onChange) return;
    const updated = specialDays.map((day) =>
      day.id === dayId ? { ...day, date: newDate } : day
    );
    onChange(updated);
  };

  const handleDeleteDay = (dayId: string) => {
    if (!onChange) return;
    const updated = specialDays.filter((day) => day.id !== dayId);
    onChange(updated);
  };

  const handleAddCustomDay = () => {
    if (!onChange || !newDayName.trim() || !newDayDate) return;
    const newDay: SpecialDay = {
      id: `custom-${Date.now()}`,
      type: "Custom",
      name: newDayName.trim(),
      date: newDayDate,
      icon: "Calendar",
      iconColor: "bg-blue-100",
      notifyEnabled: false,
    };
    onChange([...specialDays, newDay]);
    setNewDayName("");
    setNewDayDate("");
    setDialogOpen(false);
  };

  const handleEditDay = (day: SpecialDay) => {
    setEditingDay(day);
    setNewDayName(day.name);
    setNewDayDate(day.date);
    setDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!onChange || !editingDay || !newDayName.trim() || !newDayDate) return;
    const updated = specialDays.map((day) =>
      day.id === editingDay.id
        ? { ...day, name: newDayName.trim(), date: newDayDate }
        : day
    );
    onChange(updated);
    setEditingDay(null);
    setNewDayName("");
    setNewDayDate("");
    setDialogOpen(false);
  };

  return (
    <ContentCard className={className}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CheckSquare className="size-5 text-muted-foreground" />
          <h3 className="text-base font-bold">Special Days</h3>
        </div>
        {onChange && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditingDay(null);
                  setNewDayName("");
                  setNewDayDate("");
                }}
              >
                <Plus className="size-4 mr-1" />
                Add Custom
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingDay ? "Edit Special Day" : "Add Custom Day"}
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={newDayName}
                    onChange={(e) => setNewDayName(e.target.value)}
                    placeholder="e.g., Anniversary"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Date</label>
                  <Input
                    type="date"
                    value={newDayDate}
                    onChange={(e) => setNewDayDate(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setDialogOpen(false);
                      setEditingDay(null);
                      setNewDayName("");
                      setNewDayDate("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={editingDay ? handleSaveEdit : handleAddCustomDay}
                    disabled={!newDayName.trim() || !newDayDate}
                  >
                    {editingDay ? "Save" : "Add"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {specialDays.map((day) => {
          const IconComponent = iconMap[day.icon] || Calendar;
          const daysRemaining = getDaysRemaining(day.date);

          return (
            <div
              key={day.id}
              className="flex items-center justify-between gap-4 py-2"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className={cn(
                    "size-10 rounded-full flex items-center justify-center shrink-0",
                    day.iconColor
                  )}
                >
                  <IconComponent className="size-5 text-foreground" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-sm font-medium truncate">
                    {day.name}
                  </span>
                  <div className="flex items-center gap-2">
                    {onChange ? (
                      <Input
                        type="date"
                        value={day.date}
                        onChange={(e) =>
                          handleUpdateDate(day.id, e.target.value)
                        }
                        className="h-6 text-xs w-auto p-1"
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        {formatSpecialDate(day.date)}
                      </span>
                    )}
                    {daysRemaining !== null && daysRemaining !== undefined && (
                      <span className="text-xs text-muted-foreground">
                        {daysRemaining} {daysRemaining === 1 ? "day" : "days"}{" "}
                        left
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {onChange && (
                  <>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditDay(day)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteDay(day.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <X className="size-4" />
                    </Button>
                  </>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    Notify me
                  </span>
                  <Switch
                    checked={day.notifyEnabled}
                    onCheckedChange={() => handleToggleNotification(day.id)}
                    disabled={!onChange}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ContentCard>
  );
}
