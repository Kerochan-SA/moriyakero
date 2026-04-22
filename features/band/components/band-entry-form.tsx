"use client";

import { useMemo, useState, useTransition } from "react";
import type { BandEntryFormState } from "@/features/band/actions/entries";
import {
  createBandEntry,
  deleteBandEntry,
  updateBandEntry,
} from "@/features/band/actions/entries";
import { MEMBER_ROLE_KEYS } from "@/features/band/lib/constants";
import { Plus, Trash2, Users } from "lucide-react";

const emptyMembers = (): Record<(typeof MEMBER_ROLE_KEYS)[number], string> => {
  const o = {} as Record<(typeof MEMBER_ROLE_KEYS)[number], string>;
  for (const k of MEMBER_ROLE_KEYS) o[k] = "";
  return o;
};

// 1. UI用のメンバー型定義
type MemberItem = {
  role: string;
  name: string;
};

// 2. UI用のフォーム全体の型（membersを配列として定義）
type LocalFormState = Omit<BandEntryFormState, "members"> & {
  members: MemberItem[];
};

type Props = {
  mode: "create" | "edit";
  entryId?: string;
  initial?: Partial<BandEntryFormState>;
  // 過去に登録されたことのある名前や役割を親から渡せるとより便利です
  knownNames?: string[]; 
};

export function BandEntryForm({ mode, entryId, initial, knownNames = [] }: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // 初期化ロジックを修正
  const defaultState = useMemo<LocalFormState>(() => {
    let membersArray: MemberItem[] = [];

    if (Array.isArray(initial?.members)) {
      // 新しい配列形式の場合：そのまま使う
      membersArray = initial.members as MemberItem[];
    } else if (initial?.members && typeof initial.members === "object") {
      // 古いオブジェクト形式の場合：配列に変換する
      membersArray = Object.entries(initial.members)
        .filter((entry): entry is [string, string] => typeof entry[1] === "string" && entry[1] !== "")
        .map(([role, name]) => ({ role, name }));
    }

    return {
      performance_date: initial?.performance_date ?? "",
      live_name: initial?.live_name ?? "",
      copy_from: initial?.copy_from ?? "",
      video_url: initial?.video_url ?? "",
      // 1行も無い場合は空の1行を追加
      members: membersArray.length > 0 ? membersArray : [{ role: "", name: "" }],
      songs_text: initial?.songs_text ?? "",
      my_parts_text: initial?.my_parts_text ?? "",
      note: initial?.note ?? "",
    };
  }, [initial]);

  const [form, setForm] = useState<LocalFormState>(defaultState);

  // 役割の候補リスト（定数 + 入力済みのもの）
  const roleSuggestions = useMemo(() => {
    return Array.from(new Set([...MEMBER_ROLE_KEYS, ...form.members.map(m => m.role)]));
  }, [form.members]);

  function set<K extends keyof LocalFormState>(key: K, v: LocalFormState[K]) {
    setForm((f) => ({ ...f, [key]: v }));
  }

  function updateMember(index: number, field: keyof MemberItem, value: string) {
    const newMembers = [...form.members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    set("members", newMembers);
  }

  function addMember() {
    set("members", [...form.members, { role: "", name: "" }]);
  }

  function removeMember(index: number) {
    const newMembers = form.members.filter((_, i) => i !== index);
    set("members", newMembers.length > 0 ? newMembers : [{ role: "", name: "" }]);
  }

  // 3. 送信時はUIの配列形式をそのまま送る
  function submit() {
    setError(null);

    const payload: BandEntryFormState = {
      ...form,
      members: form.members,
    };

    startTransition(async () => {
      if (mode === "create") {
        const r = await createBandEntry(payload);
        if (r && "error" in r && r.error) setError(r.error);
        return;
      }
      if (!entryId) return;
      const r = await updateBandEntry(entryId, payload);
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

      {/* メンバー構成セクション */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Users className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-bold text-slate-800">メンバー構成</h3>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full border-collapse">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">役割</th>
                <th className="px-4 py-3">名前</th>
                <th className="w-12 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {form.members.map((member, index) => (
                <tr key={index} className="group transition-colors hover:bg-slate-50/50">
                  <td className="p-2">
                    <input
                      type="text"
                      list="role-list"
                      placeholder="例: Vo."
                      className="w-full rounded-lg border-transparent bg-transparent px-3 py-2 text-sm focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 outline-none"
                      value={member.role}
                      onChange={(e) => updateMember(index, "role", e.target.value)}
                    />
                  </td>
                  <td className="p-2 border-l border-slate-50">
                    <input
                      type="text"
                      list="name-list"
                      placeholder="名前を入力"
                      className="w-full rounded-lg border-transparent bg-transparent px-3 py-2 text-sm focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 outline-none"
                      value={member.name}
                      onChange={(e) => updateMember(index, "name", e.target.value)}
                    />
                  </td>
                  <td className="p-2 text-center">
                    <button
                      type="button"
                      onClick={() => removeMember(index)}
                      className="rounded-md p-2 text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 追加ボタン */}
          <div className="p-3 bg-slate-50/30 border-t border-slate-100">
            <button
              type="button"
              onClick={addMember}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-3 text-sm font-bold text-slate-500 transition hover:border-indigo-300 hover:bg-white hover:text-indigo-600"
            >
              <Plus size={18} />
              メンバーを追加
            </button>
          </div>
        </div>
      </section>

      {/* サジェスト用データリスト */}
      <datalist id="role-list">
        {roleSuggestions.map(role => <option key={role} value={role} />)}
      </datalist>
      <datalist id="name-list">
        {knownNames.map(name => <option key={name} value={name} />)}
      </datalist>

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
