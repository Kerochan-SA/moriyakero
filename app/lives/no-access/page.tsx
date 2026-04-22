import Link from "next/link";
import { SignOutButton } from "@/features/band/components/sign-out-button";

export const dynamic = "force-dynamic";

export default function BandNoAccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-16 text-slate-900">
      <div className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold">このページは現在使っていません</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          現在はメンバー権限による制御を行っていません。
          編集機能はログイン状態であれば利用できます。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <SignOutButton />
          <Link
            href="/"
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            トップへ
          </Link>
        </div>
      </div>
    </div>
  );
}
