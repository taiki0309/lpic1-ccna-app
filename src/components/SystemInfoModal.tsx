"use client";

import React, { useState, useEffect } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";

interface SystemInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SystemInfoModal({
  isOpen,
  onClose,
}: SystemInfoModalProps) {
  const { authStatus, user } = useAuthenticator((ctx) => [
    ctx.authStatus,
    ctx.user,
  ]);

  const [activeTab, setActiveTab] = useState<"session" | "iam" | "cloudfront">(
    "session"
  );
  const [sessionTimeLeft, setSessionTimeLeft] = useState<string>("計算中...");

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      const now = new Date();
      const minsLeft = 59 - now.getMinutes();
      const secsLeft = 59 - now.getSeconds();
      setSessionTimeLeft(`${minsLeft}分 ${secsLeft}秒 (自動リフレッシュ有効)`);
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* オーバーレイ */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* モーダルコンテンツ */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl animate-scale-up">
        {/* ヘッダー */}
        <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface-2)] px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛡️</span>
            <h2 className="text-base font-extrabold text-[var(--foreground)]">
              セッション時間 ＆ 構成ステータス確認
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--border)] hover:text-[var(--foreground)] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* タブ切り替え */}
        <div className="flex border-b border-[var(--border)] bg-[var(--surface-2)]/50 px-6 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("session")}
            className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-extrabold transition-colors whitespace-nowrap ${
              activeTab === "session"
                ? "border-[var(--accent-primary)] text-[var(--accent-primary)]"
                : "border-transparent text-[var(--text-muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <span>⏱️</span>
            <span>③ セッション時間</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("iam")}
            className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-extrabold transition-colors whitespace-nowrap ${
              activeTab === "iam"
                ? "border-[var(--accent-primary)] text-[var(--accent-primary)]"
                : "border-transparent text-[var(--text-muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <span>👤</span>
            <span>④ suzukiユーザーと権限</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("cloudfront")}
            className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-extrabold transition-colors whitespace-nowrap ${
              activeTab === "cloudfront"
                ? "border-[var(--accent-primary)] text-[var(--accent-primary)]"
                : "border-transparent text-[var(--text-muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <span>🌐</span>
            <span>⑤ CloudFrontのメリット</span>
          </button>
        </div>

        {/* タブコンテンツ */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
          {activeTab === "session" && (
            <div className="space-y-4 text-xs leading-relaxed text-[var(--foreground)]">
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--text-muted)]">
                    ログインステータス:
                  </span>
                  <span className="font-extrabold text-[var(--accent-secondary)]">
                    {authStatus === "authenticated"
                      ? "● 認証済 (Cognito User Pool)"
                      : "○ 未認証 (ゲスト/未ログイン)"}
                  </span>
                </div>
                {authStatus === "authenticated" && user && (
                  <div className="mt-2 flex items-center justify-between border-t border-[var(--border)] pt-2">
                    <span className="font-bold text-[var(--text-muted)]">
                      トークン有効期間 (概算):
                    </span>
                    <span className="font-mono font-bold text-[var(--accent-primary)]">
                      {sessionTimeLeft}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-extrabold text-[var(--accent-primary)]">
                  AWS Cognito のセッション時間仕様解説
                </h3>
                <ul className="list-disc pl-5 space-y-1.5 text-[var(--text-muted)]">
                  <li>
                    <strong className="text-[var(--foreground)]">
                      IDトークン / アクセストークン有効期限:
                    </strong>{" "}
                    デフォルトで <span className="text-[var(--accent-primary)] font-bold">1時間 (3600秒)</span> です。この間にAPIリクエストの認証が行われます。
                  </li>
                  <li>
                    <strong className="text-[var(--foreground)]">
                      リフレッシュトークン有効期限:
                    </strong>{" "}
                    デフォルトで <span className="text-[var(--accent-primary)] font-bold">30日間</span>（変更可能: 1時間〜3650日）。
                  </li>
                  <li>
                    <strong className="text-[var(--foreground)]">
                      セッション自動延長の仕組み:
                    </strong>{" "}
                    Amplify ライブラリは、ID/アクセストークンの有効期限が切れる前に自動でリフレッシュトークンを用いて新しいトークンを取得します。そのため、ブラウザを閉じない限り最大30日間シームレスに学習を継続できます。
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "iam" && (
            <div className="space-y-4 text-xs leading-relaxed text-[var(--foreground)]">
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
                <h3 className="text-sm font-extrabold text-[var(--accent-primary)] mb-2">
                  ④ 「suzukiユーザーでデータベースを見ている」件について
                </h3>
                <p className="text-[var(--text-muted)] mb-3">
                  現在、AWS上のデータベース（DynamoDBやRDS等）の確認・管理に <strong className="text-[var(--foreground)]">suzuki</strong> という管理用ユーザー（IAMユーザー/管理者権限）を使用されている状態は、<strong className="text-[var(--accent-secondary)]">運用上・検証上は問題ありません</strong>。ただし、以下の理由から「アプリ利用用のユーザー（CognitoやDB最小権限ユーザー）」と分ける意味は非常に大きいです。
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
                    <div className="font-bold text-[var(--accent-purple)] mb-1">
                      🛠️ インフラ/管理者 (suzuki)
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      AWSマネジメントコンソールやDBのスキーマ作成、デバッグ監視に使用する高権限ユーザー。
                    </p>
                  </div>
                  <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
                    <div className="font-bold text-[var(--accent-secondary)] mb-1">
                      📱 アプリ利用者 (Cognito)
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      自身の進捗や解答データのみにアクセスできる「最小権限」が付与されたユーザー層。
                    </p>
                  </div>
                </div>

                <div className="mt-3 space-y-1.5 text-[var(--text-muted)]">
                  <p><strong className="text-[var(--foreground)]">アプリ用ユーザーを作る3つの意味:</strong></p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li><strong className="text-[var(--foreground)]">最小権限の原則 (Least Privilege):</strong> 万が一アプリの認証情報が漏洩しても、AWS全体や他ユーザーのデータを保護できます。</li>
                    <li><strong className="text-[var(--foreground)]">監査ログの明確化:</strong> 「誰がシステムを変更したか(suzuki)」「誰が学習を進めたか(一般ユーザー)」を明確に分離できます。</li>
                    <li><strong className="text-[var(--foreground)]">スケーラビリティ:</strong> 今後ユーザー数が増えた場合でも、IAMユーザーを増やさずにCognito側で何万人でも管理可能です。</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {activeTab === "cloudfront" && (
            <div className="space-y-4 text-xs leading-relaxed text-[var(--foreground)]">
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">💡</span>
                  <h3 className="text-sm font-extrabold text-[var(--accent-primary)]">
                    現在の Amplify ドメイン (xxx.amplifyapp.com) から CloudFront に変えるメリットは？
                  </h3>
                </div>
                <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 mb-4">
                  <p className="text-[11px] font-bold text-[var(--accent-secondary)] mb-1">
                    【前提知識】実は Amplify も内部で CloudFront CDN で配信されています
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    AWS Amplify Hosting は、デフォルトで AWS のグローバル CDN (CloudFront) 基盤を使って配信されています。そのため、単純な「エッジキャッシュによる高速表示」の恩恵は現在の Amplify ドメインでも十分に得られています。
                  </p>
                </div>

                <p className="text-xs font-bold text-[var(--foreground)] mb-3">
                  では、なぜあえて「CloudFront 構成・独自ドメイン」に変更するメリットがあるのか？
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
                    <div className="font-extrabold text-[var(--accent-primary)] mb-1">
                      1. 独自ドメイン化＆ブランドSEO強化
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      「xxx.amplifyapp.com」ではなく、自社公式ドメイン（例: portal.company.co.jp）での運用が可能になり、信頼性とSEO価値が向上します。
                    </p>
                  </div>
                  <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
                    <div className="font-extrabold text-[var(--accent-secondary)] mb-1">
                      2. AWS WAF による社内IP制限・セキュリティ
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      CloudFront を前段に配置すれば AWS WAF と直接統合でき、「社内IPアドレスのみアクセス許可」「国内のみ許可」「SQLi/DDoS防御」を柔軟に適用できます。
                    </p>
                  </div>
                  <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
                    <div className="font-extrabold text-[var(--accent-purple)] mb-1">
                      3. マルチオリジン統合 (API・S3ルーティング)
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      同一ドメイン配下で `/api/*` は API Gateway / ALB へ、`/static/*` は S3 へと、バックエンドを自在に切り替えられます。
                    </p>
                  </div>
                  <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
                    <div className="font-extrabold text-[var(--accent-yellow)] mb-1">
                      4. 高度なキャッシュ＆セキュリティヘッダー制御
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      CloudFront Functions や Lambda@Edge により、カスタムヘッダー（HSTS, CSP 等）や動的認証・リダイレクトを自由に制御できます。
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 text-[11px] text-[var(--text-muted)]">
                  <strong className="text-[var(--foreground)] font-bold">【結論】：</strong> 
                  単純な表示スピードは Amplify デフォルトでも十分ですが、<strong className="text-[var(--accent-primary)] font-bold">「独自ドメイン」「社内IP制限 (AWS WAF)」「APIやS3バケットとの高度なルーティング統合」</strong> を行いたい場合は、CloudFront を変更・導入する大きなメリットがあります。
                </div>
              </div>
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="flex justify-end border-t border-[var(--border)] bg-[var(--surface-2)] px-6 py-3">
          <button
            type="button"
            onClick={() => onClose()}
            className="rounded-xl bg-[var(--accent-primary)] px-5 py-2 text-xs font-bold text-white hover:opacity-90 transition-opacity"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
