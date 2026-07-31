"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { submitAnswer } from "@/lib/submitAnswer";

// ─── 型定義 ───────────────────────────────────────────────
interface Question {
  id: string | number;
  category: string;
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
}

// ─── 静的フォールバック問題（DynamoDB 未接続時に使用） ────
const FALLBACK_QUESTIONS: Question[] = [
  {
    id: "lpic-fallback-1",
    category: "基本コマンド",
    question: "Linuxでカレントディレクトリのファイル一覧を表示するコマンドはどれか？",
    choices: ["ls", "cd", "pwd", "cp"],
    correctIndex: 0,
    explanation:
      "ls（list）コマンドはディレクトリの内容一覧を表示します。オプション -l で詳細表示、-a で隠しファイルも表示できます。",
  },
  {
    id: "lpic-fallback-2",
    category: "ファイル操作",
    question: "ファイルをコピーするコマンドはどれか？",
    choices: ["mv", "rm", "cp", "ln"],
    correctIndex: 2,
    explanation:
      "cp（copy）コマンドはファイルやディレクトリをコピーします。mv は移動、rm は削除、ln はリンク作成に使います。",
  },
  {
    id: "lpic-fallback-3",
    category: "ファイルシステム",
    question: "現在作業しているディレクトリのパスを表示するコマンドはどれか？",
    choices: ["ls", "pwd", "cd", "find"],
    correctIndex: 1,
    explanation:
      "pwd（Print Working Directory）は現在のカレントディレクトリの絶対パスを表示します。",
  },
  {
    id: "lpic-fallback-4",
    category: "テキスト処理",
    question: "ファイルの内容を画面に表示するコマンドとして最も一般的なものはどれか？",
    choices: ["echo", "cat", "grep", "sort"],
    correctIndex: 1,
    explanation:
      "cat（concatenate）はファイルの内容を標準出力に表示します。複数ファイルを連結して表示することも可能です。",
  },
  {
    id: "lpic-fallback-5",
    category: "パーミッション",
    question: "ファイルのパーミッションを変更するコマンドはどれか？",
    choices: ["chown", "chmod", "chgrp", "umask"],
    correctIndex: 1,
    explanation:
      "chmod（change mode）はファイルやディレクトリのパーミッションを変更します。chown は所有者、chgrp はグループを変更します。",
  },
  {
    id: "lpic-fallback-6",
    category: "プロセス管理",
    question: "現在実行中のプロセス一覧を表示するコマンドはどれか？",
    choices: ["top", "ps", "kill", "nice"],
    correctIndex: 1,
    explanation:
      "ps（process status）は現在のプロセス一覧を表示します。top はリアルタイムでプロセスを監視するコマンドです。",
  },
  {
    id: "lpic-fallback-7",
    category: "テキスト処理",
    question: "ファイル内の文字列を検索するコマンドはどれか？",
    choices: ["find", "locate", "grep", "awk"],
    correctIndex: 2,
    explanation:
      "grep（Global Regular Expression Print）はファイル内のパターンに一致する行を表示します。正規表現も使用できます。",
  },
  {
    id: "lpic-fallback-8",
    category: "ファイルシステム",
    question: "ディスクの使用状況を確認するコマンドはどれか？",
    choices: ["df", "du", "mount", "fsck"],
    correctIndex: 0,
    explanation:
      "df（disk free）はファイルシステムのディスク使用状況を表示します。du はディレクトリ・ファイルのサイズを表示します。",
  },
  {
    id: "lpic-fallback-9",
    category: "シェル",
    question: "前回実行したコマンドを再実行するショートカットはどれか？",
    choices: ["!!", "^r", "!!-1", "^!"],
    correctIndex: 0,
    explanation:
      "!!（bang bang）はhistoryの直前のコマンドを再実行します。!n で履歴番号 n のコマンドを実行できます。",
  },
  {
    id: "lpic-fallback-10",
    category: "パッケージ管理",
    question: "Debian系Linuxでパッケージをインストールするコマンドはどれか？",
    choices: ["yum install", "rpm -i", "apt install", "pacman -S"],
    correctIndex: 2,
    explanation:
      "apt（Advanced Package Tool）はDebian系（Ubuntu等）のパッケージ管理ツールです。yum/dnfはRed Hat系、pacmanはArch Linux系で使います。",
  },
];

