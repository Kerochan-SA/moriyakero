import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <h1 className="text-2xl font-bold text-slate-900">ページが見つかりません</h1>
      <p className="mt-2 text-slate-600">URL をご確認ください。</p>
      <Link
        href="/"
        className="mt-8 text-sm font-medium text-indigo-600 hover:text-indigo-500"
      >
        ホームへ戻る
      </Link>
    </div>
  );
}
