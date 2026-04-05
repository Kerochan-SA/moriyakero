#!/usr/bin/env node
/**
 * バンドリスト.xlsx から data/band/imported.json を生成します。
 *
 *   node scripts/import-band-xlsx.mjs
 *   node scripts/import-band-xlsx.mjs /path/to/バンドリスト.xlsx
 *
 * 第1引数が無い場合は data/band-list.xlsx を読みます。
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import XLSX from "xlsx";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const MEMBER_HEADERS = [
  "Vo.(Gt.&Vo.)",
  "Gt.",
  "Gt. 2",
  "Ba.",
  "Dr.",
  "Key.",
  "Other",
  "Other 2",
  "Other 3",
  "Other 4",
  "Other 5",
  "Other 6",
];
const SONG_HEADERS = [
  "演奏した曲1",
  "曲2",
  "曲3",
  "曲4",
  "曲5",
  "曲6",
  "曲7",
  "曲8",
];
const PART_HEADERS = [
  "自分のパート1",
  "自分のパート2",
  "自分のパート3",
  "自分のパート4",
];

function formatDateCell(v) {
  if (v instanceof Date && !Number.isNaN(v.getTime())) {
    const y = v.getUTCFullYear();
    const m = String(v.getUTCMonth() + 1).padStart(2, "0");
    const d = String(v.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}/.test(v)) {
    return v.slice(0, 10);
  }
  return v != null ? String(v) : "";
}

function str(v) {
  if (v == null) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
}

function sheetToMatrix(wb, name) {
  const sh = wb.Sheets[name];
  if (!sh || !sh["!ref"]) return null;
  return XLSX.utils.sheet_to_json(sh, { header: 1, defval: null });
}

function main() {
  const argPath = process.argv[2];
  const defaultPath = path.join(root, "data", "band-list.xlsx");
  const xlsxPath = argPath
    ? path.resolve(argPath)
    : defaultPath;

  if (!fs.existsSync(xlsxPath)) {
    console.error("ファイルが見つかりません:", xlsxPath);
    console.error("Excel を data/band-list.xlsx に置くか、パスを引数で渡してください。");
    process.exit(1);
  }

  const wb = XLSX.readFile(xlsxPath, { cellDates: true, sheetStubs: true });
  const listSheet = wb.Sheets["一覧"];
  if (!listSheet) {
    console.error('シート「一覧」がありません。');
    process.exit(1);
  }

  const rows = XLSX.utils.sheet_to_json(listSheet, { header: 1, defval: null });
  const header = rows[0];
  if (!Array.isArray(header)) {
    console.error("一覧のヘッダーが読めません。");
    process.exit(1);
  }

  const hIndex = Object.fromEntries(
    header.map((h, i) => [h, i]),
  );

  const entries = [];
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    if (!Array.isArray(row)) continue;
    const dateRaw = row[hIndex["年/月/日"]];
    const liveName = str(row[hIndex["ライブ名"]]);
    if (!liveName && !dateRaw) continue;

    const membersByRole = {};
    for (const key of MEMBER_HEADERS) {
      const idx = hIndex[key];
      membersByRole[key] = idx === undefined ? null : str(row[idx]);
    }

    const memberNames = [];
    const seen = new Set();
    for (const key of MEMBER_HEADERS) {
      const n = membersByRole[key];
      if (n && !seen.has(n)) {
        seen.add(n);
        memberNames.push(n);
      }
    }

    const songs = [];
    for (const key of SONG_HEADERS) {
      const idx = hIndex[key];
      const s = idx === undefined ? null : str(row[idx]);
      if (s) songs.push(s);
    }

    const myParts = [];
    for (const key of PART_HEADERS) {
      const idx = hIndex[key];
      const s = idx === undefined ? null : str(row[idx]);
      if (s) myParts.push(s);
    }

    entries.push({
      date: formatDateCell(dateRaw) || "",
      liveName: liveName || "",
      copyFrom: str(row[hIndex["コピー元"]]),
      videoUrl: str(row[hIndex["動画URL"]]),
      membersByRole,
      memberNames,
      songs,
      myParts,
      note: str(row[hIndex["備考"]]),
    });
  }

  const rawSheets = {};
  for (const name of wb.SheetNames) {
    rawSheets[name] = sheetToMatrix(wb, name);
  }

  const out = {
    sourceFile: path.basename(xlsxPath),
    exportedAt: new Date().toISOString(),
    entries,
    rawSheets,
  };

  const outDir = path.join(root, "data", "band");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "imported.json");
  fs.writeFileSync(outPath, JSON.stringify(out), "utf8");
  console.log("書き出し:", outPath, "entries:", entries.length);
}

main();
