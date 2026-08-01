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
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4 py-12">
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
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-extrabold text-[var(--accent-primary)]">
            <span
              className="inline-block h-2 w-2 rounded-full bg-[var(--accent-secondary)] shadow-[0_0_8px_var(--accent-secondary)]"
              aria-hidden="true"
            />
            ITインフラ技術者認定学習アプリ
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
            LPIC×CCNA 学習室へようこそ！
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[var(--text-muted)]">
            メールアドレスとパスワードでログインして学習を継続しましょう
          </p>
        </div>

        {/* Authenticator */}
        <Authenticator
          loginMechanisms={['email']}
          signUpAttributes={['email']}
          formFields={{
            signUp: {
              name: {
                label: '名前（表示名）',
                placeholder: '表示名を入力',
                isRequired: true,
                order: 1,
              },
              email: {
                order: 2,
              },
              password: {
                order: 3,
              },
              confirm_password: {
                order: 4,
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
