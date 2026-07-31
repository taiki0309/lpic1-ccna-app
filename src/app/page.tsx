import Link from "next/link";
import { Suspense } from "react";
import AuthButton from "@/components/AuthButton";

// ── メインページ ──────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 背景グラデーション */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 60% -5%, rgba(88,166,255,0.12) 0%, transparent 55%), radial-gradient(ellipse 50% 45% at 95% 85%, rgba(188,140,255,0.09) 0%, transparent 55%), radial-gradient(ellipse 45% 40% at 5% 75%, rgba(63,185,80,0.06) 0%, transparent 55%)",
        }}
      />

      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">

        {/* ── ページヘッダー ── */}
        <header className="mb-8 flex items-center justify-between animate-fade-in-up">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{
                  background: "var(--accent-secondary)",
                  boxShadow: "0 0 8px var(--accent-secondary)",
                }}
                aria-hidden="true"
              />
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                ITインフラ資格対策
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-4xl">
              今日も、<span style={{
                background: "linear-gradient(135deg, #58a6ff 0%, #bc8cff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>一問一答</span>。
            </h1>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              LPIC-1 / CCNA の合格を、着実に近づけよう。
            </p>
          </div>
          <div className="hidden sm:flex flex-col items-end gap-2">
            <Suspense
              fallback={
                <div className="h-9 w-32 skeleton" />
              }
            >
              <AuthButton />
            </Suspense>
          </div>
        </header>

        {/* ── 今日のミッションカード ── */}
        <section aria-label="今日のミッション" className="mb-8">
          <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
            <span>🎯</span> 今日のミッション
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <MissionCard
              href="/lpic1/quiz"
              icon="⚔️"
              iconBg="rgba(88,166,255,0.15)"
              iconColor="#58a6ff"
              title="弱点克服クエスト"
              desc="苦手カテゴリから5問チャレンジ"
              badge="LPIC-1"
              badgeColor="#58a6ff"
              ctaLabel="始める"
              animDelay="delay-100"
            />
            <MissionCard
              href="/ccna/quiz"
              icon="🔥"
              iconBg="rgba(188,140,255,0.15)"
              iconColor="#bc8cff"
              title="今日のチャレンジ"
              desc="CCNA 10問ランダム演習"
              badge="CCNA"
              badgeColor="#bc8cff"
              ctaLabel="挑戦する"
              animDelay="delay-200"
            />
          </div>
        </section>

        {/* ── 資格コース選択 ── */}
        <section aria-label="資格コースを選択" className="mb-8">
          <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
            <span>📚</span> 資格コース
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <CertCard
              id="lpic1-card"
              href="/lpic1"
              emoji="🐧"
              title="LPIC-1"
              subtitle="Linux 技術者認定 Level 1"
              desc="Linux の基礎から実践まで。コマンド演習・ターミナルシミュレーター・環境構築ガイドを収録。"
              tags={["4択問題", "コマンド練習", "環境構築", "ターミナルシム"]}
              accentColor="#58a6ff"
              gradient="linear-gradient(135deg, #1d6fca, #58a6ff)"
              glowColor="rgba(88,166,255,0.15)"
              animDelay="delay-100"
            />
            <CertCard
              id="ccna-card"
              href="/ccna"
              emoji="🌐"
              title="CCNA"
              subtitle="Cisco ネットワーク技術者認定"
              desc="IPアドレッシング・ルーティング・VLAN を Cisco CLI シミュレーターで実践的に学習。"
              tags={["4択問題", "CLI シム", "ネットワーク図", "D&D形式"]}
              accentColor="#bc8cff"
              gradient="linear-gradient(135deg, #6e40c9, #bc8cff)"
              glowColor="rgba(188,140,255,0.15)"
              animDelay="delay-200"
            />
          </div>
        </section>

        {/* ── 機能リンクグリッド ── */}
        <section aria-label="主な機能" className="mb-8">
          <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
            <span>⚡</span> クイックアクセス
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {quickLinks.map((item, i) => (
              <QuickLink key={item.href} {...item} animDelay={`delay-${(i + 1) * 100}`} />
            ))}
          </div>
        </section>

        {/* ── フッター ── */}
        <footer className="mt-4 text-center text-xs text-[var(--text-muted)]">
          <p>LPIC-1（Exam 101 & 102）・CCNA（200-301）対応</p>
        </footer>
      </div>
    </div>
  );
}

