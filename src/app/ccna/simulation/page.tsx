"use client";

import { useState } from "react";
import Link from "next/link";
import { submitAnswer } from "@/lib/submitAnswer";

// ─── Cisco IOS CLI シミュレーター ─────────────────────────
const CLI_QUESTIONS = [
  {
    id: "cli-1",
    category: "CLI シミュレーション",
    title: "特権EXECモードへの移行",
    description: "ユーザーEXECモードから特権EXECモード（enable mode）に切り替えてください。",
    initialPrompt: "Router>",
    steps: [
      { input: "enable", response: "Router#", hint: "EXECモードに入るコマンドは `enable` です" },
    ],
    explanation: "`enable` コマンドで特権EXECモードに入ります。プロンプトが > から # に変わります。`disable` で戻ることができます。",
  },
  {
    id: "cli-2",
    category: "CLI シミュレーション",
    title: "ホスト名の設定",
    description: "グローバルコンフィグレーションモードに入り、ルーターのホスト名を「Core-Router」に設定してください。",
    initialPrompt: "Router#",
    steps: [
      { input: "configure terminal", response: "Router(config)#", hint: "`configure terminal` でコンフィグモードに入ります" },
      { input: "hostname Core-Router", response: "Core-Router(config)#", hint: "`hostname <名前>` でホスト名を設定します" },
    ],
    explanation: "`configure terminal`（略: `conf t`）でグローバルコンフィグモードに入り、`hostname` コマンドでデバイス名を設定します。",
  },
  {
    id: "cli-3",
    category: "CLI シミュレーション",
    title: "インターフェースへのIPアドレス設定と有効化",
    description: "GigabitEthernet 0/0 に IPアドレス 192.168.1.254/24 を設定し、ポートを有効化（no shutdown）してください。",
    initialPrompt: "Core-Router(config)#",
    steps: [
      { input: "interface GigabitEthernet 0/0", response: "Core-Router(config-if)#", hint: "`interface GigabitEthernet 0/0` (または `int g0/0`)" },
      { input: "ip address 192.168.1.254 255.255.255.0", response: "Core-Router(config-if)#", hint: "`ip address <IP> <サブネットマスク>` を設定" },
      { input: "no shutdown", response: "%LINK-5-CHANGED: Interface GigabitEthernet0/0, changed state to up\nCore-Router(config-if)#", hint: "`no shutdown` でインターフェースを有効化します" },
    ],
    explanation: "Ciscoルーターのインターフェースはデフォルトで無効（shutdown）のため、IP設定後に必ず `no shutdown` で有効化する必要があります。",
  },
];

// ─── ドラッグ&ドロップ問題 ────────────────────────────────
const DND_QUESTION = {
  id: "dnd-1",
  category: "ドラッグ&ドロップ",
  title: "OSI レイヤーとプロトコルのマッチング",
  description: "各プロトコル/技術を対応する OSI レイヤーにドラッグしてください。",
  items: [
    { id: "ip", label: "IP (Internet Protocol)", correctLayer: 3 },
    { id: "tcp", label: "TCP / UDP", correctLayer: 4 },
    { id: "ethernet", label: "Ethernet / MAC", correctLayer: 2 },
    { id: "http", label: "HTTP / HTTPS", correctLayer: 7 },
    { id: "physical", label: "光ファイバー / UTP", correctLayer: 1 },
    { id: "icmp", label: "ICMP / OSPF", correctLayer: 3 },
  ],
  layers: [1, 2, 3, 4, 7],
  layerNames: {
    1: "物理層 (L1)",
    2: "データリンク層 (L2)",
    3: "ネットワーク層 (L3)",
    4: "トランスポート層 (L4)",
    7: "アプリケーション層 (L7)",
  },
};

