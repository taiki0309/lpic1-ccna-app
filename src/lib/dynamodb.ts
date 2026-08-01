import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// ─── DynamoDB クライアント（サーバーサイド専用） ────────────
// 環境変数から認証情報を読み込む（.env.local に設定）
const rawClient = new DynamoDBClient({
  region:
    process.env.APP_AWS_REGION ??
    process.env.MY_AWS_REGION ??
    process.env.CUSTOM_AWS_REGION ??
    process.env.AMPLIFY_AWS_REGION ??
    process.env.AWS_REGION ??
    "ap-northeast-1",
  credentials: {
    accessKeyId:
      process.env.APP_AWS_ACCESS_KEY_ID ??
      process.env.MY_AWS_ACCESS_KEY_ID ??
      process.env.CUSTOM_AWS_ACCESS_KEY_ID ??
      process.env.AMPLIFY_AWS_ACCESS_KEY_ID ??
      process.env.AWS_ACCESS_KEY_ID ??
      "",
    secretAccessKey:
      process.env.APP_AWS_SECRET_ACCESS_KEY ??
      process.env.MY_AWS_SECRET_ACCESS_KEY ??
      process.env.CUSTOM_AWS_SECRET_ACCESS_KEY ??
      process.env.AMPLIFY_AWS_SECRET_ACCESS_KEY ??
      process.env.AWS_SECRET_ACCESS_KEY ??
      "",
  },
});

// DynamoDBDocumentClient は JS オブジェクトを直接扱えるラッパー
export const docClient = DynamoDBDocumentClient.from(rawClient, {
  marshallOptions: {
    // undefined 値を自動除外
    removeUndefinedValues: true,
  },
});

export const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME ?? "Questions";

// Phase 2 で作成予定のテーブル
export const USER_PROGRESS_TABLE =
  process.env.DYNAMODB_USER_PROGRESS_TABLE ?? "UserProgress";
export const USER_ANSWERS_TABLE =
  process.env.DYNAMODB_USER_ANSWERS_TABLE ?? "UserAnswers";

