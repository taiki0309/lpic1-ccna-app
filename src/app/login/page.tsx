'use client';

import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function LoginRedirector() {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const router = useRouter();

  useEffect(() => {
    if (authStatus === 'authenticated') {
      router.replace('/');
    }
  }, [authStatus, router]);

  return null;
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen w-full max-w-full overflow-x-hidden items-center justify-center bg-[var(--background)] px-4 py-12">
      {/* 背景グラデーション */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(88,166,255,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(188,140,255,0.08) 0%, transparent 60%)',
        }}
      />

      <div className="w-full max-w-md">
        {/* ヘッダー */}
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-extrabold text-[var(--accent-primary)] shadow-sm">
            <span
              className="inline-block h-2 w-2 rounded-full bg-[var(--accent-secondary)] shadow-[0_0_8px_var(--accent-secondary)]"
              aria-hidden="true"
            />
            ITインフラ技術者認定学習アプリ
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
            LPIC・CCNA 学習サポート
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[var(--text-muted)]">
            社内エンジニアのスキルアップを応援！ログインして学習を進めましょう
          </p>

          {/* セキュリティ＆利用上のご案内バッジ */}
          <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/80 p-3 text-left text-[11px] text-[var(--text-muted)]">
            <div className="flex items-center gap-1.5 font-bold text-[var(--foreground)] mb-1">
              <span>🛡️</span>
              <span>セキュア認証・登録者把握システム対応</span>
            </div>
            <p className="leading-relaxed">
              ご登録いただいたメールアドレスや表示名は、不正アクセス防止および社内学習状況確認のため安全に管理されます。
            </p>
          </div>
        </div>

        {/* Authenticator */}
        <Authenticator
          loginMechanisms={['email']}
          signUpAttributes={['email']}
          formFields={{
            signIn: {
              username: {
                label: 'メールアドレス',
                placeholder: '例: example@company.com',
                isRequired: true,
              },
              password: {
                label: 'パスワード',
                placeholder: 'パスワードを入力',
                isRequired: true,
              },
            },
            signUp: {
              name: {
                label: 'お名前（表示名）',
                placeholder: '例: 山田 太郎',
                isRequired: true,
                order: 1,
              },
              email: {
                label: 'メールアドレス',
                placeholder: '例: example@company.com',
                isRequired: true,
                order: 2,
              },
              password: {
                label: 'パスワード（8文字以上）',
                placeholder: '8文字以上のパスワードを入力',
                isRequired: true,
                order: 3,
              },
              confirm_password: {
                label: 'パスワード（確認用）',
                placeholder: '確認のためもう一度入力してください',
                isRequired: true,
                order: 4,
              },
            },
            forgotPassword: {
              username: {
                label: 'ご登録のメールアドレス',
                placeholder: '例: example@company.com',
                isRequired: true,
              },
            },
            confirmResetPassword: {
              confirmation_code: {
                label: '確認コード',
                placeholder: 'メールで届いた6桁の確認コードを入力',
                isRequired: true,
              },
              password: {
                label: '新しいパスワード',
                placeholder: '新しいパスワードを入力（8文字以上）',
                isRequired: true,
              },
              confirm_password: {
                label: '新しいパスワード（確認用）',
                placeholder: '確認のためもう一度入力してください',
                isRequired: true,
              },
            },
          }}
        >
          <LoginRedirector />
        </Authenticator>
      </div>
    </main>
  );
}
