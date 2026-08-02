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
      item.includes("ハードウェア") ||
      item.includes("bios") ||
      item.includes("uefi") ||
      item.includes("systemd")
    );
  }
  if (
    target === "packages" ||
    target === "linuxインストールとパッケージ管理" ||
    target === "パッケージ管理" ||
    target === "パッケージ"
  ) {
    return (
      item.includes("パッケージ") ||
      item.includes("インストール") ||
      item.includes("apt") ||
      item.includes("dpkg") ||
      item.includes("rpm") ||
      item.includes("yum") ||
      item.includes("dnf")
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
  if (target === "filesystem" || target === "デバイスとファイルシステム" || target === "ファイルシステム") {
    return (
      item.includes("ファイルシステム") ||
      item.includes("デバイス") ||
      item.includes("マウント") ||
      item.includes("パーティション") ||
      item.includes("ディスク")
    );
  }
  if (target === "shell" || target === "シェルとスクリプト") {
    return (
      item.includes("シェル") ||
      item.includes("スクリプト") ||
      item.includes("環境変数") ||
      item.includes("bash") ||
      item.includes("エイリアス")
    );
  }
  if (target === "users" || target === "ユーザーとグループ管理" || target === "ユーザーとセキュリティ") {
    return (
      item.includes("ユーザー") ||
      item.includes("グループ") ||
      item.includes("アカウント") ||
      item.includes("セキュリティ") ||
      item.includes("権限")
    );
  }

  // ─── CCNA のマッチング定義 ──────────────────────────────
  if (target === "fundamentals" || target === "ネットワーク基礎") {
    return (
      item.includes("ネットワーク基礎") ||
      item.includes("osi") ||
      item.includes("tcp") ||
      item.includes("udp") ||
      item.includes("arp") ||
      item.includes("基礎")
    );
  }
  if (
    target === "ip-addressing" ||
    target === "ipアドレッシング" ||
    target === "ipアドレッシング・サービス" ||
    target === "ipサービス"
  ) {
    return (
      item.includes("ipアドレッシング") ||
      item.includes("ipアドレス") ||
      item.includes("サブネット") ||
      item.includes("cidr") ||
      item.includes("ipサービス") ||
      item.includes("サービス") ||
      item.includes("nat") ||
      item.includes("dhcp") ||
      item.includes("ntp") ||
      item.includes("snmp") ||
      item.includes("syslog") ||
      item.includes("pat") ||
      item.includes("ipv4") ||
      item.includes("ipv6")
    );
  }
  if (target === "routing" || target === "ルーティング" || target === "ipルーティング") {
    return (
      item.includes("ルーティング") ||
      item.includes("ospf") ||
      item.includes("eigrp") ||
      item.includes("bgp") ||
      item.includes("ルート") ||
      item.includes("スタティック")
    );
  }
  if (
    target === "switching" ||
    target === "スイッチング・vlan" ||
    target === "スイッチング" ||
    target === "vlan" ||
    target === "ネットワークアクセス"
  ) {
    return (
      item.includes("スイッチング") ||
      item.includes("スイッチ") ||
      item.includes("vlan") ||
      item.includes("stp") ||
      item.includes("イーサネット") ||
      item.includes("ネットワークアクセス") ||
      item.includes("トランキング")
    );
  }
  if (target === "security" || target === "セキュリティ" || target === "セキュリティ基礎") {
    return (
      item.includes("セキュリティ") ||
      item.includes("acl") ||
      item.includes("アクセス制御") ||
      item.includes("認証") ||
      item.includes("ポートセキュリティ") ||
      item.includes("aaa")
    );
  }
  if (
    target === "wan-cloud" ||
    target === "wan & クラウド" ||
    target === "wan・クラウド・自動化" ||
    target === "クラウド" ||
    target === "automation" ||
    target === "自動化とプログラマビリティ"
  ) {
    return (
      item.includes("wan") ||
      item.includes("クラウド") ||
      item.includes("vpn") ||
      item.includes("qos") ||
      item.includes("自動化") ||
      item.includes("プログラマビリティ") ||
      item.includes("rest") ||
      item.includes("json") ||
      item.includes("ansible") ||
      item.includes("sdn") ||
      item.includes("api")
    );
  }

  // 部分一致フォールバック
  return item.includes(target) || target.includes(item);
}
