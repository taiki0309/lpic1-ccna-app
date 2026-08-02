import Link from "next/link";

const categories = [
  { name: "システムアーキテクチャ", slug: "architecture", icon: "🖥️", color: "#58a6ff", count: 20 },
  { name: "Linuxインストールとパッケージ管理", slug: "packages", icon: "📦", color: "#3fb950", count: 25 },
  { name: "GNUとUnixコマンド", slug: "commands", icon: "⌨️", color: "#bc8cff", count: 40 },
  { name: "デバイスとファイルシステム", slug: "filesystem", icon: "💾", color: "#e3b341", count: 30 },
  { name: "シェルとスクリプト", slug: "shell", icon: "🔧", color: "#58a6ff", count: 20 },
  { name: "ユーザーとグループ管理", slug: "users", icon: "👥", color: "#3fb950", count: 18 },
];

const quickLinks = [
  {
    href: "/lpic1/guide",
    icon: "📖",
    label: "学習ガイド",
    desc: "Linuxとは？・基礎概念入門",
    color: "#bc8cff",
    gradient: "linear-gradient(135deg, #6e40c9, #bc8cff)",
  },
  {
    href: "/lpic1/quiz",
    icon: "📝",
    label: "問題演習",
    desc: "4択・コマンド補充問題",
    color: "#58a6ff",
    gradient: "linear-gradient(135deg, #1d6fca, #58a6ff)",
  },
  {
    href: "/lpic1/practice",
    icon: "⌨️",
    label: "コマンド練習 (PC専用)",
    desc: "ターミナル実務シミュレーター",
    color: "#3fb950",
    gradient: "linear-gradient(135deg, #196c2e, #3fb950)",
    desktopOnly: true,
  },
];

export default function Lpic1TopPage() {
  return (
    <main className="relative min-h-screen px-4 py-6 sm:py-10">
      {/* 背景 */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(88,166,255,0.12) 0%, transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-5xl">
        {/* パンくず */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <Link href="/" className="hover:text-[var(--foreground)] transition-colors">
            ホーム
          </Link>
          <span>/</span>
          <span className="text-[var(--foreground)]">LPIC-1</span>
        </nav>

        {/* クイックアクション */}
        <section aria-label="学習メニュー" className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              id={`lpic1-${link.href.split("/").pop()}-btn`}
              href={link.href}
              className={`group relative flex-col gap-3 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                (link as any).desktopOnly ? "hidden lg:flex pc-only" : "flex"
              }`}
              style={
                {
                  "--hover-border": link.color,
                } as React.CSSProperties
              }
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                style={{ background: `${link.color}20` }}
              >
                {link.icon}
              </div>
              <div>
                <p className="font-bold text-[var(--foreground)]">{link.label}</p>
                <p className="text-sm text-[var(--text-muted)]">{link.desc}</p>
              </div>
              <div
                className="text-xs font-semibold transition-transform duration-300 group-hover:translate-x-1"
                style={{ color: link.color }}
              >
                始める →
              </div>
            </Link>
          ))}
        </section>

        {/* カテゴリ別学習パス */}
        <section aria-label="カテゴリ別学習">
          <h2 className="mb-4 text-lg font-bold text-[var(--foreground)]">
            カテゴリ別に学ぶ
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/lpic1/quiz?category=${cat.slug}`}
                className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-all duration-200 hover:border-[var(--accent-primary)] hover:bg-[var(--surface-2)]"
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg"
                  style={{ background: `${cat.color}20` }}
                >
                  {cat.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[var(--foreground)]">
                    {cat.name}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">{cat.count} 問</p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4 shrink-0 text-[var(--text-muted)]"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            ))}
          </div>
        </section>

        {/* 試験情報 */}
        <section className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="mb-4 text-base font-bold text-[var(--foreground)]">📋 試験情報</h2>
          <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            {[
              { label: "試験", value: "Exam 101 + 102" },
              { label: "合格ライン", value: "500点 / 800点満点" },
              { label: "問題数", value: "60問 / 各試験" },
              { label: "試験時間", value: "90分 / 各試験" },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[var(--text-muted)]">{item.label}</p>
                <p className="font-semibold text-[var(--foreground)]">{item.value}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
