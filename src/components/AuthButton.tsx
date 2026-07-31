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
          router.push('/');
        }}
        className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold text-[var(--text-muted)] transition-all duration-300 hover:scale-105 hover:border-[#f85149] hover:text-[#f85149]"
      >
        🔓 ログアウト
      </button>
    );
  }

  return (
    <Link
      id="login-btn"
      href="/login"
      className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold text-[var(--text-muted)] transition-all duration-300 hover:scale-105 hover:border-[var(--accent-primary)] hover:text-[var(--foreground)]"
    >
      🔐 ログイン / サインアップ
    </Link>
  );
}
