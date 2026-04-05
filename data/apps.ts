export type AppEntry = {
  id: string;
  title: string;
  description: string;
  /** 公開URLがあればカードから遷移できます */
  url?: string;
  repositoryUrl?: string;
  tags: string[];
};

/**
 * アプリ・制作物の一覧。項目を追加するだけで /apps とトップの抜粋が更新されます。
 */
export const apps: AppEntry[] = [
  {
    id: "zets-movie-share",
    title: "ZETS-movie-share",
    description:
      "軽音サークルのライブ運営を支えるフルスタックWebアプリ。エントリー管理からタイムテーブル作成まで。",
    tags: ["Next.js", "Prisma", "Supabase"],
  },
  {
    id: "ros-robotics",
    title: "ROS Robotics",
    description:
      "ROSを用いたロボット制御アルゴリズムの開発。画像認識やパスプランニングの実装。計算機科学実験4前半。",
    tags: ["C++ / Python", "ROS", "OpenCV"],
  },
];

export function featuredApps(limit = 4) {
  return apps.slice(0, limit);
}
