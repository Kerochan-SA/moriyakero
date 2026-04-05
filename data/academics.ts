/**
 * 年度別の履修・成績。公開したくない科目はファイルから省くか、
 * `grade` を付けずに単位・科目名だけにしてください。
 */
export type CourseRecord = {
  /** 科目コード（あれば） */
  code?: string;
  name: string;
  credits: number;
  /** 成績（A, B, 秀・優・良 など。非公開なら undefined） */
  grade?: string;
};

export type AcademicYearBlock = {
  /** 表示名（例: 2025年度） */
  yearLabel: string;
  /** 並び順用。大きい年が上に来るように数字文字列（例: "2025"） */
  sortKey: string;
  courses: CourseRecord[];
  note?: string;
};

export const academicYears: AcademicYearBlock[] = [
  // 例（削除して実データに差し替えてください）:
  // {
  //   yearLabel: "2025年度",
  //   sortKey: "2025",
  //   courses: [
  //     { code: "XXXX", name: "情報学基礎", credits: 2, grade: "A" },
  //   ],
  // },
];
