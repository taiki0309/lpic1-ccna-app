import { NextResponse } from "next/server";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, TABLE_NAME } from "@/lib/dynamodb";
import { SEED_QUESTIONS } from "@/lib/questionSeedData";
import { logger } from "@/lib/logger";

export async function POST() {
  const start = Date.now();
  try {
    let successCount = 0;
    const errors: string[] = [];

    for (const q of SEED_QUESTIONS) {
      try {
        await docClient.send(
          new PutCommand({
            TableName: TABLE_NAME,
            Item: {
              PK: `CERT#${q.cert}`,
              SK: `Q#${q.questionId}`,
              questionId: q.questionId,
              cert: q.cert,
              category: q.category,
              text: q.text,
              options: q.options,
              correctIndex: q.correctIndex,
              explanation: q.explanation,
              difficulty: q.difficulty,
              createdAt: new Date().toISOString(),
            },
          })
        );
        successCount++;
      } catch (e) {
        const msg = e instanceof Error ? e.message : "PutCommand failed";
        errors.push(`${q.questionId}: ${msg}`);
      }
    }

    logger.info("api/questions/seed", "初期問題データ投入完了", {
      successCount,
      totalCount: SEED_QUESTIONS.length,
      errorsCount: errors.length,
      durationMs: Date.now() - start,
    });

    return NextResponse.json({
      success: errors.length === 0,
      count: successCount,
      total: SEED_QUESTIONS.length,
      errors: errors.length > 0 ? errors : undefined,
      message: `全${SEED_QUESTIONS.length}問中 ${successCount}問を DynamoDB '${TABLE_NAME}' テーブルに登録しました！`,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "不明なエラーが発生しました。";
    logger.error("api/questions/seed", "投入エラー", {
      error: message,
      durationMs: Date.now() - start,
    });
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
