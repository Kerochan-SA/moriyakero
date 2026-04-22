import type { Metadata } from "next";
import { assertBandEditorAccess } from "@/features/band/lib/auth-session";
import { BandEntryForm } from "@/features/band/components/band-entry-form";

export const metadata: Metadata = {
  title: "新規エントリ",
};

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ date?: string; live?: string }>;
};

export default async function NewBandEntryPage({ searchParams }: Props) {
  await assertBandEditorAccess("/lives/entries/new");
  const sp = await searchParams;
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900">演奏を追加</h2>
      <p className="mt-1 text-sm text-slate-600">
        ライブのたびに行を足していけば、概要の「ライブごと」にも反映されます。
      </p>
      <div className="mt-8 max-w-3xl">
        <BandEntryForm
          mode="create"
          initial={{
            performance_date: sp.date ?? "",
            live_name: sp.live ?? "",
          }}
        />
      </div>
    </div>
  );
}
