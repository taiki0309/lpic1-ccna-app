'use client';

import { useAuthenticator } from '@aws-amplify/ui-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AuthButton() {
  const { authStatus, user, signOut } = useAuthenticator((ctx) => [ctx.authStatus, ctx.user]);
  const router = useRouter();

  const getDisplayName = (usr: any): string => {
    if (!usr) return 'ユーザー';
    const id =
      usr.signInDetails?.loginId ||
      usr.attributes?.email ||
      usr.username ||
      'ユーザー';
    if (typeof id === 'string') {
      if (id.includes('@')) {
        return id.split('@')[0];
      }
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(id)) {
        return '学習者';
      }
      return id;
    }
    return 'ユーザー';
  };

  if (authStatus === 'authenticated') {
    const name = getDisplayName(user);
    return (
      <div className="flex items-center gap-2">
        <span className="hidden sm:inline-block rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3 py-1.5 text-xs font-bold text-[var(--accent-primary)] whitespace-nowrap" title={`ログイン中: ${name}さん`}>
          👋 こんにちは、{name}さん
        </span>
        <button
          id="logout-btn"
          onClick={() => {
            signOut();
            router.push('/login');
          }}
          className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)] transition-all duration-300 hover:scale-105 hover:border-[#f85149] hover:text-[#f85149] sm:px-4 sm:py-2 sm:text-sm"
        >
          <span>🔓</span>
          <span>ログアウト</span>
        </button>
      </div>
    );
  }

  return (
    <Link
      id="login-btn"
      href="/login"
      className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)] transition-all duration-300 hover:scale-105 hover:border-[var(--accent-primary)] hover:text-[var(--foreground)] sm:px-5 sm:py-2 sm:text-sm"
    >
      <span>🔐</span>
      <span className="sm:hidden">ログイン</span>
      <span className="hidden sm:inline">ログイン / サインアップ</span>
    </Link>
  );
}
