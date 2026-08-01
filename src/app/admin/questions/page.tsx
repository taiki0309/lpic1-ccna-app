"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface QuestionItem {
  id: string;
  category: string;
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
}

const LPIC1_CATEGORIES = [
  "システムアーキテクチャ",
  "パッケージ管理",
  "基本コマンド",
  "ファイルシステム",
  "シェルとスクリプト",
  "ユーザーとセキュリティ",
];

const CCNA_CATEGORIES = [
  "ネットワーク基礎",
  "スイッチング・VLAN",
  "IPルーティング",
  "IPサービス",
  "セキュリティ基礎",
  "自動化とプログラマビリティ",
];

export default function AdminQuestionsPage() {
  const [cert, setCert] = useState<"lpic1" | "ccna">("lpic1");
  const [category, setCategory] = useState<string>("システムアーキテクチャ");
  const [text, setText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [explanation, setExplanation] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);

  // カテゴリ変更
  useEffect(() => {
    const defaultCat =
      cert === "lpic1" ? LPIC1_CATEGORIES[0] : CCNA_CATEGORIES[0];
    setCategory(defaultCat);
    fetchQuestionsList(cert);
  }, [cert]);

  const fetchQuestionsList = async (selectedCert: string) => {
    setIsLoadingList(true);
    try {
      const res = await fetch(`/api/questions?cert=${selectedCert}`);
      const data = await res.json();
      if (data.questions) {
        setQuestions(data.questions);
      }
    } catch {
      // エラー処理
    } finally {
      setIsLoadingList(false);
    }
  };

  // 選択肢変更
  const handleOptionChange = (idx: number, val: string) => {
    const updated = [...options];
    updated[idx] = val;
    setOptions(updated);
  };

  // 1件作成送信
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cert,
          category,
          text,
          options,
          correctIndex,
          explanation,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "作成に失敗しました");
      }

      setStatusMessage({
        type: "success",
        text: `問題（ID: ${data.questionId}）を正常に登録しました！`,
      });
      setText("");
      setOptions(["", "", "", ""]);
      setExplanation("");
      fetchQuestionsList(cert);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "不明なエラー";
      setStatusMessage({ type: "error", text: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 60問一括シード送信
  const handleSeedAll = async () => {
    if (
      !confirm(
        "LPIC-1 および CCNA の全12カテゴリ・60問を AWS DynamoDB に一括登録しますか？"
      )
    ) {
      return;
    }

    setIsSeeding(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/questions/seed", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "シード登録に失敗しました");
      }

      setStatusMessage({
        type: "success",
        text: data.message || "60問の初期問題を一括登録しました！",
      });
      fetchQuestionsList(cert);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "シードエラー";
      setStatusMessage({ type: "error", text: msg });
    } finally {
      setIsSeeding(false);
    }
  };

  const categories = cert === "lpic1" ? LPIC1_CATEGORIES : CCNA_CATEGORIES;

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 pb-16">
      {/* ── Header ── */}
      <header className="border-b border-slate-800 bg-slate-950/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-slate-400 hover:text-white text-sm transition"
            >
              ← ダッシュボードへ戻る
            </Link>
            <span className="text-slate-600">/</span>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-amber-400">🛠️</span> 問題データベース管理
            </h1>
          </div>
          <button
            onClick={handleSeedAll}
            disabled={isSeeding}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 font-bold text-white text-sm shadow-lg shadow-orange-950/40 transition disabled:opacity-50"
          >
            {isSeeding
              ? "一括投入中..."
              : "⚡ 全12カテゴリ・60問を DynamoDB へ一括登録する"}
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ── 左カラム: 問題作成フォーム ── */}
        <div className="lg:col-span-5">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span>✍️</span> 新規問題の追加
            </h2>

            {statusMessage && (
              <div
                className={`p-3 rounded-xl mb-4 text-sm font-medium ${
                  statusMessage.type === "success"
                    ? "bg-emerald-950/80 border border-emerald-500/50 text-emerald-300"
                    : "bg-red-950/80 border border-red-500/50 text-red-300"
                }`}
              >
                {statusMessage.text}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  対象資格
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCert("lpic1")}
                    className={`py-2 rounded-lg text-sm font-bold border transition ${
                      cert === "lpic1"
                        ? "bg-amber-500/20 border-amber-500 text-amber-300"
                        : "bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    LPIC-1
                  </button>
                  <button
                    type="button"
                    onClick={() => setCert("ccna")}
                    className={`py-2 rounded-lg text-sm font-bold border transition ${
                      cert === "ccna"
                        ? "bg-cyan-500/20 border-cyan-500 text-cyan-300"
                        : "bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    CCNA
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  カテゴリ（ジャンル）
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  問題文 <span className="text-red-400">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="例: Linuxでファイルのパーミッションを変更するコマンドはどれか？"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  選択肢 (4つ) と 正解チェック
                </label>
                <div className="space-y-2">
                  {options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctIndex"
                        checked={correctIndex === i}
                        onChange={() => setCorrectIndex(i)}
                        className="accent-amber-500 w-4 h-4 cursor-pointer"
                        title="正解の選択肢にチェック"
                      />
                      <input
                        type="text"
                        required
                        value={opt}
                        onChange={(e) => handleOptionChange(i, e.target.value)}
                        placeholder={`選択肢 ${i + 1}`}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  解説文章
                </label>
                <textarea
                  rows={3}
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="例: chmodコマンドを使用します。-Rで再帰的変更が可能です。"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 font-bold text-slate-950 text-sm transition shadow-lg shadow-amber-950/30 disabled:opacity-50"
              >
                {isSubmitting ? "登録中..." : "問題を DynamoDB に登録する"}
              </button>
            </form>
          </div>
        </div>

        {/* ── 右カラム: 登録済み問題一覧 ── */}
        <div className="lg:col-span-7">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>📚</span> {cert.toUpperCase()} 登録済み問題一覧
              </h2>
              <span className="text-xs bg-slate-900 border border-slate-700 px-3 py-1 rounded-full text-slate-300 font-medium">
                合計: {questions.length} 問
              </span>
            </div>

            {isLoadingList ? (
              <div className="py-12 text-center text-slate-400 text-sm">
                問題を読込中...
              </div>
            ) : questions.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-slate-700 rounded-xl">
                <p className="text-slate-400 text-sm mb-3">
                  DynamoDB テーブルに問題データが見つかりません。
                </p>
                <button
                  onClick={handleSeedAll}
                  disabled={isSeeding}
                  className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-300 hover:bg-amber-500/30 text-sm font-bold transition"
                >
                  ⚡ 全12カテゴリ・60問を DynamoDB に初期投入する
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
                {questions.map((q) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/60 hover:border-slate-600 transition"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {q.category}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        ID: {q.id}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-white mb-2">
                      {q.question}
                    </p>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {q.choices.map((choice, idx) => (
                        <div
                          key={idx}
                          className={`text-xs px-2.5 py-1 rounded-md border ${
                            idx === q.correctIndex
                              ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-300 font-bold"
                              : "bg-slate-800 border-slate-700/50 text-slate-400"
                          }`}
                        >
                          {idx === q.correctIndex ? "✅ " : ""}
                          {choice}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
