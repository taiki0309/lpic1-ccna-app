import { NextResponse } from "next/server";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, USER_ANSWERS_TABLE } from "@/lib/dynamodb";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, cert, questionId, category, selectedIndex, isCorrect } = body;

    if (!userId || !cert || !questionId) {
      return NextResponse.json(
        { success: false, error: "必須項目が不足しています" },
        { status: 400 }
      );
    }

    const pk = `USER#${userId}`;
    const timestamp = Date.now();
    const sk = `ANS#${cert}#${questionId}#${timestamp}`;

    const item = {
      PK: pk,
      SK: sk,
      userId,
      cert,
      questionId: String(questionId),
      category: category || "未分類",
      selectedIndex: Number(selectedIndex),
      isCorrect: Boolean(isCorrect),
      answeredAt: new Date().toISOString(),
    };

    await docClient.send(
      new PutCommand({
        TableName: USER_ANSWERS_TABLE,
        Item: item,
      })
    );

    logger.info("api/submit", "演習回答の保存成功", {
      userId,
      cert,
      questionId,
    });

    return NextResponse.json({ success: true, item });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "不明なエラー";
    logger.error("api/submit", "演習回答の保存失敗", { error: errMessage });
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}
