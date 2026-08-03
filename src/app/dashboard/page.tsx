"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { getUserId } from "@/lib/submitAnswer";

interface CategoryStat {
  name: string;
  progress: number;
  total: number;
  answered: number;
}

interface CertStat {
  cert: string;
  href: string;
  color: string;
  gradient: string;
  icon: string;
  imageSrc?: string;
  progress: number;
  totalQuestions: number;
  answered: number;
  correct: number;
  categories: CategoryStat[];
}

interface Badge {
  id: string;
  name: string;
  icon: string;
  desc: string;
}

interface HistoryItem {
  cert?: string;
  questionId?: string;
  category?: string;
  isCorrect?: boolean;
  answeredAt?: string;
}

const defaultCertStats: CertStat[] = [
  {
    cert: "LPIC-1",
    href: "/lpic1",
    color: "#58a6ff",
    gradient: "linear-gradient(135deg, #1d6fca, #58a6ff)",
    icon: "🐧",
    imageSrc: "/characters/lpic.png",
    progress: 0,
    totalQuestions: 100,
    answered: 0,
    correct: 0,
    categories: [
      { name: "システムアーキテクチャ", progress: 0, total: 15, answered: 0 },
      { name: "Linuxインストール&パッケージ", progress: 0, total: 15, answered: 0 },
      { name: "GNUとUnixコマンド", progress: 0, total: 25, answered: 0 },
      { name: "デバイス&ファイルシステム", progress: 0, total: 15, answered: 0 },
      { name: "シェル&スクリプト", progress: 0, total: 15, answered: 0 },
      { name: "ユーザー&グループ管理", progress: 0, total: 15, answered: 0 },
    ],
  },
  {
    cert: "CCNA",
    href: "/ccna",
    color: "#bc8cff",
    gradient: "linear-gradient(135deg, #6e40c9, #bc8cff)",
    icon: "🐱",
    imageSrc: "/characters/ccna.png",
    progress: 0,
    totalQuestions: 100,
    answered: 0,
    correct: 0,
    categories: [
      { name: "ネットワーク基礎", progress: 0, total: 20, answered: 0 },
      { name: "IPアドレッシング", progress: 0, total: 15, answered: 0 },
      { name: "ルーティング", progress: 0, total: 20, answered: 0 },
      { name: "スイッチング・VLAN", progress: 0, total: 15, answered: 0 },
      { name: "セキュリティ", progress: 0, total: 15, answered: 0 },
      { name: "WAN & クラウド", progress: 0, total: 15, answered: 0 },
    ],
  },
];

const defaultStatsSummary = [
  { label: "連続学習", value: "0日", icon: "🔥" },
  { label: "総回答数", value: "0問", icon: "📝" },
  { label: "全体正答率", value: "-%", icon: "🎯" },
  { label: "取得バッジ", value: "0個", icon: "🏅" },
];

