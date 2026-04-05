/** 一覧シートと同じ役割列（members JSON のキー） */
export const MEMBER_ROLE_KEYS = [
  "Vo.(Gt.&Vo.)",
  "Gt.",
  "Gt. 2",
  "Ba.",
  "Dr.",
  "Key.",
  "Other",
  "Other 2",
  "Other 3",
  "Other 4",
  "Other 5",
  "Other 6",
] as const;

export type MemberRoleKey = (typeof MEMBER_ROLE_KEYS)[number];