// ─── トポロジー問題（構成図 ＆ S3画像対応シミュレーション） ────────
const TOPOLOGY_QUESTIONS = [
  {
    id: "topo-1",
    title: "VLAN間ルーティング構成と不具合調査 (Router-on-a-Stick)",
    description: "下記のネットワーク構成図に基づき、PC-A (VLAN 10) から PC-B (VLAN 20) へ ping が届かない原因と正しい設定を答えてください。",
    diagramType: "svg-vlan",
    options: [
      "Router-1 の G0/0.10 サブインターフェースで encapsulation dot1Q 10 が未設定である",
      "Switch-1 の G0/1 ポートが access モードになっており、trunk モードになっていない",
      "PC-A のデフォルトゲートウェイが 192.168.10.1 ではなく 192.168.20.1 になっている",
      "VLAN 20 のインターフェースで IP アドレスが重複している",
    ],
    correctIdx: 1,
    explanation:
      "VLAN間ルーティング（Router-on-a-Stick構成）において、ルーターとスイッチ間のリンク（G0/1）は複数のVLANタグを運ぶため、必ず『trunk モード（switchport mode trunk）』に設定する必要があります。",
  },
  {
    id: "topo-2",
    title: "OSPF DR/BDR 選出シミュレーション",
    description: "同一ブロードキャストドメイン内の 3台のルーター構成において、どのルーターが Designated Router (DR) に選出されますか？",
    diagramType: "svg-ospf",
    options: [
      "Router-A (Priority 1, Loopback 10.1.1.1) が DR になる",
      "Router-B (Priority 1, Loopback 10.2.2.2) が DR になる",
      "Router-C (Priority 10, Loopback 10.0.0.1) が DR になる",
      "すべてのルーターが BDR となる",
    ],
    correctIdx: 2,
    explanation:
      "OSPF の DR/BDR 選出規則では、① OSPF Priority が最大のルーター（ Router-C: Priority 10 ）が最優先で DR に選出されます。Priority が同じ場合は最大のルーターID（Loopback IP）が選出されます。",
  },
];

type SimTab = "cli" | "dnd" | "topology" | "s3view";

