import type { AcademicYearBlock } from "@/data/academics";

export function sortedAcademicYears(
  blocks: AcademicYearBlock[],
): AcademicYearBlock[] {
  return [...blocks].sort((a, b) => b.sortKey.localeCompare(a.sortKey));
}
