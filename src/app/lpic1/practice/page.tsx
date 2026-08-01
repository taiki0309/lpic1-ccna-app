"use client";

import React, { useState } from "react";
import Link from "next/link";
import { submitAnswer } from "@/lib/submitAnswer";

interface CommandQuestion {
  id: string;
  category: string;
  description: string;
  prompt: string;
  expectedCommand: string;
  aliases?: string[];
  hint: string;
  explanation: string;
}

const COMMAND_QUESTIONS: CommandQuestion[] = [
  {
    id: "cmd-1",
    category: "ファイル操作",
    description: "カレントディレクトリに新しい空のファイル「test.txt」を作成してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "touch test.txt",
    aliases: ["> test.txt"],
    hint: "空ファイルを作成したりタイムスタンプを更新するコマンドは `touch` です。",
    explanation: "`touch <ファイル名>` で空のファイルを作成します。既存のファイルの場合はタイムスタンプのみが更新されます。",
  },
  {
    id: "cmd-2",
    category: "ファイル操作",
    description: "ファイル「test.txt」をディレクトリ「/tmp」にコピーしてください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "cp test.txt /tmp",
    aliases: ["cp test.txt /tmp/", "cp -i test.txt /tmp"],
    hint: "ファイルをコピーするコマンドは `cp <コピー元> <コピー先>` です。",
    explanation: "`cp test.txt /tmp` により指定ファイルが /tmp ディレクトリ内に複製されます。",
  },
  {
    id: "cmd-3",
    category: "パーミッション",
    description: "script.sh に対して、所有者に実行権限を追加してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "chmod u+x script.sh",
    aliases: ["chmod 744 script.sh", "chmod 755 script.sh", "chmod +x script.sh"],
    hint: "u=user(所有者)、+x=実行権限追加。コマンドは `chmod u+x <ファイル名>` です。",
    explanation: "シンボルモードの `chmod u+x` を用いることで、所有者（user）に実行（execute）の権限を付与できます。",
  },
  {
    id: "cmd-4",
    category: "パーミッション",
    description: "data.txt の所有者を「admin」、所有グループを「admins」に変更してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "chown admin:admins data.txt",
    aliases: ["chown admin.admins data.txt", "sudo chown admin:admins data.txt"],
    hint: "`chown <ユーザー>:<グループ> <ファイル名>` です。",
    explanation: "`chown admin:admins data.txt` で、所有者と所有グループを同時に変更することができます。",
  },
  {
    id: "cmd-5",
    category: "テキスト処理",
    description: "app.log から文字列「ERROR」を含む行だけを大文字・小文字を無視して検索して表示してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "grep -i ERROR app.log",
    aliases: ["grep -i error app.log", "grep -i 'ERROR' app.log", "grep -i \"ERROR\" app.log"],
    hint: "大文字小文字を区別しない正規表現検索は `grep -i <パターン> <ファイル>` です。",
    explanation: "`grep -i` を用いることで大文字・小文字を区別せず、目的のエラーログ行のみを抽出できます。",
  },
  {
    id: "cmd-6",
    category: "プロセス管理",
    description: "プロセスID「1234」のプロセスを強制終了（SIGKILL / シグナル9）してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "kill -9 1234",
    aliases: ["kill -SIGKILL 1234", "kill -KILL 1234"],
    hint: "シグナル番号9（強制終了）を指定する kill コマンドは `kill -9 <PID>` です。",
    explanation: "`kill -9 1234` により、SIGKILL シグナルを送り対象プロセスを即座に強制終了します。",
  },
  {
    id: "cmd-7",
    category: "プロセス管理",
    description: "現在実行中のプロセスのリアルタイム状況を表示・監視してください（標準ツール）。",
    prompt: "user@linux:~$ ",
    expectedCommand: "top",
    aliases: ["htop", "ps aux"],
    hint: "CPUやメモリのリアルタイム監視・プロセス表示ツールは `top` です。",
    explanation: "`top` コマンドで、実行中プロセスの負荷やメモリ消費量を継続監視できます。",
  },
  {
    id: "cmd-8",
    category: "パッケージ管理",
    description: "Debian/Ubuntu系Linuxで、最新のパッケージリスト情報をサーバーから取得して更新してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "sudo apt update",
    aliases: ["apt update", "apt-get update", "sudo apt-get update"],
    hint: "パッケージリストの更新は `apt update` (または `sudo apt update`) です。",
    explanation: "`sudo apt update` でリポジトリから最新のパッケージ一覧を取得します。",
  },
];

type QuestionState = {
  input: string;
  status: "idle" | "correct" | "incorrect" | "revealed";
  attempts: number;
};

