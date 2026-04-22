#!/usr/bin/env node
/**
 * features/band/data/imported.json を PostgreSQL (Supabase) の
 * live_setlist_entries に投入します（Prisma 経由）。
 * 事前に SQL マイグレーションを実行し、DATABASE_URL / DIRECT_URL を .env.local に設定してください。
 *
 *   node --env-file=.env.local scripts/seed-supabase-from-json.mjs
 *
 * 二重投入を避けるため、実行前にテーブルを空にするか、既存データと重複しないようにしてください。
 */
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error(
    "DATABASE_URL が必要です（Prisma 用）。",
  );
  process.exit(1);
}

const prisma = new PrismaClient();

const jsonPath = path.join(root, "data", "band", "imported.json");
if (!fs.existsSync(jsonPath)) {
  console.error("見つかりません:", jsonPath, "→ 先に npm run import:band");
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const rows = (raw.entries ?? []).map((e) => ({
  performance_date: new Date(`${e.date}T00:00:00.000Z`),
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
  try {
    await prisma.liveSetlistEntry.createMany({ data: chunk });
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
  console.log("Inserted", Math.min(i + batch, rows.length), "/", rows.length);
}

await prisma.$disconnect();
console.log("Done.");
