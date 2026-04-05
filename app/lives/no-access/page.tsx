import Link from "next/link";
import { SignOutButton } from "@/components/band/sign-out-button";

export const dynamic = "force-dynamic";

export default function BandNoAccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-16 text-slate-900">
      <div className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold">閲覧権限がありません</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          ログインはできていますが、
          <code className="rounded bg-slate-100 px-1 text-xs">band_members</code>{" "}
          に登録されていません。管理者に Supabase の SQL でユーザー ID
          の登録を依頼してください。
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-100">
          {`insert into public.band_members (user_id)
  select id from auth.users
  where email = 'あなたのメール';`}
        </pre>
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
