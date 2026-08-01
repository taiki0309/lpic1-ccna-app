// スラッグ（英語名）と日本語カテゴリ名、関連サブカテゴリを柔軟にマッチングする関数

export function isCategoryMatch(itemCategory: string, targetCategory: string | null): boolean {
  if (!targetCategory || targetCategory === "all") return true;

  const target = targetCategory.toLowerCase().trim();
  const item = itemCategory.toLowerCase().trim();

  if (item === target) return true;

  // ─── LPIC-1 のマッチング定義 ──────────────────────────────
  if (target === "architecture" || target === "システムアーキテクチャ") {
    return (
      item.includes("システムアーキテクチャ") ||
      item.includes("アーキテクチャ") ||
      item.includes("ハードウェア")
    );
  }
  if (
    target === "packages" ||
    target === "linuxインストールとパッケージ管理" ||
    target === "パッケージ管理"
  ) {
    return (
      item.includes("パッケージ管理") ||
      item.includes("インストール") ||
      item.includes("apt") ||
      item.includes("dpkg") ||
      item.includes("rpm")
    );
  }
  if (target === "commands" || target === "gnuとunixコマンド" || target === "基本コマンド") {
    return (
      item.includes("unixコマンド") ||
      item.includes("gnu") ||
      item.includes("コマンド") ||
      item.includes("ファイル操作") ||
      item.includes("テキスト処理") ||
      item.includes("パーミッション") ||
      item.includes("プロセス管理")
    );
  }
  if (target === "filesystem" || target === "デバイスとファイルシステム") {
    return (
      item.includes("ファイルシステム") ||
      item.includes("デバイス") ||
      item.includes("マウント") ||
      item.includes("パーティション")
    );
  }
  if (target === "shell" || target === "シェルとスクリプト") {
    return item.includes("シェル") || item.includes("スクリプト") || item.includes("環境変数");
  }
  if (target === "users" || target === "ユーザーとグループ管理") {
    return (
      item.includes("ユーザー") ||
      item.includes("グループ") ||
      item.includes("アカウント")
    );
  }

  // ─── CCNA のマッチング定義 ──────────────────────────────
  if (target === "fundamentals" || target === "ネットワーク基礎") {
    return (
      item.includes("ネットワーク基礎") ||
      item.includes("osi") ||
      item.includes("tcp") ||
      item.includes("udp")
    );
  }
  if (target === "ip-addressing" || target === "ipアドレッシング") {
    return (
      item.includes("ipアドレッシング") ||
      item.includes("ipアドレス") ||
      item.includes("サブネット") ||
      item.includes("cidr")
    );
  }
  if (target === "routing" || target === "ルーティング") {
    return (
      item.includes("ルーティング") ||
      item.includes("ospf") ||
      item.includes("eigrp") ||
      item.includes("bgp") ||
      item.includes("ルート")
    );
  }
  if (
    target === "switching" ||
    target === "スイッチング・vlan" ||
    target === "スイッチング" ||
    target === "vlan"
  ) {
    return (
      item.includes("スイッチング") ||
      item.includes("vlan") ||
      item.includes("stp") ||
      item.includes("イーサネット")
    );
  }
  if (target === "security" || target === "セキュリティ") {
    return (
      item.includes("セキュリティ") ||
      item.includes("acl") ||
      item.includes("アクセス") ||
      item.includes("認証")
    );
  }
  if (target === "wan-cloud" || target === "wan & クラウド" || target === "クラウド") {
    return (
      item.includes("wan") ||
      item.includes("クラウド") ||
      item.includes("vpn") ||
      item.includes("qos")
    );
  }

  // 部分一致フォールバック
  return item.includes(target) || target.includes(item);
}
