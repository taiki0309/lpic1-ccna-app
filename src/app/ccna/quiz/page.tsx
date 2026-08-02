"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { submitAnswer } from "@/lib/submitAnswer";
import { SEED_QUESTIONS } from "@/lib/questionSeedData";
import { isCategoryMatch } from "@/lib/categoryMatcher";
import { shuffleQuestions } from "@/lib/shuffleQuestions";

interface Question {
  id: string | number;
  category: string;
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
}

const CATEGORY_TABS = [
  { slug: "all", label: "全問（総合演習）", icon: "🌐" },
  { slug: "fundamentals", label: "ネットワーク基礎", icon: "🔗" },
  { slug: "ip-addressing", label: "IPアドレス・サービス", icon: "🔢" },
  { slug: "routing", label: "ルーティング", icon: "🗺️" },
  { slug: "switching", label: "スイッチング・VLAN", icon: "🔀" },
  { slug: "security", label: "セキュリティ", icon: "🔐" },
  { slug: "wan-cloud", label: "WAN・クラウド・自動化", icon: "☁️" },
];

// ─── CCNA カテゴリ別 充実フォールバック問題（全カテゴリ完全対応版） ───
const FALLBACK_QUESTIONS: Question[] = [
  // ── 1. ネットワーク基礎 (4問) ──
  {
    id: "ccna-fund-1",
    category: "ネットワーク基礎",
    question: "OSI参照モデルにおいて、ルーターがIPアドレスを用いて経路選択を行うのはどのレイヤ（層）か？",
    choices: ["ネットワーク層 (レイヤ3)", "データリンク層 (レイヤ2)", "トランスポート層 (レイヤ4)", "物理層 (レイヤ1)"],
    correctIndex: 0,
    explanation: "IPアドレスに基づくルーティング（経路選択）は、OSI参照モデルのネットワーク層（第3層）で行われます。",
  },
  {
    id: "ccna-fund-2",
    category: "ネットワーク基礎",
    question: "TCPとUDPの比較について、正しい記述はどれか？",
    choices: [
      "TCPはコネクション指向で信頼性が高く、UDPはコネクションレスで高速・リアルタイム性が高い",
      "UDPはスリーウェイハンドシェイクを用いて接続を確立する",
      "TCPは動画配信や音声通話でのみ使用される",
      "UDPはパケット再送制御を標準で行う",
    ],
    correctIndex: 0,
    explanation: "TCPは正確性重視（WEB閲覧等）、UDPは速度やリアルタイム性重視（動画通話・DNS等）の特徴があります。",
  },
  {
    id: "ccna-fund-3",
    category: "ネットワーク基礎",
    question: "イーサネットで使用されるMACアドレス（物理アドレス）のビット長として正しいものはどれか？",
    choices: ["48ビット (6バイト)", "32ビット (4バイト)", "128ビット (16バイト)", "64ビット (8バイト)"],
    correctIndex: 0,
    explanation: "MACアドレスは48ビット（前半24ビットがメーカー識別子OUI、後半24ビットが固有番号）で構成されます。",
  },
  {
    id: "ccna-fund-4",
    category: "ネットワーク基礎",
    question: "ハブ（リピータハブ）とスイッチ（レイヤ2スイッチ）の動作の違いとして正しいものはどれか？",
    choices: [
      "スイッチはMACアドレステーブルを学習し、目的のポートにのみフレームを転送する",
      "ハブは全ポートが独立したコリジョンドメインを持つ",
      "スイッチはIPアドレスを見てルーティングを行う",
      "ハブはVLANを構成することができる",
    ],
    correctIndex: 0,
    explanation: "レイヤ2スイッチは宛先MACアドレスを学習して該当ポートのみに転送するため、コリジョン（衝突）を防ぎ通信効率を高めます。",
  },

  // ── 2. IPアドレッシング (3問) ──
  {
    id: "ccna-ip-1",
    category: "IPアドレッシング",
    question: "IPv4アドレスのクラスCにおけるプライベートIPアドレスの範囲として正しいものはどれか？",
    choices: [
      "192.168.0.0 〜 192.168.255.255",
      "10.0.0.0 〜 10.255.255.255",
      "172.16.0.0 〜 172.31.255.255",
      "169.254.0.0 〜 169.254.255.255",
    ],
    correctIndex: 0,
    explanation: "192.168.0.0/16 はクラスCのプライベートアドレス範囲であり、社内LANや家庭用ルーター等で広く使用されます。",
  },
  {
    id: "ccna-ip-2",
    category: "IPアドレッシング",
    question: "プレフィックス長「/24」を表すサブネットマスク表記として正しいものはどれか？",
    choices: ["255.255.255.0", "255.255.0.0", "255.255.255.128", "255.255.255.255"],
    correctIndex: 0,
    explanation: "/24 は先頭から24ビットが「1」（8ビット×3=24）であることを意味し、10進数では 255.255.255.0 となります。",
  },
  {
    id: "ccna-ip-3",
    category: "IPアドレッシング",
    question: "ネットワーク上のPCやデバイスに対し、IPアドレスやサブネットマスクを自動的に割り当てるプロトコルはどれか？",
    choices: ["DHCP", "DNS", "ARP", "NAT"],
    correctIndex: 0,
    explanation: "DHCP (Dynamic Host Configuration Protocol) はIPアドレス等のネットワーク設定を自動的に配布・管理する仕組みです。",
  },

  // ── 3. ルーティング (3問) ──
  {
    id: "ccna-rt-1",
    category: "ルーティング",
    question: "ルーターのルーティングテーブルに宛先ネットワークが登録されていない場合、パケットの転送先として使われる標準の経路はどれか？",
    choices: ["デフォルトルート (0.0.0.0/0)", "スタティックルート", "ダイナミックルート", "ループバックルート"],
    correctIndex: 0,
    explanation: "どの宛先にも一致しない通信はデフォルトルート (0.0.0.0/0) に送られます（インターネット境界ルーターなどで必須）。",
  },
  {
    id: "ccna-rt-2",
    category: "ルーティング",
    question: "リンクステート型ルーティングプロトコルに分類され、コスト（帯域幅）をもとに最短経路を計算するプロトコルはどれか？",
    choices: ["OSPF", "RIP", "BGP", "EIGRP"],
    correctIndex: 0,
    explanation: "OSPF (Open Shortest Path First) はリンクステート型プロトコルで、帯域幅に基づくコストを計算し最良経路を決定します。",
  },
  {
    id: "ccna-rt-3",
    category: "ルーティング",
    question: "異なる宛先経路情報がある場合、ルーターがどの情報源を優先するかを決定する数値（直接接続は0、スタティックは1等）は何と呼ばれるか？",
    choices: ["アドミニストレーティブディスタンス (AD値)", "メトリック", "ホップ数", "自律システム番号 (AS番号)"],
    correctIndex: 0,
    explanation: "AD値（信頼度）が小さい経路情報源ほど信頼できるとみなされ、ルーティングテーブルに優先採用されます。",
  },

  // ── 4. スイッチング・VLAN (4問) ──
  {
    id: "ccna-sw-1",
    category: "スイッチング・VLAN",
    question: "物理的な配線を変えずに、スイッチ内で論理的にグループを分割する技術（VLAN）の最大の利点はどれか？",
    choices: [
      "ブロードキャストドメインを分割し、セキュリティ向上とネットワーク負荷軽減を図れる",
      "ルーターなしで異なるVLAN間の直接通信ができるようになる",
      "MACアドレスが自動的に暗号化される",
      "通信ケーブルが断線した際に自動修復される",
    ],
    correctIndex: 0,
    explanation: "VLANによりブロードキャストの到達範囲を分割できるため、不要なパケット拡散を防ぎ安全で効率的なLANを構築できます。",
  },
  {
    id: "ccna-sw-2",
    category: "スイッチング・VLAN",
    question: "1本のスイッチ間リンクで複数のVLANフレームを同時に転送するために設定するポートモードはどれか？",
    choices: ["トランクポート (Trunk)", "アクセスポート (Access)", "ダイナミックポート (Dynamic)", "モニターポート (Monitor)"],
    correctIndex: 0,
    explanation: "トランクポート（IEEE 802.1Qタグを使用）を設定することで、複数のVLANデータを1本のケーブルで区別して伝送できます。",
  },
  {
    id: "ccna-sw-3",
    category: "スイッチング・VLAN",
    question: "ネットワーク上のループ（物理的な円環接続によるパケット永久循環）を防止・自動制御するプロトコルはどれか？",
    choices: ["STP (Spanning Tree Protocol)", "ARP (Address Resolution Protocol)", "LACP", "VTP"],
    correctIndex: 0,
    explanation: "STP (スパニングツリープロトコル) は、ループ発生時に自動的に一部のポートをブロックし、障害時には自動で迂回させます。",
  },
  {
    id: "ccna-sw-4",
    category: "スイッチング・VLAN",
    question: "スイッチのインターフェースに設定できる「アクセスポート (access)」について正しい記述はどれか？",
    choices: [
      "1つのVLANにのみ所属し、PCやサーバーなどの端末を接続するために使用される",
      "すべてのVLANタグを保持して転送する",
      "ルーター同士のバックボーン接続にのみ使用される",
      "MACアドレスの学習が標準で無効化される",
    ],
    correctIndex: 0,
    explanation: "アクセスポートは単一のVLANに割り当てられ、主にPC・プリンタ等のエンドデバイスを接続する際に用いられます。",
  },

  // ── 5. セキュリティ (3問) ──
  {
    id: "ccna-sec-1",
    category: "セキュリティ",
    question: "ルーターやスイッチを通過するトラフィックを、送信元IPや宛先ポート番号などの条件で許可または拒否するフィルタリング機能はどれか？",
    choices: ["ACL (アクセス制御リスト)", "NAT (アドレス変換)", "DHCPスヌーピング", "STPガード"],
    correctIndex: 0,
    explanation: "ACL (Access Control List) を用いることで、不適切な通信や外部からの不正アクセスのフィルタリングが可能です。",
  },
  {
    id: "ccna-sec-2",
    category: "セキュリティ",
    question: "スイッチのポートにおいて、接続を許可する端末のMACアドレスを制限し、不正なPCの接続を防止するセキュリティ機能はどれか？",
    choices: ["ポートセキュリティ (Port Security)", "ダイナミックARPインスペクション", "BPDUガード", "ストームコントロール"],
    correctIndex: 0,
    explanation: "ポートセキュリティを使うと、許可されたMACアドレス以外の機器を接続した際にポートをシャットダウンするなどの制限が可能です。",
  },
  {
    id: "ccna-sec-3",
    category: "セキュリティ",
    question: "現在のWi-Fi（無線LAN）環境で、個々の端末ごとに暗号化鍵を生成する高度なセキュリティ対策を導入した最新規格はどれか？",
    choices: ["WPA3", "WEP", "WPA-PSK", "WPA-TKIP"],
    correctIndex: 0,
    explanation: "WPA3 はSAEという認証方式を取り入れ、辞書攻撃への耐性や端末個別の暗号化を実現した現在の推奨セキュリティ規格です。",
  },

  // ── 6. WAN・クラウド・自動化 (3問) ──
  {
    id: "ccna-wan-1",
    category: "WAN・クラウド・自動化",
    question: "ソフトウェアでネットワーク全体を一元管理・制御する技術（SDN）において、制御機能（コントロールプレーン）を担う中核サーバーを何と呼ぶか？",
    choices: ["SDNコントローラー", "エッジルーター", "フォワードハブ", "BGPスピーカ"],
    correctIndex: 0,
    explanation: "SDNではネットワークインフラを構成する各デバイスに代わり、SDNコントローラーが中央で一括して経路設定やポリシーを制御します。",
  },
  {
    id: "ccna-wan-2",
    category: "WAN・クラウド・自動化",
    question: "Webサービスやネットワーク機器の自動設定で広く用いられる、人間が読み書きしやすいデータ形式（構造化言語）はどれか？",
    choices: ["JSON", "バイナリダンプ", "アセンブリコード", "マシン語"],
    correctIndex: 0,
    explanation: "JSON (JavaScript Object Notation) は、REST APIなどでデータの受け渡しとして標準的に用いられる人間にも読みやすい形式です。",
  },
  {
    id: "ccna-wan-3",
    category: "WAN・クラウド・自動化",
    question: "エージェント不要で、SSHを経由してネットワーク機器やサーバーの設定自動化を行う代表的な構成管理ツールはどれか？",
    choices: ["Ansible", "Wireshark", "PingPlotter", "Cisco Packet Tracer"],
    correctIndex: 0,
    explanation: "Ansible はPlaybook (YAML形式) に記述した設定を、SSHを通じて多数の機器に一斉適用できる代表的な自動化ツールです。",
  },
];

