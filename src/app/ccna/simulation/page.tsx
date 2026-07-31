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
];

// ─── ドラッグ&ドロップ問題 ────────────────────────────────
const DND_QUESTION = {
  id: "dnd-1",
  category: "ドラッグ&ドロップ",
  title: "OSI レイヤーとプロトコルのマッチング",
  description: "各プロトコル/技術を対応する OSI レイヤーにドラッグしてください。",
  items: [
    { id: "ip", label: "IP", correctLayer: 3 },
    { id: "tcp", label: "TCP", correctLayer: 4 },
    { id: "ethernet", label: "Ethernet", correctLayer: 2 },
    { id: "http", label: "HTTP", correctLayer: 7 },
    { id: "physical", label: "物理ケーブル", correctLayer: 1 },
  ],
  layers: [1, 2, 3, 4, 7],
  layerNames: { 1: "物理層 (L1)", 2: "データリンク層 (L2)", 3: "ネットワーク層 (L3)", 4: "トランスポート層 (L4)", 7: "アプリケーション層 (L7)" },
};

type SimTab = "cli" | "dnd" | "topology";

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
        setCliStepIdx((s) => s + 1);
      }
    } else {
      setCliError(true);
      setCliHistory([...cliHistory, { prompt: currentPrompt, command: trimmed, response: "% Invalid input detected" }]);
      setCliInput("");
    }
  };

  const handleCliKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleCliSubmit();
  };

  const nextCliQuestion = () => {
    if (cliQuestionIdx + 1 < CLI_QUESTIONS.length) {
      setCliQuestionIdx((i) => i + 1);
      setCliInput("");
      setCliHistory([]);
      setCliStepIdx(0);
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

  const dndScore = DND_QUESTION.items.filter(
    (item) => assignments[item.id] === item.correctLayer
  ).length;

  const handleDndCheck = () => {
    setDndChecked(true);
    const isAllCorrect = dndScore === DND_QUESTION.items.length;
    submitAnswer({
      cert: "ccna",
      questionId: DND_QUESTION.id,
      category: DND_QUESTION.category || "ネットワーク基礎",
      selectedIndex: 0,
      isCorrect: isAllCorrect,
    });
  };

  const unassigned = DND_QUESTION.items.filter((i) => assignments[i.id] === null);

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

      <div className="mx-auto max-w-4xl">
        {/* パンくず */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <Link href="/" className="hover:text-[var(--foreground)] transition-colors">ホーム</Link>
          <span>/</span>
          <Link href="/ccna" className="hover:text-[var(--foreground)] transition-colors">CCNA</Link>
          <span>/</span>
          <span className="text-[var(--foreground)]">シミュレーション</span>
        </nav>

        {/* ヘッダー */}
        <header className="mb-8">
          <h1 className="mb-2 text-2xl font-extrabold text-[var(--foreground)]">
            🎮 シミュレーション問題
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            実際の試験形式に近いインタラクティブな問題で実践力を鍛えます。
          </p>
        </header>

        {/* タブ切替 */}
        <div className="mb-6 flex gap-2 overflow-x-auto">
          {(
            [
              { key: "cli", label: "🖥️ CLI シミュレーター", color: "#bc8cff" },
              { key: "dnd", label: "🔀 ドラッグ&ドロップ", color: "#58a6ff" },
              { key: "topology", label: "🗺️ ネットワーク図（近日公開）", color: "#3fb950" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="shrink-0 rounded-xl border px-4 py-2 text-sm font-semibold transition-all duration-200"
              style={{
                borderColor: activeTab === tab.key ? tab.color : "var(--border)",
                background: activeTab === tab.key ? `${tab.color}20` : "var(--surface)",
                color: activeTab === tab.key ? tab.color : "var(--text-muted)",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── CLI シミュレーター ────────────────────────────── */}
        {activeTab === "cli" && (
          <div>
            <div className="mb-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-full border border-[#bc8cff] bg-[rgba(188,140,255,0.12)] px-2 py-0.5 text-xs font-semibold text-[#bc8cff]">
                  {cliQ.category}
                </span>
                <span className="text-xs text-[var(--text-muted)]">
                  問題 {cliQuestionIdx + 1} / {CLI_QUESTIONS.length}
                </span>
              </div>
              <h2 className="mb-1 font-bold text-[var(--foreground)]">{cliQ.title}</h2>
              <p className="text-sm text-[var(--text-muted)]">{cliQ.description}</p>
            </div>

            {/* ターミナル */}
            <div className="overflow-hidden rounded-xl border border-[var(--border)]" style={{ background: "#0d1117" }}>
              {/* ヘッダー */}
              <div className="flex items-center gap-1.5 border-b border-[var(--border)] px-4 py-2">
                <span className="h-3 w-3 rounded-full bg-[#f85149]" />
                <span className="h-3 w-3 rounded-full bg-[#e3b341]" />
                <span className="h-3 w-3 rounded-full bg-[#3fb950]" />
                <span className="ml-2 font-mono text-xs text-[var(--text-muted)]">Cisco IOS CLI</span>
              </div>

              {/* 履歴 */}
              <div className="min-h-[180px] px-4 py-3 font-mono text-sm">
                {cliHistory.map((entry, i) => (
                  <div key={i}>
                    <div className="flex gap-2">
                      <span className="text-[#3fb950]">{entry.prompt}</span>
                      <span className="text-[var(--foreground)]">{entry.command}</span>
                    </div>
                    <div
                      className="text-sm"
                      style={{
                        color: entry.response.startsWith("%") ? "#f85149" : "var(--text-muted)",
                      }}
                    >
                      {entry.response}
                    </div>
                  </div>
                ))}

                {!cliCompleted ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[#3fb950]">
                      {cliStepIdx === 0 ? cliQ.initialPrompt : cliQ.steps[cliStepIdx - 1].response}
                    </span>
                    <input
                      id="cli-input"
                      type="text"
                      value={cliInput}
                      onChange={(e) => { setCliInput(e.target.value); setCliError(false); }}
                      onKeyDown={handleCliKeyDown}
                      className="flex-1 bg-transparent text-[var(--foreground)] outline-none"
                      autoComplete="off"
                      spellCheck={false}
                      autoFocus
                    />
                  </div>
                ) : (
                  <div className="text-[#3fb950]">
                    ✓ コンフィグレーション完了！
                  </div>
                )}
              </div>

              {/* ヒント・エラー */}
              {(cliError || showCliHint) && (
                <div className="border-t border-[var(--border)] px-4 py-2 text-xs">
                  {cliError && <p className="text-[#f85149]">✗ コマンドが認識されませんでした</p>}
                  {showCliHint && (
                    <p className="text-[#e3b341]">💡 {currentStep.hint}</p>
                  )}
                </div>
              )}
            </div>

            {/* ボタン群 */}
            <div className="mt-4 flex gap-3">
              {!cliCompleted ? (
                <>
                  <button
                    onClick={handleCliSubmit}
                    disabled={!cliInput.trim()}
                    className="flex-1 rounded-xl py-3 font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40"
                    style={{ background: "linear-gradient(135deg, #6e40c9, #bc8cff)" }}
                  >
                    実行 (Enter)
                  </button>
                  <button
                    onClick={() => setShowCliHint(true)}
                    className="rounded-xl border border-[#e3b341] bg-[rgba(227,179,65,0.08)] px-4 py-3 text-sm font-semibold text-[#e3b341] transition-all hover:bg-[rgba(227,179,65,0.15)]"
                  >
                    💡 ヒント
                  </button>
                </>
              ) : (
                <div className="flex w-full flex-col gap-3">
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm text-[var(--foreground)]">
                    <p className="mb-1 font-semibold text-[var(--accent-primary)]">📘 解説</p>
                    {cliQ.explanation}
                  </div>
                  <button
                    onClick={nextCliQuestion}
                    disabled={cliQuestionIdx >= CLI_QUESTIONS.length - 1}
                    className="w-full rounded-xl py-3 font-semibold text-white transition-all hover:scale-[1.02] hover:opacity-90 disabled:opacity-40"
                    style={{ background: "linear-gradient(135deg, #6e40c9, #bc8cff)" }}
                  >
                    {cliQuestionIdx >= CLI_QUESTIONS.length - 1 ? "全問完了！🎉" : "次の問題へ →"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── ドラッグ&ドロップ ──────────────────────────────── */}
        {activeTab === "dnd" && (
          <div>
            <div className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <div className="mb-2">
                <span className="rounded-full border border-[#58a6ff] bg-[rgba(88,166,255,0.12)] px-2 py-0.5 text-xs font-semibold text-[#58a6ff]">
                  {DND_QUESTION.category}
                </span>
              </div>
              <h2 className="mb-1 font-bold text-[var(--foreground)]">{DND_QUESTION.title}</h2>
              <p className="text-sm text-[var(--text-muted)]">{DND_QUESTION.description}</p>
            </div>

            {/* 未割り当てアイテム */}
            <div className="mb-6">
              <p className="mb-2 text-sm text-[var(--text-muted)]">ドラッグするアイテム：</p>
              <div className="flex flex-wrap gap-2">
                {unassigned.map((item) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={() => setDragItem(item.id)}
                    className="cursor-grab rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition-all hover:border-[var(--accent-primary)] active:cursor-grabbing"
                  >
                    {item.label}
                  </div>
                ))}
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
                    className="flex min-h-[52px] items-center gap-3 rounded-xl border p-3 transition-all duration-200"
                    style={{
                      borderColor: hasWrong ? "#f85149" : isCorrect ? "#3fb950" : "var(--border)",
                      background: hasWrong
                        ? "rgba(248,81,73,0.06)"
                        : isCorrect
                        ? "rgba(63,185,80,0.06)"
                        : "var(--surface)",
                    }}
                  >
                    <span className="w-36 shrink-0 text-xs font-semibold text-[var(--text-muted)]">
                      {layerName}
                    </span>
                    <div className="flex flex-1 flex-wrap gap-2">
                      {assignedItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => removeAssignment(item.id)}
                          className="rounded-lg border border-[#58a6ff] bg-[rgba(88,166,255,0.12)] px-3 py-1 text-xs font-semibold text-[#58a6ff] transition-all hover:bg-[rgba(88,166,255,0.20)]"
                          title="クリックで取り除く"
                        >
                          {item.label} ×
                        </button>
                      ))}
                      {assignedItems.length === 0 && (
                        <span className="text-xs text-[var(--border)]">ここにドロップ</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 採点ボタン */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleDndCheck}
                disabled={unassigned.length > 0}
                className="flex-1 rounded-xl py-3 font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40"
                style={{ background: "linear-gradient(135deg, #1d6fca, #58a6ff)" }}
              >
                {unassigned.length > 0 ? `残り ${unassigned.length} 項目` : "採点する"}
              </button>
              <button
                onClick={() => { setAssignments(Object.fromEntries(DND_QUESTION.items.map((i) => [i.id, null]))); setDndChecked(false); }}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm font-semibold text-[var(--text-muted)] transition-all hover:text-[var(--foreground)]"
              >
                リセット
              </button>
            </div>

            {dndChecked && (
              <div
                className="mt-4 rounded-xl border p-4 text-center"
                style={{
                  borderColor: dndScore === DND_QUESTION.items.length ? "#3fb950" : "#e3b341",
                  background:
                    dndScore === DND_QUESTION.items.length
                      ? "rgba(63,185,80,0.08)"
                      : "rgba(227,179,65,0.08)",
                }}
              >
                <p
                  className="text-lg font-extrabold"
                  style={{ color: dndScore === DND_QUESTION.items.length ? "#3fb950" : "#e3b341" }}
                >
                  {dndScore === DND_QUESTION.items.length ? "🎉 全問正解！" : `${dndScore} / ${DND_QUESTION.items.length} 正解`}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── トポロジー（準備中） ─────────────────────────── */}
        {activeTab === "topology" && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-16 text-center">
            <div className="text-5xl">🗺️</div>
            <h2 className="text-xl font-bold text-[var(--foreground)]">ネットワーク図問題</h2>
            <p className="max-w-sm text-sm text-[var(--text-muted)]">
              SVG インタラクティブなネットワークトポロジー問題を準備中です。
              近日公開予定 — お楽しみに！
            </p>
            <span className="rounded-full border border-[var(--border)] px-4 py-1 text-xs text-[var(--text-muted)]">
              Coming Soon
            </span>
          </div>
        )}
      </div>
    </main>
  );
}
