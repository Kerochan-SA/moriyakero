"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, ChevronDown, ChevronUp, Users, Music, Info } from "lucide-react";

type MemberItem = {
  role: string;
  name: string;
};

type Props = {
  r: any;
  canEdit: boolean;
};

export function LiveEntryRow({ r, canEdit }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const members = (r.members as Record<string, string | null>) ?? {};
  const songs = Array.isArray(r.songs) ? r.songs : [];
  const parts = Array.isArray(r.my_parts) ? r.my_parts : [];

  // 表示用：コピー元 / 1曲目
  const firstSongLabel = songs[0] || "曲名未設定";
  const displayLabel = `${r.copy_from || "Original"} / ${firstSongLabel}`;

  return (
    <>
      <tr
        className={`group cursor-pointer transition-colors ${isOpen ? "bg-indigo-50/40" : "hover:bg-slate-50/80"}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <td className="whitespace-nowrap px-3 py-4 font-mono text-[11px] text-slate-500">
          {r.performance_date}
        </td>
        <td className="max-w-[8rem] truncate px-3 py-4 font-medium text-slate-900">
          {r.live_name}
        </td>
        <td className="px-3 py-4">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-700">{displayLabel}</span>
            {songs.length > 1 && (
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                +{songs.length - 1}
              </span>
            )}
          </div>
        </td>
        <td className="px-3 py-4 text-center" onClick={(e) => e.stopPropagation()}>
          {r.video_url ? (
            <a href={String(r.video_url)} target="_blank" rel="noopener noreferrer" className="text-indigo-600">
              <ExternalLink size={14} />
            </a>
          ) : <span className="text-slate-300">-</span>}
        </td>
        <td className="px-3 py-4">
          <span className="text-[10px] font-bold uppercase text-indigo-500">{parts.join(" · ")}</span>
        </td>
        <td className="px-3 py-4 text-slate-400">
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </td>
        <td className="px-3 py-4 text-right" onClick={(e) => e.stopPropagation()}>
          {canEdit ? (
            <Link href={`/lives/entries/${r.id}`} className="text-[11px] font-bold text-indigo-600 hover:underline">
              編集
            </Link>
          ) : <span className="text-slate-300">·</span>}
        </td>
      </tr>

      {/* 詳細展開セクション */}
      {isOpen && (
        <tr className="bg-slate-50/50">
          <td colSpan={7} className="px-6 py-6 border-l-4 border-l-indigo-500">
            <div className="grid gap-8 sm:grid-cols-2">
              {/* 曲リスト */}
              <div>
                <h4 className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                  <Music size={12} /> Setlist
                </h4>
                <ul className="space-y-1.5">
                  {songs.map((song: string, i: number) => (
                    <li key={i} className="flex gap-3 text-sm text-slate-700">
                      <span className="text-slate-300 font-mono text-xs">{String(i + 1).padStart(2, '0')}</span>
                      {song}
                    </li>
                  ))}
                </ul>
              </div>

              {/* メンバー構成 */}
              <div>
                <h4 className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                  <Users size={12} /> Lineup
                </h4>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {(r.members as MemberItem[]).map((m, i) => (
                    <div key={i} className="flex flex-col border-b border-slate-200 pb-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">{m.role}</span>
                      <span className="text-sm font-medium text-slate-700">
                        {canEdit ? m.name : "（非公開）"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}