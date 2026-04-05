"use client";

import { useMemo, useState, useTransition } from "react";
import type { BandEntryFormState } from "@/actions/band-entries";
import {
  createBandEntry,
  deleteBandEntry,
  updateBandEntry,
} from "@/actions/band-entries";
import { MEMBER_ROLE_KEYS } from "@/lib/band/constants";

const emptyMembers = (): Record<(typeof MEMBER_ROLE_KEYS)[number], string> => {
  const o = {} as Record<(typeof MEMBER_ROLE_KEYS)[number], string>;
  for (const k of MEMBER_ROLE_KEYS) o[k] = "";
  return o;
};

type Props = {
  mode: "create" | "edit";
  entryId?: string;
  initial?: Partial<BandEntryFormState>;
};

export function BandEntryForm({ mode, entryId, initial }: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const defaultState = useMemo<BandEntryFormState>(
    () => ({
      performance_date: initial?.performance_date ?? "",
      live_name: initial?.live_name ?? "",
      copy_from: initial?.copy_from ?? "",
      video_url: initial?.video_url ?? "",
      members: { ...emptyMembers(), ...initial?.members },
      songs_text: initial?.songs_text ?? "",
      my_parts_text: initial?.my_parts_text ?? "",
      note: initial?.note ?? "",
    }),
    [initial],
  );

  const [form, setForm] = useState<BandEntryFormState>(defaultState);

  function set<K extends keyof BandEntryFormState>(key: K, v: BandEntryFormState[K]) {
    setForm((f) => ({ ...f, [key]: v }));
  }

  function setMember(role: (typeof MEMBER_ROLE_KEYS)[number], v: string) {
    setForm((f) => ({ ...f, members: { ...f.members, [role]: v } }));
  }

  function submit() {
    setError(null);
    startTransition(async () => {
      if (mode === "create") {
        const r = await createBandEntry(form);
        if (r && "error" in r && r.error) setError(r.error);
        return;
      }
      if (!entryId) return;
      const r = await updateBandEntry(entryId, form);
      if (r && "error" in r && r.error) setError(r.error);
    });
  }

  function remove() {
    if (!entryId || !confirm("このエントリを削除しますか？")) return;
    setError(null);
    startTransition(async () => {
      const r = await deleteBandEntry(entryId);
      if (r && "error" in r && r.error) setError(r.error);
    });
  }

  return (
    <div className="space-y-6">
      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-1">
          <span className="text-xs font-medium text-slate-600">日付 *</span>
          <input
            type="date"
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            value={form.performance_date}
            onChange={(e) => set("performance_date", e.target.value)}
          />
        </label>
        <label className="block sm:col-span-1">
          <span className="text-xs font-medium text-slate-600">ライブ名 *</span>
          <input
            type="text"
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            value={form.live_name}
            onChange={(e) => set("live_name", e.target.value)}
            placeholder="例: 九月ライブ2023"
          />
        </label>
        <label className="block sm:col-span-1">
          <span className="text-xs font-medium text-slate-600">コピー元</span>
          <input
            type="text"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            value={form.copy_from}
            onChange={(e) => set("copy_from", e.target.value)}
          />
        </label>
        <label className="block sm:col-span-1">
          <span className="text-xs font-medium text-slate-600">動画 URL</span>
          <input
            type="url"
            inputMode="url"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            value={form.video_url}
            onChange={(e) => set("video_url", e.target.value)}
            placeholder="https://..."
          />
        </label>
      </div>

      <fieldset className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <legend className="px-1 text-sm font-semibold text-slate-800">
          メンバー（役割ごと）
        </legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {MEMBER_ROLE_KEYS.map((role) => (
            <label key={role} className="block">
              <span className="text-xs text-slate-500">{role}</span>
              <input
                type="text"
                className="mt-0.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-base text-slate-900"
                value={form.members[role]}
                onChange={(e) => setMember(role, e.target.value)}
              />
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block">
        <span className="text-xs font-medium text-slate-600">
          演奏した曲（1行に1曲、またはカンマ区切り）
        </span>
        <textarea
          rows={5}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          value={form.songs_text}
          onChange={(e) => set("songs_text", e.target.value)}
        />
      </label>

      <label className="block">
        <span className="text-xs font-medium text-slate-600">
          自分のパート（例: Dr. · Cj.）
        </span>
        <input
          type="text"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          value={form.my_parts_text}
          onChange={(e) => set("my_parts_text", e.target.value)}
        />
      </label>

      <label className="block">
        <span className="text-xs font-medium text-slate-600">備考</span>
        <textarea
          rows={3}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          value={form.note}
          onChange={(e) => set("note", e.target.value)}
        />
      </label>

      <div className="sticky bottom-0 flex flex-col gap-3 border-t border-slate-200 bg-slate-50/95 py-4 pt-4 backdrop-blur sm:flex-row sm:justify-between">
        <button
          type="button"
          disabled={pending}
          onClick={submit}
          className="rounded-lg bg-indigo-600 px-5 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-50"
        >
          {pending ? "保存中…" : mode === "create" ? "追加する" : "更新する"}
        </button>
        {mode === "edit" && entryId ? (
          <button
            type="button"
            disabled={pending}
            onClick={remove}
            className="rounded-lg border border-red-200 bg-white px-5 py-3 text-base font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-50"
          >
            削除
          </button>
        ) : null}
      </div>
    </div>
  );
}