// ── サブコンポーネント ──────────────────────────────────────────────

function MissionCard({
  href, icon, iconBg, iconColor, title, desc, badge, badgeColor, ctaLabel, animDelay,
}: {
  href: string; icon: string; iconBg: string; iconColor: string; title: string;
  desc: string; badge: string; badgeColor: string; ctaLabel: string; animDelay: string;
}) {
  return (
    <Link
      href={href}
      className={`card-hover group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 animate-fade-in-up ${animDelay}`}
    >
      {/* アクセントライン */}
      <div
        className="absolute left-0 top-0 h-full w-1 rounded-l-2xl"
        style={{ background: iconColor }}
        aria-hidden="true"
      />
      {/* アイコン */}
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl"
        style={{ background: iconBg }}
        aria-hidden="true"
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-bold"
            style={{ background: `${badgeColor}22`, color: badgeColor }}
          >
            {badge}
          </span>
        </div>
        <p className="font-bold text-[var(--foreground)] truncate">{title}</p>
        <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate">{desc}</p>
      </div>
      <div
        className="shrink-0 rounded-xl px-4 py-2 text-sm font-bold text-white transition-all duration-200 group-hover:scale-105 group-hover:opacity-90"
        style={{ background: iconColor }}
      >
        {ctaLabel}
      </div>
    </Link>
  );
}

function CertCard({
  id, href, emoji, title, subtitle, desc, tags, accentColor, gradient, glowColor, animDelay,
}: {
  id: string; href: string; emoji: string; title: string; subtitle: string;
  desc: string; tags: string[]; accentColor: string; gradient: string;
  glowColor: string; animDelay: string;
}) {
  return (
    <Link
      id={id}
      href={href}
      className={`card-hover group relative flex flex-col gap-4 overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 animate-fade-in-up ${animDelay}`}
    >
      {/* ホバー時グロー */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${glowColor} 0%, transparent 70%)` }}
      />
      {/* ヘッダー行 */}
      <div className="flex items-center justify-between">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl shadow-lg animate-float"
          style={{ background: gradient }}
          aria-hidden="true"
        >
          {emoji}
        </div>
        <span
          className="rounded-full border px-3 py-1 text-xs font-semibold"
          style={{ borderColor: accentColor, color: accentColor }}
        >
          {subtitle.split(" ")[0]}
        </span>
      </div>
      {/* テキスト */}
      <div>
        <h2 className="mb-1 text-xl font-extrabold text-[var(--foreground)]">{title}</h2>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">{desc}</p>
      </div>
      {/* タグ */}
      <ul className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full bg-[var(--surface-2)] px-2.5 py-1 text-[11px] text-[var(--text-muted)]"
          >
            {tag}
          </li>
        ))}
      </ul>
      {/* CTA */}
      <div
        className="flex items-center gap-1 text-sm font-bold transition-transform duration-300 group-hover:translate-x-1"
        style={{ color: accentColor }}
      >
        学習を開始する →
      </div>
    </Link>
  );
}

function QuickLink({
  href, icon, label, iconBg, animDelay,
}: {
  href: string; icon: string; label: string; iconBg: string; animDelay: string;
}) {
  return (
    <Link
      href={href}
      className={`card-hover group flex flex-col items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-center animate-fade-in-up ${animDelay}`}
    >
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl text-xl"
        style={{ background: iconBg }}
        aria-hidden="true"
      >
        {icon}
      </div>
      <span className="text-xs font-semibold text-[var(--foreground)]">{label}</span>
    </Link>
  );
}

// ── データ ─────────────────────────────────────────────────────────

const quickLinks = [
  { href: "/dashboard", icon: "📊", label: "進捗確認", iconBg: "rgba(88,166,255,0.15)" },
  { href: "/ccna/simulation", icon: "🖥️", label: "CLIシム", iconBg: "rgba(188,140,255,0.15)" },
  { href: "/lpic1/guide", icon: "📖", label: "入門ガイド", iconBg: "rgba(63,185,80,0.15)" },
  { href: "/lpic1/practice", icon: "⌨️", label: "コマンド練習", iconBg: "rgba(227,179,65,0.15)" },
];
