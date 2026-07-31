'use client';

import { configureAmplify } from '@/lib/amplifyConfig';
import { Authenticator } from '@aws-amplify/ui-react';

// クライアントサイドでAmplifyを初期化（一度だけ実行）
configureAmplify();

export default function AmplifyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Authenticator.Provider>{children}</Authenticator.Provider>;
}
