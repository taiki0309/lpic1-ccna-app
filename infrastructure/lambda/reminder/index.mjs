/**
 * 学習リマインドメール送信 Lambda 関数
 *
 * トリガー: EventBridge Scheduler（毎日 20:00 JST）
 * 動作: 当日学習ゼロのユーザーにリマインドメールを SES で送信
 *
 * 環境変数:
 *   USER_ANSWERS_TABLE  - DynamoDB UserAnswers テーブル名
 *   SENDER_EMAIL        - 送信元メールアドレス（SES で検証済み）
 *   AWS_REGION          - AWS リージョン
 */

import {
  DynamoDBClient,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import {
  SESv2Client,
  SendEmailCommand,
} from "@aws-sdk/client-sesv2";

const dynamo = new DynamoDBClient({ region: process.env.AWS_REGION });
const ses = new SESv2Client({ region: process.env.AWS_REGION });

const TABLE = process.env.USER_ANSWERS_TABLE ?? "UserAnswers";
const SENDER = process.env.SENDER_EMAIL ?? "noreply@example.com";

// 今日の日付文字列（JST）
function todayJST() {
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return jst.toISOString().split("T")[0]; // "2026-08-01"
}

// 当日の学習がないユーザーを DynamoDB から取得
async function getInactiveUsers(today) {
  // UserAnswers テーブルから全件取得して当日分を除外
  const result = await dynamo.send(new ScanCommand({ TableName: TABLE }));
  const items = (result.Items ?? []).map((i) => unmarshall(i));

  const activeUsers = new Set(
    items
      .filter((i) => i.answeredAt?.startsWith(today))
      .map((i) => i.userId)
  );

  const allUsers = new Set(items.map((i) => i.userId));
  const inactiveUsers = [...allUsers].filter((u) => !activeUsers.has(u));

  return inactiveUsers;
}

// リマインドメール HTML 本文
function buildEmailHtml(userId) {
  return `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"></head>
<body style="font-family:'Hiragino Kaku Gothic Pro',Meiryo,sans-serif; background:#0d1117; color:#e6edf3; margin:0; padding:0;">
  <div style="max-width:600px; margin:0 auto; padding:40px 24px;">
    <div style="background:linear-gradient(135deg,#58a6ff,#bc8cff); padding:3px; border-radius:16px;">
      <div style="background:#161b22; border-radius:14px; padding:32px;">
        <h1 style="font-size:24px; font-weight:900; margin:0 0 8px 0;">📚 今日の学習、まだですよ！</h1>
        <p style="color:#8b949e; margin:0 0 24px 0;">LPIC×CCNA 学習室からのリマインド</p>
        <p style="line-height:1.8; margin:0 0 24px 0;">
          今日はまだ学習が記録されていません。<br>
          毎日少しずつ続けることが、合格への近道です。<br>
          今日も一問だけでも挑戦してみましょう！🔥
        </p>
        <a href="https://d28til9vu58hhk.cloudfront.net/lpic1/quiz"
           style="display:inline-block; background:linear-gradient(135deg,#58a6ff,#bc8cff); color:white; text-decoration:none; padding:14px 32px; border-radius:12px; font-weight:700; font-size:16px;">
          今日の演習を始める →
        </a>
        <p style="color:#8b949e; font-size:12px; margin-top:32px;">
          このメールはリマインド設定をしているユーザーにのみ送信しています。<br>
          配信停止をご希望の場合はアカウント設定からお手続きください。
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export const handler = async () => {
  const today = todayJST();
  console.log(JSON.stringify({ level: "INFO", message: "リマインド送信開始", today }));

  let inactiveUsers;
  try {
    inactiveUsers = await getInactiveUsers(today);
  } catch (err) {
    console.error(JSON.stringify({ level: "ERROR", message: "ユーザー取得エラー", error: err.message }));
    return { statusCode: 500 };
  }

  console.log(JSON.stringify({ level: "INFO", message: `対象ユーザー数: ${inactiveUsers.length}`, today }));

  let sent = 0;
  for (const userId of inactiveUsers) {
    // userId がメールアドレス形式の場合のみ送信
    if (!userId || !userId.includes("@")) continue;

    try {
      await ses.send(new SendEmailCommand({
        FromEmailAddress: SENDER,
        Destination: { ToAddresses: [userId] },
        Content: {
          Simple: {
            Subject: { Data: "📚【LPIC×CCNA 学習室】今日の学習を忘れずに！", Charset: "UTF-8" },
            Body: {
              Html: { Data: buildEmailHtml(userId), Charset: "UTF-8" },
              Text: {
                Data: "今日はまだ学習が記録されていません。LPIC×CCNA 学習室で今日の演習を始めましょう！",
                Charset: "UTF-8",
              },
            },
          },
        },
      }));
      sent++;
    } catch (err) {
      console.error(JSON.stringify({ level: "WARN", message: "メール送信失敗", userId, error: err.message }));
    }
  }

  console.log(JSON.stringify({ level: "INFO", message: `リマインド送信完了`, sent, total: inactiveUsers.length }));
  return { statusCode: 200, sent, total: inactiveUsers.length };
};
