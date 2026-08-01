"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { submitAnswer } from "@/lib/submitAnswer";
import { SEED_QUESTIONS } from "@/lib/questionSeedData";
import { isCategoryMatch } from "@/lib/categoryMatcher";
import { shuffleQuestions } from "@/lib/shuffleQuestions";

// ─── 型定義 ───────────────────────────────────────────────
interface Question {
  id: string | number;
  category: string;
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
}

const CATEGORY_TABS = [
  { slug: "all", label: "全問（総合演習）", icon: "📚" },
  { slug: "architecture", label: "システムアーキテクチャ", icon: "🖥️" },
  { slug: "packages", label: "インストールとパッケージ", icon: "📦" },
  { slug: "commands", label: "GNU・Unixコマンド", icon: "⌨️" },
  { slug: "filesystem", label: "ファイルシステム・デバイス", icon: "💾" },
  { slug: "shell", label: "シェルとスクリプト", icon: "🔧" },
  { slug: "users", label: "ユーザーとグループ管理", icon: "👥" },
];

// ─── カテゴリ別 充実フォールバック問題（全カテゴリ完全対応版） ───
const FALLBACK_QUESTIONS: Question[] = [
  // ── 1. システムアーキテクチャ (architecture) ──
  {
    id: "lpic-arch-1",
    category: "システムアーキテクチャ",
    question: "BIOSとUEFIの違いについて正しい記述はどれか？",
    choices: [
      "UEFIは2TB以上のディスクからの起動ができない",
      "UEFIはGPT（GUID Partition Table）をサポートしている",
      "BIOSはセキュアブートを標準サポートしている",
      "UEFIは16ビットモードでのみ動作する",
    ],
    correctIndex: 1,
    explanation:
      "UEFIはGPT（GUID Partition Table）をサポートし、2TBを超える大容量ディスクからの起動やセキュアブートが可能です。",
  },
  {
    id: "lpic-arch-2",
    category: "システムアーキテクチャ",
    question: "Linux起動時に接続されているPCIデバイスの一覧を表示するコマンドはどれか？",
    choices: ["lsusb", "lspci", "lsdev", "pci-info"],
    correctIndex: 1,
    explanation:
      "lspci コマンドはPCIバスおよび接続されているデバイスの一覧を表示します。オプション -k で使用中のカーネルモジュールも確認可能です。",
  },
  {
    id: "lpic-arch-3",
    category: "システムアーキテクチャ",
    question: "systemd採用システムで現在のデフォルトターゲット（ランレベルに相当）を確認するコマンドはどれか？",
    choices: [
      "systemctl get-default",
      "systemctl show-target",
      "systemctl list-default",
      "systemctl status target",
    ],
    correctIndex: 0,
    explanation:
      "systemctl get-default コマンドにより、現在のデフォルトのターゲットユニットを表示します。",
  },
  {
    id: "lpic-arch-4",
    category: "システムアーキテクチャ",
    question: "カーネル起動時のメッセージ履歴をブートバッファから確認するコマンドはどれか？",
    choices: ["syslog", "dmesg", "journalctl --boot-only", "klogd"],
    correctIndex: 1,
    explanation:
      "dmesg（display message / driver message）コマンドは、カーネルのリングバッファに保存された起動メッセージやハードウェア認識ログを表示します。",
  },

  // ── 2. Linuxインストールとパッケージ管理 (packages) ──
  {
    id: "lpic-pkg-1",
    category: "Linuxインストールとパッケージ管理",
    question: "Debian系Linux（Ubuntu等）でパッケージをインストールするaptコマンドの使い方として正しいものはどれか？",
    choices: ["apt install -y nginx", "apt setup nginx", "apt get nginx", "dpkg --install nginx"],
    correctIndex: 0,
    explanation:
      "apt install -y <パッケージ名> でインストールを行います。-y を指定することで確認プロンプトを省略できます。",
  },
  {
    id: "lpic-pkg-2",
    category: "Linuxインストールとパッケージ管理",
    question: "Red Hat系Linux（RHEL, AlmaLinux等）で使用される主要なパッケージファイル拡張子はどれか？",
    choices: [".deb", ".rpm", ".tar.gz", ".pkg"],
    correctIndex: 1,
    explanation:
      ".rpm（Red Hat Package Manager）はRHELやFedora系で標準使用されます。.deb はDebian/Ubuntu系です。",
  },
  {
    id: "lpic-pkg-3",
    category: "Linuxインストールとパッケージ管理",
    question: "実行ファイルが依存している共有ライブラリを確認するコマンドはどれか？",
    choices: ["ldconfig", "ldd", "libcheck", "depmod"],
    correctIndex: 1,
    explanation:
      "ldd（List Dynamic Dependencies）コマンドは、プログラムが必要とする共有ライブラリの一覧を表示します。",
  },
  {
    id: "lpic-pkg-4",
    category: "Linuxインストールとパッケージ管理",
    question: "dpkg コマンドでインストール済みパッケージの一覧を表示するオプションはどれか？",
    choices: ["dpkg -l", "dpkg -i", "dpkg -s", "dpkg -r"],
    correctIndex: 0,
    explanation:
      "dpkg -l（--list）でインストール済みパッケージの一覧を表示します。-i はインストール、-r は削除です。",
  },

  // ── 3. GNUとUnixコマンド (commands) ──
  {
    id: "lpic-cmd-1",
    category: "GNUとUnixコマンド",
    question: "Linuxでカレントディレクトリのファイル一覧を隠しファイル含め詳細表示するコマンドはどれか？",
    choices: ["ls -la", "cd -l", "pwd -a", "cp -la"],
    correctIndex: 0,
    explanation:
      "ls -la コマンドはディレクトリの内容を詳細フォーマット（-l）かつ隠しファイルを含む全ファイル（-a）で表示します。",
  },
  {
    id: "lpic-cmd-2",
    category: "GNUとUnixコマンド",
    question: "ファイルをコピーするコマンドとして正しいものはどれか？",
    choices: ["mv", "rm", "cp", "ln"],
    correctIndex: 2,
    explanation:
      "cp（copy）コマンドはファイルやディレクトリをコピーします。ディレクトリをコピーする場合は -r オプションをつけます。",
  },
  {
    id: "lpic-cmd-3",
    category: "GNUとUnixコマンド",
    question: "ファイル内の文字列を大文字・小文字を無視して検索するコマンドはどれか？",
    choices: ["find -i", "locate -a", "grep -i", "awk -i"],
    correctIndex: 2,
    explanation:
      "grep -i（--ignore-case）は大文字と小文字を区別せずに一致パターンを検索します。",
  },
  {
    id: "lpic-cmd-4",
    category: "GNUとUnixコマンド",
    question: "所有者に実行権限を追加する chmod コマンドはどれか？",
    choices: ["chmod u+x filename", "chmod a-x filename", "chmod o+w filename", "chmod g+r filename"],
    correctIndex: 0,
    explanation:
      "u=user(所有者)、+x=実行権限追加。したがって chmod u+x となります。",
  },
  {
    id: "lpic-cmd-5",
    category: "GNUとUnixコマンド",
    question: "現在実行中のプロセス一覧を表示する標準的なコマンドはどれか？",
    choices: ["top -l", "ps aux", "kill -a", "nice -p"],
    correctIndex: 1,
    explanation:
      "ps aux は全ユーザーのプロセス状況を詳細に表示します。トッププロセスをリアルタイムで監視するには top コマンドを用います。",
  },

  // ── 4. デバイスとファイルシステム (filesystem) ──
  {
    id: "lpic-fs-1",
    category: "デバイスとファイルシステム",
    question: "ディスクの空き容量や使用率を人間が読みやすい形式（GB/MB等）で表示するコマンドはどれか？",
    choices: ["df -h", "du -s", "fdisk -l", "mount -a"],
    correctIndex: 0,
    explanation:
      "df -h（disk free, human-readable）コマンドは、各ファイルシステムの空き容量や使用率を分かりやすい単位で出力します。",
  },
  {
    id: "lpic-fs-2",
    category: "デバイスとファイルシステム",
    question: "システムの起動時に自動マウントされるファイルシステム情報が記載されている設定ファイルはどれか？",
    choices: ["/etc/fstab", "/etc/mtab", "/etc/mounts", "/etc/filesystems"],
    correctIndex: 0,
    explanation:
      "/etc/fstab（file systems table）に、マウントデバイス・マウントポイント・ファイルシステムタイプ・オプションを記述します。",
  },
  {
    id: "lpic-fs-3",
    category: "デバイスとファイルシステム",
    question: "ext4 ファイルシステムを作成するためのコマンドはどれか？",
    choices: ["mkfs.ext4 /dev/sdb1", "fsck.ext4 /dev/sdb1", "fdisk /dev/sdb1", "mount -t ext4 /dev/sdb1"],
    correctIndex: 0,
    explanation:
      "mkfs.ext4（または mkfs -t ext4）コマンドを用いて、指定したパーティションに ext4 ファイルシステムを作成します。",
  },

  // ── 5. シェルとスクリプト (shell) ──
  {
    id: "lpic-sh-1",
    category: "シェルとスクリプト",
    question: "現在の環境変数一覧を表示するコマンドはどれか？",
    choices: ["printenv", "echo-all", "showenv", "varlist"],
    correctIndex: 0,
    explanation:
      "printenv（または env）コマンドによって現在のシステム環境変数を一覧表示します。",
  },
  {
    id: "lpic-sh-2",
    category: "シェルとスクリプト",
    question: "前回実行した直前のコマンドを再実行する履歴ショートカットはどれか？",
    choices: ["!!", "^r", "!!-1", "^!"],
    correctIndex: 0,
    explanation:
      "!!（bang bang）はbash履歴における直前のコマンドを展開して実行します。",
  },
  {
    id: "lpic-sh-3",
    category: "シェルとスクリプト",
    question: "シェルスクリプトファイルの先頭行に記述するシバン（shebang）として標準的な記述はどれか？",
    choices: ["#!/bin/bash", "#//bin/bash", "$!/bin/bash", "//bin/bash"],
    correctIndex: 0,
    explanation:
      "#!/bin/bash のように書くことで、そのスクリプトを処理するインタープリターをカーネルに指示します。",
  },

  // ── 6. ユーザーとグループ管理 (users) ──
  {
    id: "lpic-user-1",
    category: "ユーザーとグループ管理",
    question: "ユーザーのパスワードの有効期限や変更履歴情報が暗号化されて保存されるファイルはどれか？",
    choices: ["/etc/shadow", "/etc/passwd", "/etc/group", "/etc/login.defs"],
    correctIndex: 0,
    explanation:
      "/etc/shadow ファイルには、ハッシュ化されたパスワードおよびパスワード有効期限等のセキュリティ情報が保存されます。",
  },
  {
    id: "lpic-user-2",
    category: "ユーザーとグループ管理",
    question: "新規ユーザー 'user1' を作成すると同時にホームディレクトリを作成するコマンドはどれか？",
    choices: ["useradd -m user1", "adduser -d user1", "usermod -c user1", "groupadd user1"],
    correctIndex: 0,
    explanation:
      "useradd -m オプションを指定することで、ユーザー作成と同時にホームディレクトリ（/home/user1）を自動作成します。",
  },
  {
    id: "lpic-user-3",
    category: "ユーザーとグループ管理",
    question: "現在ログインしているユーザーのUID、GID、および所属グループを表示するコマンドはどれか？",
    choices: ["id", "whoami", "w", "users"],
    correctIndex: 0,
    explanation:
      "id コマンドはユーザーのユーザーID（UID）、グループID（GID）、および所属グループ一覧を出力します。",
  },
];

