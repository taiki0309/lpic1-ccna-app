import Link from "next/link";
import { notFound } from "next/navigation";

interface GuideStep {
  title: string;
  content: string;
  code: string | null;
  note: string | null;
}

const guides: Record<
  string,
  {
    title: string;
    level: string;
    levelColor: string;
    duration: string;
    tags: string[];
    steps: GuideStep[];
  }
> = {
  "network-basics": {
    title: "ネットワーク基礎を理解する",
    level: "初心者",
    levelColor: "#3fb950",
    duration: "30分",
    tags: ["OSI", "TCP/IP", "プロトコル"],
    steps: [
      {
        title: "OSI 参照モデルとは",
        content:
          "OSI（Open Systems Interconnection）モデルは、ネットワーク通信を7つの層に分けたフレームワークです。各層が独立した役割を持つことで、標準化と相互接続性を実現します。",
        code: "# OSI 7 層モデル（上から下へ）\nL7: アプリケーション層  (HTTP, FTP, SMTP, DNS)\nL6: プレゼンテーション層 (SSL/TLS, 暗号化, 圧縮)\nL5: セッション層       (NetBIOS, RPC)\nL4: トランスポート層   (TCP, UDP)\nL3: ネットワーク層     (IP, ICMP, OSPF)\nL2: データリンク層     (Ethernet, 802.11, ARP)\nL1: 物理層            (ケーブル, 光ファイバー, 電波)",
        note: "覚え方: 「All People Seem To Need Data Processing」(上から: Application～Physical)",
      },
      {
        title: "TCP/IP モデル",
        content:
          "実際のインターネットで使われているのは OSI ではなく TCP/IP モデルです。OSI の7層を4層に統合しています。",
        code: "# TCP/IP モデル と OSI の対応\nアプリケーション層  ← OSI L7 + L6 + L5\nトランスポート層    ← OSI L4\nインターネット層    ← OSI L3\nネットワーク接続層  ← OSI L2 + L1",
        note: "CCNA 試験ではOSIモデルの各層で動作するデバイスとプロトコルが頻出です。",
      },
      {
        title: "TCP vs UDP の違い",
        content: "トランスポート層のプロトコルの使い分けを理解しましょう。",
        code: "# TCP（信頼性重視）\n- コネクション型（3ウェイハンドシェイク）\n- 順序保証・再送制御・フロー制御あり\n- 用途: HTTP/HTTPS, FTP, SSH, SMTP\n\n# UDP（速度重視）\n- コネクションレス型\n- 順序保証なし・再送なし\n- 用途: DNS, DHCP, ビデオストリーミング, VoIP",
        note: "ポート番号: HTTP=80, HTTPS=443, SSH=22, FTP=21, DNS=53",
      },
      {
        title: "イーサネットフレームの構造",
        content: "L2（データリンク層）で使われるイーサネットフレームの構造です。",
        code: "# イーサネット II フレーム\n┌──────────┬──────────┬──────┬──────────────┬─────┐\n│宛先MAC   │送信元MAC │Type  │データ        │FCS  │\n│6バイト   │6バイト   │2バイト│46-1500バイト│4バイト│\n└──────────┴──────────┴──────┴──────────────┴─────┘\n\n# MACアドレスの確認\n# Windows: ipconfig /all\n# Linux:   ip link show",
        note: "MACアドレスは 48ビット（6バイト）。前半3バイトがベンダーID（OUI）です。",
      },
    ],
  },
  "ip-addressing": {
    title: "IPアドレッシングとサブネッティング",
    level: "初級",
    levelColor: "#58a6ff",
    duration: "40分",
    tags: ["IPv4", "サブネット", "CIDR"],
    steps: [
      {
        title: "IPv4 アドレスの構造",
        content:
          "IPv4 アドレスは 32ビット（4バイト）の数値で、ネットワーク部とホスト部に分かれます。",
        code: "# 192.168.1.100 の2進数表現\n192 = 11000000\n168 = 10101000\n  1 = 00000001\n100 = 01100100\n\n# サブネットマスク /24 = 255.255.255.0\n# ネットワーク部 (24ビット) | ホスト部 (8ビット)\n# 11111111.11111111.11111111.00000000",
        note: "CCNA 試験ではサブネット計算が必須スキルです。",
      },
      {
        title: "プライベートアドレス（RFC 1918）",
        content: "インターネットに直接ルーティングされないプライベートアドレス空間です。",
        code: "# プライベートアドレス範囲\nクラスA: 10.0.0.0    〜 10.255.255.255   (/8)\nクラスB: 172.16.0.0  〜 172.31.255.255   (/12)\nクラスC: 192.168.0.0 〜 192.168.255.255  (/16)\n\n# 特殊アドレス\nループバック: 127.0.0.1 (localhost)\nリンクローカル: 169.254.0.0/16 (APIPA)",
        note: "社内ネットワークでは 192.168.0.0/16 や 10.0.0.0/8 がよく使われます。",
      },
      {
        title: "CIDR とサブネット計算",
        content: "CIDR（Classless Inter-Domain Routing）の計算方法を理解しましょう。",
        code: "# /24 ネットワーク: 192.168.1.0/24\nサブネットマスク: 255.255.255.0\nネットワークアドレス: 192.168.1.0\nブロードキャスト:     192.168.1.255\n有効ホスト数: 2^8 - 2 = 254\nホスト範囲: 192.168.1.1 〜 192.168.1.254\n\n# /26 サブネット（256アドレスを4分割）\nサブネットマスク: 255.255.255.192\n有効ホスト数: 2^6 - 2 = 62\nサブネット0: 192.168.1.0/26   (1〜62)\nサブネット1: 192.168.1.64/26  (65〜126)\nサブネット2: 192.168.1.128/26 (129〜190)\nサブネット3: 192.168.1.192/26 (193〜254)",
        note: "有効ホスト数 = 2^(ホストビット数) - 2（ネットワーク・ブロードキャストを除く）",
      },
      {
        title: "よく使うプレフィックス長の早見表",
        content: "試験でよく出るサブネット値を覚えておきましょう。",
        code: "/24 → 254ホスト  (マスク: 255.255.255.0)\n/25 → 126ホスト  (マスク: 255.255.255.128)\n/26 →  62ホスト  (マスク: 255.255.255.192)\n/27 →  30ホスト  (マスク: 255.255.255.224)\n/28 →  14ホスト  (マスク: 255.255.255.240)\n/29 →   6ホスト  (マスク: 255.255.255.248)\n/30 →   2ホスト  (マスク: 255.255.255.252)  ← WAN リンク用",
        note: "/30 は P2P リンクによく使います。/31 は RFC 3021 で P2P に使用可能。",
      },
    ],
  },
  "routing": {
    title: "ルーティングの基礎",
    level: "初級",
    levelColor: "#58a6ff",
    duration: "50分",
    tags: ["OSPF", "EIGRP", "スタティック"],
    steps: [
      {
        title: "ルーティングテーブルの見方",
        content: "ルーターはルーティングテーブルを参照してパケットを転送します。",
        code: "Router# show ip route\n\nCodes: C - connected, S - static, R - RIP,\n       O - OSPF, B - BGP, E - EIGRP\n\n     10.0.0.0/8 is variably subnetted\nC       10.0.0.0/24 is directly connected, GigabitEthernet0/0\nO       10.0.1.0/24 [110/2] via 10.0.0.1, GigabitEthernet0/0\nS*      0.0.0.0/0 [1/0] via 203.0.113.1",
        note: "[110/2] の 110 は AD（管理距離）、2 はメトリック（コスト）です。",
      },
      {
        title: "スタティックルートの設定",
        content: "手動でルーティングテーブルにルートを追加します。",
        code: "Router(config)# ip route 192.168.2.0 255.255.255.0 10.0.0.1\n# ↑ 宛先ネットワーク           サブネットマスク  ネクストホップ\n\n# デフォルトルート（最後の手段）\nRouter(config)# ip route 0.0.0.0 0.0.0.0 203.0.113.1\n\n# 確認\nRouter# show ip route static",
        note: "スタティックルートは管理距離=1（Connected=0の次に優先）です。",
      },
      {
        title: "OSPF の設定と確認",
        content: "リンクステート型のルーティングプロトコル OSPF を設定します。",
        code: "Router(config)# router ospf 1\nRouter(config-router)# network 10.0.0.0 0.0.0.255 area 0\nRouter(config-router)# network 10.0.1.0 0.0.0.255 area 0\n\n# 確認コマンド\nRouter# show ip ospf neighbor      # ネイバー関係確認\nRouter# show ip ospf interface     # インターフェース状態\nRouter# show ip route ospf         # OSPF ルートのみ表示",
        note: "OSPF のデフォルト AD は 110。エリア 0（バックボーン）が必須です。",
      },
      {
        title: "管理距離（AD）の早見表",
        content: "複数のルーティングソースがある場合、AD が小さいほど優先されます。",
        code: "# 管理距離（Administrative Distance）\nConnected (直結)     :   0\nStatic (スタティック) :   1\nEBGP                 :  20\nEIGRP (内部)          :  90\nOSPF                 : 110\nIS-IS                : 115\nRIP                  : 120\nEIGRP (外部)          : 170\niBGP                 : 200",
        note: "AD が小さいルートが優先されます。同じ AD なら メトリックで比較。",
      },
    ],
  },
  "switching": {
    title: "スイッチングとVLAN",
    level: "中級",
    levelColor: "#e3b341",
    duration: "45分",
    tags: ["VLAN", "STP", "802.1Q"],
    steps: [
      {
        title: "VLAN の基礎",
        content:
          "VLAN（Virtual LAN）は物理ネットワークを論理的に分割し、ブロードキャストドメインを制限します。",
        code: "Switch# show vlan brief\n\nVLAN Name         Status    Ports\n---- ------------ --------- --------\n1    default      active    Gi0/0, Gi0/1\n10   Sales        active    Gi0/2, Gi0/3\n20   Engineering  active    Gi0/4, Gi0/5\n\n# VLAN の作成と名前付け\nSwitch(config)# vlan 10\nSwitch(config-vlan)# name Sales",
        note: "VLAN 1 はデフォルト VLAN で削除不可。管理 VLAN には別の VLAN を使うのが推奨。",
      },
      {
        title: "アクセスポートとトランクポートの設定",
        content: "スイッチポートのモードを設定します。",
        code: "# アクセスポート（エンドデバイス接続用）\nSwitch(config)# interface GigabitEthernet0/1\nSwitch(config-if)# switchport mode access\nSwitch(config-if)# switchport access vlan 10\n\n# トランクポート（スイッチ間接続）\nSwitch(config)# interface GigabitEthernet0/0\nSwitch(config-if)# switchport mode trunk\nSwitch(config-if)# switchport trunk allowed vlan 10,20",
        note: "トランクポートは 802.1Q タグで複数 VLAN を1本のリンクで通します。",
      },
      {
        title: "STP（スパニングツリープロトコル）",
        content:
          "STP はスイッチングループを防止し、冗長リンクの場合に論理的な木構造を形成します。",
        code: "# STP の確認\nSwitch# show spanning-tree vlan 10\n\n# ポートの状態\n# Blocking: 非転送（ループ防止）\n# Listening: BPDUを聞く\n# Learning: MACアドレスを学習\n# Forwarding: 通常転送\n# Disabled: 無効\n\n# ルートブリッジの確認\nSwitch# show spanning-tree vlan 10 | include Root",
        note: "RSTP（802.1w）は STP の高速版。CCNA では両方の理解が必要です。",
      },
    ],
  },
  "cisco-cli": {
    title: "Cisco IOS CLI 入門",
    level: "初心者",
    levelColor: "#3fb950",
    duration: "25分",
    tags: ["CLI", "IOS", "show コマンド"],
    steps: [
      {
        title: "IOS のモード構造",
        content: "Cisco IOS には階層的なモードがあります。",
        code: "# ユーザーEXECモード（読み取りのみ）\nRouter>\n\n# 特権EXECモード（全 show コマンド実行可能）\nRouter# enable\nRouter#\n\n# グローバルコンフィグモード（設定変更）\nRouter# configure terminal\nRouter(config)#\n\n# インターフェースコンフィグ\nRouter(config)# interface GigabitEthernet0/0\nRouter(config-if)#",
        note: "Ctrl+Z または `end` でグローバルコンフィグから特権EXECに戻れます。",
      },
      {
        title: "基本的な show コマンド",
        content: "ルーターやスイッチの状態を確認するコマンドです。",
        code: "show version           # IOS バージョン・ハードウェア情報\nshow running-config    # 現在の設定（RAM）\nshow startup-config    # 起動時の設定（NVRAM）\nshow ip interface brief # インターフェース一覧と状態\nshow ip route          # ルーティングテーブル\nshow arp               # ARP テーブル\nshow interfaces        # インターフェース詳細",
        note: "`show` コマンドは特権EXECモードで実行します。",
      },
      {
        title: "設定の保存と削除",
        content: "設定を保存しないと再起動時にリセットされます。",
        code: "# 設定の保存（running-config → startup-config）\nRouter# copy running-config startup-config\n# または\nRouter# write memory\n\n# 設定のリセット\nRouter# erase startup-config\nRouter# reload\n\n# 特定の設定を削除\nRouter(config)# no ip route 192.168.2.0 255.255.255.0",
        note: "本番環境では設定変更後、必ず `copy running-config startup-config` を実行。",
      },
      {
        title: "ショートカットと便利機能",
        content: "IOS CLI の効率的な操作方法です。",
        code: "# Tab キー: コマンド補完\nsh<Tab> → show\n\n# ? でヘルプ\nRouter# show ?\nRouter# show ip ?\n\n# コマンド短縮形\nRouter# sh ip int br   → show ip interface brief\nRouter# conf t         → configure terminal\n\n# Ctrl+A: 行頭  Ctrl+E: 行末\n# Ctrl+P または ↑: コマンド履歴\n# no shutdown: インターフェースを有効化",
        note: "IOS はコマンドを一意に識別できる文字数まで省略できます（`sh` = `show`）。",
      },
    ],
  },
  "security": {
    title: "ネットワークセキュリティ基礎",
    level: "中級",
    levelColor: "#e3b341",
    duration: "35分",
    tags: ["ACL", "NAT", "セキュリティ"],
    steps: [
      {
        title: "ACL（アクセスコントロールリスト）の基礎",
        content: "ACL はルーターでトラフィックをフィルタリングする仕組みです。",
        code: "# 標準 ACL（送信元IPのみ制御）\nRouter(config)# access-list 10 permit 192.168.1.0 0.0.0.255\nRouter(config)# access-list 10 deny any\n\n# インターフェースに適用\nRouter(config)# interface GigabitEthernet0/1\nRouter(config-if)# ip access-group 10 in   # 入力方向\n\n# 確認\nRouter# show access-lists",
        note: "ACL の末尾には暗黙の `deny any` があります。明示的に permit しないと全拒否。",
      },
      {
        title: "拡張 ACL",
        content: "送信元・宛先 IP とプロトコル/ポートを指定したきめ細かい制御です。",
        code: "# 拡張 ACL の書式\n# access-list <番号> <permit|deny> <プロトコル> <送信元> <宛先> [ポート]\n\nRouter(config)# access-list 100 permit tcp 192.168.1.0 0.0.0.255 any eq 80\nRouter(config)# access-list 100 permit tcp 192.168.1.0 0.0.0.255 any eq 443\nRouter(config)# access-list 100 deny ip any any\n\n# 名前付き ACL（推奨）\nRouter(config)# ip access-list extended WEB_FILTER\nRouter(config-ext-nacl)# permit tcp any any eq 80\nRouter(config-ext-nacl)# permit tcp any any eq 443",
        note: "標準ACLは番号1-99、拡張ACLは100-199。名前付きACLが管理しやすい。",
      },
      {
        title: "NAT（Network Address Translation）",
        content: "プライベートアドレスをグローバルアドレスに変換します。",
        code: "# PAT（Port Address Translation / NAT Overload）の設定\n# 内部インターフェース\nRouter(config)# interface GigabitEthernet0/0\nRouter(config-if)# ip nat inside\n\n# 外部インターフェース\nRouter(config)# interface GigabitEthernet0/1\nRouter(config-if)# ip nat outside\n\n# ACL で内部ネットワークを定義\nRouter(config)# access-list 1 permit 192.168.0.0 0.0.255.255\n\n# NAT 設定\nRouter(config)# ip nat inside source list 1 interface GigabitEthernet0/1 overload\n\n# 確認\nRouter# show ip nat translations",
        note: "PAT（overload）は1つのグローバルIPで多数のホストを NAT できます。",
      },
    ],
  },
};

