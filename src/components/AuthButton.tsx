'use client';

import { useAuthenticator } from '@aws-amplify/ui-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AuthButton() {
  const { authStatus, signOut } = useAuthenticator((ctx) => [ctx.authStatus]);
  const router = useRouter();

  if (authStatus === 'authenticated') {
    return (
      <button
        id="logout-btn"
        onClick={() => {
          signOut();
          router.push('/login');
        }}
        className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)] transition-all duration-300 hover:scale-105 hover:border-[#f85149] hover:text-[#f85149] sm:px-5 sm:py-2 sm:text-sm"
      >
        <span>🔓</span>
        <span>ログアウト</span>
      </button>
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
