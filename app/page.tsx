import React from 'react';
import { X, Music, Code2, Cpu, ExternalLink, Mail } from 'lucide-react';

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Hero Section */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl font-bold tracking-tight mb-4 text-slate-900">
            洩矢 ケロ / Moriya Kero
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Kyoto University / Engineering / Information Science
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="https://x.com/moriyakero2000"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-slate-900 text-white rounded-full hover:bg-slate-700 transition"
              aria-label="X（旧Twitter）"
            >
              <X size={24} />
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* About Section */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8 border-l-4 border-indigo-500 pl-4">About Me</h2>
          <div className="grid md:grid-cols-2 gap-12 text-slate-700 leading-relaxed">
            <p>
              京都大学工学部情報学科計算機科学コース
              <br />
              データベースを用いたWeb開発からアルゴリズム設計まで
            </p>
            <p>
              京大アンプラグド(Cj.)、ZETS(Dr.)の2つの軽音サークルに所属
              <br />
              ライブイベントの運営を効率化するためのツール開発など、技術を身近な課題解決に活かそうとしている
            </p>
          </div>
        </section>

        {/* Projects Section */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8 border-l-4 border-indigo-500 pl-4">Projects</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Project 1: LiveLog */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-indigo-300 transition group">
              <div className="flex justify-between items-start mb-4">
                <Code2 className="text-indigo-600" size={32} />
                <ExternalLink className="text-slate-300 group-hover:text-indigo-500" size={20} />
              </div>
              <h3 className="text-xl font-bold mb-2">ZETS-movie-share</h3>
              <p className="text-slate-600 text-sm mb-4">
                軽音サークルのライブ運営を支えるフルスタックWebアプリ。エントリー管理からタイムテーブル作成まで。
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-slate-100 text-xs rounded-full">Next.js</span>
                <span className="px-3 py-1 bg-slate-100 text-xs rounded-full">Prisma</span>
                <span className="px-3 py-1 bg-slate-100 text-xs rounded-full">Supabase</span>
              </div>
            </div>

            {/* Project 2: Robotics */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-indigo-300 transition group">
              <div className="flex justify-between items-start mb-4">
                <Cpu className="text-emerald-600" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">ROS Robotics</h3>
              <p className="text-slate-600 text-sm mb-4">
                ROSを用いたロボット制御アルゴリズムの開発。画像認識やパスプランニングの実装。計算機科学実験4前半。もうやりたくない。
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-slate-100 text-xs rounded-full">C++ / Python</span>
                <span className="px-3 py-1 bg-slate-100 text-xs rounded-full">ROS</span>
                <span className="px-3 py-1 bg-slate-100 text-xs rounded-full">OpenCV</span>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section>
          <h2 className="text-2xl font-bold mb-8 border-l-4 border-indigo-500 pl-4">Skills</h2>
          <div className="flex flex-wrap gap-3">
            {['TypeScript', 'Python', 'Next.js', 'Java', 'PostgreSQL', 'supabase', 'Docker', 'ROS', 'OCaml'].map(skill => (
              <span key={skill} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium shadow-sm">
                {skill}
              </span>
            ))}
          </div>
        </section>
      </main>

      <footer className="text-center py-12 text-slate-400 text-sm">
        © 2026 Moriya Kero. Powered by Next.js & Moriyakero.
      </footer>
    </div>
  );
}