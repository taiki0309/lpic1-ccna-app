import Link from "next/link";
import Image from "next/image";
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

      <div className="mx-auto max-w-5xl px-3 sm:px-8 py-6">
        {/* ── 今日のミッションカード ── */}
        <section aria-label="今日のミッション" className="mb-10">
          <div className="mb-3.5 flex items-center gap-2.5">
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border-2 border-[var(--border)] bg-white shadow-sm shrink-0">
              <Image
                src="/characters/boy.png"
                alt=""
                fill
                className="object-cover"
                sizes="36px"
              />
            </div>
            <h2 className="text-sm font-extrabold uppercase tracking-widest text-[var(--text-muted)]">
              今日のミッション
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <MissionCard
              href="/lpic1/quiz"
              icon="⚔️"
              imgSrc="/characters/boy.png"
              iconBg="rgba(88,166,255,0.15)"
              iconColor="#58a6ff"
              title="弱点克服クエスト"
              desc="苦手カテゴリから厳選問題チャレンジ"
              badge="LPIC-1"
              badgeColor="#58a6ff"
              ctaLabel="始める"
              animDelay="delay-100"
            />
            <MissionCard
              href="/ccna/quiz"
              icon="🔥"
              imgSrc="/characters/teacher.png"
              iconBg="rgba(188,140,255,0.15)"
              iconColor="#bc8cff"
              title="今日のチャレンジ"
              desc="CCNA カテゴリ別実戦問題演習"
              badge="CCNA"
              badgeColor="#bc8cff"
              ctaLabel="挑戦する"
              animDelay="delay-200"
            />
          </div>
        </section>

        {/* ── 資格コース選択 ── */}
        <section aria-label="資格コースを選択" className="mb-10">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border-2 border-[var(--border)] bg-white shadow-sm shrink-0">
              <Image
                src="/characters/teacher.png"
                alt=""
                fill
                className="object-cover"
                sizes="36px"
              />
            </div>
            <h2 className="text-sm font-extrabold uppercase tracking-widest text-[var(--text-muted)]">
              資格学習コース
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <CertCard
              id="lpic1-card"
              href="/lpic1"
              emoji="🐧"
              imgSrc="/characters/lpic.png"
              title="LPIC-1 対策コース"
              subtitle="Linux 技術者認定 Level 1"
              desc="Linux の基礎知識から実践まで。カテゴリ別問題演習・CLIコマンド入力練習で合格力を徹底強化。"
              tags={["4択問題", "コマンド入力練習", "実戦テスト"]}
              accentColor="#58a6ff"
              gradient="linear-gradient(135deg, #1d6fca, #58a6ff)"
              glowColor="rgba(88,166,255,0.15)"
              animDelay="delay-100"
            />
            <CertCard
              id="ccna-card"
              href="/ccna"
              emoji="🌐"
              imgSrc="/characters/ccna.png"
              title="CCNA 対策コース"
              subtitle="Cisco ネットワーク技術者認定"
              desc="IPアドレッシング・ルーティング・VLAN を、選択問題とCisco CLI演習・ドラッグ&ドロップで実践学習。"
              tags={["4択問題", "CLIシミュレーター", "ドラッグ&ドロップ", "実戦テスト"]}
              accentColor="#bc8cff"
              gradient="linear-gradient(135deg, #6e40c9, #bc8cff)"
              glowColor="rgba(188,140,255,0.15)"
              animDelay="delay-200"
            />
          </div>
        </section>

        {/* ── 学習管理・サポート ── */}
        <section aria-label="学習サポート" className="mb-8">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 sm:gap-6 text-center sm:text-left">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shrink-0 border-2 border-[var(--accent-primary)] bg-white shadow-lg">
                <Image
                  src="/characters/advisor.png"
                  alt="アドバイザー"
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-extrabold text-[var(--foreground)]">
                  学習の進捗状況をチェック
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-muted)]">
                  どのカテゴリが得意でどこが苦手か、グラフと正答率でひと目で確認できます。
                </p>
              </div>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[var(--accent-primary)] px-6 py-3 text-sm font-bold text-white hover:opacity-90 transition-opacity shadow-md"
            >
              <span>進捗ボードを見る</span>
              <span>→</span>
            </Link>
          </div>
        </section>

        {/* ── フッター ── */}
        <footer className="mt-12 text-center text-xs text-[var(--text-muted)] border-t border-[var(--border)] pt-6">
          <p>LPIC-1（Exam 101 & 102）・CCNA（200-301）対応 オンライン学習アプリ</p>
        </footer>
      </div>
    </div>
  );
}

