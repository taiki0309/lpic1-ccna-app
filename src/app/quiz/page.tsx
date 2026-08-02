import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "総合演習・実戦テスト - ITインフラ技術者認定学習アプリ",
  description: "LPIC-1・CCNA の本番試験を想定した全問総合演習・模擬実戦テスト。現在の実力診断と合格力の測定に最適です。",
};

export default function QuizHubPage() {
  return (
    <main className="relative min-h-screen px-4 py-8 sm:py-12">
      {/* 背景グラデーション */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(31,111,235,0.12) 0%, rgba(110,64,201,0.12) 50%, transparent 80%)",
        }}
      />

      <div className="mx-auto max-w-5xl">
        {/* ヘッダー */}
        <header className="mb-8 text-center sm:mb-12">
          <span className="inline-block rounded-full bg-[var(--accent-primary)]/10 px-3.5 py-1 text-xs font-bold text-[var(--accent-primary)] mb-3">
            🎯 本番対策・実力測定
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[var(--foreground)] tracking-tight">
            総合演習・実戦テスト
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[var(--text-muted)] max-w-2xl mx-auto">
            全カテゴリの学習内容を横断した総合問題演習と本番同様の実戦テストに挑戦できます。目指す認定資格を選択して実力を測定しましょう。
          </p>
        </header>

        {/* コース選択グリッド */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-12">
          {/* LPIC-1 総合演習カード */}
          <div
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
            style={{
              boxShadow: "0 12px 30px -10px rgba(88,166,255,0.15)",
            }}
          >
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div
                  className="relative flex h-14 w-14 overflow-hidden items-center justify-center rounded-2xl bg-white shadow-md border border-[var(--border)]"
                  style={{ background: "linear-gradient(135deg, #1d6fca, #58a6ff)" }}
                >
                  <Image
                    src="/characters/lpic.png"
                    alt="LPIC-1 ペンギン"
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-400">
                  全6カテゴリ対応
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--foreground)] mb-2">
                LPIC-1 総合演習・実戦テスト
              </h2>
              <p className="text-sm text-[var(--text-muted)] mb-6 leading-relaxed">
                システムアーキテクチャ・コマンド・パーミッション・シェルスクリプトなど全範囲からランダム出題。60問 / 90分形式の合格基準に合わせた模擬演習です。
              </p>

              <div className="mb-6 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl bg-[var(--surface-2)] p-2.5 text-center">
                  <span className="block text-[var(--text-muted)]">試験時間</span>
                  <span className="font-bold text-[var(--foreground)]">90 分 / 各試験</span>
                </div>
                <div className="rounded-xl bg-[var(--surface-2)] p-2.5 text-center">
                  <span className="block text-[var(--text-muted)]">合格ライン</span>
                  <span className="font-bold text-[var(--foreground)]">500点 / 800点満点</span>
                </div>
              </div>
            </div>

            <Link
              href="/lpic1/quiz?category=all"
              className="flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold text-white transition-all hover:opacity-90 shadow-lg"
              style={{ background: "linear-gradient(135deg, #1d6fca, #58a6ff)" }}
            >
              <span>LPIC-1 総合演習を開始</span>
              <span>→</span>
            </Link>
          </div>

          {/* CCNA 総合演習カード */}
          <div
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
            style={{
              boxShadow: "0 12px 30px -10px rgba(188,140,255,0.15)",
            }}
          >
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div
                  className="relative flex h-14 w-14 overflow-hidden items-center justify-center rounded-2xl bg-white shadow-md border border-[var(--border)]"
                  style={{ background: "linear-gradient(135deg, #6e40c9, #bc8cff)" }}
                >
                  <Image
                    src="/characters/ccna.png"
                    alt="CCNA 猫"
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-400">
                  200-301 対応
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--foreground)] mb-2">
                CCNA 総合演習・実戦テスト
              </h2>
              <p className="text-sm text-[var(--text-muted)] mb-6 leading-relaxed">
                ネットワーク基礎・IPアドレッシング・ルーティング・スイッチング・セキュリティ・WANクラウド全網羅。本番の頻出パターンを実戦演習します。
              </p>

              <div className="mb-6 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl bg-[var(--surface-2)] p-2.5 text-center">
                  <span className="block text-[var(--text-muted)]">試験時間</span>
                  <span className="font-bold text-[var(--foreground)]">120 分</span>
                </div>
                <div className="rounded-xl bg-[var(--surface-2)] p-2.5 text-center">
                  <span className="block text-[var(--text-muted)]">合格ライン</span>
                  <span className="font-bold text-[var(--foreground)]">約 825点 / 1000点</span>
                </div>
              </div>
            </div>

            <Link
              href="/ccna/quiz?category=all"
              className="flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold text-white transition-all hover:opacity-90 shadow-lg"
              style={{ background: "linear-gradient(135deg, #6e40c9, #bc8cff)" }}
            >
              <span>CCNA 総合演習を開始</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* 活用アドバイスセクション */}
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-6 sm:p-8">
          <h3 className="text-base sm:text-lg font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
            <span>💡</span> 本番試験合格へのアドバイス
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm text-[var(--text-muted)]">
            <div className="rounded-xl bg-[var(--surface)] p-4 border border-[var(--border)]">
              <p className="font-bold text-[var(--foreground)] mb-1">
                1. 制限時間を意識した解答
              </p>
              <p>
                本番は1問あたり約1〜1.5分しか掛けられません。迷った問題は見直しチェックをつけて先に進む習慣をつけましょう。
              </p>
            </div>
            <div className="rounded-xl bg-[var(--surface)] p-4 border border-[var(--border)]">
              <p className="font-bold text-[var(--foreground)] mb-1">
                2. 解説の徹底的な読み込み
              </p>
              <p>
                なぜその選択肢が正しいのかだけでなく、他の誤り選択肢の理由も理解することで、類似問題の得点力が飛躍します。
              </p>
            </div>
            <div className="rounded-xl bg-[var(--surface)] p-4 border border-[var(--border)]">
              <p className="font-bold text-[var(--foreground)] mb-1">
                3. シミュレーション問題演習との併用
              </p>
              <p>
                スマホ・PC対応の「ドラッグ＆ドロップ演習」や、PC版「CLIコマンドシミュレーター」も併用することで、実践的な本番対応力が確実になります。
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