export default function Lpic1PracticePage() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [states, setStates] = useState<Record<string, QuestionState>>({});
  // 正解した問題のIDのみ保持（正解を見たりスキップした場合はスコア/ポイントに含めない）
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [showHint, setShowHint] = useState(false);

  const question = COMMAND_QUESTIONS[currentIdx] || COMMAND_QUESTIONS[0];
  const state = states[question.id] || { input: "", status: "idle", attempts: 0 };

  const updateState = (qId: string, newState: Partial<QuestionState>) => {
    setStates((prev) => ({
      ...prev,
      [qId]: { ...(prev[qId] || { input: "", status: "idle", attempts: 0 }), ...newState },
    }));
  };

  const checkCommandMatch = (userInput: string, expected: string, aliases: string[] = []): boolean => {
    const normalize = (str: string) =>
      str
        .trim()
        .replace(/\s+/g, " ")
        .replace(/["']/g, "")
        .toLowerCase();

    const normalizedUser = normalize(userInput);
    if (normalizedUser === normalize(expected)) return true;

    return aliases.some((alias) => normalize(alias) === normalizedUser);
  };

  const handleSubmit = () => {
    if (!state.input.trim()) return;
    const isCorrect = checkCommandMatch(
      state.input,
      question.expectedCommand,
      question.aliases
    );

    if (isCorrect) {
      updateState(question.id, { status: "correct", attempts: state.attempts + 1 });
      // 「正解をみる」を使わず自力正解した場合のみ進捗・正答スコアに追加！
      setCompleted((prev) => new Set([...prev, question.id]));

      submitAnswer({
        cert: "lpic1",
        questionId: question.id,
        category: question.category,
        selectedIndex: 0,
        isCorrect: true,
      });
    } else {
      updateState(question.id, { status: "incorrect", attempts: state.attempts + 1 });
    }
  };

  // ※ ご指摘⑤対応:「正解を見る」を使っても正答率・ポイントには加算しない！
  const handleReveal = () => {
    updateState(question.id, {
      status: "revealed",
      input: question.expectedCommand,
    });
    // setCompleted は実行しない（＝ポイントは加算されない）
  };

  const handleNext = () => {
    setShowHint(false);
    if (currentIdx < COMMAND_QUESTIONS.length - 1) {
      setCurrentIdx((i) => i + 1);
    }
  };

  const handlePrev = () => {
    setShowHint(false);
    if (currentIdx > 0) {
      setCurrentIdx((i) => i - 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const totalCompleted = completed.size;
  const totalQuestions = COMMAND_QUESTIONS.length;

  return (
    <main className="relative min-h-screen px-4 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(88,166,255,0.10) 0%, transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-3xl">
        <nav className="mb-6 flex items-center gap-2 text-sm font-bold text-[var(--text-muted)]">
          <Link href="/" className="hover:text-[var(--foreground)] transition-colors">
            ホーム
          </Link>
          <span>/</span>
          <Link href="/lpic1" className="hover:text-[var(--foreground)] transition-colors">
            LPIC-1
          </Link>
          <span>/</span>
          <span className="text-[var(--foreground)]">Linux CLI コマンド練習</span>
        </nav>

        <header className="mb-8">
          <h1 className="mb-2 text-2xl font-extrabold text-[var(--foreground)]">
            ⌨️ Linux CLI コマンド実務練習
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            指示されたコマンドを入力し「実行」または Enter キーで判定できます。
            <span className="font-bold text-[var(--accent-secondary)] ml-1">
              ※ 自力入力で正解した問題のみがポイント・正答数にカウントされます。
            </span>
          </p>
        </header>

        {/* 進捗とスコア */}
        <div className="mb-6">
          <div className="mb-1 flex justify-between text-xs text-[var(--text-muted)] font-bold">
            <span>自力クリア進捗</span>
            <span>
              {totalCompleted} / {totalQuestions} クリア
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-[var(--surface-2)]">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(totalCompleted / totalQuestions) * 100}%`,
                background: "linear-gradient(90deg, #1d6fca, #58a6ff)",
              }}
            />
          </div>
        </div>

        {/* 問題選択番号バッジ */}
        <div className="mb-6 flex flex-wrap gap-2">
          {COMMAND_QUESTIONS.map((q, i) => {
            const isCleared = completed.has(q.id);
            const isCurrent = i === currentIdx;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => {
                  setCurrentIdx(i);
                  setShowHint(false);
                }}
                className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-extrabold transition-all ${
                  isCleared
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500"
                    : isCurrent
                    ? "bg-[var(--accent-primary)] text-white shadow-md scale-110"
                    : "bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent-primary)] hover:text-[var(--foreground)]"
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>

        {/* 問題カード */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl sm:p-8">
          <div className="mb-4 flex items-center justify-between">
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1 text-xs font-bold text-[var(--accent-primary)]">
              {question.category}
            </span>
            <span className="text-xs text-[var(--text-muted)] font-bold">
              問題 {currentIdx + 1} / {totalQuestions}
            </span>
          </div>

          <h2 className="mb-6 text-base font-extrabold leading-relaxed text-[var(--foreground)] sm:text-lg">
            {question.description}
          </h2>

          {/* ターミナル入力エリア（文字色問題・入力反応を完全解決） */}
          <div
            className="mb-4 overflow-hidden rounded-xl border border-[var(--border)] shadow-lg"
            style={{ background: "#0e131f" }}
          >
            <div
              className="flex items-center gap-1.5 border-b border-[var(--border)] px-4 py-2"
              style={{ background: "#161b26" }}
            >
              <span className="h-3 w-3 rounded-full bg-[#f85149]" />
              <span className="h-3 w-3 rounded-full bg-[#e3b341]" />
              <span className="h-3 w-3 rounded-full bg-[#3fb950]" />
              <span className="ml-2 text-xs font-mono font-bold" style={{ color: "#8b949e" }}>
                bash — Linux CLI Interactive
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-3.5 font-mono text-base">
              <span className="shrink-0 font-bold" style={{ color: "#3fb950" }}>
                {question.prompt}
              </span>
              <input
                id="command-input"
                type="text"
                value={state.input}
                onChange={(e) =>
                  updateState(question.id, { input: e.target.value, status: "idle" })
                }
                onKeyDown={handleKeyDown}
                disabled={state.status === "correct" || state.status === "revealed"}
                placeholder="コマンドを入力してください... (Enterで判定)"
                style={{
                  color: "#4ade80",
                  backgroundColor: "transparent",
                  fontWeight: 700,
                  fontSize: "1rem",
                }}
                className="flex-1 outline-none placeholder:text-gray-500 disabled:opacity-80"
                autoComplete="off"
                spellCheck={false}
              />
            </div>

            {/* 結果メッセージ表示欄 */}
            {state.status !== "idle" && (
              <div
                className="border-t border-[var(--border)] px-4 py-3 font-mono text-xs font-bold"
                style={{
                  background:
                    state.status === "correct"
                      ? "rgba(63, 185, 80, 0.12)"
                      : state.status === "revealed"
                      ? "rgba(188, 140, 255, 0.12)"
                      : "rgba(248, 81, 73, 0.12)",
                  color:
                    state.status === "correct"
                      ? "#3fb950"
                      : state.status === "revealed"
                      ? "#bc8cff"
                      : "#f85149",
                }}
              >
                {state.status === "correct" && "✓ [正解] 完璧です！ポイントを獲得しました。"}
                {state.status === "incorrect" &&
                  "✗ [不正解] コマンドまたはオプションが異なります。「ヒント」も確認できます。"}
                {state.status === "revealed" &&
                  `💡 [正解を表示] ${question.expectedCommand} (※ 正解閲覧時はポイント未加算)`}
              </div>
            )}
          </div>

          {/* 解説欄（正解時・正解閲覧時） */}
          {(state.status === "correct" || state.status === "revealed") && (
            <div className="mb-6 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm">
              <p className="font-extrabold text-[var(--accent-primary)] mb-1">💡 解説</p>
              <p className="text-[var(--foreground)] leading-relaxed font-medium">
                {question.explanation}
              </p>
            </div>
          )}

          {/* ヒント表示部 */}
          {showHint && state.status !== "correct" && state.status !== "revealed" && (
            <div className="mb-6 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-300 font-bold">
              <p className="mb-1 text-xs uppercase tracking-wide opacity-80">ヒント</p>
              <p>{question.hint}</p>
            </div>
          )}

          {/* アクションボタン群 */}
          <div className="flex flex-wrap items-center gap-3">
            {state.status === "idle" || state.status === "incorrect" ? (
              <>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!state.input.trim()}
                  className="flex-1 rounded-xl py-3 px-4 font-extrabold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 shadow-md"
                  style={{ background: "linear-gradient(135deg, #196c2e, #3fb950)" }}
                >
                  実行 (Enter)
                </button>
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 font-extrabold text-amber-400 hover:bg-amber-500/20"
                >
                  {showHint ? "ヒントを閉じる" : "💡 ヒント"}
                </button>
                <button
                  type="button"
                  onClick={handleReveal}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 font-extrabold text-[var(--foreground)] hover:border-[var(--accent-primary)]"
                >
                  🔑 正解を見る
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="w-full rounded-xl py-3 px-6 font-extrabold text-white transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #1d6fca, #58a6ff)" }}
              >
                {currentIdx < COMMAND_QUESTIONS.length - 1
                  ? "次の問題へ進む →"
                  : "結果・完了一覧を見る"}
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--foreground)]"
            >
              ⏭️ スキップ
            </button>
          </div>
        </div>

        {/* 前後ナビゲーションバー */}
        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-6 py-2.5 text-sm font-bold text-[var(--foreground)] disabled:opacity-40"
          >
            ← 前の問題
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={currentIdx === COMMAND_QUESTIONS.length - 1}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-6 py-2.5 text-sm font-bold text-[var(--foreground)] disabled:opacity-40"
          >
            次の問題 →
          </button>
        </div>
      </div>
    </main>
  );
}
