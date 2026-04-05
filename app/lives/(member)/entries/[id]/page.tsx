import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBandEntryForEdit } from "@/actions/band-entries";
import { BandEntryForm } from "@/components/band/band-entry-form";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: `編集 ${id.slice(0, 8)}…` };
}

export default async function EditBandEntryPage({ params }: Props) {
  const { id } = await params;
  const initial = await getBandEntryForEdit(id);
  if (!initial) notFound();

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900">エントリを編集</h2>
      <div className="mt-8 max-w-3xl">
        <BandEntryForm mode="edit" entryId={id} initial={initial} />
      </div>
    </div>
  );
}
