"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { MEMBER_ROLE_KEYS } from "@/features/band/lib/constants";
import { getBandAccessState } from "@/features/band/lib/auth-session";
import { membersRecordFromRow } from "@/features/band/lib/db";

type MemberItem = {
  role: string;
  name: string;
};

export type BandEntryFormState = {
  performance_date: string;
  live_name: string;
  copy_from: string;
  video_url: string;
  // Record ではなく MemberItem の配列にする
  members: MemberItem[]; 
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

function normalizeMembers(members: MemberItem[]): MemberItem[] {
  return members
    .map((m) => ({
      role: m.role.trim(),
      name: m.name.trim(),
    }))
    .filter((m) => m.role || m.name);
}

export async function createBandEntry(form: BandEntryFormState) {
  const session = await getBandAccessState();
  if (session.kind !== "ok") return { error: "forbidden" };

  const songs = parseLines(form.songs_text);
  const my_parts = parseParts(form.my_parts_text);

  // 空の名前や役割の行を除外して、配列のまま保存
  const cleanMembers = normalizeMembers(form.members);

  const { error } = await session.supabase.from("live_setlist_entries").insert({
    performance_date: form.performance_date,
    live_name: form.live_name.trim(),
    copy_from: form.copy_from.trim() || null,
    video_url: form.video_url.trim() || null,
    members: cleanMembers, // ここが配列 [ {role: "Gt.", name: "A"}, {role: "Gt.", name: "B"} ] になる
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
  const cleanMembers = normalizeMembers(form.members);

  const { error } = await session.supabase
    .from("live_setlist_entries")
    .update({
      performance_date: form.performance_date,
      live_name: form.live_name.trim(),
      copy_from: form.copy_from.trim() || null,
      video_url: form.video_url.trim() || null,
      members: cleanMembers,
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

  // --- データの正規化（Normalization） ---
  let membersArray: { role: string; name: string }[] = [];
  
  if (Array.isArray(data.members)) {
    // すでに配列形式の場合
    membersArray = data.members as { role: string; name: string }[];
  } else if (typeof data.members === "object" && data.members !== null) {
    // 古いレコード（オブジェクト）形式が残っている場合の変換
    membersArray = Object.entries(data.members as Record<string, string>)
      .map(([role, name]) => ({ role, name }));
  }

  // 1行も無い場合は空の1行を表示させる（UIの利便性のため）
  if (membersArray.length === 0) {
    membersArray = [{ role: "", name: "" }];
  }

  const state: BandEntryFormState = {
    performance_date: data.performance_date,
    live_name: data.live_name,
    copy_from: data.copy_from ?? "",
    video_url: data.video_url ?? "",
    members: membersArray, // 配列として渡す
    songs_text: Array.isArray(data.songs) ? data.songs.join("\n") : "",
    my_parts_text: Array.isArray(data.my_parts) ? data.my_parts.join(" · ") : "",
    note: data.note ?? "",
  };
  
  return state;
}
2