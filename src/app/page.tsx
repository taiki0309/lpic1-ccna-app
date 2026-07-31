import Link from "next/link";
import { Suspense } from "react";
import AuthButton from "@/components/AuthButton";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-16">
      {/* 背景グラデーション */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(88,166,255,0.15) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(188,140,255,0.10) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 10% 70%, rgba(63,185,80,0.07) 0%, transparent 60%)",
        }}
      />

      {/* ロゴバッジ */}
      <div className="mb-8 flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text-muted)]">
        <span
          className="inline-block h-2 w-2 rounded-full bg-[var(--accent-secondary)] shadow-[0_0_8px_var(--accent-secondary)]"
          aria-hidden="true"
        />
        IT資格対策プラットフォーム
      </div>

      {/* メインタイトル */}
      <h1 className="mb-4 text-center text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl md:text-7xl">
        <span
          style={{
            background:
              "linear-gradient(135deg, #58a6ff 0%, #bc8cff 50%, #3fb950 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          CertPath
        </span>
        <br />
        <span className="text-[var(--foreground)]">学習プラットフォーム</span>
      </h1>

      {/* サブタイトル */}
      <p className="mb-12 max-w-xl text-center text-lg leading-relaxed text-[var(--text-muted)] sm:text-xl">
        LPIC-1・CCNA に完全対応。シミュレーション問題・コマンド練習・
        <br className="hidden sm:block" />
        環境構築ガイドで、初心者から合格まで一本道。
      </p>

      {/* 資格選択カード */}
      <section
        aria-label="資格を選択"
        className="mb-10 grid w-full max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2"
      >
        {/* LPIC-1 カード */}
        <Link
          id="lpic1-card"
          href="/lpic1"
          className="group relative flex flex-col gap-4 overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 transition-all duration-300 hover:border-[#58a6ff] hover:shadow-[0_0_40px_rgba(88,166,255,0.15)] hover:-translate-y-1"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(88,166,255,0.08) 0%, transparent 70%)",
            }}
          />
          <div className="flex items-center justify-between">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl font-black text-white"
              style={{ background: "linear-gradient(135deg, #1d6fca, #58a6ff)" }}
            >
              L1
            </div>
            <span className="rounded-full border border-[#58a6ff] px-3 py-1 text-xs font-semibold text-[#58a6ff]">
              Linux
            </span>
          </div>
          <div>
            <h2 className="mb-2 text-2xl font-extrabold text-[var(--foreground)]">
              LPIC-1
            </h2>
            <p className="text-sm leading-relaxed text-[var(--text-muted)]">
              Linux基礎から実践まで。コマンド練習・ターミナルシミュレーター・
              環境構築ガイドで初心者でも確実に合格。
            </p>
          </div>
          <ul className="flex flex-wrap gap-2">
            {["4択問題", "コマンド練習", "環境構築ガイド", "ターミナルシム"].map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-xs text-[var(--text-muted)]"
              >
                {tag}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-1 text-sm font-semibold text-[#58a6ff] transition-transform duration-300 group-hover:translate-x-1">
            学習を開始 →
          </div>
        </Link>

        {/* CCNA カード */}
        <Link
          id="ccna-card"
          href="/ccna"
          className="group relative flex flex-col gap-4 overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 transition-all duration-300 hover:border-[#bc8cff] hover:shadow-[0_0_40px_rgba(188,140,255,0.15)] hover:-translate-y-1"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(188,140,255,0.08) 0%, transparent 70%)",
            }}
          />
          <div className="flex items-center justify-between">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl font-black text-white"
              style={{ background: "linear-gradient(135deg, #6e40c9, #bc8cff)" }}
            >
              CC
            </div>
            <span className="rounded-full border border-[#bc8cff] px-3 py-1 text-xs font-semibold text-[#bc8cff]">
              Network
            </span>
          </div>
          <div>
            <h2 className="mb-2 text-2xl font-extrabold text-[var(--foreground)]">
              CCNA
            </h2>
            <p className="text-sm leading-relaxed text-[var(--text-muted)]">
              Cisco ネットワーク基礎から応用まで。CLI シミュレーター・
              ネットワーク図問題・ドラッグ&ドロップ形式で実践力を養成。
            </p>
          </div>
          <ul className="flex flex-wrap gap-2">
            {["4択問題", "CLI シム", "ネットワーク図", "ドラッグ&ドロップ"].map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-xs text-[var(--text-muted)]"
              >
                {tag}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-1 text-sm font-semibold text-[#bc8cff] transition-transform duration-300 group-hover:translate-x-1">
            学習を開始 →
          </div>
        </Link>
      </section>

      {/* ナビボタン（ダッシュボード・ログイン/ログアウト） */}
      <div className="mb-12 flex flex-col items-center gap-4 sm:flex-row">
        <Link
          id="dashboard-btn"
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold text-[var(--foreground)] transition-all duration-300 hover:scale-105 hover:border-[var(--accent-primary)]"
        >
          📊 学習ダッシュボード
        </Link>
        {/* 認証状態で切り替わる Suspense ラップ */}
        <Suspense
          fallback={
            <div className="inline-flex h-[46px] w-40 animate-pulse rounded-xl border border-[var(--border)] bg-[var(--surface)]" />
          }
        >
          <AuthButton />
        </Suspense>
      </div>

      {/* 機能紹介カード（リンク付き） */}
      <section
        aria-label="主な機能"
        className="w-full max-w-4xl"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {featureLinks.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="group flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-300 hover:border-[var(--accent-primary)] hover:bg-[var(--surface-2)]"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl text-xl"
                style={{ background: feature.iconBg }}
                aria-hidden="true"
              >
                {feature.icon}
              </div>
              <h2 className="text-base font-semibold text-[var(--foreground)]">
                {feature.title}
              </h2>
              <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                {feature.desc}
              </p>
              <span className="text-xs font-semibold text-[var(--accent-primary)] opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                開く →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* フッター */}
      <footer className="mt-16 text-center text-sm text-[var(--text-muted)]">
        <p>LPIC-1（Exam 101 & 102）・CCNA（200-301）対応</p>
      </footer>
    </main>
  );
}

const featureLinks = [
  {
    href: "/ccna/simulation",
    icon: "🖥️",
    iconBg: "rgba(88,166,255,0.15)",
    title: "シミュレーション問題",
    desc: "実際のターミナル・Cisco CLI を模した本格シミュレーターで、実技力を育てる。",
  },
  {
    href: "/lpic1/guide",
    icon: "📖",
    iconBg: "rgba(63,185,80,0.15)",
    title: "初心者向けガイド",
    desc: "環境構築から基本コマンドまで、ステップバイステップで丁寧に解説。",
  },
  {
    href: "/dashboard",
    icon: "📈",
    iconBg: "rgba(188,140,255,0.15)",
    title: "進捗 & 弱点分析",
    desc: "カテゴリ別正答率・連続学習ストリークで、効率的な学習プランを立てよう。",
  },
];
