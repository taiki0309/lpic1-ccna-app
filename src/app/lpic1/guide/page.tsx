import Link from "next/link";

const guides = [
  {
    slug: "what-is-linux",
    icon: "🐧",
    title: "Linuxとは？ OSの概念・歴史・仕組みを学ぼう",
    desc: "Linuxの基本コンセプト、GPLライセンス、カーネルとOSの役割、主なディストリビューション（Red Hat系 vs Debian系）の違いを分かりやすく解説。",
    level: "初心者入門",
    levelColor: "#3fb950",
    steps: 5,
    duration: "15分",
    tags: ["Linuxとは", "オープンソース", "OS基礎", "ディストリビューション"],
  },
  {
    slug: "basic-commands",
    icon: "⌨️",
    title: "基本コマンドをマスターしよう",
    desc: "ls, cd, pwd, cp, mv, rm など、LPIC-1 で必須のファイル操作コマンドを実例で学びます。",
    level: "初心者",
    levelColor: "#3fb950",
    steps: 10,
    duration: "20分",
    tags: ["ファイル操作", "ナビゲーション"],
  },
  {
    slug: "permissions",
    icon: "🔐",
    title: "パーミッションと所有権を理解する",
    desc: "chmod, chown, chgrp の仕組みと、rwx 表記・数値表記の読み方を図解で解説。",
    level: "初級",
    levelColor: "#58a6ff",
    steps: 7,
    duration: "25分",
    tags: ["パーミッション", "chmod", "chown"],
  },
  {
    slug: "package-management",
    icon: "📦",
    title: "パッケージ管理（apt / yum / rpm）",
    desc: "Debian 系の apt と Red Hat 系の yum/rpm を使ったパッケージのインストール・管理を学びます。",
    level: "初級",
    levelColor: "#58a6ff",
    steps: 9,
    duration: "20分",
    tags: ["apt", "yum", "rpm", "パッケージ"],
  },
  {
    slug: "shell-scripting",
    icon: "🔧",
    title: "シェルスクリプト入門",
    desc: "変数・条件分岐・ループ・関数を使って実用的なシェルスクリプトを書けるようになります。",
    level: "中級",
    levelColor: "#e3b341",
    steps: 12,
    duration: "40分",
    tags: ["bash", "スクリプト", "自動化"],
  },
  {
    slug: "process-management",
    icon: "⚙️",
    title: "プロセス管理とジョブコントロール",
    desc: "ps, top, kill, nice, bg/fg など、プロセスの監視・制御方法を実例付きで解説。",
    level: "中級",
    levelColor: "#e3b341",
    steps: 8,
    duration: "25分",
    tags: ["プロセス", "ps", "kill", "top"],
  },
];

export default function Lpic1GuidePage() {
  return (
    <main className="relative min-h-screen px-4 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(188,140,255,0.10) 0%, transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-5xl">
        {/* パンくず */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <Link href="/" className="hover:text-[var(--foreground)] transition-colors">ホーム</Link>
          <span>/</span>
          <Link href="/lpic1" className="hover:text-[var(--foreground)] transition-colors">LPIC-1</Link>
          <span>/</span>
          <span className="text-[var(--foreground)]">環境構築ガイド</span>
        </nav>

        {/* ヘッダー */}
        <header className="mb-10">
          <h1 className="mb-2 text-3xl font-extrabold text-[var(--foreground)]">
            📖 環境構築ガイド
          </h1>
          <p className="text-[var(--text-muted)]">
            初心者でも一から Linux 環境を構築し、試験に必要なスキルを身につけられるガイド集です。
          </p>
        </header>

        {/* ガイドカード一覧 */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/lpic1/guide/${guide.slug}`}
              className="card-hover group flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-300 hover:border-[var(--accent-primary)]"
            >
              <div>
                {/* 上部タグ・レベル */}
                <div className="mb-4 flex items-center justify-between">
                  <span
                    className="rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                    style={{
                      borderColor: guide.levelColor,
                      color: guide.levelColor,
                      backgroundColor: `${guide.levelColor}10`,
                    }}
                  >
                    {guide.level}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">⏱ {guide.duration}</span>
                </div>

                {/* アイコン＋タイトル */}
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-3xl">{guide.icon}</span>
                  <h2 className="text-base font-extrabold leading-snug text-[var(--foreground)] group-hover:text-[var(--accent-primary)] transition-colors">
                    {guide.title}
                  </h2>
                </div>

                {/* 説明 */}
                <p className="mb-4 text-xs leading-relaxed text-[var(--text-muted)]">
                  {guide.desc}
                </p>
              </div>

              {/* 下部タグ＆ステップ数 */}
              <div>
                <div className="mb-3 flex flex-wrap gap-1">
                  {guide.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-[var(--surface-2)] px-2 py-0.5 text-xs font-medium text-[var(--text-muted)]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t border-[var(--border)] pt-3 text-xs text-[var(--text-muted)]">
                  <span className="font-semibold">{guide.steps} ステップ</span>
                  <span className="font-bold text-[var(--accent-primary)] group-hover:translate-x-1 transition-transform">
                    ガイドを見る →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
