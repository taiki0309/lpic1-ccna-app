"use client";

import { useState } from "react";
import Link from "next/link";
import { submitAnswer } from "@/lib/submitAnswer";

// ─── 練習問題定義 ─────────────────────────────────────────
interface CommandQuestion {
  id: string;
  category: string;
  description: string;
  prompt: string;
  expectedCommand: string;
  hint: string;
  explanation: string;
}

const COMMAND_QUESTIONS: CommandQuestion[] = [
  {
    id: "cmd-1",
    category: "ファイル操作",
    description: "現在のディレクトリにある全ファイル（隠しファイルを含む）を詳細表示してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "ls -la",
    hint: "ls コマンドに -l（詳細）と -a（隠しファイル）オプションを組み合わせます",
    explanation: "`ls -la` は -l（long format: 詳細表示）と -a（all: 隠しファイルを含む）を組み合わせたコマンドです。`ls -al` でも同じ結果になります。",
  },
  {
    id: "cmd-2",
    category: "ファイル操作",
    description: "/home/user/documents ディレクトリを作成してください（存在しない場合も安全に実行）。",
    prompt: "user@linux:~$ ",
    expectedCommand: "mkdir -p /home/user/documents",
    hint: "mkdir に -p オプションをつけると、親ディレクトリも含めて作成でき、既存の場合もエラーになりません",
    explanation: "`mkdir -p` は --parents の略で、中間ディレクトリを自動作成し、ディレクトリが既に存在してもエラーを出しません。",
  },
  {
    id: "cmd-3",
    category: "パーミッション",
    description: "script.sh に対して、所有者に実行権限を追加してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "chmod u+x script.sh",
    hint: "chmod の記号モード: u=user(所有者), +x=実行権限を追加",
    explanation: "`chmod u+x` は user（所有者）に execute（実行）権限を追加します。chmod 755 でも実行権限を付与できますが、記号モードはより明示的です。",
  },
  {
    id: "cmd-4",
    category: "テキスト処理",
    description: "/var/log/syslog ファイルから 'error' を含む行を大文字・小文字を区別せずに検索してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "grep -i error /var/log/syslog",
    hint: "grep に -i オプションで大文字・小文字を無視できます",
    explanation: "`grep -i`（--ignore-case）は大文字・小文字を区別せずにパターンを検索します。`grep -i -n` で行番号も表示できます。",
  },
  {
    id: "cmd-5",
    category: "プロセス管理",
    description: "CPU使用率が高い順にプロセス一覧を表示してください（ps コマンドを使用）。",
    prompt: "user@linux:~$ ",
    expectedCommand: "ps aux --sort=-%cpu",
    hint: "ps aux でプロセス一覧を取得し、--sort オプションでCPU使用率（%cpu）の降順ソートができます",
    explanation: "`ps aux` は全ユーザーのプロセスを詳細表示します。`--sort=-%cpu` の - は降順を意味します。`top` コマンドでもリアルタイムに確認できます。",
  },
  {
    id: "cmd-6",
    category: "ファイルシステム",
    description: "現在マウントされているファイルシステムのディスク使用量を人間が読みやすい形式で表示してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "df -h",
    hint: "df コマンドに -h（human-readable）オプションを付けます",
    explanation: "`df -h`（disk free, human-readable）はGB・MBなど読みやすい単位でディスク使用量を表示します。`-H` は1000単位、`-h` は1024単位です。",
  },
  {
    id: "cmd-7",
    category: "シェル",
    description: "HOME 環境変数の値を表示してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "echo $HOME",
    hint: "echo コマンドと $ を使って環境変数の値を参照します",
    explanation: "`echo $HOME` は HOME 環境変数を展開して表示します。`printenv HOME` や `env | grep HOME` でも確認できます。",
  },
  {
    id: "cmd-8",
    category: "パッケージ管理",
    description: "apt を使って nginx パッケージをインストールしてください（確認プロンプトなし）。",
    prompt: "user@linux:~$ ",
    expectedCommand: "apt install -y nginx",
    hint: "-y オプションで全ての確認に自動的に yes と答えます",
    explanation: "`apt install -y` は --yes の略で、対話プロンプトをスキップします。本番環境では確認なしにインストールするため、慎重に使用しましょう。",
  },
];

type Status = "idle" | "correct" | "incorrect" | "revealed";

interface QuestionState {
  input: string;
  status: Status;
  showHint: boolean;
  attempts: number;
}

