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
  // ── 1. ネットワーク基礎 (fundamentals) ──
  {
    id: "ccna-fund-1",
    category: "ネットワーク基礎",
    question: "OSI参照モデルのレイヤー3（ネットワーク層）で動作する主なデバイスはどれか？",
    choices: ["スイッチ", "ルーター", "ハブ", "リピーター"],
    correctIndex: 1,
    explanation:
      "ルーターはレイヤー3（ネットワーク層）で動作し、IPアドレスを使用して論理的な経路制御（ルーティング）を行います。",
  },
  {
    id: "ccna-fund-2",
    category: "ネットワーク基礎",
    question: "TCPとUDPの説明として最も正しいものはどれか？",
    choices: [
      "TCPはコネクションレス型で高速、UDPはコネクション型で信頼性が高い",
      "TCPはコネクション型で信頼性が高く、UDPはコネクションレス型で高速・低遅延",
      "TCPとUDPはどちらもレイヤー2で動作する",
      "UDPはスリーウェイハンドシェイクを用いて接続を確立する",
    ],
    correctIndex: 1,
    explanation:
      "TCP（Transmission Control Protocol）は3WAYハンドシェイクで接続を確立して順序制御や再送制御を行うコネクション型です。UDPはオーバーヘッドの小さいコネクションレス型です。",
  },
  {
    id: "ccna-fund-3",
    category: "ネットワーク基礎",
    question: "イーサネットフレームのプリアンブルとSFD（Start Frame Delimiter）を合わせた総バイト数はどれか？",
    choices: ["4バイト", "6バイト", "8バイト", "14バイト"],
    correctIndex: 2,
    explanation:
      "プリアンブル（7バイト）と SFD（1バイト）を合わせて 8バイトとなり、受信側にフレーム開始を同期させます。",
  },
  {
    id: "ccna-fund-4",
    category: "ネットワーク基礎",
    question: "ARP（Address Resolution Protocol）の役割として正しい記述はどれか？",
    choices: [
      "IPアドレスからMACアドレスを解決する",
      "MACアドレスからIPアドレスを解決する",
      "ホスト名をIPアドレスに変換する",
      "ポート番号を自動的に割り当てる",
    ],
    correctIndex: 0,
    explanation:
      "ARPは、既知のIPアドレスに対応する宛先MACアドレスを調べるために使用されるプロトコルです。",
  },

  // ── 2. IPアドレッシング (ip-addressing) ──
  {
    id: "ccna-ip-1",
    category: "IPアドレッシング",
    question: "192.168.1.0/24 ネットワークにおいて、実際にホストに割り当て可能なIPアドレス数はいくつか？",
    choices: ["256", "255", "254", "252"],
    correctIndex: 2,
    explanation:
      "/24 ではホストビットが8ビット（2^8 = 256アドレス）あります。ネットワークアドレスとブロードキャストアドレスの2つを除いた 254 個が割り当て可能です。",
  },
  {
    id: "ccna-ip-2",
    category: "IPアドレッシング",
    question: "RFC 1918 で定義されているプライベートIPアドレスの範囲として正しいものはどれか？",
    choices: [
      "10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16",
      "10.0.0.0/8, 172.0.0.0/8, 192.168.0.0/24",
      "172.16.0.0/16, 192.168.1.0/24",
      "192.168.0.0/16 のみ",
    ],
    correctIndex: 0,
    explanation:
      "クラスA: 10.0.0.0/8、クラスB: 172.16.0.0/12（172.16〜172.31）、クラスC: 192.168.0.0/16 の3ブロックです。",
  },
  {
    id: "ccna-ip-3",
    category: "IPアドレッシング",
    question: "IPv6アドレス 2001:0db8:0000:0000:0000:ff00:0042:8329 の最も短縮された正しい表記はどれか？",
    choices: [
      "2001:db8::ff00:42:8329",
      "2001:db8::ff00:0042:8329",
      "2001:db8:::ff00:42:8329",
      "2001:db8::ff:42:8329",
    ],
    correctIndex: 0,
    explanation:
      "連続する0のブロックを「::」に省略し、各ブロック先頭の0を省略して 2001:db8::ff00:42:8329 となります。",
  },
  {
    id: "ccna-ip-4",
    category: "IPアドレッシング",
    question: "サブネットマスク 255.255.255.224 を CIDR（プレフィックス）表記にしたものはどれか？",
    choices: ["/26", "/27", "/28", "/29"],
    correctIndex: 1,
    explanation:
      "第4オクテットの 224 は 11100000(2) であり、24 + 3 = 27ビットがネットワーク部となるため /27 です。",
  },

  // ── 3. ルーティング (routing) ──
  {
    id: "ccna-rt-1",
    category: "ルーティング",
    question: "OSPF のデフォルトの管理距離（Administrative Distance）はいくつか？",
    choices: ["90", "100", "110", "120"],
    correctIndex: 2,
    explanation:
      "OSPF のデフォルト AD は 110 です。なお EIGRP は 90、RIP は 120、スタティックルートは 1 です。",
  },
  {
    id: "ccna-rt-2",
    category: "ルーティング",
    question: "すべての宛先に一致するデフォルトルートをスタティックに設定するコマンドはどれか？",
    choices: [
      "ip route 0.0.0.0 0.0.0.0 10.0.0.1",
      "ip route default 10.0.0.1",
      "ip route 255.255.255.255 0.0.0.0 10.0.0.1",
      "route add default gw 10.0.0.1",
    ],
    correctIndex: 0,
    explanation:
      "Cisco IOSにおいて、宛先ネットワークとサブネットマスクを 0.0.0.0 0.0.0.0 とすることでデフォルトルートを定義します。",
  },
  {
    id: "ccna-rt-3",
    category: "ルーティング",
    question: "OSPF で隣接ルーター（ネイバー）関係のステータス一覧を確認するコマンドはどれか？",
    choices: [
      "show ip ospf neighbor",
      "show ip ospf route",
      "show ip protocol",
      "show ospf status",
    ],
    correctIndex: 0,
    explanation:
      "show ip ospf neighbor コマンドで、ネイバーID・ステータス（FULL/DR 等）・インターフェースなどの隣接情報を確認できます。",
  },
  {
    id: "ccna-rt-4",
    category: "ルーティング",
    question: "ルーティングテーブル内に異なる管理距離（AD）を持つ同じ宛先ルートが存在する場合、ルーターはどれを選択するか？",
    choices: [
      "管理距離（AD）が最も小さいルート",
      "管理距離（AD）が最も大きいルート",
      "メトリックが最も大きいルート",
      "両方をロードバランシングする",
    ],
    correctIndex: 0,
    explanation:
      "管理距離（AD）は異なるプロトコル間の信頼度を表す値であり、数値が最も小さいルートが優先してルーティングテーブルにインストールされます。",
  },

  // ── 4. スイッチング・VLAN (switching) ──
  {
    id: "ccna-sw-1",
    category: "スイッチング・VLAN",
    question: "IEEE 802.1Q でイーサネットフレームに追加されるVLANタグのサイズは何バイトか？",
    choices: ["2バイト", "4バイト", "6バイト", "8バイト"],
    correctIndex: 1,
    explanation:
      "802.1Q フレームタギングでは TPID（2バイト）+ TCI（2バイト：優先度やVLAN ID 12ビット等）の合計 4バイトが追加されます。",
  },
  {
    id: "ccna-sw-2",
    category: "スイッチング・VLAN",
    question: "STP（Spanning Tree Protocol）において、ルートブリッジを選出する際に最優先されるパラメータはどれか？",
    choices: [
      "最も小さいブリッジID（優先度 + MACアドレス）",
      "最も大きいブリッジID",
      "最も高速なポートスピード",
      "最も多いポート数",
    ],
    correctIndex: 0,
    explanation:
      "STPではブリッジ優先度（デフォルト32768）とMACアドレスで構成される「ブリッジID」が最も小さいスイッチがルートブリッジに選出されます。",
  },
  {
    id: "ccna-sw-3",
    category: "スイッチング・VLAN",
    question: "スイッチポートをトランクポート（802.1Q）に設定するコマンドの正しい組み合わせはどれか？",
    choices: [
      "switchport mode trunk",
      "switchport trunk enable",
      "switchport mode access-trunk",
      "vlan trunk on",
    ],
    correctIndex: 0,
    explanation:
      "インターフェース設定モードで `switchport mode trunk` を入力することによりトランクモードを有効化します。",
  },
  {
    id: "ccna-sw-4",
    category: "スイッチング・VLAN",
    question: "レイヤー2スイッチがMACアドレステーブルの学習を行うきっかけはどれか？",
    choices: [
      "受信したフレームの送信元MACアドレスを記録する",
      "受信したフレームの宛先MACアドレスを記録する",
      "送信したパケットのIPアドレスを記録する",
      "ARPリクエストを定期的にブロードキャストして記録する",
    ],
    correctIndex: 0,
    explanation:
      "スイッチはフレームを受信した際、そのフレームの「送信元MACアドレス」と受信インターフェースを紐付けてMACアドレステーブルを学習します。",
  },

  // ── 5. セキュリティ (security) ──
  {
    id: "ccna-sec-1",
    category: "セキュリティ",
    question: "Cisco IOS の標準ACL（番号 1〜99）がフィルタリング条件として検査する要素はどれか？",
    choices: [
      "送信元IPアドレスのみ",
      "宛先IPアドレスのみ",
      "送信元IPおよび宛先ポート番号",
      "プロトコル番号とTCPフラグ",
    ],
    correctIndex: 0,
    explanation:
      "標準ACL（1〜99, 1300〜1999）は「送信元IPアドレス」のみを条件としてトラフィックをフィルタリングします。宛先やポートも見る場合は拡張ACL（100〜199等）を使用します。",
  },
  {
    id: "ccna-sec-2",
    category: "セキュリティ",
    question: "アクセスポートへの不正なデバイス接続を防ぐ「ポートセキュリティ」機能を有効化するコマンドはどれか？",
    choices: [
      "switchport port-security",
      "security port enable",
      "switchport access secure",
      "port-security on",
    ],
    correctIndex: 0,
    explanation:
      "インターフェース設定モードにおいて `switchport port-security` を実行することでポートセキュリティを有効にします。",
  },
  {
    id: "ccna-sec-3",
    category: "セキュリティ",
    question: "ルーターへのリモート管理接続において、Telnetと比較した際の SSH の最大のセキュリティ上の利点はどれか？",
    choices: [
      "通信内容や認証パスワードが暗号化される",
      "通信速度が圧倒的に高速である",
      "ルーターのCPU負荷をゼロにできる",
      "パスワード入力なしで自動接続できる",
    ],
    correctIndex: 0,
    explanation:
      "Telnetは平文で通信が行われますが、SSH（Secure Shell）は認証やデータ通信全体が暗号化されるため盗聴や改ざんを防止できます。",
  },

  // ── 6. WAN & クラウド (wan-cloud) ──
  {
    id: "ccna-wan-1",
    category: "WAN & クラウド",
    question: "VPN技術における IPsec が提供する主なセキュリティ機能の組み合わせとして正しいものはどれか？",
    choices: [
      "機密性（暗号化）、完全性（改ざん検知）、認証",
      "圧縮、高速化、自動IP割り当て",
      "ロードバランシング、NATトラバーサルのみ",
      "MACアドレス認証、VLANタギング",
    ],
    correctIndex: 0,
    explanation:
      "IPsec は ESP および AH プロトコル等により、暗号化（機密性）、改ざん検知（完全性）、およびピア認証を提供します。",
  },
  {
    id: "ccna-wan-2",
    category: "WAN & クラウド",
    question: "IaaS, PaaS, SaaS の説明として、ユーザーが OS 以上のインストール・設定管理を担当するクラウドサービスモデルはどれか？",
    choices: ["IaaS (Infrastructure as a Service)", "PaaS (Platform as a Service)", "SaaS (Software as a Service)", "FaaS (Function as a Service)"],
    correctIndex: 0,
    explanation:
      "IaaS は仮想サーバー（インフラ）が提供され、OSやミドルウェア、アプリケーション等の管理は利用者が行います。",
  },
  {
    id: "ccna-wan-3",
    category: "WAN & クラウド",
    question: "QoS（Quality of Service）において、パケットを分類・マーキングするためにIPヘッダーで使用されるフィールドはどれか？",
    choices: ["DSCP (Differentiated Services Code Point)", "TTL (Time to Live)", "FCS (Frame Check Sequence)", "Window Size"],
    correctIndex: 0,
    explanation:
      "QoS では IPv4/IPv6 ヘッダーの ToS/トラフィッククラスフィールド内にある DSCP（6ビット）を使用してパケットの優先度をマーキングします。",
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
