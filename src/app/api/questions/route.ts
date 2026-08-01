import { ScanCommand, GetCommand, QueryCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, TABLE_NAME } from "@/lib/dynamodb";
import { logger } from "@/lib/logger";

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

  const start = Date.now();
  try {
    logger.info("api/questions", "問題データ取得開始", { cert: cert ?? "all", category: category ?? "all", id });
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

    logger.info("api/questions", "問題データ取得成功", { count: questions.length, durationMs: Date.now() - start });
    return Response.json({ questions });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "不明なエラーが発生しました。";

    logger.error("api/questions", "DynamoDB エラー", { error: message, durationMs: Date.now() - start });

    return Response.json(
      { error: message, questions: [] },
      { status: 503 }
    );
  }
}

// ─── POST /api/questions ─────────────────────────────────
// 新規問題の登録（1件）
export async function POST(request: Request) {
  const start = Date.now();
  try {
    const body = await request.json();
    const { cert, category, text, options, correctIndex, explanation, difficulty } = body;

    if (!cert || !category || !text || !options || correctIndex === undefined) {
      return Response.json(
        { error: "必須項目（cert, category, text, options, correctIndex）が不足しています。" },
        { status: 400 }
      );
    }

    const questionId = `q-${cert}-${Date.now()}`;
    const item = {
      PK: `CERT#${cert}`,
      SK: `Q#${questionId}`,
      questionId,
      cert,
      category,
      text,
      options,
      correctIndex: Number(correctIndex),
      explanation: explanation || "解説はありません。",
      difficulty: difficulty || "intermediate",
      createdAt: new Date().toISOString(),
    };

    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: item,
      })
    );

    logger.info("api/questions", "問題作成成功", { questionId, durationMs: Date.now() - start });
    return Response.json({ success: true, questionId, item });
  } catch (err) {
    const message = err instanceof Error ? err.message : "問題の作成に失敗しました。";
    logger.error("api/questions", "問題作成エラー", { error: message, durationMs: Date.now() - start });
    return Response.json({ error: message }, { status: 500 });
  }
}