export default function Lpic1PracticePage() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [states, setStates] = useState<Record<string, QuestionState>>(
    Object.fromEntries(
      COMMAND_QUESTIONS.map((q) => [
        q.id,
        { input: "", status: "idle", showHint: false, attempts: 0 },
      ])
    )
  );
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const question = COMMAND_QUESTIONS[currentIdx];
  const state = states[question.id];

  const updateState = (id: string, patch: Partial<QuestionState>) => {
    setStates((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  };

  const handleSubmit = () => {
    if (!state.input.trim()) return;
    const normalized = state.input.trim().replace(/\s+/g, " ");
    const isCorrect = normalized === question.expectedCommand;

    if (isCorrect) {
      updateState(question.id, { status: "correct", attempts: state.attempts + 1 });
      setCompleted((prev) => new Set([...prev, question.id]));
    } else {
      updateState(question.id, { status: "incorrect", attempts: state.attempts + 1 });
    }

    // コマンド練習の回答結果を AWS Lambda / DynamoDB に送信
    submitAnswer({
      cert: "lpic1",
      questionId: question.id,
      category: question.category || "GNUとUnixコマンド",
      selectedIndex: 0,
      isCorrect,
    });
  };

  const handleReveal = () => {
    updateState(question.id, {
      status: "revealed",
      input: question.expectedCommand,
    });
    setCompleted((prev) => new Set([...prev, question.id]));
  };

  const handleNext = () => {
    if (currentIdx < COMMAND_QUESTIONS.length - 1) {
      setCurrentIdx((i) => i + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx((i) => i - 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
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
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(63,185,80,0.10) 0%, transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-3xl">
        {/* パンくず */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <Link href="/" className="hover:text-[var(--foreground)] transition-colors">ホーム</Link>
          <span>/</span>
          <Link href="/lpic1" className="hover:text-[var(--foreground)] transition-colors">LPIC-1</Link>
          <span>/</span>
          <span className="text-[var(--foreground)]">コマンド練習</span>
        </nav>

        {/* ヘッダー */}
        <header className="mb-8">
          <h1 className="mb-2 text-2xl font-extrabold text-[var(--foreground)]">
            ⌨️ コマンド練習
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            説明を読んで、正しいコマンドを入力してください。Enter で回答。
          </p>
        </header>

        {/* 進捗バー */}
        <div className="mb-6">
          <div className="mb-1 flex justify-between text-xs text-[var(--text-muted)]">
            <span>進捗</span>
            <span>{totalCompleted} / {totalQuestions} 完了</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-2)]">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(totalCompleted / totalQuestions) * 100}%`,
                background: "linear-gradient(90deg, #196c2e, #3fb950)",
              }}
            />
          </div>
        </div>

        {/* 問題ナビゲーション */}
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {COMMAND_QUESTIONS.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrentIdx(i)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-all duration-200"
              style={{
                background: completed.has(q.id)
                  ? "rgba(63,185,80,0.20)"
                  : i === currentIdx
                  ? "rgba(88,166,255,0.20)"
                  : "var(--surface-2)",
                border: `1px solid ${
                  completed.has(q.id)
                    ? "#3fb950"
                    : i === currentIdx
                    ? "#58a6ff"
                    : "var(--border)"
                }`,
                color: completed.has(q.id)
                  ? "#3fb950"
                  : i === currentIdx
                  ? "#58a6ff"
                  : "var(--text-muted)",
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* 問題カード */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl sm:p-8">
          {/* カテゴリバッジ */}
          <div className="mb-4 flex items-center gap-2">
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1 text-xs font-medium text-[var(--accent-secondary)]">
              {question.category}
            </span>
            <span className="text-xs text-[var(--text-muted)]">
              問題 {currentIdx + 1} / {totalQuestions}
            </span>
          </div>

          {/* 問題文 */}
          <h2 className="mb-6 text-base font-semibold leading-relaxed text-[var(--foreground)] sm:text-lg">
            {question.description}
          </h2>

          {/* ターミナル入力エリア */}
          <div
            className="mb-4 overflow-hidden rounded-xl border border-[var(--border)]"
            style={{ background: "#0d1117" }}
          >
            {/* ターミナルヘッダー */}
            <div className="flex items-center gap-1.5 border-b border-[var(--border)] px-4 py-2">
              <span className="h-3 w-3 rounded-full bg-[#f85149]" />
              <span className="h-3 w-3 rounded-full bg-[#e3b341]" />
              <span className="h-3 w-3 rounded-full bg-[#3fb950]" />
              <span className="ml-2 text-xs text-[var(--text-muted)]">bash</span>
            </div>
            {/* 入力行 */}
            <div className="flex items-center gap-2 px-4 py-3 font-mono text-sm">
              <span className="shrink-0 text-[#3fb950]">{question.prompt}</span>
              <input
                id="command-input"
                type="text"
                value={state.input}
                onChange={(e) => updateState(question.id, { input: e.target.value, status: "idle" })}
                onKeyDown={handleKeyDown}
                disabled={state.status === "correct" || state.status === "revealed"}
                placeholder="コマンドを入力..."
                className="flex-1 bg-transparent text-[var(--foreground)] outline-none placeholder:text-[var(--border)] disabled:opacity-60"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            {/* フィードバック行 */}
            {state.status !== "idle" && (
              <div
                className="border-t border-[var(--border)] px-4 py-2 font-mono text-xs"
                style={{
                  color:
                    state.status === "correct" ? "#3fb950"
                    : state.status === "revealed" ? "#e3b341"
                    : "#f85149",
                }}
              >
                {state.status === "correct" && "✓ 正解！"}
                {state.status === "revealed" && `→ 正解: ${question.expectedCommand}`}
                {state.status === "incorrect" && `✗ 不正解 — もう一度試してください`}
              </div>
            )}
          </div>

          {/* ヒント */}
          {state.showHint && (
            <div className="mb-4 rounded-xl border border-[#e3b341] bg-[rgba(227,179,65,0.08)] px-4 py-3 text-sm text-[#e3b341]">
              💡 ヒント: {question.hint}
            </div>
          )}

          {/* 解説（正解後） */}
          {(state.status === "correct" || state.status === "revealed") && (
            <div className="mb-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm leading-relaxed text-[var(--foreground)]">
              <p className="mb-1 font-semibold text-[var(--accent-primary)]">📘 解説</p>
              {question.explanation}
            </div>
          )}

          {/* ボタン群 */}
          <div className="flex flex-wrap gap-3">
            {state.status === "idle" || state.status === "incorrect" ? (
              <>
                <button
                  id="submit-command-btn"
                  onClick={handleSubmit}
                  disabled={!state.input.trim()}
                  className="flex-1 rounded-xl py-3 font-semibold text-white transition-all duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                  style={{ background: "linear-gradient(135deg, #196c2e, #3fb950)" }}
                >
                  実行 (Enter)
                </button>
                {!state.showHint && (
                  <button
                    id="hint-btn"
                    onClick={() => updateState(question.id, { showHint: true })}
                    className="rounded-xl border border-[#e3b341] bg-[rgba(227,179,65,0.08)] px-4 py-3 text-sm font-semibold text-[#e3b341] transition-all hover:bg-[rgba(227,179,65,0.15)]"
                  >
                    💡 ヒント
                  </button>
                )}
                {state.attempts >= 2 && (
                  <button
                    id="reveal-btn"
                    onClick={handleReveal}
                    className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm font-semibold text-[var(--text-muted)] transition-all hover:text-[var(--foreground)]"
                  >
                    答えを見る
                  </button>
                )}
              </>
            ) : (
              <button
                id="next-question-btn"
                onClick={handleNext}
                disabled={currentIdx >= COMMAND_QUESTIONS.length - 1}
                className="flex-1 rounded-xl py-3 font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                style={{ background: "linear-gradient(135deg, #1d6fca, #58a6ff)" }}
              >
                {currentIdx >= COMMAND_QUESTIONS.length - 1 ? "全問完了！🎉" : "次の問題へ →"}
              </button>
            )}
          </div>
        </div>

        {/* 前後ナビ */}
        <div className="mt-4 flex gap-3">
          <button
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] py-3 text-sm font-semibold text-[var(--text-muted)] transition-all hover:border-[var(--accent-primary)] hover:text-[var(--foreground)] disabled:opacity-40"
          >
            ← 前の問題
          </button>
          <button
            onClick={handleNext}
            disabled={currentIdx >= COMMAND_QUESTIONS.length - 1}
            className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] py-3 text-sm font-semibold text-[var(--text-muted)] transition-all hover:border-[var(--accent-primary)] hover:text-[var(--foreground)] disabled:opacity-40"
          >
            次の問題 →
          </button>
        </div>

        {/* 完了メッセージ */}
        {totalCompleted === totalQuestions && (
          <div className="mt-6 rounded-2xl border border-[#3fb950] bg-[rgba(63,185,80,0.08)] p-6 text-center">
            <p className="mb-2 text-3xl">🎉</p>
            <p className="font-bold text-[#3fb950]">全問完了！お疲れさまでした！</p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">問題演習に進んで、実力を確認しましょう。</p>
            <Link
              href="/lpic1/quiz"
              className="mt-4 inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white transition-all hover:scale-105 hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #1d6fca, #58a6ff)" }}
            >
              問題演習へ →
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
