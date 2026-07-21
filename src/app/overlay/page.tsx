"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BanpickOverlay } from "@/features/banpick-overlay/components/BanpickOverlay";
import { initialDraftState } from "@/features/banpick-overlay/data/mockDraft";
import type { DraftState } from "@/types/banpick";

function OverlayContent() {
  const searchParams = useSearchParams();
  const layoutParam = searchParams.get("layout") as "full" | "bottom" | null;
  const layout = layoutParam || "bottom";

  const [draft, setDraft] = useState<DraftState>(() => {
    if (typeof window === "undefined") {
      return initialDraftState;
    }

    const saved = localStorage.getItem("banpick-draft-state");

    if (saved) {
      try {
        return JSON.parse(saved) as DraftState;
      } catch (e) {
        console.error("อ่านสถานะ draft ไม่สำเร็จ", e);
      }
    }

    return initialDraftState;
  });

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "banpick-draft-state" && e.newValue) {
        try {
          setDraft(JSON.parse(e.newValue));
        } catch (err) {
          console.error("อ่านสถานะ draft ล่าสุดไม่สำเร็จ", err);
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return <BanpickOverlay draft={draft} layout={layout} fullScreen />;
}

export default function OverlayPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-transparent" />}>
      <OverlayContent />
    </Suspense>
  );
}
