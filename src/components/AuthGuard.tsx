"use client";

import React, { useEffect } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // /login 以外のページで未認証の場合はログイン画面へ自動リダイレクト
    if (authStatus === "unauthenticated" && pathname !== "/login") {
      router.replace("/login");
    }
  }, [authStatus, pathname, router]);

  // ログイン画面そのものは常に表示
  if (pathname === "/login") {
    return <>{children}</>;
  }

  // 認証チェック中（ローディング表示）
  if (authStatus === "configuring") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent-primary)] border-t-transparent" />
          <p className="text-sm text-[var(--text-muted)]">認証を確認中...</p>
        </div>
      </div>
    );
  }

  // 未認証時はリダイレクト中のため何も描画しない
  if (authStatus === "unauthenticated") {
    return null;
  }

  return <>{children}</>;
}
