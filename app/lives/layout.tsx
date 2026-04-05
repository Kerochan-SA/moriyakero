import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ライブ出演",
  description: "メンバー限定・バンド演奏データの閲覧と編集",
};

export default function LivesRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