type FeedbackState = "none" | "correct" | "incorrect";
type DataSource = "dynamodb" | "fallback";

function Lpic1QuizInner() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState<DataSource>("dynamodb");
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>("none");
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      setFetchError(null);

      try {
        const params = new URLSearchParams({ cert: "lpic1" });
        if (category) params.set("category", category);
        const res = await fetch(`/api/questions?${params.toString()}`);

        if (!res.ok) throw new Error(`サーバーエラー: ${res.status}`);

        const data = await res.json();

        if (!data.questions || data.questions.length === 0) {
          setQuestions(FALLBACK_QUESTIONS);
          setDataSource("fallback");
        } else {
          setQuestions(data.questions);
          setDataSource("dynamodb");
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "不明なエラー";
        setFetchError(message);
        setQuestions(FALLBACK_QUESTIONS);
        setDataSource("fallback");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [category]);

  const total = questions.length;
  const question = questions[currentIndex];
  const progress =
    total > 0 ? ((currentIndex + (feedback !== "none" ? 1 : 0)) / total) * 100 : 0;

  const handleSubmit = () => {
    if (selectedChoice === null || !question) return;
    const isCorrect = selectedChoice === question.correctIndex;
    setFeedback(isCorrect ? "correct" : "incorrect");
    if (isCorrect) setScore((s) => s + 1);
    setShowPopup(true);

    // Lambda 関数 URL へ回答ログと進捗を非同期 POST
    submitAnswer({
      cert: "lpic1",
      questionId: question.id,
      category: question.category || "未分類",
      selectedIndex: selectedChoice,
      isCorrect,
    });
  };

  const handleNext = () => {
    setShowPopup(false);
    if (currentIndex + 1 >= total) {
      setIsFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedChoice(null);
      setFeedback("none");
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedChoice(null);
    setFeedback("none");
    setScore(0);
    setIsFinished(false);
    setShowPopup(false);
  };

  // ─── ローディング ────────────────────────────────────────
  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-4">
        <div
          className="pointer-events-none fixed inset-0 -z-10"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(88,166,255,0.10) 0%, transparent 60%)",
          }}
        />
        <div className="flex flex-col items-center gap-4">
          <div
            className="h-12 w-12 rounded-full border-4 border-[var(--border)] border-t-[var(--accent-primary)]"
            style={{ animation: "spin 0.8s linear infinite" }}
            role="status"
            aria-label="読み込み中"
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p className="text-sm text-[var(--text-muted)]">問題を取得中…</p>
        </div>
      </main>
    );
  }

  // ─── 完了画面 ─────────────────────────────────────────────
  if (isFinished) {
    const pct = Math.round((score / total) * 100);
    const grade =
      pct >= 80
        ? { label: "合格圏！", color: "#3fb950", emoji: "🏆" }
        : pct >= 60
        ? { label: "もう少し！", color: "#e3b341", emoji: "📚" }
        : { label: "要復習", color: "#f85149", emoji: "💪" };

    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
        <div
          className="pointer-events-none fixed inset-0 -z-10"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(88,166,255,0.12) 0%, transparent 60%)",
          }}
        />
        <div className="w-full max-w-lg rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-2xl">
          <div className="mb-4 text-6xl">{grade.emoji}</div>
          <h1 className="mb-2 text-3xl font-extrabold" style={{ color: grade.color }}>
            {grade.label}
          </h1>
          <p className="mb-6 text-[var(--text-muted)]">クイズ完了！お疲れさまでした。</p>

          <div
            className="mx-auto mb-6 flex h-36 w-36 items-center justify-center rounded-full border-8"
            style={{ borderColor: grade.color }}
          >
            <div>
              <p className="text-4xl font-extrabold" style={{ color: grade.color }}>
                {pct}%
              </p>
              <p className="text-sm text-[var(--text-muted)]">
                {score}/{total} 正解
              </p>
            </div>
          </div>

          <div className="mb-8 h-3 overflow-hidden rounded-full bg-[var(--surface-2)]">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${pct}%`, background: grade.color }}
            />
          </div>

          <p className="mb-6 text-xs text-[var(--text-muted)]">
            {dataSource === "dynamodb"
              ? "✅ DynamoDB から取得した問題で挑戦しました"
              : "⚠️ オフラインモード（静的データ）で挑戦しました"}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              id="restart-btn"
              onClick={handleRestart}
              className="flex-1 rounded-xl px-6 py-3 font-semibold text-white transition-all duration-200 hover:scale-105 hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #1d6fca, #58a6ff)" }}
            >
              もう一度挑戦
            </button>
            <Link
              href="/lpic1"
              className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-6 py-3 text-center font-semibold text-[var(--foreground)] transition-all duration-200 hover:scale-105 hover:border-[var(--accent-primary)]"
            >
              LPIC-1 トップへ
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ─── クイズ画面 ───────────────────────────────────────────
  if (!question) return null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(88,166,255,0.10) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 80% 80%, rgba(188,140,255,0.08) 0%, transparent 60%)",
        }}
      />

      <div className="w-full max-w-2xl">
        <header className="mb-4 flex items-center justify-between">
          <Link
            href="/lpic1"
            className="flex items-center gap-1 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--foreground)]"
          >
            ← LPIC-1 トップ
          </Link>
          <span className="text-sm font-medium text-[var(--text-muted)]">
            {currentIndex + 1} / {total}
          </span>
          <span className="text-sm font-semibold text-[var(--accent-secondary)]">
            スコア: {score}
          </span>
        </header>

        {fetchError && (
          <div className="mb-4 rounded-xl border border-[#e3b341] bg-[rgba(227,179,65,0.08)] px-4 py-2 text-xs text-[#e3b341]">
            ⚠️ DynamoDB 接続エラー — オフラインモードで動作中
          </div>
        )}

        {/* プログレスバー */}
        <div className="mb-8 h-2 overflow-hidden rounded-full bg-[var(--surface-2)]">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #58a6ff, #bc8cff)",
            }}
          />
        </div>

        {/* 問題カード */}
        <section
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl sm:p-8"
          aria-label="問題"
        >
          <div className="mb-4 inline-block rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1 text-xs font-medium text-[var(--accent-primary)]">
            {question.category}
          </div>

          <h1 className="mb-6 text-lg font-bold leading-relaxed text-[var(--foreground)] sm:text-xl">
            Q{currentIndex + 1}. {question.question}
          </h1>

          <div className="mb-6 flex flex-col gap-3" role="radiogroup" aria-label="選択肢">
            {question.choices.map((choice, idx) => {
              let borderColor = "var(--border)";
              let bgColor = "var(--surface-2)";
              let textColor = "var(--foreground)";

              if (feedback !== "none") {
                if (idx === question.correctIndex) {
                  borderColor = "#3fb950";
                  bgColor = "rgba(63,185,80,0.12)";
                  textColor = "#3fb950";
                } else if (idx === selectedChoice && feedback === "incorrect") {
                  borderColor = "#f85149";
                  bgColor = "rgba(248,81,73,0.12)";
                  textColor = "#f85149";
                }
              } else if (idx === selectedChoice) {
                borderColor = "#58a6ff";
                bgColor = "rgba(88,166,255,0.12)";
                textColor = "#58a6ff";
              }

              return (
                <button
                  key={idx}
                  id={`choice-${idx}`}
                  role="radio"
                  aria-checked={selectedChoice === idx}
                  disabled={feedback !== "none"}
                  onClick={() => setSelectedChoice(idx)}
                  className="flex items-center gap-3 rounded-xl border px-5 py-4 text-left text-sm font-medium transition-all duration-200 disabled:cursor-default"
                  style={{
                    borderColor,
                    background: bgColor,
                    color: textColor,
                    transform:
                      selectedChoice === idx && feedback === "none"
                        ? "translateX(4px)"
                        : "none",
                  }}
                >
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold"
                    style={{ borderColor, color: textColor }}
                  >
                    {feedback !== "none" && idx === question.correctIndex
                      ? "✓"
                      : feedback === "incorrect" && idx === selectedChoice
                      ? "✗"
                      : String.fromCharCode(65 + idx)}
                  </span>
                  {choice}
                </button>
              );
            })}
          </div>

          {feedback === "none" && (
            <button
              id="submit-btn"
              onClick={handleSubmit}
              disabled={selectedChoice === null}
              className="w-full rounded-xl py-4 font-semibold text-white transition-all duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              style={{
                background:
                  selectedChoice !== null
                    ? "linear-gradient(135deg, #1d6fca, #58a6ff)"
                    : "var(--surface-2)",
              }}
            >
              回答する
            </button>
          )}

          {feedback !== "none" && (
            <div
              className="rounded-xl border p-4 text-sm leading-relaxed"
              style={{
                borderColor: feedback === "correct" ? "#3fb950" : "#f85149",
                background:
                  feedback === "correct"
                    ? "rgba(63,185,80,0.08)"
                    : "rgba(248,81,73,0.08)",
                color: "var(--foreground)",
              }}
            >
              <p
                className="mb-1 font-semibold"
                style={{ color: feedback === "correct" ? "#3fb950" : "#f85149" }}
              >
                💡 解説
              </p>
              {question.explanation}
            </div>
          )}
        </section>

        {feedback !== "none" && (
          <button
            id="next-btn"
            onClick={handleNext}
            className="mt-4 w-full rounded-xl py-4 font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #1d6fca, #58a6ff)" }}
          >
            {currentIndex + 1 >= total ? "結果を見る 🏆" : "次の問題へ →"}
          </button>
        )}
      </div>

      {/* フィードバックポップアップ */}
      {showPopup && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
            onClick={() => setShowPopup(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={feedback === "correct" ? "正解" : "不正解"}
            className="fixed left-1/2 top-1/2 z-50 w-[90%] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border p-8 text-center shadow-2xl"
            style={{
              background: "var(--surface)",
              borderColor: feedback === "correct" ? "#3fb950" : "#f85149",
            }}
          >
            <div className="mb-3 text-5xl">
              {feedback === "correct" ? "🎉" : "😢"}
            </div>
            <h2
              className="mb-2 text-2xl font-extrabold"
              style={{ color: feedback === "correct" ? "#3fb950" : "#f85149" }}
            >
              {feedback === "correct" ? "正解！" : "不正解…"}
            </h2>
            <p className="mb-6 text-sm text-[var(--text-muted)]">
              {feedback === "correct"
                ? "素晴らしい！その調子で頑張ろう。"
                : `正解は「${question.choices[question.correctIndex]}」でした。`}
            </p>
            <button
              id="popup-close-btn"
              onClick={handleNext}
              className="w-full rounded-xl py-3 font-semibold text-white transition-all duration-200 hover:opacity-90"
              style={{
                background:
                  feedback === "correct"
                    ? "linear-gradient(135deg, #196c2e, #3fb950)"
                    : "linear-gradient(135deg, #8b1a1a, #f85149)",
              }}
            >
              {currentIndex + 1 >= total ? "結果を見る" : "次へ進む"}
            </button>
          </div>
        </>
      )}
    </main>
  );
}

export default function Lpic1QuizPage() {
  return (
    <Suspense>
      <Lpic1QuizInner />
    </Suspense>
  );
}
