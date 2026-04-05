#!/usr/bin/env node
/**
 * data/band/imported.json を Supabase の live_setlist_entries に投入します。
 * 事前に SQL マイグレーションを実行し、SUPABASE_SERVICE_ROLE_KEY を .env.local に設定してください。
 *
 *   node --env-file=.env.local scripts/seed-supabase-from-json.mjs
 *
 * 二重投入を避けるため、実行前にテーブルを空にするか、既存データと重複しないようにしてください。
 */
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY が必要です。",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const jsonPath = path.join(root, "data", "band", "imported.json");
if (!fs.existsSync(jsonPath)) {
  console.error("見つかりません:", jsonPath, "→ 先に npm run import:band");
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const rows = (raw.entries ?? []).map((e) => ({
  performance_date: e.date,
  live_name: e.liveName,
  copy_from: e.copyFrom,
  video_url: e.videoUrl,
  members: e.membersByRole ?? {},
  songs: e.songs ?? [],
  my_parts: e.myParts ?? [],
  note: e.note,
}));

const batch = 40;
for (let i = 0; i < rows.length; i += batch) {
  const chunk = rows.slice(i, i + batch);
  const { error } = await supabase.from("live_setlist_entries").insert(chunk);
  if (error) {
    console.error(error);
    process.exit(1);
  }
  console.log("Inserted", Math.min(i + batch, rows.length), "/", rows.length);
}

console.log("Done.");
