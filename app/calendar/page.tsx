import { getEvents, type DbEvent } from "@/lib/supabase-queries";
import { fetchGoogleEvents } from "@/lib/calendar-service";
import Link from "next/link";
import CalendarPageClient from "@/components/calendar-page-client";

export const revalidate = 3600;

export default async function CalendarPage() {
  let manualEvents: DbEvent[] = [];
  let googleEvents: DbEvent[] = [];

  const results = await Promise.allSettled([
    getEvents(),
    fetchGoogleEvents(),
  ]);

  if (results[0].status === "fulfilled") {
    manualEvents = results[0].value || [];
  } else {
    console.warn("Failed to fetch manual events for calendar:", results[0].reason);
  }

  if (results[1].status === "fulfilled") {
    googleEvents = results[1].value || [];
  } else {
    console.warn("Failed to fetch google events for calendar:", results[1].reason);
  }

  const allEvents = [...manualEvents, ...googleEvents].sort((a, b) => {
    const timeA = a.start_time ? new Date(a.start_time).getTime() : 0;
    const timeB = b.start_time ? new Date(b.start_time).getTime() : 0;
    return timeA - timeB;
  });

  return (
    <div>
      <CalendarPageClient initialEvents={allEvents} />
      <div className="max-w-6xl mx-auto px-4 pb-8 text-right">
        <Link
          href="/f1-database?tab=schedule"
          className="text-xs font-bold text-blue-500 hover:underline"
        >
          → F1 DB で詳細スケジュールを見る / View detailed schedule in F1 DB
        </Link>
      </div>
    </div>
  );
}
