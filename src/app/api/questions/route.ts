import { ScanCommand, GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, TABLE_NAME } from "@/lib/dynamodb";

// ─── DynamoDB アイテムの型 ─────────────────────────────────
// テーブルスキーマ（拡張版）:
//   PK           (String, Partition Key) — "CERT#lpic1" / "CERT#ccna"
//   SK           (String, Sort Key)      — "Q#q-001"
//   questionId   (String)               — "q-001"（後方互換）
//   questionType (String)               — "multiple-choice" / "command-fill" / "cli-sim" 等
//   text         (String)               — 問題文
//   options      (List<String>)         — 選択肢
//   correctIndex (Number)               — 正解インデックス
//   explanation  (String)               — 解説文
//   category     (String)               — カテゴリ名
//   difficulty   (String)               — "beginner" / "intermediate" / "advanced"
interface DynamoQuestion {
  PK?: string;
  SK?: string;
  questionId: string;
  questionType?: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  category?: string;
  difficulty?: string;
}

function toQuestion(item: DynamoQuestion) {
  // DynamoDB が StringSet (SS) で返す場合 Set オブジェクトになるため配列へ変換
  const choices = Array.isArray(item.options)
    ? item.options
    : item.options
    ? [...(item.options as Iterable<string>)]
    : [];

  return {
    id: item.questionId ?? item.SK?.replace("Q#", "") ?? "unknown",
    category: item.category ?? "未分類",
    question: item.text,
    choices,
    correctIndex: Number(item.correctIndex),
    explanation: item.explanation ?? "解説はありません。",
    questionType: item.questionType ?? "multiple-choice",
    difficulty: item.difficulty ?? "intermediate",
  };
}

// ─── GET /api/questions ──────────────────────────────────
// クエリパラメータ:
//   ?cert=lpic1|ccna  → 資格でフィルタ（PK=CERT#<cert> で Query）
//   ?id=q-001         → 特定の問題1件を取得 (GetItem)
//   ?category=<cat>   → カテゴリフィルタ（クライアントサイド）
//   （なし）          → 全問題を取得 (Scan)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const cert = searchParams.get("cert"); // "lpic1" or "ccna"
  const category = searchParams.get("category");

  try {
    // ── 1件取得（後方互換）────────────────────────────────
    if (id) {
      const result = await docClient.send(
        new GetCommand({
          TableName: TABLE_NAME,
          Key: { questionId: id },
        })
      );

      if (!result.Item) {
        return Response.json(
          { error: `questionId "${id}" が見つかりません。` },
          { status: 404 }
        );
      }

      const question = toQuestion(result.Item as DynamoQuestion);
      return Response.json({ questions: [question] });
    }

    let items: DynamoQuestion[] = [];

    // ── 資格指定あり → PK/SK 構造で Query ────────────────
    if (cert) {
      const pk = `CERT#${cert}`;
      try {
        // 1. PK/SK 構造でクエリ
        const result = await docClient.send(
          new QueryCommand({
            TableName: TABLE_NAME,
            KeyConditionExpression: "PK = :pk",
            ExpressionAttributeValues: { ":pk": pk },
          })
        );
        items = (result.Items ?? []) as DynamoQuestion[];
      } catch {
        try {
          // 2. PK フィールドでフィルタ Scan（PK/SK 構造移行期）
          const result = await docClient.send(
            new ScanCommand({
              TableName: TABLE_NAME,
              FilterExpression: "PK = :pk",
              ExpressionAttributeValues: { ":pk": pk },
            })
          );
          items = (result.Items ?? []) as DynamoQuestion[];
        } catch {
          // 3. PK フィールド自体がない → フロント側フォールバックに委ねる
          items = [];
        }
      }
      // cert 指定なのに 0 件 → フロントがフォールバック問題を使う
    } else {
      // ── 全件取得 (Scan) ─────────────────────────────────
      const result = await docClient.send(
        new ScanCommand({ TableName: TABLE_NAME })
      );
      items = (result.Items ?? []) as DynamoQuestion[];
    }

    // カテゴリフィルタ（クライアント要求）
    if (category) {
      items = items.filter((item) => item.category === category);
    }

    // ソート
    items.sort((a, b) => a.questionId.localeCompare(b.questionId));

    const questions = items.map(toQuestion);

    return Response.json({ questions });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "不明なエラーが発生しました。";

    console.error("[API /api/questions] DynamoDB エラー:", message);

    return Response.json(
      { error: message, questions: [] },
      { status: 503 }
    );
  }
}