type FeedbackState = "none" | "correct" | "incorrect";
type DataSource = "dynamodb" | "fallback";

function getFilteredQuestions(category: string | null): Question[] {
  // まず SEED_QUESTIONS から検索（複数ヒットするように改善）
  const seedFiltered = SEED_QUESTIONS.filter(
    (q) => q.cert === "lpic1" && isCategoryMatch(q.category, category)
  );

  if (seedFiltered.length >= 3) {
    return seedFiltered.map((q) => ({
      id: q.questionId,
      category: q.category,
      question: q.text,
      choices: q.options,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
    }));
  }

  // フォールバックからのフィルタリング
  const fbFiltered = FALLBACK_QUESTIONS.filter((q) =>
    isCategoryMatch(q.category, category)
  );

  return fbFiltered.length > 0 ? fbFiltered : FALLBACK_QUESTIONS;
}

function Lpic1QuizInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get("category") || "all";

  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState<DataSource>("dynamodb");
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>("none");
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      setFetchError(null);
      setCurrentIndex(0);
      setSelectedChoice(null);
      setFeedback("none");
      setScore(0);
      setIsFinished(false);

      try {
        const params = new URLSearchParams({ cert: "lpic1" });
        if (categoryParam && categoryParam !== "all") {
          params.set("category", categoryParam);
        }
        const res = await fetch(`/api/questions?${params.toString()}`);

        if (!res.ok) throw new Error(`サーバーエラー: ${res.status}`);

        const data = await res.json();

        // categoryParam に適合する問題だけを厳密抽出
        const filteredApi = (data.questions || []).filter((q: any) =>
          isCategoryMatch(q.category, categoryParam)
        );

        if (filteredApi.length === 0) {
          setQuestions(shuffleQuestions(getFilteredQuestions(categoryParam)));
          setDataSource("fallback");
        } else {
          setQuestions(shuffleQuestions(filteredApi));
          setDataSource("dynamodb");
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "不明なエラー";
        setFetchError(message);
        setQuestions(shuffleQuestions(getFilteredQuestions(categoryParam)));
        setDataSource("fallback");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [categoryParam]);

  const total = questions.length;
  const question = questions[currentIndex];
  const progress =
    total > 0 ? ((currentIndex + (feedback !== "none" ? 1 : 0)) / total) * 100 : 0;

  const handleSubmit = () => {
    if (selectedChoice === null || !question) return;
    const isCorrect = selectedChoice === question.correctIndex;

    if (isCorrect) setScore((s) => s + 1);
    setFeedback(isCorrect ? "correct" : "incorrect");

    submitAnswer({
      cert: "lpic1",
      questionId: String(question.id),
      category: question.category || "未分類",
      selectedIndex: selectedChoice,
      isCorrect,
    });
  };

  const handleNext = () => {
    if (currentIndex + 1 < total) {
      setCurrentIndex((i) => i + 1);
      setSelectedChoice(null);
      setFeedback("none");
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedChoice(null);
    setFeedback("none");
    setScore(0);
    setIsFinished(false);
    setQuestions((prev) => shuffleQuestions(prev));
  };

  const handleCategorySelect = (slug: string) => {
    if (slug === "all") {
      router.push("/lpic1/quiz");
    } else {
      router.push(`/lpic1/quiz?category=${slug}`);
    }
  };

  // ─── ローディング画面 ─────────────────────────────────────
  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--accent-primary)] border-t-transparent" />
          <p className="font-semibold text-[var(--text-muted)]">
            LPIC-1 問題データを読込中...
          </p>
        </div>
      </main>
    );
  }

  // ─── 完了画面 ─────────────────────────────────────────────
  if (isFinished) {
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
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
              ? "✅ カテゴリ別実践問題（DynamoDB/シードデータ）"
              : "✅ カテゴリ別実践問題モード"}
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
  if (!question) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <p className="text-lg font-bold mb-4">選択したカテゴリの問題がまだありません。</p>
        <button
          onClick={() => handleCategorySelect("all")}
          className="rounded-xl bg-[var(--accent-primary)] px-6 py-3 text-white font-bold"
        >
          全問モードへ戻る
        </button>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(88,166,255,0.10) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 80% 80%, rgba(188,140,255,0.08) 0%, transparent 60%)",
        }}
      />

      <div className="w-full max-w-3xl">
        <header className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <Link
            href="/lpic1"
            className="flex items-center gap-1 text-sm font-bold text-[var(--text-muted)] transition-colors hover:text-[var(--foreground)]"
          >
            ← LPIC-1 トップ
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-[var(--text-muted)]">
              問題 {currentIndex + 1} / {total}
            </span>
            <span className="text-sm font-extrabold text-[var(--accent-secondary)]">
              スコア: {score}
            </span>
          </div>
        </header>

        {/* 🏷️ カテゴリ選択タブバー（ワンタッチ切り替え可能） */}
        <div className="mb-6 overflow-x-auto pb-2">
          <div className="flex gap-1.5 min-w-max">
            {CATEGORY_TABS.map((tab) => {
              const active = tab.slug === categoryParam;
              return (
                <button
                  key={tab.slug}
                  onClick={() => handleCategorySelect(tab.slug)}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                    active
                      ? "bg-[var(--accent-primary)] text-white shadow-md scale-105"
                      : "bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent-primary)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {fetchError && (
          <div className="mb-4 rounded-xl border border-[#e3b341] bg-[rgba(227,179,65,0.08)] px-4 py-2 text-xs text-[#e3b341]">
            ⚠️ DynamoDB オフライン — カテゴリ別実戦データを使用中
          </div>
        )}

        {/* プログレスバー */}
        <div className="mb-6 h-2.5 overflow-hidden rounded-full bg-[var(--surface-2)]">
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
          <div className="mb-4 inline-block rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1 text-xs font-bold text-[var(--accent-primary)]">
            🐧 {question.category}
          </div>

          <h2
            id="question-text"
            className="mb-8 text-base font-extrabold leading-relaxed text-[var(--foreground)] sm:text-lg"
          >
            {question.question}
          </h2>

          {/* 選択肢リスト */}
          <div className="mb-8 grid gap-3" role="group" aria-label="選択肢">
            {question.choices.map((choice, i) => {
              let btnStyle =
                "border-[var(--border)] bg-[var(--surface-2)] text-[var(--foreground)] hover:border-[var(--accent-primary)]";

              if (feedback !== "none") {
                if (i === question.correctIndex) {
                  btnStyle =
                    "border-[#3fb950] bg-[rgba(63,185,80,0.15)] text-[#3fb950] font-bold";
                } else if (i === selectedChoice && feedback === "incorrect") {
                  btnStyle =
                    "border-[#f85149] bg-[rgba(248,81,73,0.15)] text-[#f85149] font-bold";
                } else {
                  btnStyle = "border-[var(--border)] bg-[var(--surface-2)] opacity-50";
                }
              } else if (selectedChoice === i) {
                btnStyle =
                  "border-[var(--accent-primary)] bg-[rgba(88,166,255,0.15)] text-[var(--accent-primary)] font-bold";
              }

              return (
                <button
                  key={i}
                  id={`choice-btn-${i}`}
                  onClick={() => feedback === "none" && setSelectedChoice(i)}
                  disabled={feedback !== "none"}
                  className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left text-sm transition-all duration-200 ${btnStyle} disabled:cursor-default`}
                >
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-xs font-bold"
                    style={{
                      borderColor:
                        feedback !== "none" && i === question.correctIndex
                          ? "#3fb950"
                          : selectedChoice === i
                          ? "var(--accent-primary)"
                          : "var(--border)",
                    }}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="flex-1 font-semibold">{choice}</span>
                  {feedback !== "none" && i === question.correctIndex && (
                    <span className="text-base">✓</span>
                  )}
                  {feedback === "incorrect" &&
                    i === selectedChoice &&
                    i !== question.correctIndex && <span className="text-base">✗</span>}
                </button>
              );
            })}
          </div>

          {/* 解説カード（回答後に表示） */}
          {feedback !== "none" && (
            <div
              className={`mb-6 rounded-xl border p-4 text-sm animate-fade-in-up ${
                feedback === "correct"
                  ? "border-[#3fb950] bg-[rgba(63,185,80,0.08)]"
                  : "border-[#f85149] bg-[rgba(248,81,73,0.08)]"
              }`}
            >
              <div className="mb-2 flex items-center gap-2 font-extrabold">
                {feedback === "correct" ? (
                  <span className="text-[#3fb950]">🎉 正解！素晴らしい！</span>
                ) : (
                  <span className="text-[#f85149]">💡 残念！正解は {String.fromCharCode(65 + question.correctIndex)} です</span>
                )}
              </div>
              <p className="leading-relaxed text-[var(--foreground)] font-medium">
                {question.explanation}
              </p>
            </div>
          )}

          {/* アクションボタン */}
          {feedback === "none" ? (
            <button
              id="submit-answer-btn"
              onClick={handleSubmit}
              disabled={selectedChoice === null}
              className="w-full rounded-xl py-3.5 font-extrabold text-white transition-all duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              style={{ background: "linear-gradient(135deg, #1d6fca, #58a6ff)" }}
            >
              回答する
            </button>
          ) : (
            <button
              id="next-question-btn"
              onClick={handleNext}
              className="w-full rounded-xl py-3.5 font-extrabold text-white transition-all duration-200 hover:scale-[1.01] hover:opacity-90"
              style={{
                background:
                  feedback === "correct"
                    ? "linear-gradient(135deg, #196c2e, #3fb950)"
                    : "linear-gradient(135deg, #6e40c9, #bc8cff)",
              }}
            >
              {currentIndex + 1 < total ? "次の問題へ進む →" : "結果を見る 🎉"}
            </button>
          )}
        </section>
      </div>
    </main>
  );
}

export default function Lpic1QuizPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center px-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--accent-primary)] border-t-transparent" />
        </main>
      }
    >
      <Lpic1QuizInner />
    </Suspense>
  );
}
