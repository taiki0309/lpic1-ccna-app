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
  // ── 1. システムアーキテクチャ (3問) ──
  {
    id: "lpic-arch-1",
    category: "システムアーキテクチャ",
    question: "PC起動時にハードウェアの初期化を行い、ストレージからOSのブートローダーを呼び出すファームウェアとして現在の標準的なものはどれか？",
    choices: ["UEFI", "LILO", "SysVinit", "GRUB"],
    correctIndex: 0,
    explanation: "従来のBIOSに代わり、現在の大容量ストレージや高速起動、セキュアブートに対応した標準ファームウェアは UEFI です。",
  },
  {
    id: "lpic-arch-2",
    category: "システムアーキテクチャ",
    question: "Linuxシステムに接続されているPCIデバイス（グラフィックカードやイーサネットアダプタなど）の一覧を表示するコマンドはどれか？",
    choices: ["lspci", "lsusb", "lsdev", "ifconfig"],
    correctIndex: 0,
    explanation: "lspci コマンドでPCIバスおよび接続されているデバイスの一覧を表示できます。USBデバイス確認は lsusb です。",
  },
  {
    id: "lpic-arch-3",
    category: "システムアーキテクチャ",
    question: "システム起動時にカーネルが出力したハードウェア検出メッセージを確認できるコマンドはどれか？",
    choices: ["dmesg", "uname", "fdisk", "journalctl --kernel-only"],
    correctIndex: 0,
    explanation: "dmesg コマンドは、OS起動時にカーネルが出力したハードウェア検出などのメッセージログ（カーネルリングバッファ）を表示します。",
  },

  // ── 2. パッケージ管理 (3問) ──
  {
    id: "lpic-pkg-1",
    category: "パッケージ管理",
    question: "Debian/Ubuntu系Linuxにおいて、インターネット上のリポジトリから最新のパッケージ情報（一覧）を取得・更新するコマンドはどれか？",
    choices: ["apt update", "apt upgrade", "apt install", "apt clean"],
    correctIndex: 0,
    explanation: "apt update でまずリポジトリのインデックス（最新パッケージ情報）を更新し、その後の apt upgrade でインストール済みパッケージを更新します。",
  },
  {
    id: "lpic-pkg-2",
    category: "パッケージ管理",
    question: "Debian/Ubuntu系システムで、パッケージファイル(.deb)を個別に直接インストールするdpkgコマンドのオプションはどれか？",
    choices: ["dpkg -i", "dpkg -l", "dpkg -r", "dpkg -s"],
    correctIndex: 0,
    explanation: "-i (install) オプションで .deb パッケージを直接インストールします。-l は一覧表示、-r は削除です。",
  },
  {
    id: "lpic-pkg-3",
    category: "パッケージ管理",
    question: "RHEL/CentOS系システムにおいて、依存関係を自動解決してパッケージをインストール・更新する標準のパッケージ管理ツールはどれか？",
    choices: ["dnf (yum)", "apt", "pacman", "zypper"],
    correctIndex: 0,
    explanation: "Red Hat系Linuxでは、従来の yum や後継の dnf コマンドがRPMパッケージの依存関係を自動解決して管理する標準ツールです。",
  },

  // ── 3. 基本コマンド (4問) ──
  {
    id: "lpic-cmd-1",
    category: "基本コマンド",
    question: "カレントディレクトリ（現在自分がいるディレクトリ）の絶対パスを表示するコマンドはどれか？",
    choices: ["pwd", "cd", "ls", "pwd --current"],
    correctIndex: 0,
    explanation: "pwd (print working directory) コマンドを実行すると、現在の作業ディレクトリの絶対パスが画面に表示されます。",
  },
  {
    id: "lpic-cmd-2",
    category: "基本コマンド",
    question: "ディレクトリごとファイルを再帰的にコピーするために必要な cp コマンドのオプションはどれか？",
    choices: ["-r", "-f", "-v", "-p"],
    correctIndex: 0,
    explanation: "-r（または -R、recursive=再帰的）オプションを指定することで、ディレクトリ内の全ファイルとサブディレクトリを丸ごとコピーできます。",
  },
  {
    id: "lpic-cmd-3",
    category: "基本コマンド",
    question: "テキストファイルの内容を表示・連結する基本的なコマンドはどれか？",
    choices: ["cat", "less", "head", "grep"],
    correctIndex: 0,
    explanation: "cat (concatenate) コマンドは、ファイル全体をそのまま標準出力に表示するため、短い設定ファイルの確認などで最もよく使われます。",
  },
  {
    id: "lpic-cmd-4",
    category: "基本コマンド",
    question: "ファイル内から特定の文字列（キーワード）を含む行を検索して抽出するコマンドはどれか？",
    choices: ["grep", "find", "locate", "whereis"],
    correctIndex: 0,
    explanation: "grep コマンドはテキストファイルから正規表現やキーワードに一致する行を検索して出力する必須コマンドです。",
  },

  // ── 4. ファイルシステムとデバイス (3問) ──
  {
    id: "lpic-fs-1",
    category: "ファイルシステムとデバイス",
    question: "システム起動時に自動マウントするファイルシステムやデバイスの設定が記述されている設定ファイルはどれか？",
    choices: ["/etc/fstab", "/etc/mtab", "/etc/mount.conf", "/etc/disks"],
    correctIndex: 0,
    explanation: "/etc/fstab (file systems table) に、起動時に自動マウントするデバイスやマウントポイント、ファイルシステム形式などを記述します。",
  },
  {
    id: "lpic-fs-2",
    category: "ファイルシステムとデバイス",
    question: "ディスクの空き容量と使用量を、人間が読みやすい単位（MBやGBなど）で確認するコマンドはどれか？",
    choices: ["df -h", "du -sh", "lsblk", "fdisk -l"],
    correctIndex: 0,
    explanation: "df コマンドに -h (human-readable) オプションを付けることで、システム中のファイルシステムのディスク使用状況を読みやすい単位で確認できます。",
  },
  {
    id: "lpic-fs-3",
    category: "ファイルシステムとデバイス",
    question: "ツリー状に接続されているブロックデバイス（ハードディスクやパーティション情報）の一覧を表示するコマンドはどれか？",
    choices: ["lsblk", "lspci", "lsusb", "lscpu"],
    correctIndex: 0,
    explanation: "lsblk コマンドはシステム上のブロックデバイス一覧を階層構造でわかりやすく表示するため、ストレージ構成の確認に便利です。",
  },

  // ── 5. シェルとスクリプト (3問) ──
  {
    id: "lpic-sh-1",
    category: "シェルとスクリプト",
    question: "シェルスクリプトファイルの1行目に記述する、そのスクリプトを実行するインタープリターを指定する記法（#!/bin/bash など）は何と呼ばれるか？",
    choices: ["シバン (Shebang)", "コメントアウト", "マジックコメント", "インクルード宣言"],
    correctIndex: 0,
    explanation: "#! から始まる記述をシバン（シェバング）と呼び、どのシェルプログラム（/bin/bash や /bin/sh など）でスクリプトを実行すべきかをOSに指示します。",
  },
  {
    id: "lpic-sh-2",
    category: "シェルとスクリプト",
    question: "作成したシェルスクリプトに実行権限（誰でも実行可能）を付与するコマンドはどれか？",
    choices: ["chmod +x script.sh", "chown +exec script.sh", "chmod 644 script.sh", "umask 022 script.sh"],
    correctIndex: 0,
    explanation: "chmod +x (または 755 など) により、ファイルに実行権限 (execute) を設定できます。",
  },
  {
    id: "lpic-sh-3",
    category: "シェルとスクリプト",
    question: "設定した変数（例: VAR='test'）を、子プロセスや外部コマンドからも環境変数として参照できるようにするコマンドはどれか？",
    choices: ["export VAR", "source VAR", "import VAR", "set --env VAR"],
    correctIndex: 0,
    explanation: "export コマンドで変数を環境変数としてエクスポートすることで、起動するシェルスクリプトやプログラム内からも参照可能になります。",
  },

  // ── 6. ユーザーとセキュリティ (4問) ──
  {
    id: "lpic-sec-1",
    category: "ユーザーとセキュリティ",
    question: "Linuxシステム内のすべてのユーザーアカウント情報（ユーザー名やホームディレクトリなど）が保存されているファイルはどれか？",
    choices: ["/etc/passwd", "/etc/shadow", "/etc/group", "/etc/users"],
    correctIndex: 0,
    explanation: "/etc/passwd は全アカウントの基本情報を保持しており、実際のハッシュ化されたパスワードはセキュリティ上 /etc/shadow に格納されます。",
  },
  {
    id: "lpic-sec-2",
    category: "ユーザーとセキュリティ",
    question: "新規ユーザーアカウントを作成するために使用する標準コマンドはどれか？",
    choices: ["useradd", "newuser", "createuser", "mkuser"],
    correctIndex: 0,
    explanation: "useradd コマンド（または対話型の adduser）を使用して、新しいユーザーアカウントやホームディレクトリを作成します。",
  },
  {
    id: "lpic-sec-3",
    category: "ユーザーとセキュリティ",
    question: "自身のパスワード（または管理者として他ユーザーのパスワード）を変更するコマンドはどれか？",
    choices: ["passwd", "chpasswd", "pwd-update", "secpasswd"],
    correctIndex: 0,
    explanation: "passwd コマンドを実行することで、対話的にパスワードを変更できます。rootユーザーであれば他ユーザーのパスワード変更も可能です。",
  },
  {
    id: "lpic-sec-4",
    category: "ユーザーとセキュリティ",
    question: "許可されたユーザーが自身のパスワードを入力することで、一時的に管理者(root)権限でコマンドを実行できるようにするコマンドはどれか？",
    choices: ["sudo", "su --admin", "rootexec", "chmod --root"],
    correctIndex: 0,
    explanation: "sudo コマンドを使うことで、/etc/sudoers の設定に基づき root 権限が必要なコマンドを安全かつ履歴ログを残して実行できます。",
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
