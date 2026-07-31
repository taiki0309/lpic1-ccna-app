import { getCurrentUser } from "aws-amplify/auth";

export interface SubmitAnswerParams {
  cert: "lpic1" | "ccna";
  questionId: string | number;
  category: string;
  selectedIndex: number;
  isCorrect: boolean;
  userId?: string;
}

/**
 * Amplifyの認証情報からユーザーIDを取得します。
 * 未ログイン・取得不可の場合は仮のID (test-user-front) を返します。
 */
export async function getUserId(): Promise<string> {
  try {
    const user = await getCurrentUser();
    return user.userId || user.username || "test-user-front";
  } catch {
    return "test-user-front";
  }
}

/**
 * クイズの回答時に Lambda の関数 URL へ POST リクエストを送信します。
 * バックグラウンドで非同期送信しても UI をブロックしない設計にしています。
 */
export async function submitAnswer(
  params: SubmitAnswerParams
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  const url = process.env.NEXT_PUBLIC_SUBMIT_ANSWER_URL;
  if (!url) {
    console.warn(
      "[submitAnswer] NEXT_PUBLIC_SUBMIT_ANSWER_URL が環境変数に設定されていません。"
    );
    return { success: false, error: "URL未設定" };
  }

  try {
    const userId = params.userId || (await getUserId());

    const payload = {
      userId,
      cert: params.cert,
      questionId: String(params.questionId),
      category: params.category || "未分類",
      selectedIndex: params.selectedIndex,
      isCorrect: params.isCorrect,
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(
        "[submitAnswer] Lambda 関数 URL への POST が失敗しました:",
        res.status,
        errText
      );
      return { success: false, error: `HTTP ${res.status}: ${errText}` };
    }

    const data = await res.json().catch(() => null);
    return { success: true, data };
  } catch (err) {
    console.error("[submitAnswer] 通信エラー:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
