"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { MemberRoleKey } from "@/lib/band/constants";
import { MEMBER_ROLE_KEYS } from "@/lib/band/constants";
import { getBandAccessState } from "@/lib/auth/band-session";
import { membersRecordFromRow } from "@/lib/band/db";

export type BandEntryFormState = {
  performance_date: string;
  live_name: string;
  copy_from: string;
  video_url: string;
  members: Record<MemberRoleKey, string>;
  songs_text: string;
  my_parts_text: string;
  note: string;
};

function parseLines(text: string): string[] {
  return text
    .split(/\r?\n|,/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseParts(text: string): string[] {
  return text
    .split(/[,、·.]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function membersToJson(m: Record<MemberRoleKey, string>) {
  const o: Record<string, string> = {};
  for (const [k, v] of Object.entries(m)) {
    if (v.trim()) o[k] = v.trim();
  }
  return o;
}

export async function createBandEntry(form: BandEntryFormState) {
  const session = await getBandAccessState();
  if (session.kind !== "ok") return { error: "forbidden" };

  const songs = parseLines(form.songs_text);
  const my_parts = parseParts(form.my_parts_text);

  const { error } = await session.supabase.from("live_setlist_entries").insert({
    performance_date: form.performance_date,
    live_name: form.live_name.trim(),
    copy_from: form.copy_from.trim() || null,
    video_url: form.video_url.trim() || null,
    members: membersToJson(form.members),
    songs,
    my_parts,
    note: form.note.trim() || null,
    created_by: session.user.id,
  });

  if (error) return { error: error.message };

  revalidatePath("/lives");
  revalidatePath("/lives/entries");
  revalidatePath("/lives/stats");
  redirect("/lives/entries");
}

export async function updateBandEntry(id: string, form: BandEntryFormState) {
  const session = await getBandAccessState();
  if (session.kind !== "ok") return { error: "forbidden" };

  const songs = parseLines(form.songs_text);
  const my_parts = parseParts(form.my_parts_text);

  const { error } = await session.supabase
    .from("live_setlist_entries")
    .update({
      performance_date: form.performance_date,
      live_name: form.live_name.trim(),
      copy_from: form.copy_from.trim() || null,
      video_url: form.video_url.trim() || null,
      members: membersToJson(form.members),
      songs,
      my_parts,
      note: form.note.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/lives");
  revalidatePath("/lives/entries");
  revalidatePath("/lives/stats");
  revalidatePath(`/lives/entries/${id}`);
  redirect("/lives/entries");
}

export async function deleteBandEntry(id: string) {
  const session = await getBandAccessState();
  if (session.kind !== "ok") return { error: "forbidden" };

  const { error } = await session.supabase
    .from("live_setlist_entries")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/lives");
  revalidatePath("/lives/entries");
  revalidatePath("/lives/stats");
  redirect("/lives/entries");
}

export async function getBandEntryForEdit(id: string) {
  const session = await getBandAccessState();
  if (session.kind !== "ok") return null;

  const { data, error } = await session.supabase
    .from("live_setlist_entries")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;

  const membersFull = membersRecordFromRow(
    data.members as Record<string, unknown>,
  );
  const members: Record<MemberRoleKey, string> = {} as Record<
    MemberRoleKey,
    string
  >;
  for (const k of MEMBER_ROLE_KEYS) {
    members[k] = membersFull[k] ?? "";
  }

  const state: BandEntryFormState = {
    performance_date: data.performance_date,
    live_name: data.live_name,
    copy_from: data.copy_from ?? "",
    video_url: data.video_url ?? "",
    members,
    songs_text: (data.songs as string[]).join("\n"),
    my_parts_text: (data.my_parts as string[]).join(" · "),
    note: data.note ?? "",
  };
  return state;
}