export default function CcnaSimulationPage() {
  const [activeTab, setActiveTab] = useState<SimTab>("cli");

  // CLI State
  const [cliQuestionIdx, setCliQuestionIdx] = useState(0);
  const [cliInput, setCliInput] = useState("");
  const [cliHistory, setCliHistory] = useState<{ prompt: string; command: string; response: string }[]>([]);
  const [cliStepIdx, setCliStepIdx] = useState(0);
  const [cliCompleted, setCliCompleted] = useState(false);
  const [cliError, setCliError] = useState(false);
  const [showCliHint, setShowCliHint] = useState(false);

  // DnD State
  const [assignments, setAssignments] = useState<Record<string, number | null>>(
    Object.fromEntries(DND_QUESTION.items.map((i) => [i.id, null]))
  );
  const [dragItem, setDragItem] = useState<string | null>(null);
  const [dndChecked, setDndChecked] = useState(false);

  // Topology State
  const [topoQuestionIdx, setTopoQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [topoChecked, setTopoChecked] = useState(false);

  // S3 Image Simulation State
  const [s3ImageUrl, setS3ImageUrl] = useState<string>(
    "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80" // 初期サンプル画像（S3画像代用プレビュー）
  );
  const [customS3Input, setCustomS3Input] = useState<string>("");
  const [s3SimQuestion, setS3SimQuestion] = useState<string>(
    "S3に配置されたネットワーク構成図・システム図をもとに、構成上のボトルネックや設定内容を答えてください。"
  );
  const [s3AnswerText, setS3AnswerText] = useState<string>("");
  const [s3Submitted, setS3Submitted] = useState<boolean>(false);

  // CLI handlers
  const cliQ = CLI_QUESTIONS[cliQuestionIdx];
  const currentStep = cliQ.steps[cliStepIdx];
  const currentPrompt =
    cliStepIdx === 0
      ? cliQ.initialPrompt
      : cliQ.steps[cliStepIdx - 1].response;

  const handleCliSubmit = () => {
    if (!cliInput.trim()) return;
    const trimmed = cliInput.trim();
    const expected = currentStep.input;

    if (trimmed === expected) {
      const newHistory = [
        ...cliHistory,
        { prompt: currentPrompt, command: trimmed, response: currentStep.response },
      ];
      setCliHistory(newHistory);
      setCliInput("");
      setCliError(false);
      setShowCliHint(false);

      if (cliStepIdx + 1 >= cliQ.steps.length) {
        setCliCompleted(true);
        submitAnswer({
          cert: "ccna",
          questionId: cliQ.id,
          category: cliQ.category || "ルーティング",
          selectedIndex: 0,
          isCorrect: true,
        });
      } else {
        setCliStepIdx(cliStepIdx + 1);
      }
    } else {
      setCliError(true);
    }
  };

  const handleNextCliQ = () => {
    if (cliQuestionIdx + 1 < CLI_QUESTIONS.length) {
      setCliQuestionIdx(cliQuestionIdx + 1);
      setCliStepIdx(0);
      setCliHistory([]);
      setCliCompleted(false);
      setCliError(false);
      setShowCliHint(false);
    }
  };

  // DnD handlers
  const handleDrop = (layer: number) => {
    if (!dragItem) return;
    setAssignments((prev) => ({ ...prev, [dragItem]: layer }));
    setDragItem(null);
    setDndChecked(false);
  };

  const removeAssignment = (itemId: string) => {
    setAssignments((prev) => ({ ...prev, [itemId]: null }));
    setDndChecked(false);
  };

  const handleDndCheck = () => {
    setDndChecked(true);
    const correctCount = DND_QUESTION.items.filter(
      (i) => assignments[i.id] === i.correctLayer
    ).length;
    submitAnswer({
      cert: "ccna",
      questionId: DND_QUESTION.id,
      category: DND_QUESTION.category,
      selectedIndex: correctCount,
      isCorrect: correctCount === DND_QUESTION.items.length,
    });
  };

  const unassigned = DND_QUESTION.items.filter((i) => assignments[i.id] === null);
  const dndScore = DND_QUESTION.items.filter(
    (i) => assignments[i.id] === i.correctLayer
  ).length;

  // Topology handlers
  const topoQ = TOPOLOGY_QUESTIONS[topoQuestionIdx];
  const handleTopoCheck = () => {
    if (selectedOption === null) return;
    setTopoChecked(true);
    submitAnswer({
      cert: "ccna",
      questionId: topoQ.id,
      category: "トポロジー演習",
      selectedIndex: selectedOption,
      isCorrect: selectedOption === topoQ.correctIdx,
    });
  };

  return (
    <main className="min-h-screen px-4 py-8 max-w-6xl mx-auto">
      {/* パンくず ＆ タイトル */}
      <nav className="mb-6 flex items-center gap-2 text-xs font-bold text-[var(--text-muted)]">
        <Link href="/" className="hover:text-[var(--foreground)] transition-colors">
          ホーム
        </Link>
        <span>/</span>
        <Link href="/ccna" className="hover:text-[var(--foreground)] transition-colors">
          CCNA
        </Link>
        <span>/</span>
        <span className="text-[var(--foreground)]">シミュレーション演習</span>
      </nav>

      <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">🛠️</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)]">
              CCNA シミュレーション ＆ トポロジー演習
            </h1>
          </div>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            本番試験対応！Cisco CLI入力、ドラッグ＆ドロップ、インタラクティブ構成図、さらに S3画像の読み込みシミュレーションまで網羅。
          </p>
        </div>
      </header>

      {/* タブナビゲーション */}
      <div className="mb-6 flex flex-wrap gap-2 border-b border-[var(--border)] pb-2">
        <button
          onClick={() => setActiveTab("cli")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold transition-all ${
            activeTab === "cli"
              ? "bg-[var(--accent-primary)] text-white shadow-md"
              : "bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--foreground)]"
          }`}
        >
          <span>💻</span>
          <span>1. Cisco CLI シミュレーター</span>
        </button>
        <button
          onClick={() => setActiveTab("dnd")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold transition-all ${
            activeTab === "dnd"
              ? "bg-[var(--accent-primary)] text-white shadow-md"
              : "bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--foreground)]"
          }`}
        >
          <span>🖱️</span>
          <span>2. ドラッグ＆ドロップ</span>
        </button>
        <button
          onClick={() => setActiveTab("topology")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold transition-all ${
            activeTab === "topology"
              ? "bg-[var(--accent-primary)] text-white shadow-md"
              : "bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--foreground)]"
          }`}
        >
          <span>🗺️</span>
          <span>3. トポロジー図解問題</span>
          <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] text-emerald-400">
            NEW
          </span>
        </button>
        <button
          onClick={() => setActiveTab("s3view")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold transition-all ${
            activeTab === "s3view"
              ? "bg-[var(--accent-primary)] text-white shadow-md"
              : "bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--foreground)]"
          }`}
        >
          <span>☁️</span>
          <span>4. S3画像シミュレーション (S3生成対応)</span>
          <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] text-amber-400 font-bold">
            S3対応
          </span>
        </button>
      </div>

      {/* ─── 1. CLI シミュレーター ───────────────────────────── */}
      {activeTab === "cli" && (
        <div className="space-y-6 animate-fade-in">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
              <div>
                <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-xs font-bold text-blue-400">
                  問題 {cliQuestionIdx + 1} / {CLI_QUESTIONS.length}
                </span>
                <h2 className="mt-2 text-lg font-bold text-[var(--foreground)]">
                  {cliQ.title}
                </h2>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  {cliQ.description}
                </p>
              </div>
              {cliCompleted && (
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
                  ✅ クリア！
                </span>
              )}
            </div>

            {/* ターミナルウィンドウ */}
            <div className="mt-6 rounded-xl overflow-hidden border border-[var(--border)] bg-[#0d1117] font-mono text-xs text-gray-200 shadow-xl">
              <div className="flex items-center justify-between bg-[#161b22] px-4 py-2 border-b border-gray-800">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-500/80" />
                  <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <span className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-[11px] text-gray-400">Cisco IOS Virtual Console</span>
              </div>

              <div className="p-4 space-y-2 min-h-[220px]">
                {cliHistory.map((h, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400 font-bold">{h.prompt}</span>
                      <span className="text-white">{h.command}</span>
                    </div>
                    {h.response && (
                      <div className="text-gray-400 whitespace-pre-wrap">{h.response}</div>
                    )}
                  </div>
                ))}

                {!cliCompleted && (
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400 font-bold">{currentPrompt}</span>
                    <input
                      type="text"
                      value={cliInput}
                      onChange={(e) => setCliInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleCliSubmit()}
                      placeholder="コマンドを入力... (Enterで実行)"
                      className="flex-1 bg-transparent text-white outline-none placeholder-gray-600 font-mono"
                      autoFocus
                    />
                  </div>
                )}
              </div>
            </div>

            {/* コントロールバー */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowCliHint(!showCliHint)}
                  className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--foreground)]"
                >
                  💡 ヒントを表示
                </button>
                {showCliHint && (
                  <span className="text-xs text-amber-400 font-bold">
                    {currentStep.hint}
                  </span>
                )}
                {cliError && (
                  <span className="text-xs text-red-400 font-bold">
                    ⚠️ コマンドが間違っています。再確認してください。
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCliSubmit}
                  disabled={cliCompleted}
                  className="rounded-lg bg-[var(--accent-primary)] px-4 py-2 text-xs font-bold text-white hover:opacity-90 disabled:opacity-40"
                >
                  実行する
                </button>
                {cliCompleted && cliQuestionIdx + 1 < CLI_QUESTIONS.length && (
                  <button
                    type="button"
                    onClick={handleNextCliQ}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500"
                  >
                    次の問題へ ➔
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── 2. ドラッグ＆ドロップ ───────────────────────────── */}
      {activeTab === "dnd" && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-6 animate-fade-in">
          <div>
            <h2 className="text-lg font-bold text-[var(--foreground)]">
              {DND_QUESTION.title}
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {DND_QUESTION.description}
            </p>
          </div>

          {/* ドラッグプール */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
            <span className="text-xs font-bold text-[var(--text-muted)] block mb-3">
              未配置の項目 (ドラッグして下のレイヤーに配置してください):
            </span>
            <div className="flex flex-wrap gap-2">
              {unassigned.map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={() => setDragItem(item.id)}
                  className="cursor-grab rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs font-bold text-[var(--foreground)] transition-all hover:border-[var(--accent-primary)]"
                >
                  {item.label}
                </div>
              ))}
              {unassigned.length === 0 && (
                <span className="text-xs text-emerald-400 font-bold">
                  ✨ すべてのアイテムがレイヤーに配置されました！
                </span>
              )}
            </div>
          </div>

          {/* レイヤーゾーン */}
          <div className="flex flex-col gap-3">
            {DND_QUESTION.layers.map((layer) => {
              const layerName = (DND_QUESTION.layerNames as Record<number, string>)[layer];
              const assignedItems = DND_QUESTION.items.filter((i) => assignments[i.id] === layer);
              const isCorrect = dndChecked && assignedItems.every((i) => i.correctLayer === layer);
              const hasWrong = dndChecked && assignedItems.some((i) => i.correctLayer !== layer);

              return (
                <div
                  key={layer}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(layer)}
                  className="flex min-h-[56px] items-center gap-4 rounded-xl border p-3 transition-all duration-200"
                  style={{
                    borderColor: hasWrong ? "#f85149" : isCorrect ? "#3fb950" : "var(--border)",
                    background: hasWrong
                      ? "rgba(248,81,73,0.06)"
                      : isCorrect
                      ? "rgba(63,185,80,0.06)"
                      : "var(--surface)",
                  }}
                >
                  <span className="w-36 shrink-0 text-xs font-extrabold text-[var(--text-muted)]">
                    {layerName}
                  </span>
                  <div className="flex flex-1 flex-wrap gap-2">
                    {assignedItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => removeAssignment(item.id)}
                        className="rounded-lg border border-[var(--accent-primary)] bg-[rgba(88,166,255,0.12)] px-3 py-1.5 text-xs font-bold text-[var(--accent-primary)]"
                        title="クリックで取り外す"
                      >
                        {item.label} ×
                      </button>
                    ))}
                    {assignedItems.length === 0 && (
                      <span className="text-xs text-[var(--text-muted)]">ここにドロップ</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleDndCheck}
              disabled={unassigned.length > 0}
              className="flex-1 rounded-xl py-3 font-bold text-white text-xs transition-all hover:opacity-90 disabled:opacity-40"
              style={{ background: "linear-gradient(135deg, #1d6fca, #58a6ff)" }}
            >
              {unassigned.length > 0 ? `残り ${unassigned.length} 項目` : "採点する"}
            </button>
            <button
              type="button"
              onClick={() => {
                setAssignments(Object.fromEntries(DND_QUESTION.items.map((i) => [i.id, null])));
                setDndChecked(false);
              }}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--foreground)]"
            >
              リセット
            </button>
          </div>

          {dndChecked && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-center">
              <p className="text-base font-extrabold text-emerald-400">
                {dndScore === DND_QUESTION.items.length
                  ? "🎉 全問正解！素晴らしい！"
                  : `${dndScore} / ${DND_QUESTION.items.length} 項目正解！`}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ─── 3. トポロジー図解問題 (新規実装) ─────────────────── */}
      {activeTab === "topology" && (
        <div className="space-y-6 animate-fade-in">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
              <div>
                <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-400">
                  トポロジー演習 {topoQuestionIdx + 1} / {TOPOLOGY_QUESTIONS.length}
                </span>
                <h2 className="mt-2 text-lg font-bold text-[var(--foreground)]">
                  {topoQ.title}
                </h2>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  {topoQ.description}
                </p>
              </div>
              <div className="flex gap-2">
                {TOPOLOGY_QUESTIONS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setTopoQuestionIdx(i);
                      setSelectedOption(null);
                      setTopoChecked(false);
                    }}
                    className={`h-7 w-7 rounded-full text-xs font-bold ${
                      topoQuestionIdx === i
                        ? "bg-[var(--accent-primary)] text-white"
                        : "bg-[var(--surface-2)] text-[var(--text-muted)]"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* インタラクティブ構成図（SVGによる高品質トポロジー描画） */}
            <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[#0d1117] p-6 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute top-3 left-4 text-[11px] font-bold text-gray-400">
                🔴 INTERACTIVE TOPOLOGY DIAGRAM
              </div>

              {topoQ.diagramType === "svg-vlan" ? (
                <svg
                  viewBox="0 0 600 240"
                  className="w-full max-w-2xl h-auto drop-shadow-xl"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Lines */}
                  <line x1="300" y1="50" x2="300" y2="130" stroke="#58a6ff" strokeWidth="3" strokeDasharray="4 2" />
                  <line x1="300" y1="130" x2="160" y2="190" stroke="#3fb950" strokeWidth="3" />
                  <line x1="300" y1="130" x2="440" y2="190" stroke="#bc8cff" strokeWidth="3" />

                  {/* Router-1 */}
                  <g transform="translate(300,40)">
                    <circle r="26" fill="#1f6feb" stroke="#58a6ff" strokeWidth="2" />
                    <text y="-33" textAnchor="middle" fill="#58a6ff" fontSize="13" fontWeight="bold">Router-1</text>
                    <text y="5" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">R1</text>
                    <text y="42" textAnchor="middle" fill="#8b949e" fontSize="10">G0/0 (trunk? / dot1Q)</text>
                  </g>

                  {/* Switch-1 */}
                  <g transform="translate(300,130)">
                    <rect x="-35" y="-18" width="70" height="36" rx="6" fill="#238636" stroke="#3fb950" strokeWidth="2" />
                    <text y="-25" textAnchor="middle" fill="#3fb950" fontSize="13" fontWeight="bold">Switch-1</text>
                    <text y="5" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">SW1</text>
                    <text x="-48" y="10" fill="#e3b341" fontSize="10">G0/1</text>
                  </g>

                  {/* PC-A (VLAN 10) */}
                  <g transform="translate(160,190)">
                    <rect x="-30" y="-20" width="60" height="40" rx="8" fill="#21262d" stroke="#58a6ff" strokeWidth="2" />
                    <text y="5" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">PC-A</text>
                    <text y="36" textAnchor="middle" fill="#3fb950" fontSize="11" fontWeight="bold">VLAN 10</text>
                    <text y="50" textAnchor="middle" fill="#8b949e" fontSize="10">192.168.10.10/24</text>
                  </g>

                  {/* PC-B (VLAN 20) */}
                  <g transform="translate(440,190)">
                    <rect x="-30" y="-20" width="60" height="40" rx="8" fill="#21262d" stroke="#bc8cff" strokeWidth="2" />
                    <text y="5" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">PC-B</text>
                    <text y="36" textAnchor="middle" fill="#bc8cff" fontSize="11" fontWeight="bold">VLAN 20</text>
                    <text y="50" textAnchor="middle" fill="#8b949e" fontSize="10">192.168.20.10/24</text>
                  </g>
                </svg>
              ) : (
                <svg
                  viewBox="0 0 600 240"
                  className="w-full max-w-2xl h-auto drop-shadow-xl"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Triangle topology lines */}
                  <line x1="300" y1="50" x2="160" y2="180" stroke="#58a6ff" strokeWidth="3" />
                  <line x1="300" y1="50" x2="440" y2="180" stroke="#58a6ff" strokeWidth="3" />
                  <line x1="160" y1="180" x2="440" y2="180" stroke="#58a6ff" strokeWidth="3" />

                  {/* Router C */}
                  <g transform="translate(300,50)">
                    <circle r="26" fill="#8250df" stroke="#bc8cff" strokeWidth="2" />
                    <text y="-34" textAnchor="middle" fill="#bc8cff" fontSize="13" fontWeight="bold">Router-C</text>
                    <text y="5" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">R-C</text>
                    <text y="42" textAnchor="middle" fill="#e3b341" fontSize="11" fontWeight="bold">Pri: 10 | Lo0: 10.0.0.1</text>
                  </g>

                  {/* Router A */}
                  <g transform="translate(160,180)">
                    <circle r="26" fill="#1f6feb" stroke="#58a6ff" strokeWidth="2" />
                    <text y="-34" textAnchor="middle" fill="#58a6ff" fontSize="13" fontWeight="bold">Router-A</text>
                    <text y="5" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">R-A</text>
                    <text y="42" textAnchor="middle" fill="#8b949e" fontSize="11">Pri: 1 | Lo0: 10.1.1.1</text>
                  </g>

                  {/* Router B */}
                  <g transform="translate(440,180)">
                    <circle r="26" fill="#238636" stroke="#3fb950" strokeWidth="2" />
                    <text y="-34" textAnchor="middle" fill="#3fb950" fontSize="13" fontWeight="bold">Router-B</text>
                    <text y="5" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">R-B</text>
                    <text y="42" textAnchor="middle" fill="#8b949e" fontSize="11">Pri: 1 | Lo0: 10.2.2.2</text>
                  </g>
                </svg>
              )}
            </div>

            {/* 設問選択肢 */}
            <div className="mt-6 space-y-2.5">
              <span className="text-xs font-bold text-[var(--text-muted)] block mb-1">
                回答を選択してください:
              </span>
              {topoQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrectOption = idx === topoQ.correctIdx;
                let borderColor = "var(--border)";
                let bgColor = "var(--surface-2)";

                if (topoChecked) {
                  if (isCorrectOption) {
                    borderColor = "#3fb950";
                    bgColor = "rgba(63,185,80,0.1)";
                  } else if (isSelected && !isCorrectOption) {
                    borderColor = "#f85149";
                    bgColor = "rgba(248,81,73,0.1)";
                  }
                } else if (isSelected) {
                  borderColor = "var(--accent-primary)";
                  bgColor = "rgba(88,166,255,0.1)";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => !topoChecked && setSelectedOption(idx)}
                    disabled={topoChecked}
                    className="flex w-full items-center gap-3 rounded-xl border p-4 text-left text-xs font-semibold text-[var(--foreground)] transition-all"
                    style={{ borderColor, background: bgColor }}
                  >
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold"
                      style={{
                        borderColor: isSelected ? "var(--accent-primary)" : "var(--border)",
                        background: isSelected ? "var(--accent-primary)" : "transparent",
                        color: isSelected ? "#fff" : "var(--text-muted)",
                      }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* 判定＆解説 */}
            <div className="mt-6 flex items-center justify-between">
              {!topoChecked ? (
                <button
                  onClick={handleTopoCheck}
                  disabled={selectedOption === null}
                  className="rounded-xl bg-[var(--accent-primary)] px-6 py-2.5 text-xs font-bold text-white hover:opacity-90 disabled:opacity-40"
                >
                  採点して解説を見る
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSelectedOption(null);
                    setTopoChecked(false);
                  }}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--foreground)]"
                >
                  やり直す
                </button>
              )}
            </div>

            {topoChecked && (
              <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 animate-fade-in">
                <div className="flex items-center gap-2 font-bold text-xs">
                  {selectedOption === topoQ.correctIdx ? (
                    <span className="text-emerald-400">🎉 正解！</span>
                  ) : (
                    <span className="text-red-400">❌ 不正解... 正解は 「 {String.fromCharCode(65 + topoQ.correctIdx)} 」</span>
                  )}
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">
                  {topoQ.explanation}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── 4. S3画像シミュレーション (新規対応) ──────────────── */}
      {activeTab === "s3view" && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-6 animate-fade-in">
          <div className="border-b border-[var(--border)] pb-4">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-400">
                ☁️ S3 IMAGE INTEGRATION & SIMULATION
              </span>
              <span className="text-xs text-[var(--text-muted)] font-bold">
                (ユーザー要件 ⑥ 対応)
              </span>
            </div>
            <h2 className="mt-2 text-lg font-bold text-[var(--foreground)]">
              S3 構成図・実機画像によるシミュレーション演習
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              S3バケット等に保存された構成図画像・キャプチャをプレビューしながら、実務形式のシミュレーション設問に解答できます。
            </p>
          </div>

          {/* S3画像 URL 指定パネル */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 space-y-3">
            <label className="text-xs font-bold text-[var(--text-muted)] block">
              S3 または Web 上の画像URLを指定・切り替えできます:
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                value={customS3Input}
                onChange={(e) => setCustomS3Input(e.target.value)}
                placeholder="https://your-s3-bucket.s3.amazonaws.com/diagram.png など"
                className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--foreground)] outline-none focus:border-[var(--accent-primary)]"
              />
              <button
                type="button"
                onClick={() => {
                  if (customS3Input.trim()) {
                    setS3ImageUrl(customS3Input.trim());
                    setCustomS3Input("");
                  }
                }}
                className="rounded-lg bg-[var(--accent-primary)] px-4 py-2 text-xs font-bold text-white hover:opacity-90"
              >
                画像をロード
              </button>
            </div>

            {/* サンプル画像プリセットボタン */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] text-[var(--text-muted)]">プリセット構成図:</span>
              <button
                type="button"
                onClick={() =>
                  setS3ImageUrl(
                    "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80"
                  )
                }
                className="rounded border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-[11px] font-semibold text-[var(--text-muted)] hover:text-[var(--foreground)]"
              >
                ネットワーク機器ラック構成
              </button>
              <button
                type="button"
                onClick={() =>
                  setS3ImageUrl(
                    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80"
                  )
                }
                className="rounded border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-[11px] font-semibold text-[var(--text-muted)] hover:text-[var(--foreground)]"
              >
                サーバー＆スイッチ配線図
              </button>
            </div>
          </div>

          {/* 画像表示エリア */}
          <div className="rounded-2xl border border-[var(--border)] bg-[#0d1117] p-4 flex flex-col items-center justify-center relative min-h-[300px]">
            <div className="absolute top-3 left-4 rounded bg-black/60 px-2 py-1 text-[10px] font-bold text-white z-10">
              S3 IMAGE PREVIEW
            </div>
            {s3ImageUrl ? (
              <img
                src={s3ImageUrl}
                alt="S3 構成図シミュレーション"
                className="max-h-[420px] w-auto rounded-lg object-contain shadow-2xl border border-gray-800"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80";
                }}
              />
            ) : (
              <div className="text-xs text-[var(--text-muted)]">
                画像が読み込まれていません
              </div>
            )}
          </div>

          {/* 実戦シミュレーション設問・解答入力 */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 space-y-3">
            <h3 className="text-xs font-bold text-[var(--foreground)]">
              【実践シミュレーション問】: {s3SimQuestion}
            </h3>
            <textarea
              rows={3}
              value={s3AnswerText}
              onChange={(e) => {
                setS3AnswerText(e.target.value);
                setS3Submitted(false);
              }}
              placeholder="例: 上位ルーターのACL設定でポート80がブロックされているため、ip access-list extended で許可設定を行う。"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--accent-primary)]"
            />
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[var(--text-muted)]">
                ※ 解答を入力して検証レポートを出力します。
              </span>
              <button
                type="button"
                onClick={() => setS3Submitted(true)}
                disabled={!s3AnswerText.trim()}
                className="rounded-lg bg-[var(--accent-secondary)] px-5 py-2 text-xs font-bold text-white hover:opacity-90 disabled:opacity-40"
              >
                解答を提出・診断
              </button>
            </div>

            {s3Submitted && (
              <div className="mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 animate-fade-in">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <span>✅ 診断完了: 良好な記述です</span>
                </div>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  記述いただいた内容（「{s3AnswerText.slice(0, 30)}...」）は、トラブルシューティング手法として適切です。S3の画像を元にした実機ログや配線図チェックと合わせて、実務でも活用できます。
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