// ── サブコンポーネント ──────────────────────────────────────────────

function MissionCard({
  href,
  icon,
  imgSrc,
  iconBg,
  iconColor,
  title,
  desc,
  badge,
  badgeColor,
  ctaLabel,
  animDelay,
}: {
  href: string;
  icon: string;
  imgSrc?: string;
  iconBg: string;
  iconColor: string;
  title: string;
  desc: string;
  badge: string;
  badgeColor: string;
  ctaLabel: string;
  animDelay: string;
}) {
  return (
    <Link
      href={href}
      className={`card-hover group relative flex items-center justify-between gap-3.5 sm:gap-5 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6 animate-fade-in-up ${animDelay}`}
    >
      <div
        className="absolute left-0 top-0 h-full w-2 rounded-l-2xl"
        style={{ background: iconColor }}
        aria-hidden="true"
      />
      <div
        className="relative flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl overflow-hidden border-2 border-[var(--border)] bg-white shadow-md transition-transform duration-300 group-hover:scale-105"
        style={{ background: iconBg }}
        aria-hidden="true"
      >
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={title}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <span className="text-3xl sm:text-4xl">{icon}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-bold"
            style={{ background: `${badgeColor}22`, color: badgeColor }}
          >
            {badge}
          </span>
        </div>
        <p className="font-extrabold text-base sm:text-lg text-[var(--foreground)] truncate">{title}</p>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-0.5 truncate">
          {desc}
        </p>
      </div>
      <div
        className="shrink-0 rounded-xl px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold text-white transition-all duration-200 group-hover:scale-105 group-hover:opacity-90 shadow-sm"
        style={{ background: iconColor }}
      >
        {ctaLabel}
      </div>
    </Link>
  );
}

function CertCard({
  id,
  href,
  emoji,
  imgSrc,
  title,
  subtitle,
  desc,
  tags,
  accentColor,
  gradient,
  glowColor,
  animDelay,
}: {
  id: string;
  href: string;
  emoji: string;
  imgSrc?: string;
  title: string;
  subtitle: string;
  desc: string;
  tags: string[];
  accentColor: string;
  gradient: string;
  glowColor: string;
  animDelay: string;
}) {
  return (
    <Link
      id={id}
      href={href}
      className={`card-hover group relative flex flex-col gap-4 overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 animate-fade-in-up ${animDelay}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${glowColor} 0%, transparent 70%)`,
        }}
      />
      <div className="flex items-center justify-between">
        <div
          className="relative flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl overflow-hidden border-2 border-[var(--border)] bg-white shadow-lg animate-float"
          style={{ background: gradient }}
          aria-hidden="true"
        >
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt={title}
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <span className="text-4xl sm:text-5xl">{emoji}</span>
          )}
        </div>
        <span
          className="rounded-full border px-3.5 py-1 text-xs font-bold"
          style={{ borderColor: accentColor, color: accentColor }}
        >
          {subtitle.split(" ")[0]}
        </span>
      </div>
      <div>
        <h2 className="mb-1.5 text-xl sm:text-2xl font-extrabold text-[var(--foreground)]">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
          {desc}
        </p>
      </div>
      <ul className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-xs text-[var(--text-muted)]"
          >
            {tag}
          </li>
        ))}
      </ul>
      <div
        className="flex items-center gap-1 text-sm font-extrabold transition-transform duration-300 group-hover:translate-x-1 mt-1"
        style={{ color: accentColor }}
      >
        コース学習を開始する →
      </div>
    </Link>
  );
}