type Params = Promise<{ slug: string }>;

export default async function CcnaGuideDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const guide = guides[slug];

  if (!guide) {
    notFound();
  }

  return (
    <main className="relative min-h-screen px-4 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(188,140,255,0.10) 0%, transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-3xl">
        {/* パンくず */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <Link href="/" className="hover:text-[var(--foreground)] transition-colors">ホーム</Link>
          <span>/</span>
          <Link href="/ccna" className="hover:text-[var(--foreground)] transition-colors">CCNA</Link>
          <span>/</span>
          <Link href="/ccna/guide" className="hover:text-[var(--foreground)] transition-colors">ガイド</Link>
          <span>/</span>
          <span className="truncate text-[var(--foreground)]">{guide.title}</span>
        </nav>

        {/* ヘッダー */}
        <header className="mb-10">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span
              className="rounded-full border px-3 py-1 text-xs font-semibold"
              style={{ borderColor: guide.levelColor, color: guide.levelColor }}
            >
              {guide.level}
            </span>
            <span className="text-xs text-[var(--text-muted)]">⏱ {guide.duration}</span>
            <span className="text-xs text-[var(--text-muted)]">🔢 {guide.steps.length} ステップ</span>
          </div>
          <h1 className="mb-3 text-2xl font-extrabold leading-snug text-[var(--foreground)] sm:text-3xl">
            {guide.title}
          </h1>
          <div className="flex flex-wrap gap-1.5">
            {guide.tags.map((tag) => (
              <span key={tag} className="rounded bg-[var(--surface-2)] px-2 py-0.5 text-xs text-[var(--text-muted)]">
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* ステップ一覧 */}
        <div className="flex flex-col gap-8">
          {guide.steps.map((step, i) => (
            <section
              key={i}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
            >
              <div className="mb-4 flex items-center gap-3">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black text-white"
                  style={{ background: "linear-gradient(135deg, #6e40c9, #bc8cff)" }}
                >
                  {i + 1}
                </div>
                <h2 className="text-base font-bold text-[var(--foreground)]">{step.title}</h2>
              </div>

              <p className="mb-4 text-sm leading-relaxed text-[var(--text-muted)]">
                {step.content}
              </p>

              {step.code && (
                <div
                  className="mb-4 overflow-x-auto rounded-xl border border-[var(--border)]"
                  style={{ background: "#0d1117" }}
                >
                  <div className="flex items-center gap-1.5 border-b border-[var(--border)] px-4 py-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#f85149]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#e3b341]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#3fb950]" />
                    <span className="ml-2 font-mono text-xs text-[var(--text-muted)]">Cisco IOS / bash</span>
                  </div>
                  <pre className="overflow-x-auto px-4 py-4 font-mono text-sm leading-relaxed text-[var(--foreground)]">
                    <code>{step.code}</code>
                  </pre>
                </div>
              )}

              {step.note && (
                <div className="flex items-start gap-2 rounded-xl border border-[#bc8cff] bg-[rgba(188,140,255,0.08)] px-4 py-3 text-xs leading-relaxed text-[#bc8cff]">
                  <span className="shrink-0">💡</span>
                  <span>{step.note}</span>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* 完了 */}
        <div className="mt-10 rounded-2xl border border-[#bc8cff] bg-[rgba(188,140,255,0.08)] p-6 text-center">
          <p className="mb-2 text-2xl">🎉</p>
          <p className="font-bold text-[#bc8cff]">このガイドを完了しました！</p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            問題演習やシミュレーションで実力を試してみましょう。
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/ccna/quiz"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-white transition-all hover:scale-105 hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #6e40c9, #bc8cff)" }}
            >
              問題演習へ →
            </Link>
            <Link
              href="/ccna/simulation"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-6 py-3 font-semibold text-[var(--foreground)] transition-all hover:scale-105"
            >
              シミュレーションへ →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export function generateStaticParams() {
  return Object.keys(guides).map((slug) => ({ slug }));
}
