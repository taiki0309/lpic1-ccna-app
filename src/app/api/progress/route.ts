import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, USER_ANSWERS_TABLE } from "@/lib/dynamodb";

interface DynamoAnswer {
  PK?: string;
  SK?: string;
  userId?: string;
  cert?: string;
  questionId?: string;
  category?: string;
  isCorrect?: boolean;
  answeredAt?: string;
}

// カテゴリ名の正規化（英語表記を日本語にマップ）
function normalizeCategory(cat?: string): string {
  if (!cat) return "未分類";
  const map: Record<string, string> = {
    "Network Fundamentals": "ネットワーク基礎",
    "IP Addressing": "IPアドレッシング",
    "Routing": "ルーティング",
    "Switching & VLAN": "スイッチング・VLAN",
    "Security": "セキュリティ",
    "WAN & Cloud": "WAN & クラウド",
    "System Architecture": "システムアーキテクチャ",
    "Linux Installation & Packages": "Linuxインストール&パッケージ",
    "GNU & Unix Commands": "GNUとUnixコマンド",
    "Devices & Filesystems": "デバイス&ファイルシステム",
    "Shells & Scripting": "シェル&スクリプト",
    "User & Group Management": "ユーザー&グループ管理",
  };
  return map[cat] || cat;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || "test-user-001";

  try {
    const pk = `USER#${userId}`;
    const result = await docClient.send(
      new QueryCommand({
        TableName: USER_ANSWERS_TABLE,
        KeyConditionExpression: "PK = :pk",
        ExpressionAttributeValues: { ":pk": pk },
      })
    );

    const items = (result.Items ?? []) as DynamoAnswer[];

    // LPIC-1 と CCNA の初期構造
    const lpic1Categories = [
      { name: "システムアーキテクチャ", total: 20 },
      { name: "Linuxインストール&パッケージ", total: 25 },
      { name: "GNUとUnixコマンド", total: 40 },
      { name: "デバイス&ファイルシステム", total: 30 },
      { name: "シェル&スクリプト", total: 20 },
      { name: "ユーザー&グループ管理", total: 18 },
    ];
    const ccnaCategories = [
      { name: "ネットワーク基礎", total: 30 },
      { name: "IPアドレッシング", total: 25 },
      { name: "ルーティング", total: 35 },
      { name: "スイッチング・VLAN", total: 28 },
      { name: "セキュリティ", total: 20 },
      { name: "WAN & クラウド", total: 22 },
    ];

    const lpic1Map: Record<string, { answered: number; correct: number }> = {};
    lpic1Categories.forEach((c) => (lpic1Map[c.name] = { answered: 0, correct: 0 }));

    const ccnaMap: Record<string, { answered: number; correct: number }> = {};
    ccnaCategories.forEach((c) => (ccnaMap[c.name] = { answered: 0, correct: 0 }));

    let lpic1Answered = 0;
    let lpic1Correct = 0;
    let ccnaAnswered = 0;
    let ccnaCorrect = 0;

    items.forEach((item) => {
      const cert = (item.cert || "").toUpperCase();
      const normCat = normalizeCategory(item.category);
      const isCorrect = item.isCorrect === true;

      if (cert === "LPIC1" || cert === "LPIC-1" || cert.includes("LPIC")) {
        lpic1Answered++;
        if (isCorrect) lpic1Correct++;
        if (lpic1Map[normCat]) {
          lpic1Map[normCat].answered++;
          if (isCorrect) lpic1Map[normCat].correct++;
        }
      } else if (cert === "CCNA" || cert.includes("CCNA")) {
        ccnaAnswered++;
        if (isCorrect) ccnaCorrect++;
        if (ccnaMap[normCat]) {
          ccnaMap[normCat].answered++;
          if (isCorrect) ccnaMap[normCat].correct++;
        }
      }
    });

    const lpic1TotalQ = 153;
    const ccnaTotalQ = 160;

    const lpic1Progress = Math.min(100, Math.round((lpic1Answered / lpic1TotalQ) * 100));
    const ccnaProgress = Math.min(100, Math.round((ccnaAnswered / ccnaTotalQ) * 100));

    const certStats = [
      {
        cert: "LPIC-1",
        href: "/lpic1",
        color: "#58a6ff",
        gradient: "linear-gradient(135deg, #1d6fca, #58a6ff)",
        icon: "L1",
        progress: lpic1Progress,
        totalQuestions: lpic1TotalQ,
        answered: lpic1Answered,
        correct: lpic1Correct,
        categories: lpic1Categories.map((c) => {
          const ans = lpic1Map[c.name]?.answered || 0;
          const prog = Math.min(100, Math.round((ans / c.total) * 100));
          return { name: c.name, progress: prog, total: c.total, answered: ans };
        }),
      },
      {
        cert: "CCNA",
        href: "/ccna",
        color: "#bc8cff",
        gradient: "linear-gradient(135deg, #6e40c9, #bc8cff)",
        icon: "CC",
        progress: ccnaProgress,
        totalQuestions: ccnaTotalQ,
        answered: ccnaAnswered,
        correct: ccnaCorrect,
        categories: ccnaCategories.map((c) => {
          const ans = ccnaMap[c.name]?.answered || 0;
          const prog = Math.min(100, Math.round((ans / c.total) * 100));
          return { name: c.name, progress: prog, total: c.total, answered: ans };
        }),
      },
    ];

    // 連続学習日数（streakDays）の計算
    const dates = Array.from(
      new Set(
        items
          .map((item) => (item.answeredAt ? item.answeredAt.split("T")[0] : null))
          .filter(Boolean) as string[]
      )
    ).sort().reverse();

    let streakDays = dates.length > 0 ? 1 : 0;
    if (dates.length > 1) {
      for (let i = 0; i < dates.length - 1; i++) {
        const d1 = new Date(dates[i]);
        const d2 = new Date(dates[i + 1]);
        const diff = (d1.getTime() - d2.getTime()) / (1000 * 3600 * 24);
        if (Math.round(diff) === 1) {
          streakDays++;
        } else {
          break;
        }
      }
    }

    const totalAnswered = lpic1Answered + ccnaAnswered;
    const totalCorrect = lpic1Correct + ccnaCorrect;
    const overallAccuracy =
      totalAnswered > 0
        ? `${Math.round((totalCorrect / totalAnswered) * 100)}%`
        : "-%";

    // バッジ計算
    const badges = [];
    if (totalAnswered >= 1) {
      badges.push({ id: "first-step", name: "初めの第一歩", icon: "🌱", desc: "初めて問題に挑戦" });
    }
    if (totalCorrect >= 1) {
      badges.push({ id: "first-correct", name: "初正解", icon: "✨", desc: "初めて問題に正解" });
    }
    if (totalCorrect >= 5) {
      badges.push({ id: "bronze-solver", name: "ブロンズソルバー", icon: "🥉", desc: "累計5問正解" });
    }
    if (totalCorrect >= 20) {
      badges.push({ id: "silver-solver", name: "シルバーソルバー", icon: "🥈", desc: "累計20問正解" });
    }
    if (totalCorrect >= 50) {
      badges.push({ id: "gold-solver", name: "ゴールドマスター", icon: "🥇", desc: "累計50問正解" });
    }
    if (streakDays >= 3) {
      badges.push({ id: "streak-3", name: "3日連続学習", icon: "🔥", desc: "3日間継続学習" });
    }

    const statsSummary = [
      { label: "連続学習", value: `${streakDays}日`, icon: "🔥" },
      { label: "総回答数", value: `${totalAnswered}問`, icon: "📝" },
      { label: "全体正答率", value: overallAccuracy, icon: "🎯" },
      { label: "取得バッジ", value: `${badges.length}個`, icon: "🏅" },
    ];

    // 最近の回答履歴（最新10件）
    const recentHistory = items
      .slice()
      .sort((a, b) => (b.answeredAt || "").localeCompare(a.answeredAt || ""))
      .slice(0, 10);

    return Response.json({
      success: true,
      certStats,
      statsSummary,
      badges,
      recentHistory,
    });
  } catch (err) {
    console.error("[api/progress] GET error:", err);
    return Response.json(
      {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