export default function DashboardPage() {
  const { authStatus, user } = useAuthenticator((ctx) => [ctx.authStatus, ctx.user]);
  const [certStats, setCertStats] = useState<CertStat[]>(defaultCertStats);
  const [statsSummary, setStatsSummary] = useState(defaultStatsSummary);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [recentHistory, setRecentHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getDisplayName = (usr: any): string => {
    if (!usr) return 'ユーザー';
    const customName =
      usr.attributes?.name ||
      usr.attributes?.preferred_username ||
      usr.attributes?.nickname ||
      usr.attributes?.given_name ||
      usr.name ||
      usr.displayName;
    if (typeof customName === 'string' && customName.trim().length > 0) {
      return customName.trim();
    }
    const id =
      usr.signInDetails?.loginId ||
      usr.attributes?.email ||
      usr.username ||
      'ユーザー';
    if (typeof id === 'string') {
      if (id.includes('@')) {
        return id.split('@')[0];
      }
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(id)) {
        return '学習者';
      }
      return id;
    }
    return 'ユーザー';
  };

  const displayName = getDisplayName(user);

  const fetchProgressData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const userId = await getUserId();
      const res = await fetch(`/api/progress?userId=${encodeURIComponent(userId)}`);
      const data = await res.json();
      if (data.success) {
        if (data.certStats) setCertStats(data.certStats);
        if (data.statsSummary) setStatsSummary(data.statsSummary);
        if (data.badges) setBadges(data.badges);
        if (data.recentHistory) setRecentHistory(data.recentHistory);
      }
    } catch (err) {
      console.error("[Dashboard] 学習データ取得エラー:", err);
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProgressData();
  }, []);

  return (
    <main className="relative min-h-screen px-4 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(88,166,255,0.10) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 90% 80%, rgba(188,140,255,0.08) 0%, transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-5xl">
        {/* パンくず */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <Link href="/" className="hover:text-[var(--foreground)] transition-colors">
            ホーム
          </Link>
          <span>/</span>
          <span className="text-[var(--foreground)]">ダッシュボード</span>
        </nav>

        {/* ヘッダー */}
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="mb-2 text-3xl font-extrabold text-[var(--foreground)] flex items-center gap-2">
              <span>📊</span>
              <span>学習ダッシュボード</span>
            </h1>
            <p className="text-sm text-[var(--text-muted)] flex flex-wrap items-center gap-1.5">
              {authStatus === 'authenticated' && (
                <span className="font-bold text-[var(--accent-primary)] bg-[var(--surface-2)] px-2.5 py-0.5 rounded-md border border-[var(--border)]">
                  👋 こんにちは、{displayName} さん！
                </span>
              )}
              <span>各資格の学習進捗・弱点カテゴリを一目で把握できます。</span>
            </p>
          </div>
        </header>

        {/* 資格別進捗カード */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {certStats.map((cert) => (
            <div
              key={cert.cert}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm transition-all hover:shadow-md"
            >
              {/* 資格ヘッダー */}
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="relative flex h-16 w-16 sm:h-20 sm:w-20 overflow-hidden items-center justify-center rounded-2xl bg-white shadow-lg border-2 border-[var(--border)] shrink-0"
                    style={{ background: cert.gradient }}
                  >
                    {cert.imageSrc ? (
                      <Image
                        src={cert.imageSrc}
                        alt={`${cert.cert} アイコン`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <span className="text-3xl sm:text-4xl font-black text-white">{cert.icon}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-extrabold text-base sm:text-lg text-[var(--foreground)]">{cert.cert}</p>
                    <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-0.5">
                      {cert.answered} / {cert.totalQuestions} 問回答済み
                      {cert.answered > 0 && (
                        <span className="ml-2 font-bold text-[var(--accent-primary)]">
                          (正解: {cert.correct}問)
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <Link
                  href={cert.href}
                  className="text-xs font-semibold transition-colors hover:text-[var(--foreground)]"
                  style={{ color: cert.color }}
                >
                  学習する →
                </Link>
              </div>

              {/* 全体進捗バー */}
              <div className="mb-1 flex justify-between text-xs text-[var(--text-muted)]">
                <span>全体進捗</span>
                <span className="font-bold">{cert.progress}%</span>
              </div>
              <div className="mb-5 h-2.5 overflow-hidden rounded-full bg-[var(--surface-2)]">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${cert.progress}%`,
                    background: cert.gradient,
                  }}
                />
              </div>

              {/* カテゴリ別 */}
              <div className="flex flex-col gap-2.5">
                {cert.categories.map((cat) => (
                  <div key={cat.name}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="truncate text-[var(--text-muted)]">{cat.name}</span>
                      <span className="shrink-0 font-medium text-[var(--text-muted)]">
                        {cat.answered} / {cat.total} 問 ({cat.progress}%)
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-[var(--surface-2)]">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${cat.progress}%`,
                          background: cert.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 統計サマリー */}
        <section className="mb-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
          <h2 className="mb-4 text-base font-bold text-[var(--foreground)]">📈 学習統計サマリー</h2>
          <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
            {statsSummary.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 transition-all hover:border-[var(--accent-primary)]"
              >
                <div className="mb-1 text-2xl">{stat.icon}</div>
                <div className="text-xl font-extrabold text-[var(--foreground)]">{stat.value}</div>
                <div className="text-xs text-[var(--text-muted)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 取得済みバッジ一覧 */}
        {badges.length > 0 && (
          <section className="mb-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <h2 className="mb-4 text-base font-bold text-[var(--foreground)]">🏅 取得済みバッジ</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {badges.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3.5 transition-transform hover:scale-105"
                >
                  <span className="text-2xl">{b.icon}</span>
                  <div className="overflow-hidden">
                    <p className="truncate text-sm font-bold text-[var(--foreground)]">{b.name}</p>
                    <p className="truncate text-xs text-[var(--text-muted)]">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 最近の学習履歴 */}
        {recentHistory.length > 0 && (
          <section className="mb-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <h2 className="mb-4 text-base font-bold text-[var(--foreground)]">📜 最近の回答履歴</h2>
            <div className="divide-y divide-[var(--border)]">
              {recentHistory.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-3 text-sm first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">
                      {item.isCorrect ? "✅" : "❌"}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-[var(--surface-2)] px-1.5 py-0.5 text-xs font-semibold text-[var(--foreground)]">
                          {(item.cert || "").toUpperCase()}
                        </span>
                        <span className="font-medium text-[var(--foreground)]">
                          {item.category || "問題"}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-muted)]">
                        問題 ID: {item.questionId}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-[var(--text-muted)]">
                    {item.answeredAt
                      ? new Date(item.answeredAt).toLocaleString("ja-JP", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}


      </div>
    </main>
  );
}