type FeedbackState = "none" | "correct" | "incorrect";
type DataSource = "dynamodb" | "fallback";

function getFilteredQuestions(category: string | null): Question[] {
  const seedFiltered = SEED_QUESTIONS.filter(
    (q) => q.cert === "ccna" && isCategoryMatch(q.category, category)
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

  const fbFiltered = FALLBACK_QUESTIONS.filter((q) =>
    isCategoryMatch(q.category, category)
  );

  return fbFiltered.length > 0 ? fbFiltered : FALLBACK_QUESTIONS;
}

function CcnaQuizInner() {
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
        const params = new URLSearchParams({ cert: "ccna" });
        if (categoryParam && categoryParam !== "all") {
          params.set("category", categoryParam);
        }
        const res = await fetch(`/api/questions?${params.toString()}`);

        if (!res.ok) throw new Error(`サーバーエラー: ${res.status}`);

        const data = await res.json();

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
      cert: "ccna",
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
      router.push("/ccna/quiz");
    } else {
      router.push(`/ccna/quiz?category=${slug}`);
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--accent-primary)] border-t-transparent" />
          <p className="font-semibold text-[var(--text-muted)]">
            CCNA 問題データを読込中...
          </p>
        </div>
      </main>
    );
  }

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
              "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(188,140,255,0.12) 0%, transparent 60%)",
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
              style={{ background: "linear-gradient(135deg, #6e40c9, #bc8cff)" }}
            >
              もう一度挑戦
            </button>
            <Link
              href="/ccna"
              className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-6 py-3 text-center font-semibold text-[var(--foreground)] transition-all duration-200 hover:scale-105 hover:border-[var(--accent-primary)]"
            >
              CCNA トップへ
            </Link>
          </div>
        </div>
      </main>
    );
  }

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
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(188,140,255,0.10) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 80% 80%, rgba(88,166,255,0.08) 0%, transparent 60%)",
        }}
      />

      <div className="w-full max-w-3xl">
        <header className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <Link
            href="/ccna"
            className="flex items-center gap-1 text-sm font-bold text-[var(--text-muted)] transition-colors hover:text-[var(--foreground)]"
          >
            ← CCNA トップ
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

        {/* 🏷️ CCNAカテゴリ選択タブバー（ワンタッチ切り替え可能） */}
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

        <div className="mb-6 h-2.5 overflow-hidden rounded-full bg-[var(--surface-2)]">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #6e40c9, #bc8cff)",
            }}
          />
        </div>

        <section
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl sm:p-8"
          aria-label="問題"
        >
          <div className="mb-4 inline-block rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1 text-xs font-bold text-[var(--accent-primary)]">
            🌐 {question.category}
          </div>

          <h2
            id="question-text"
            className="mb-8 text-base font-extrabold leading-relaxed text-[var(--foreground)] sm:text-lg"
          >
            {question.question}
          </h2>

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

          {feedback === "none" ? (
            <button
              id="submit-answer-btn"
              onClick={handleSubmit}
              disabled={selectedChoice === null}
              className="w-full rounded-xl py-3.5 font-extrabold text-white transition-all duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              style={{ background: "linear-gradient(135deg, #6e40c9, #bc8cff)" }}
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

export default function CcnaQuizPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center px-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--accent-primary)] border-t-transparent" />
        </main>
      }
    >
      <CcnaQuizInner />
    </Suspense>
  );
}
