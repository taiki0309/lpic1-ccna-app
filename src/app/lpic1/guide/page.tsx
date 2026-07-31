import Link from "next/link";

const guides = [
  {
    slug: "linux-install",
    icon: "💿",
    title: "Linux環境の構築（VirtualBox + Ubuntu）",
    desc: "VirtualBoxにUbuntuをインストールして、実際にコマンドを試せる環境を0から作ります。",
    level: "初心者",
    levelColor: "#3fb950",
    steps: 8,
    duration: "30分",
    tags: ["VirtualBox", "Ubuntu", "インストール"],
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

        {/* レベルフィルター（表示のみ） */}
        <div className="mb-6 flex flex-wrap gap-2">
          {[
            { label: "すべて", color: "var(--accent-primary)", active: true },
            { label: "初心者", color: "#3fb950", active: false },
            { label: "初級", color: "#58a6ff", active: false },
            { label: "中級", color: "#e3b341", active: false },
          ].map((f) => (
            <button
              key={f.label}
              className="rounded-full border px-4 py-1.5 text-sm font-semibold transition-all hover:scale-105"
              style={{
                borderColor: f.active ? f.color : "var(--border)",
                background: f.active ? `${f.color}20` : "var(--surface)",
                color: f.active ? f.color : "var(--text-muted)",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* ガイドカード一覧 */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/lpic1/guide/${guide.slug}`}
              className="group flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent-primary)] hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                  style={{ background: `${guide.levelColor}20` }}
                >
                  {guide.icon}
                </div>
                <span
                  className="rounded-full border px-2 py-0.5 text-xs font-semibold"
                  style={{ borderColor: guide.levelColor, color: guide.levelColor }}
                >
                  {guide.level}
                </span>
              </div>

              <div>
                <h2 className="mb-2 text-sm font-bold leading-snug text-[var(--foreground)]">
                  {guide.title}
                </h2>
                <p className="text-xs leading-relaxed text-[var(--text-muted)]">
                  {guide.desc}
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                <span>🔢 {guide.steps} ステップ</span>
                <span>⏱ {guide.duration}</span>
              </div>

              <div className="flex flex-wrap gap-1">
                {guide.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-[var(--surface-2)] px-2 py-0.5 text-xs text-[var(--text-muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-1 text-xs font-semibold text-[var(--accent-primary)] opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
                ガイドを読む →
              </div>
            </Link>
          ))}
        </div>

        {/* 学習の進め方 */}
        <section className="mt-12 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8">
          <h2 className="mb-6 text-lg font-bold text-[var(--foreground)]">
            🗺️ 推奨学習ルート
          </h2>
          <div className="flex flex-col gap-4">
            {[
              { step: 1, title: "Linux環境の構築", link: "/lpic1/guide/linux-install", color: "#3fb950" },
              { step: 2, title: "基本コマンドをマスター", link: "/lpic1/guide/basic-commands", color: "#3fb950" },
              { step: 3, title: "コマンド練習でアウトプット", link: "/lpic1/practice", color: "#58a6ff" },
              { step: 4, title: "パーミッション・パッケージ管理", link: "/lpic1/guide/permissions", color: "#58a6ff" },
              { step: 5, title: "問題演習で実力チェック", link: "/lpic1/quiz", color: "#e3b341" },
            ].map((item, i, arr) => (
              <div key={item.step} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black text-white"
                    style={{ background: item.color }}
                  >
                    {item.step}
                  </div>
                  {i < arr.length - 1 && (
                    <div className="mt-1 h-6 w-px bg-[var(--border)]" />
                  )}
                </div>
                <Link
                  href={item.link}
                  className="group mt-1 text-sm font-semibold text-[var(--foreground)] transition-colors hover:text-[var(--accent-primary)]"
                >
                  {item.title}
                  <span className="ml-1 opacity-0 transition-opacity group-hover:opacity-100"> →</span>
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
