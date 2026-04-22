import type { SupabaseClient } from "@supabase/supabase-js";

export async function fetchEntriesForList(
  supabase: SupabaseClient,
  opts: { date?: string | null; live?: string | null; q?: string | null },
) {
  let query = supabase
    .from("live_setlist_entries")
    .select("*")
    .order("performance_date", { ascending: false });

  if (opts.date) query = query.eq("performance_date", opts.date);
  if (opts.live) query = query.eq("live_name", opts.live);

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  let rows = data ?? [];
  const search = opts.q?.trim();
  if (search) {
    const low = search.toLowerCase();
    rows = rows.filter((r) => {
      const songs = (r.songs as string[]) ?? [];
      return (
        (r.live_name && String(r.live_name).toLowerCase().includes(low)) ||
        (r.copy_from && String(r.copy_from).toLowerCase().includes(low)) ||
        (r.note && String(r.note).toLowerCase().includes(low)) ||
        songs.some((s) => s.toLowerCase().includes(low))
      );
    });
  }
  return rows;
}

export type LiveGroup = {
  performance_date: string;
  live_name: string;
  count: number;
};

export function groupByLive(
  rows: { performance_date: string; live_name: string }[],
): LiveGroup[] {
  const m = new Map<string, LiveGroup>();
  for (const r of rows) {
    const key = `${r.performance_date}::${r.live_name}`;
    const cur = m.get(key);
    if (cur) cur.count += 1;
    else
      m.set(key, {
        performance_date: r.performance_date,
        live_name: r.live_name,
        count: 1,
      });
  }
  return [...m.values()].sort((a, b) => {
    if (a.performance_date !== b.performance_date) {
      return b.performance_date.localeCompare(a.performance_date);
    }
    return a.live_name.localeCompare(b.live_name, "ja");
  });
}
