"use client";

import { useState } from "react";
import Link from "next/link";

const guides = [
  {
    slug: "network-basics",
    icon: "🌐",
    title: "ネットワーク基礎を理解する",
    desc: "OSI参照モデル・TCP/IPモデル・プロトコルの役割を図解でわかりやすく解説します。",
    level: "初心者",
    levelColor: "#3fb950",
    steps: 10,
    duration: "30分",
    tags: ["OSI", "TCP/IP", "プロトコル"],
  },
  {
    slug: "ip-addressing",
    icon: "🔢",
    title: "IPアドレッシングとサブネッティング",
    desc: "クラス・プライベートアドレス・サブネットマスク・CIDR表記を計算例とともに解説。",
    level: "初級",
    levelColor: "#58a6ff",
    steps: 12,
    duration: "40分",
    tags: ["IPv4", "サブネット", "CIDR"],
  },
  {
    slug: "routing",
    icon: "🗺️",
    title: "ルーティングの基礎",
    desc: "スタティックルート・OSPF・EIGRP・BGP の仕組みと設定コマンドを学習します。",
    level: "初級",
    levelColor: "#58a6ff",
    steps: 15,
    duration: "50分",
    tags: ["OSPF", "EIGRP", "スタティック"],
  },
  {
    slug: "switching",
    icon: "🔀",
    title: "スイッチングとVLAN",
    desc: "STP・VLAN・トランキング・EtherChannel の設定と動作原理を実例で解説。",
    level: "中級",
    levelColor: "#e3b341",
    steps: 12,
    duration: "45分",
    tags: ["VLAN", "STP", "802.1Q"],
  },
  {
    slug: "cisco-cli",
    icon: "🖥️",
    title: "Cisco IOS CLI 入門",
    desc: "基本的なIOS操作モード・show コマンド・設定保存・Privileged EXEC モードを習得。",
    level: "初心者",
    levelColor: "#3fb950",
    steps: 8,
    duration: "25分",
    tags: ["CLI", "IOS", "show コマンド"],
  },
  {
    slug: "security",
    icon: "🔐",
    title: "ネットワークセキュリティ基礎",
    desc: "ACL・NAT・VPN・ファイアウォールの概念と、Cisco ルーターでの設定方法を解説。",
    level: "中級",
    levelColor: "#e3b341",
    steps: 10,
    duration: "35分",
    tags: ["ACL", "NAT", "セキュリティ"],
  },
];

export default function CcnaGuidePage() {
  const [selectedLevel, setSelectedLevel] = useState("すべて");

  const filteredGuides =
    selectedLevel === "すべて"
      ? guides
      : guides.filter((g) => {
          if (selectedLevel === "初心者初級") {
            return g.level === "初心者入門" || g.level === "初心者" || g.level === "初級";
          }
          if (selectedLevel === "初心者入門") return g.level === "初心者入門" || g.level === "初心者";
          if (selectedLevel === "初心者") return g.level === "初心者入門" || g.level === "初心者";
          return g.level === selectedLevel;
        });

  return (
    <main className="relative min-h-screen px-4 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(188,140,255,0.10) 0%, transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-5xl">
        {/* パンくず */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <Link href="/" className="hover:text-[var(--foreground)] transition-colors">ホーム</Link>
          <span>/</span>
          <Link href="/ccna" className="hover:text-[var(--foreground)] transition-colors">CCNA</Link>
          <span>/</span>
          <span className="text-[var(--foreground)]">学習ガイド</span>
        </nav>

        {/* ヘッダー */}
        <header className="mb-10">
          <h1 className="mb-2 text-3xl font-extrabold text-[var(--foreground)]">
            📖 CCNA 学習ガイド
          </h1>
          <p className="text-[var(--text-muted)]">
            ネットワーク初心者でも一から理解できるガイド集。OSI モデルから Cisco CLI まで網羅。
          </p>
        </header>

        {/* レベルフィルター */}
        <div className="mb-6 flex flex-wrap gap-2">
          {[
            { label: "すべて", color: "#bc8cff" },
            { label: "初心者入門", color: "#3fb950" },
            { label: "初心者", color: "#3fb950" },
            { label: "初心者初級", color: "#58a6ff" },
            { label: "初級", color: "#58a6ff" },
            { label: "中級", color: "#e3b341" },
          ].map((f) => {
            const active = selectedLevel === f.label;
            return (
              <button
                key={f.label}
                onClick={() => setSelectedLevel(f.label)}
                className="rounded-full border px-4 py-1.5 text-sm font-semibold transition-all hover:scale-105 cursor-pointer"
                style={{
                  borderColor: active ? f.color : "var(--border)",
                  background: active ? `${f.color}20` : "var(--surface)",
                  color: active ? f.color : "var(--text-muted)",
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* ガイドカード一覧 */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGuides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/ccna/guide/${guide.slug}`}
              className="group flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#bc8cff] hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                  style={{ background: `${guide.levelColor}20` }}
                >
                  {guide.icon}
                </div>
                <span
                  className="rounded-full border px-2 py-0.5 text-xs font-semibold"
                  style={{ borderColor: guide.levelColor, color: guide.levelColor }}
                >
                  {guide.level}
                </span>
              </div>

              <div>
                <h2 className="mb-2 text-sm font-bold leading-snug text-[var(--foreground)]">
                  {guide.title}
                </h2>
                <p className="text-xs leading-relaxed text-[var(--text-muted)]">
                  {guide.desc}
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                <span>🔢 {guide.steps} ステップ</span>
                <span>⏱ {guide.duration}</span>
              </div>

              <div className="flex flex-wrap gap-1">
                {guide.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-[var(--surface-2)] px-2 py-0.5 text-xs text-[var(--text-muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-1 text-xs font-semibold text-[#bc8cff] opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
                ガイドを読む →
              </div>
            </Link>
          ))}
          {filteredGuides.length === 0 && (
            <div className="col-span-full py-12 text-center text-[var(--text-muted)]">
              該当する学習ガイドはありません。
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
