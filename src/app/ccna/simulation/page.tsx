"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { submitAnswer } from "@/lib/submitAnswer";

// ─── Cisco IOS CLI シミュレーター ─────────────────────────
const CLI_QUESTIONS = [
  {
    id: "cli-1",
    category: "CLI シミュレーション",
    title: "特権EXECモードへの移行",
    description: "ユーザーEXECモードから特権EXECモード（enable mode）に切り替えてください。",
    initialPrompt: "Router>",
    steps: [
      { input: "enable", response: "Router#", hint: "EXECモードに入るコマンドは `enable` です" },
    ],
    explanation: "`enable` コマンドで特権EXECモードに入ります。プロンプトが > から # に変わります。`disable` で戻ることができます。",
  },
  {
    id: "cli-2",
    category: "CLI シミュレーション",
    title: "ホスト名の設定",
    description: "グローバルコンフィグレーションモードに入り、ルーターのホスト名を「Core-Router」に設定してください。",
    initialPrompt: "Router#",
    steps: [
      { input: "configure terminal", response: "Router(config)#", hint: "`configure terminal` でコンフィグモードに入ります" },
      { input: "hostname Core-Router", response: "Core-Router(config)#", hint: "`hostname <名前>` でホスト名を設定します" },
    ],
    explanation: "`configure terminal`（略: `conf t`）でグローバルコンフィグモードに入り、`hostname` コマンドでデバイス名を設定します。",
  },
  {
    id: "cli-3",
    category: "CLI シミュレーション",
    title: "インターフェースへのIPアドレス設定と有効化",
    description: "GigabitEthernet 0/0 に IPアドレス 192.168.1.254/24 を設定し、ポートを有効化（no shutdown）してください。",
    initialPrompt: "Core-Router(config)#",
    steps: [
      { input: "interface GigabitEthernet 0/0", response: "Core-Router(config-if)#", hint: "`interface GigabitEthernet 0/0` (または `int g0/0`)" },
      { input: "ip address 192.168.1.254 255.255.255.0", response: "Core-Router(config-if)#", hint: "`ip address <IP> <サブネットマスク>` を設定" },
      { input: "no shutdown", response: "%LINK-5-CHANGED: Interface GigabitEthernet0/0, changed state to up\nCore-Router(config-if)#", hint: "`no shutdown` でインターフェースを有効化します" },
    ],
    explanation: "Ciscoルーターのインターフェースはデフォルトで無効（shutdown）のため、IP設定後に必ず `no shutdown` で有効化する必要があります。",
  },
  {
    id: "cli-4",
    category: "CLI シミュレーション",
    title: "VLANの作成と名前設定",
    description: "VLAN 10 を作成し、VLAN 名を「Sales」に設定してください。",
    initialPrompt: "Switch(config)#",
    steps: [
      { input: "vlan 10", response: "Switch(config-vlan)#", hint: "`vlan <番号>` で VLAN コンフィグモードに入ります" },
      { input: "name Sales", response: "Switch(config-vlan)#", hint: "`name <名称>` で VLAN に名前をつけます" },
    ],
    explanation: "スイッチ上で VLAN を新規作成するにはグローバルコンフィグモードから `vlan <ID>` を実行し、`name` で管理名称を設定します。",
  },
  {
    id: "cli-5",
    category: "CLI シミュレーション",
    title: "アクセスポートのVLAN設定",
    description: "インターフェース FastEthernet 0/1 をアクセスモードにし、VLAN 10 を割り当ててください。",
    initialPrompt: "Switch(config)#",
    steps: [
      { input: "interface FastEthernet 0/1", response: "Switch(config-if)#", hint: "`interface FastEthernet 0/1` (または `int f0/1`)" },
      { input: "switchport mode access", response: "Switch(config-if)#", hint: "ポートをアクセスモードにします (`switchport mode access`)" },
      { input: "switchport access vlan 10", response: "Switch(config-if)#", hint: "VLAN 10 を割り当てます (`switchport access vlan 10`)" },
    ],
    explanation: "端末を接続するポートは `switchport mode access` を設定した上で `switchport access vlan <ID>` で対応 VLAN に所属させます。",
  },
  {
    id: "cli-6",
    category: "CLI シミュレーション",
    title: "802.1Q トランクポートの設定",
    description: "GigabitEthernet 0/1 をトランクモードに設定し、許可する VLAN を 10 と 20 に制限してください。",
    initialPrompt: "Switch(config)#",
    steps: [
      { input: "interface GigabitEthernet 0/1", response: "Switch(config-if)#", hint: "`interface GigabitEthernet 0/1` (または `int g0/1`)" },
      { input: "switchport mode trunk", response: "Switch(config-if)#", hint: "トランクモードにします (`switchport mode trunk`)" },
      { input: "switchport trunk allowed vlan 10,20", response: "Switch(config-if)#", hint: "`switchport trunk allowed vlan 10,20` で許可VLANを指定します" },
    ],
    explanation: "スイッチ間やルーター間を接続するポートには `switchport mode trunk` を設定し、不必要な VLAN のトラフィックが流れないよう制限します。",
  },
  {
    id: "cli-7",
    category: "CLI シミュレーション",
    title: "OSPF ルーティングプロセスの設定",
    description: "OSPF プロセス ID 1 を起動し、ネットワーク 192.168.1.0/24 (ワイルドカード 0.0.0.255) をエリア 0 に所属させて広告してください。",
    initialPrompt: "Router(config)#",
    steps: [
      { input: "router ospf 1", response: "Router(config-router)#", hint: "`router ospf <プロセスID>` で OSPF 設定モードに入ります" },
      { input: "network 192.168.1.0 0.0.0.255 area 0", response: "Router(config-router)#", hint: "`network <アドレス> <ワイルドカードマスク> area <エリア番号>`" },
    ],
    explanation: "OSPFでは、サブネットマスクの反転であるワイルドカードマスク (例: /24 なら 0.0.0.255) を使って広告するインターフェース範囲を指定します。",
  },
  {
    id: "cli-8",
    category: "CLI シミュレーション",
    title: "デフォルト静的ルート (Default Static Route) の設定",
    description: "全ての未知宛先トラフィックを次ホップ 203.0.113.1 へ転送するデフォルトルートを設定してください。",
    initialPrompt: "Router(config)#",
    steps: [
      { input: "ip route 0.0.0.0 0.0.0.0 203.0.113.1", response: "Router(config)#", hint: "`ip route 0.0.0.0 0.0.0.0 <ネクストホップIP>` を入力します" },
    ],
    explanation: "宛先IP 0.0.0.0、サブネットマスク 0.0.0.0 を指定するスタティックルートはデフォルトルートと呼ばれ、インターネット境界ルーターで必須の設定です。",
  },
  {
    id: "cli-9",
    category: "CLI シミュレーション",
    title: "SSH アクセスのためのドメイン名と鍵生成",
    description: "ドメイン名を「cisco.local」に設定し、1024ビットの RSA 暗号鍵を生成してください。",
    initialPrompt: "Router(config)#",
    steps: [
      { input: "ip domain-name cisco.local", response: "Router(config)#", hint: "`ip domain-name <ドメイン名>` でドメインを設定します" },
      { input: "crypto key generate rsa", response: "How many bits in the modulus [512]: 1024\n% Generating 1024 bit RSA keys, keys will be non-exportable...\nRouter(config)#", hint: "`crypto key generate rsa` で SSH 用の鍵を生成します" },
    ],
    explanation: "Cisco デバイスでセキュアな SSH サーバを有効化するには、ホスト名とドメイン名の設定を行った後に RSA 鍵対を作成します。",
  },
  {
    id: "cli-10",
    category: "CLI シミュレーション",
    title: "コンソール回線のパスワード認証設定",
    description: "コンソールポート (line console 0) にパスワード「cisco」を設定し、ログイン認証を有効化してください。",
    initialPrompt: "Router(config)#",
    steps: [
      { input: "line console 0", response: "Router(config-line)#", hint: "`line console 0` (または `line con 0`) で回線モードに入ります" },
      { input: "password cisco", response: "Router(config-line)#", hint: "`password <パスワード文字列>` を設定します" },
      { input: "login", response: "Router(config-line)#", hint: "`login` コマンドで認証を有効化します" },
    ],
    explanation: "物理コンソール接続にセキュリティをかけるため、`password` を設定した上で必ず `login` コマンドを実行して有効化します。",
  },
  {
    id: "cli-11",
    category: "CLI シミュレーション",
    title: "VTY回線 (Telnet/SSH) のパスワード設定",
    description: "VTY回線 (line vty 0 4) にパスワード「cisco」を設定し、ログイン認証を有効化してください。",
    initialPrompt: "Router(config)#",
    steps: [
      { input: "line vty 0 4", response: "Router(config-line)#", hint: "`line vty 0 4` で仮想端末回線モードに入ります" },
      { input: "password cisco", response: "Router(config-line)#", hint: "`password <パスワード>` を設定します" },
      { input: "login", response: "Router(config-line)#", hint: "`login` でリモート接続時の認証を有効化します" },
    ],
    explanation: "Telnet や SSH などのリモートアクセスを行うために、line vty 0 4 に対してパスワードとログイン認証を設定します。",
  },
  {
    id: "cli-12",
    category: "CLI シミュレーション",
    title: "特権EXECモードの暗号化パスワード設定",
    description: "特権EXECモードへの移行に用いる暗号化パスワードとして「cisco123」を設定してください。",
    initialPrompt: "Router(config)#",
    steps: [
      { input: "enable secret cisco123", response: "Router(config)#", hint: "`enable secret <パスワード>` でMD5暗号化パスワードを設定します" },
    ],
    explanation: "`enable secret` はパスワードを暗号化して保存するため、プレーンテキストの `enable password` より推奨されます。",
  },
  {
    id: "cli-13",
    category: "CLI シミュレーション",
    title: "全プレーンテキストパスワードの暗号化",
    description: "設定ファイル内の平文パスワードを一括して暗号化するサービスを有効化してください。",
    initialPrompt: "Router(config)#",
    steps: [
      { input: "service password-encryption", response: "Router(config)#", hint: "`service password-encryption` を実行します" },
    ],
    explanation: "`service password-encryption` を有効にすると、コンソールパスワードなどが設定ファイル（running-config）上で弱い暗号化（Type 7）によって保護されます。",
  },
  {
    id: "cli-14",
    category: "CLI シミュレーション",
    title: "RIP ルーティングの設定 (v2)",
    description: "RIPルーティングプロトコルを起動し、バージョン2への変更およびネットワーク 10.0.0.0 を宣言してください。",
    initialPrompt: "Router(config)#",
    steps: [
      { input: "router rip", response: "Router(config-router)#", hint: "`router rip` でルーティング設定モードに入ります" },
      { input: "version 2", response: "Router(config-router)#", hint: "`version 2` でクラスレスルーティングに変更します" },
      { input: "no auto-summary", response: "Router(config-router)#", hint: "`no auto-summary` で自動集約を無効化します" },
      { input: "network 10.0.0.0", response: "Router(config-router)#", hint: "`network 10.0.0.0` で対象ネットワークを宣言します" },
    ],
    explanation: "RIPv2 ではサブネット情報をアドバタイズするため、`version 2` とともに `no auto-summary` で自動集約を無効にする設定が標準的です。",
  },
  {
    id: "cli-15",
    category: "CLI シミュレーション",
    title: "標準アクセス制御リスト (ACL) の作成と適用",
    description: "ホスト 192.168.1.100 の通信のみを拒否し、他を許可する標準ACL番号 10 を作成して、g0/0 の受信方向に適用してください。",
    initialPrompt: "Router(config)#",
    steps: [
      { input: "access-list 10 deny 192.168.1.100", response: "Router(config)#", hint: "`access-list 10 deny <IP>` で特定ホストを拒否します" },
      { input: "access-list 10 permit any", response: "Router(config)#", hint: "`access-list 10 permit any` で残りを許可します" },
      { input: "interface g0/0", response: "Router(config-if)#", hint: "`interface g0/0` でインターフェースモードへ" },
      { input: "ip access-group 10 in", response: "Router(config-if)#", hint: "`ip access-group 10 in` で受信方向に適用します" },
    ],
    explanation: "ACL は末尾に暗黙の Deny Any があるため、特定の通信を拒否する場合は必ずあとに permit any を記述する必要があります。",
  },
  {
    id: "cli-16",
    category: "CLI シミュレーション",
    title: "PAT (IPマスカレード / overload) の設定",
    description: "アクセスリスト 1 で許可された内部ホストの通信を、インターフェース g0/1 の IP を使って PAT (overload) 変換してください。",
    initialPrompt: "Router(config)#",
    steps: [
      { input: "ip nat inside source list 1 interface g0/1 overload", response: "Router(config)#", hint: "`ip nat inside source list 1 interface g0/1 overload`" },
    ],
    explanation: "`overload` キーワードを指定することで、複数の内部 IP アドレスを 1 つのグローバル IP アドレス（ポート番号で識別）に変換する PAT が機能します。",
  },
  {
    id: "cli-17",
    category: "CLI シミュレーション",
    title: "DHCP サーバープールの作成",
    description: "DHCPプール「LAN-POOL」を作成し、ネットワーク 192.168.1.0/24 とデフォルトゲートウェイ 192.168.1.1 を指定してください。",
    initialPrompt: "Router(config)#",
    steps: [
      { input: "ip dhcp pool LAN-POOL", response: "Router(dhcp-config)#", hint: "`ip dhcp pool <名前>` でプール作成モードに入ります" },
      { input: "network 192.168.1.0 255.255.255.0", response: "Router(dhcp-config)#", hint: "`network <アドレス> <マスク>` で配布帯域を設定します" },
      { input: "default-router 192.168.1.1", response: "Router(dhcp-config)#", hint: "`default-router <IP>` でゲートウェイを設定します" },
    ],
    explanation: "Cisco ルーターを DHCP サーバーとして動作させるには、プールを作成してネットワーク帯域とデフォルトルーターなどを設定します。",
  },
  {
    id: "cli-18",
    category: "CLI シミュレーション",
    title: "PortFast と BPDU Guard の設定",
    description: "インターフェース FastEthernet0/1 に Spanning-Tree PortFast と BPDU Guard を有効化してください。",
    initialPrompt: "Switch(config)#",
    steps: [
      { input: "interface f0/1", response: "Switch(config-if)#", hint: "`interface f0/1` でインターフェースモードへ" },
      { input: "spanning-tree portfast", response: "%Portfast has been configured on FastEthernet0/1\nSwitch(config-if)#", hint: "`spanning-tree portfast` で PortFast を有効化します" },
      { input: "spanning-tree bpduguard enable", response: "Switch(config-if)#", hint: "`spanning-tree bpduguard enable` を実行します" },
    ],
    explanation: "PCやサーバーを接続するアクセスポートで PortFast を有効にすると転送状態への遷移が高速化し、BPDU Guard により不正なスイッチ接続を防止できます。",
  },
  {
    id: "cli-19",
    category: "CLI シミュレーション",
    title: "EtherChannel (LACP) の設定",
    description: "インターフェース範囲 g0/1-2 を選択し、LACP モードでチャネルグループ 1 に参加 (active) させてください。",
    initialPrompt: "Switch(config)#",
    steps: [
      { input: "interface range g0/1 - 2", response: "Switch(config-if-range)#", hint: "`interface range g0/1 - 2` で複数ポートを選択します" },
      { input: "channel-group 1 mode active", response: "Creating a port-channel interface Port-channel 1\nSwitch(config-if-range)#", hint: "`channel-group 1 mode active` で LACP モードを開始します" },
    ],
    explanation: "LACP (IEEE 802.3ad) で EtherChannel を構成する場合、少なくもと片側のモードを `active` に設定してネゴシエーションを行います。",
  },
  {
    id: "cli-20",
    category: "CLI シミュレーション",
    title: "NTP サーバーの同期設定",
    description: "IP アドレス 203.0.113.123 をタイムサーバー (NTPサーバー) として参照するよう設定してください。",
    initialPrompt: "Router(config)#",
    steps: [
      { input: "ntp server 203.0.113.123", response: "Router(config)#", hint: "`ntp server <IPアドレス>` を設定します" },
    ],
    explanation: "ネットワーク内の各デバイスのログ時刻を正確に一致させるため、`ntp server` コマンドで共通のタイムサーバーと同期します。",
  },
];

// ─── ドラッグ&ドロップ問題（全20問） ────────────────────────────────
const DND_QUESTIONS = [
  {
    id: "dnd-1",
    category: "ドラッグ&ドロップ",
    title: "OSI レイヤーとプロトコルのマッチング",
    description: "各プロトコル/技術を対応する OSI レイヤーにドラッグしてください。",
    items: [
      { id: "ip", label: "IP (Internet Protocol)", correctLayer: 3 },
      { id: "tcp", label: "TCP / UDP", correctLayer: 4 },
      { id: "ethernet", label: "Ethernet / MAC", correctLayer: 2 },
      { id: "http", label: "HTTP / HTTPS", correctLayer: 7 },
      { id: "physical", label: "光ファイバー / UTP", correctLayer: 1 },
      { id: "icmp", label: "ICMP / OSPF", correctLayer: 3 },
    ],
    layers: [1, 2, 3, 4, 7],
    layerNames: {
      1: "物理層 (L1)",
      2: "データリンク層 (L2)",
      3: "ネットワーク層 (L3)",
      4: "トランスポート層 (L4)",
      7: "アプリケーション層 (L7)",
    },
  },
  {
    id: "dnd-2",
    category: "ドラッグ&ドロップ",
    title: "著名ポート番号とサービス名のマッチング",
    description: "各プロトコル・サービスを正しい TCP/UDP ポート番号に分類してください。",
    items: [
      { id: "port-80", label: "HTTP (非暗号化 Web)", correctLayer: 80 },
      { id: "port-443", label: "HTTPS (セキュア Web)", correctLayer: 443 },
      { id: "port-22", label: "SSH / SFTP (暗号化ログイン)", correctLayer: 22 },
      { id: "port-53", label: "DNS (名前解決)", correctLayer: 53 },
      { id: "port-23", label: "Telnet (非暗号化ログイン)", correctLayer: 23 },
      { id: "port-67", label: "DHCP サーバー", correctLayer: 67 },
    ],
    layers: [22, 23, 53, 67, 80, 443],
    layerNames: {
      22: "ポート 22",
      23: "ポート 23",
      53: "ポート 53",
      67: "ポート 67",
      80: "ポート 80",
      443: "ポート 443",
    },
  },
  {
    id: "dnd-3",
    category: "ドラッグ&ドロップ",
    title: "OSPF ネイバー関係の確立ステート",
    description: "OSPF ルーターが隣接関係を結ぶ各状態を、進行する順序段階に正しく当てはめてください。",
    items: [
      { id: "ospf-1", label: "Down (helloパケット未受信)", correctLayer: 1 },
      { id: "ospf-2", label: "Init (hello受信 / 自IP未記載)", correctLayer: 2 },
      { id: "ospf-3", label: "2-Way (双方向通信 / DR選出)", correctLayer: 3 },
      { id: "ospf-4", label: "ExStart (マスター/スレーブ決定)", correctLayer: 4 },
      { id: "ospf-5", label: "Exchange (DBD要約情報の交換)", correctLayer: 5 },
      { id: "ospf-6", label: "Full (ルーティング情報同期完了)", correctLayer: 6 },
    ],
    layers: [1, 2, 3, 4, 5, 6],
    layerNames: {
      1: "1. Down ステート",
      2: "2. Init ステート",
      3: "3. 2-Way ステート",
      4: "4. ExStart ステート",
      5: "5. Exchange ステート",
      6: "6. Full (完全同期)",
    },
  },
  {
    id: "dnd-4",
    category: "ドラッグ&ドロップ",
    title: "Syslog ログレベルの数値と重要度分類",
    description: "Syslog のメッセージレベル（0〜7）と対応する意味・重要度を一致させてください。",
    items: [
      { id: "sys-0", label: "Emergency (システム起動不能)", correctLayer: 0 },
      { id: "sys-1", label: "Alert (即時対応が必要)", correctLayer: 1 },
      { id: "sys-2", label: "Critical (重大なエラー)", correctLayer: 2 },
      { id: "sys-3", label: "Error (通常のエラー条件)", correctLayer: 3 },
      { id: "sys-4", label: "Warning (警告条件)", correctLayer: 4 },
      { id: "sys-6", label: "Informational (通常情報)", correctLayer: 6 },
    ],
    layers: [0, 1, 2, 3, 4, 6],
    layerNames: {
      0: "レベル 0 (Emerg)",
      1: "レベル 1 (Alert)",
      2: "レベル 2 (Crit)",
      3: "レベル 3 (Err)",
      4: "レベル 4 (Warn)",
      6: "レベル 6 (Info)",
    },
  },
  {
    id: "dnd-5",
    category: "ドラッグ&ドロップ",
    title: "IPv6 アドレスプレフィックス分類",
    description: "各種 IPv6 アドレスの特徴と対応するプレフィックスにドラッグして分類してください。",
    items: [
      { id: "ip6-1", label: "グローバルユニキャストアドレス", correctLayer: 1 },
      { id: "ip6-2", label: "リンクローカルアドレス", correctLayer: 2 },
      { id: "ip6-3", label: "マルチキャストアドレス", correctLayer: 3 },
      { id: "ip6-4", label: "ループバック（自分自身）", correctLayer: 4 },
    ],
    layers: [1, 2, 3, 4],
    layerNames: {
      1: "2000:: / 3 (Global)",
      2: "fe80:: / 10 (Link-Local)",
      3: "ff00:: / 8 (Multicast)",
      4: "::1 / 128 (Loopback)",
    },
  },
  {
    id: "dnd-6",
    category: "ドラッグ&ドロップ",
    title: "STP (Spanning Tree Protocol) ポート状態",
    description: "STP ポートの各ステートとそれぞれの動作特徴・フレーム転送有無を一致させてください。",
    items: [
      { id: "stp-1", label: "Blocking (フレーム転送・学習なし / BPDU受信のみ)", correctLayer: 1 },
      { id: "stp-2", label: "Listening (BPDU送受信によるポート役割決定)", correctLayer: 2 },
      { id: "stp-3", label: "Learning (MACアドレス学習を開始 / 転送なし)", correctLayer: 3 },
      { id: "stp-4", label: "Forwarding (データ転送とMAC学習を両方実施)", correctLayer: 4 },
    ],
    layers: [1, 2, 3, 4],
    layerNames: {
      1: "Blocking ステート",
      2: "Listening ステート",
      3: "Learning ステート",
      4: "Forwarding ステート",
    },
  },
  {
    id: "dnd-7",
    category: "ドラッグ&ドロップ",
    title: "LANスイッチのフレーム転送（スイッチング）方式",
    description: "スイッチがフレームを中継する方式を特徴に合わせて分類してください。",
    items: [
      { id: "sw-1", label: "全フレームを受信・FCSエラーチェック後に転送", correctLayer: 1 },
      { id: "sw-2", label: "先頭6バイト(宛先MAC)を読んだ瞬間に転送開始 (最速)", correctLayer: 2 },
      { id: "sw-3", label: "先頭64バイトを読んで衝突エラー発生を回避して転送", correctLayer: 3 },
    ],
    layers: [1, 2, 3],
    layerNames: {
      1: "ストア＆フォワード",
      2: "カットスルー (Fast)",
      3: "フラグメントフリー",
    },
  },
  {
    id: "dnd-8",
    category: "ドラッグ&ドロップ",
    title: "ワイヤレスアクセスポイント (AP) アーキテクチャ",
    description: "無線 LAN アクセスポイントの各種タイプと制御形態を一致させてください。",
    items: [
      { id: "ap-1", label: "単体で認証・管理・設定を行う独立型 AP", correctLayer: 1 },
      { id: "ap-2", label: "WLC (コントローラー) からの一元制御を受ける AP", correctLayer: 2 },
      { id: "ap-3", label: "無線LAN全体の電波調整や設定を一元管理する頭脳", correctLayer: 3 },
    ],
    layers: [1, 2, 3],
    layerNames: {
      1: "自律型 (Autonomous AP)",
      2: "軽量型 (Lightweight AP)",
      3: "WLC (コントローラー)",
    },
  },
  {
    id: "dnd-9",
    category: "ドラッグ&ドロップ",
    title: "ネットワークセキュリティ脅威の分類",
    description: "各攻撃手法・脅威の名称を正しい説明文と対応させてください。",
    items: [
      { id: "sec-1", label: "偽サイトやメールで認証情報・個人情報を詐取する攻撃", correctLayer: 1 },
      { id: "sec-2", label: "大量トラフィックを送りつけサービスを停止させる攻撃", correctLayer: 2 },
      { id: "sec-3", label: "通信の途中に割り込んでデータを盗聴・改ざんする攻撃", correctLayer: 3 },
      { id: "sec-4", label: "単語リストを自動入力してパスワードを破る攻撃", correctLayer: 4 },
    ],
    layers: [1, 2, 3, 4],
    layerNames: {
      1: "フィッシング (Phishing)",
      2: "DoS / DDoS 攻撃",
      3: "中間者攻撃 (MITM)",
      4: "辞書攻撃",
    },
  },
  {
    id: "dnd-10",
    category: "ドラッグ&ドロップ",
    title: "NAT / PAT (ネットワークアドレス変換) の種類",
    description: "各種アドレス変換技術とそれぞれの変換対応表モデルを一致させてください。",
    items: [
      { id: "nat-1", label: "プライベートIPとグローバルIPを 1:1 で固定変換", correctLayer: 1 },
      { id: "nat-2", label: "用意されたグローバルIPプールから動的に 1:1 変換", correctLayer: 2 },
      { id: "nat-3", label: "ポート番号を用いて複数のプライベートIPを 1つに多重化 (1:N)", correctLayer: 3 },
    ],
    layers: [1, 2, 3],
    layerNames: {
      1: "スタティック NAT",
      2: "ダイナミック NAT",
      3: "PAT / NAPT (IPマスカレード)",
    },
  },
  {
    id: "dnd-11",
    category: "ドラッグ&ドロップ",
    title: "ルーティングプロトコルの AD値 (信頼度)",
    description: "各ルーティング情報源と Cisco 機器のデフォルト AD (Administrative Distance) 値をマッチングしてください。",
    items: [
      { id: "ad-0", label: "直接接続インターフェース (Connected)", correctLayer: 0 },
      { id: "ad-1", label: "スタティックルート (Static)", correctLayer: 1 },
      { id: "ad-110", label: "OSPF", correctLayer: 110 },
      { id: "ad-120", label: "RIP (Routing Information Protocol)", correctLayer: 120 },
    ],
    layers: [0, 1, 110, 120],
    layerNames: {
      0: "AD = 0 (最高信頼)",
      1: "AD = 1",
      110: "AD = 110",
      120: "AD = 120",
    },
  },
  {
    id: "dnd-12",
    category: "ドラッグ&ドロップ",
    title: "QoS (Quality of Service) サービスモデル",
    description: "通信品質制御を行う各モデルの特徴を分類してください。",
    items: [
      { id: "qos-1", label: "特別な制御を行わず、届いた順にパケットを処理", correctLayer: 1 },
      { id: "qos-2", label: "通信開始前にアプリ間でエンドツーエンドの帯域予約を行う", correctLayer: 2 },
      { id: "qos-3", label: "パケットに優先度マーク (DSCP) を付け、クラス毎に制御", correctLayer: 3 },
    ],
    layers: [1, 2, 3],
    layerNames: {
      1: "Best Effort (ベストエフォート)",
      2: "IntServ (統合サービス)",
      3: "DiffServ (差別化サービス)",
    },
  },
  {
    id: "dnd-13",
    category: "ドラッグ&ドロップ",
    title: "クラウドコンピューティング サービスモデル",
    description: "クラウドで提供される各サービス形態と利用者が管理する範囲を分類してください。",
    items: [
      { id: "cld-1", label: "仮想サーバーやネットワーク等のインフラ基盤を提供", correctLayer: 1 },
      { id: "cld-2", label: "アプリ開発用の実行環境やミドルウェアまでを提供", correctLayer: 2 },
      { id: "cld-3", label: "WebメールやCRMなど完成されたアプリケーションを提供", correctLayer: 3 },
    ],
    layers: [1, 2, 3],
    layerNames: {
      1: "IaaS (Infrastructure)",
      2: "PaaS (Platform)",
      3: "SaaS (Software)",
    },
  },
  {
    id: "dnd-14",
    category: "ドラッグ&ドロップ",
    title: "SDN (Software-Defined Networking) レイヤー構造",
    description: "コントローラーベース SDN の各プレーンと役割を一致させてください。",
    items: [
      { id: "sdn-1", label: "ネットワークの要件やポリシーを指示するアプリ群", correctLayer: 1 },
      { id: "sdn-2", label: "全体の経路計算やデバイス状態を一元制御する頭脳", correctLayer: 2 },
      { id: "sdn-3", label: "物理・仮想スイッチがパケットを転送するデータ処理部", correctLayer: 3 },
    ],
    layers: [1, 2, 3],
    layerNames: {
      1: "アプリケーションプレーン",
      2: "コントロールプレーン",
      3: "データプレーン",
    },
  },
  {
    id: "dnd-15",
    category: "ドラッグ&ドロップ",
    title: "無線LAN (WLAN) セキュリティプロトコル",
    description: "各無線セキュリティ技術の仕様や暗号化アルゴリズムを一致させてください。",
    items: [
      { id: "wl-1", label: "RC4暗号を使用する古い脆弱なセキュリティ規格 (使用禁止)", correctLayer: 1 },
      { id: "wl-2", label: "AES-CCMPを使用し事前共有鍵 (PSK) で認証を行う標準規格", correctLayer: 2 },
      { id: "wl-3", label: "SAE認証と192bit暗号サポートを導入した最新セキュリティ", correctLayer: 3 },
      { id: "wl-4", label: "RADIUSサーバー連携で個人の証明書やID/PW認証を実施", correctLayer: 4 },
    ],
    layers: [1, 2, 3, 4],
    layerNames: {
      1: "WEP",
      2: "WPA2-Personal (WPA2-PSK)",
      3: "WPA3",
      4: "802.1X / Enterprise",
    },
  },
  {
    id: "dnd-16",
    category: "ドラッグ&ドロップ",
    title: "AAA ネットワークアクセス制御フレームワーク",
    description: "AAA (Authentication, Authorization, Accounting) の各機能の意味を分類してください。",
    items: [
      { id: "aaa-1", label: "「誰であるか」を証明・検証するプロセス (ID/PW等)", correctLayer: 1 },
      { id: "aaa-2", label: "ユーザーの権限や許可されるコマンド・アクセスを決定", correctLayer: 2 },
      { id: "aaa-3", label: "利用した時間や実行コマンドの操作履歴を記録・追跡", correctLayer: 3 },
    ],
    layers: [1, 2, 3],
    layerNames: {
      1: "Authentication (認証)",
      2: "Authorization (認可)",
      3: "Accounting (アカウンティング)",
    },
  },
  {
    id: "dnd-17",
    category: "ドラッグ&ドロップ",
    title: "Cisco ACL (アクセス制御リスト) の種類",
    description: "標準ACL と 拡張ACL の特徴・指定可能条件・番号範囲を分類してください。",
    items: [
      { id: "acl-1", label: "送信元 IP アドレスのみを検査条件とする (番号 1〜99)", correctLayer: 1 },
      { id: "acl-2", label: "送信元・宛先 IP、プロトコル、ポート番号まで指定可能 (番号 100〜199)", correctLayer: 2 },
      { id: "acl-3", label: "宛先デバイスにできる限り「近い」ルーターインターフェースに適用すべき", correctLayer: 1 },
      { id: "acl-4", label: "送信元デバイスにできる限り「近い」ルーターインターフェースに適用すべき", correctLayer: 2 },
    ],
    layers: [1, 2],
    layerNames: {
      1: "標準 ACL (Standard)",
      2: "拡張 ACL (Extended)",
    },
  },
  {
    id: "dnd-18",
    category: "ドラッグ&ドロップ",
    title: "DHCP アドレス自動割り当て DORA プロセス",
    description: "クライアントが DHCP サーバーから IP アドレスを取得する 4 ステップ順序に当てはめてください。",
    items: [
      { id: "dh-1", label: "Discover: クライアントがDHCPサーバーを探すブロードキャスト", correctLayer: 1 },
      { id: "dh-2", label: "Offer: サーバーが割り当て可能なIPアドレス候補を提案", correctLayer: 2 },
      { id: "dh-3", label: "Request: クライアントが提案されたIPの使用を要求", correctLayer: 3 },
      { id: "dh-4", label: "Acknowledge: サーバーが正式予約を完了し承認通知を返信", correctLayer: 4 },
    ],
    layers: [1, 2, 3, 4],
    layerNames: {
      1: "Step 1: Discover",
      2: "Step 2: Offer",
      3: "Step 3: Request",
      4: "Step 4: Acknowledge",
    },
  },
  {
    id: "dnd-19",
    category: "ドラッグ&ドロップ",
    title: "光ファイバーコネクタ＆ケーブル種別",
    description: "光ファイバー通信のコネクタタイプやモードの種類を説明とマッチングしてください。",
    items: [
      { id: "fbr-1", label: "角型プッシュプル接続で広く普及する標準コネクタ", correctLayer: 1 },
      { id: "fbr-2", label: "高密度配線に適した小型クリップ付きコネクタ (Little Connector)", correctLayer: 2 },
      { id: "fbr-3", label: "コア径が細くレーザー光で長距離通信するケーブル (黄色の外被が一般的)", correctLayer: 3 },
      { id: "fbr-4", label: "コア径が太くLED光で短〜中距離通信するケーブル (オレンジ/アクア外被)", correctLayer: 4 },
    ],
    layers: [1, 2, 3, 4],
    layerNames: {
      1: "SC コネクタ",
      2: "LC コネクタ",
      3: "シングルモード (SMF)",
      4: "マルチモード (MMF)",
    },
  },
  {
    id: "dnd-20",
    category: "ドラッグ&ドロップ",
    title: "REST API HTTP メソッドと CRUD 処理",
    description: "RESTful API で用いられる各 HTTP メソッドを対応するデータ処理アクションに分類してください。",
    items: [
      { id: "rst-1", label: "サーバーからリソースやデータを「取得 (Read)」する", correctLayer: 1 },
      { id: "rst-2", label: "サーバーに新規リソースを「作成 (Create)」する", correctLayer: 2 },
      { id: "rst-3", label: "既存のリソース全体を「更新・置換 (Update)」する", correctLayer: 3 },
      { id: "rst-4", label: "指定したリソースをサーバーから「削除 (Delete)」する", correctLayer: 4 },
    ],
    layers: [1, 2, 3, 4],
    layerNames: {
      1: "GET メソッド",
      2: "POST メソッド",
      3: "PUT メソッド",
      4: "DELETE メソッド",
    },
  },
];


// ─── トポロジー問題（構成図 ＆ S3画像対応シミュレーション） ────────
const TOPOLOGY_QUESTIONS = [
  {
    id: "topo-1",
    title: "VLAN間ルーティング構成と不具合調査 (Router-on-a-Stick)",
    description: "下記のネットワーク構成図に基づき、PC-A (VLAN 10) から PC-B (VLAN 20) へ ping が届かない原因と正しい設定を答えてください。",
    diagramType: "svg-vlan",
    options: [
      "Router-1 の G0/0.10 サブインターフェースで encapsulation dot1Q 10 が未設定である",
      "Switch-1 の G0/1 ポートが access モードになっており、trunk モードになっていない",
      "PC-A のデフォルトゲートウェイが 192.168.10.1 ではなく 192.168.20.1 になっている",
      "VLAN 20 のインターフェースで IP アドレスが重複している",
    ],
    correctIdx: 1,
    explanation:
      "VLAN間ルーティング（Router-on-a-Stick構成）において、ルーターとスイッチ間のリンク（G0/1）は複数のVLANタグを運ぶため、必ず『trunk モード（switchport mode trunk）』に設定する必要があります。",
  },
  {
    id: "topo-2",
    title: "OSPF DR/BDR 選出シミュレーション",
    description: "同一ブロードキャストドメイン内の 3台のルーター構成において、どのルーターが Designated Router (DR) に選出されますか？",
    diagramType: "svg-ospf",
    options: [
      "Router-A (Priority 1, Loopback 10.1.1.1) が DR になる",
      "Router-B (Priority 1, Loopback 10.2.2.2) が DR になる",
      "Router-C (Priority 10, Loopback 10.0.0.1) が DR になる",
      "すべてのルーターが BDR となる",
    ],
    correctIdx: 2,
    explanation:
      "OSPF の DR/BDR 選出規則では、① OSPF Priority が最大のルーター（ Router-C: Priority 10 ）が最優先で DR に選出されます。Priority が同じ場合は最大のルーターID（Loopback IP）が選出されます。",
  },
];

type SimTab = "cli" | "dnd" | "topology" | "s3view";

export default function CcnaSimulationPage() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [activeTab, setActiveTab] = useState<SimTab>("cli");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // CLI State
  const [cliQuestionIdx, setCliQuestionIdx] = useState(0);
  const [cliInput, setCliInput] = useState("");
  const [cliHistory, setCliHistory] = useState<{ prompt: string; command: string; response: string }[]>([]);
  const [cliStepIdx, setCliStepIdx] = useState(0);

  useEffect(() => {
    const checkTouch = () => {
      const isTouch =
        window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
        (window.innerWidth <= 1024 && ("ontouchstart" in window || navigator.maxTouchPoints > 0));
      setIsTouchDevice(isTouch);
      if (isTouch) {
        setActiveTab("dnd");
      }
    };
    checkTouch();
    window.addEventListener("resize", checkTouch);
    return () => window.removeEventListener("resize", checkTouch);
  }, []);

  const [cliCompleted, setCliCompleted] = useState(false);
  const [cliError, setCliError] = useState(false);
  const [showCliHint, setShowCliHint] = useState(false);

  // DnD State
  const [dndQuestionIdx, setDndQuestionIdx] = useState(0);
  const currentDndQ = DND_QUESTIONS[dndQuestionIdx] || DND_QUESTIONS[0];
  const [assignments, setAssignments] = useState<Record<string, number | null>>(() =>
    Object.fromEntries(DND_QUESTIONS[0].items.map((i) => [i.id, null]))
  );
  const [dragItem, setDragItem] = useState<string | null>(null);
  const [dndChecked, setDndChecked] = useState(false);

  const handleNextDndQ = () => {
    if (dndQuestionIdx + 1 < DND_QUESTIONS.length) {
      const nextIdx = dndQuestionIdx + 1;
      setDndQuestionIdx(nextIdx);
      setAssignments(
        Object.fromEntries(DND_QUESTIONS[nextIdx].items.map((i) => [i.id, null]))
      );
      setDndChecked(false);
      setSelectedItemId(null);
    }
  };

  const handlePrevDndQ = () => {
    if (dndQuestionIdx > 0) {
      const prevIdx = dndQuestionIdx - 1;
      setDndQuestionIdx(prevIdx);
      setAssignments(
        Object.fromEntries(DND_QUESTIONS[prevIdx].items.map((i) => [i.id, null]))
      );
      setDndChecked(false);
      setSelectedItemId(null);
    }
  };

  // Topology State
  const [topoQuestionIdx, setTopoQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [topoChecked, setTopoChecked] = useState(false);

  // S3 Image Simulation State
  const [s3ImageUrl, setS3ImageUrl] = useState<string>(
    "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80" // 初期サンプル画像（S3画像代用プレビュー）
  );
  const [customS3Input, setCustomS3Input] = useState<string>("");
  const [s3SimQuestion, setS3SimQuestion] = useState<string>(
    "S3に配置されたネットワーク構成図・システム図をもとに、構成上のボトルネックや設定内容を答えてください。"
  );
  const [s3AnswerText, setS3AnswerText] = useState<string>("");
  const [s3Submitted, setS3Submitted] = useState<boolean>(false);

  // CLI handlers
  const cliQ = CLI_QUESTIONS[cliQuestionIdx];
  const currentStep = cliQ.steps[cliStepIdx];
  const currentPrompt =
    cliStepIdx === 0
      ? cliQ.initialPrompt
      : cliQ.steps[cliStepIdx - 1].response;

  const handleCliSubmit = () => {
    if (!cliInput.trim()) return;
    const trimmed = cliInput.trim().replace(/\s+/g, " ");
    const expected = currentStep.input.replace(/\s+/g, " ");

    if (
      trimmed.toLowerCase() === expected.toLowerCase() ||
      trimmed === expected
    ) {
      const newHistory = [
        ...cliHistory,
        { prompt: currentPrompt, command: trimmed, response: currentStep.response },
      ];
      setCliHistory(newHistory);
      setCliInput("");
      setCliError(false);
      setShowCliHint(false);

      if (cliStepIdx + 1 >= cliQ.steps.length) {
        setCliCompleted(true);
        submitAnswer({
          cert: "ccna",
          questionId: cliQ.id,
          category: cliQ.category || "ルーティング",
          selectedIndex: 0,
          isCorrect: true,
        });
      } else {
        setCliStepIdx(cliStepIdx + 1);
      }
    } else {
      setCliError(true);
    }
  };

  const handleCliSkipStep = () => {
    const newHistory = [
      ...cliHistory,
      { prompt: currentPrompt, command: `(スキップ: ${currentStep.input})`, response: currentStep.response },
    ];
    setCliHistory(newHistory);
    setCliInput("");
    setCliError(false);
    setShowCliHint(false);

    if (cliStepIdx + 1 >= cliQ.steps.length) {
      setCliCompleted(true);
    } else {
      setCliStepIdx(cliStepIdx + 1);
    }
  };

  const handleNextCliQ = () => {
    if (cliQuestionIdx + 1 < CLI_QUESTIONS.length) {
      setCliQuestionIdx(cliQuestionIdx + 1);
      setCliStepIdx(0);
      setCliHistory([]);
      setCliCompleted(false);
      setCliError(false);
      setShowCliHint(false);
    }
  };

  // DnD handlers
  const handleDrop = (layer: number, itemIdToAssign?: string) => {
    const targetId = itemIdToAssign || dragItem || selectedItemId;
    if (!targetId) return;
    setAssignments((prev) => ({ ...prev, [targetId]: layer }));
    setDragItem(null);
    setSelectedItemId(null);
    setDndChecked(false);
  };

  const removeAssignment = (itemId: string) => {
    setAssignments((prev) => ({ ...prev, [itemId]: null }));
    setDndChecked(false);
    setSelectedItemId(null);
  };

  const handleDndCheck = () => {
    setDndChecked(true);
    const correctCount = currentDndQ.items.filter(
      (i) => assignments[i.id] === i.correctLayer
    ).length;
    submitAnswer({
      cert: "ccna",
      questionId: currentDndQ.id,
      category: currentDndQ.category,
      selectedIndex: correctCount,
      isCorrect: correctCount === currentDndQ.items.length,
    });
  };

  const unassigned = currentDndQ.items.filter((i) => assignments[i.id] === null);
  const dndScore = currentDndQ.items.filter(
    (i) => assignments[i.id] === i.correctLayer
  ).length;

  // Topology handlers
  const topoQ = TOPOLOGY_QUESTIONS[topoQuestionIdx];
  const handleTopoCheck = () => {
    if (selectedOption === null) return;
    setTopoChecked(true);
    submitAnswer({
      cert: "ccna",
      questionId: topoQ.id,
      category: "トポロジー演習",
      selectedIndex: selectedOption,
      isCorrect: selectedOption === topoQ.correctIdx,
    });
  };

  return (
    <main className="min-h-screen px-4 py-8 max-w-6xl mx-auto">
      {/* パンくず ＆ タイトル */}
      <nav className="mb-6 flex items-center gap-2 text-xs font-bold text-[var(--text-muted)]">
        <Link href="/" className="hover:text-[var(--foreground)] transition-colors">
          ホーム
        </Link>
        <span>/</span>
        <Link href="/ccna" className="hover:text-[var(--foreground)] transition-colors">
          CCNA
        </Link>
        <span>/</span>
        <span className="text-[var(--foreground)]">シミュレーション演習</span>
      </nav>

      <header className="mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl sm:text-3xl">💻</span>
          <h1 className="text-xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
            CCNA 実戦シミュレーション演習
          </h1>
        </div>
        <p className="mt-1 text-xs sm:text-sm text-[var(--text-muted)]">
          本番試験対応 — Cisco CLIコマンド入力 ＆ ドラッグ&ドロップ演習
        </p>
      </header>

      {/* タブナビゲーション */}
      <div className="mb-6 flex items-center gap-2 border-b border-[var(--border)] pb-2 shrink-0 overflow-x-auto">
        <button
          onClick={() => setActiveTab("cli")}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "cli"
              ? "bg-[var(--accent-primary)] text-white shadow-md"
              : "bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--foreground)]"
          }`}
        >
          <span>💻</span>
          <span>1. Cisco CLI</span>
          <span className="ml-1 rounded-md bg-[rgba(248,81,73,0.15)] px-1.5 py-0.5 text-[10px] font-extrabold text-[#f85149] border border-[#f85149]/30">
            PC専用
          </span>
        </button>
        <button
          onClick={() => {
            setActiveTab("dnd");
            setSelectedItemId(null);
          }}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "dnd"
              ? "bg-[var(--accent-primary)] text-white shadow-md"
              : "bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--foreground)]"
          }`}
        >
          <span>🖱️</span>
          <span>2. ドラッグ＆ドロップ</span>
          <span className="ml-1 rounded-md bg-[rgba(63,185,80,0.15)] px-1.5 py-0.5 text-[10px] font-extrabold text-[#3fb950] border border-[#3fb950]/30">
            スマホ・PC対応
          </span>
        </button>
      </div>

      {/* ─── 1. CLI シミュレーター ───────────────────────────── */}
      {activeTab === "cli" && (
        isTouchDevice ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-xl max-w-lg mx-auto my-6 animate-fade-in">
            <div className="mb-4 text-4xl">🖥️</div>
            <span className="inline-block rounded-full bg-[rgba(248,81,73,0.15)] px-3 py-1 text-xs font-extrabold text-[#f85149] border border-[#f85149]/30 mb-3">
              PC（デスクトップ）専用機能
            </span>
            <h2 className="mb-2 text-lg font-bold text-[var(--foreground)]">
              Cisco IOS CLI シミュレーター
            </h2>
            <p className="mb-6 text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
              コマンドライン入力（CLI）によるシミュレーター演習は、キーボードを備えたPC（デスクトップ環境）での学習に最適化されています。<br />
              スマートフォンやタブレットからは、タップ操作に対応した<strong>「2. ドラッグ＆ドロップ問題」</strong>をご利用ください！
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("dnd");
                  setSelectedItemId(null);
                }}
                className="rounded-xl bg-[var(--accent-primary)] px-6 py-3 text-xs font-bold text-white shadow-md transition-all hover:opacity-90"
              >
                🖱️ ドラッグ＆ドロップ演習を開く →
              </button>
              <Link
                href="/ccna/quiz"
                className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-6 py-3 text-xs font-bold text-[var(--foreground)] transition-all hover:bg-[var(--border)] text-center"
              >
                📝 4択・コマンド補充問題へ
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
              <div>
                <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-xs font-bold text-blue-400">
                  問題 {cliQuestionIdx + 1} / {CLI_QUESTIONS.length}
                </span>
                <h2 className="mt-2 text-lg font-bold text-[var(--foreground)]">
                  {cliQ.title}
                </h2>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  {cliQ.description}
                </p>
              </div>
              {cliCompleted && (
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
                  ✅ クリア！
                </span>
              )}
            </div>

            {/* ターミナルウィンドウ */}
            <div className="mt-6 rounded-xl overflow-hidden border border-[var(--border)] bg-[#0d1117] font-mono text-xs text-gray-200 shadow-xl">
              <div className="flex items-center justify-between bg-[#161b22] px-4 py-2 border-b border-gray-800">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-500/80" />
                  <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <span className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-[11px] text-gray-400">Cisco IOS Virtual Console</span>
              </div>

              <div className="p-4 space-y-2 min-h-[220px]">
                {cliHistory.map((h, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400 font-bold">{h.prompt}</span>
                      <span className="text-white">{h.command}</span>
                    </div>
                    {h.response && (
                      <div className="text-gray-400 whitespace-pre-wrap">{h.response}</div>
                    )}
                  </div>
                ))}

                {!cliCompleted && (
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400 font-bold">{currentPrompt}</span>
                    <input
                      type="text"
                      value={cliInput}
                      onChange={(e) => setCliInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleCliSubmit()}
                      placeholder="コマンドを入力... (Enterで実行)"
                      className="flex-1 bg-transparent text-white outline-none placeholder-gray-600 font-mono"
                      autoFocus
                    />
                  </div>
                )}
              </div>
            </div>

            {/* コントロールバー */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowCliHint(!showCliHint)}
                  className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--foreground)]"
                >
                  💡 ヒント
                </button>
                <button
                  type="button"
                  onClick={() => setCliInput(currentStep.input)}
                  className="rounded-lg border border-[var(--accent-primary)] bg-[rgba(88,166,255,0.1)] px-3 py-1.5 text-xs font-bold text-[var(--accent-primary)] hover:bg-[rgba(88,166,255,0.2)]"
                  title="正解コマンドを入力欄に自動セット"
                >
                  🔑 正解を見る ({currentStep.input})
                </button>
                {showCliHint && (
                  <span className="text-xs text-amber-400 font-bold">
                    💡 {currentStep.hint}
                  </span>
                )}
                {cliError && (
                  <span className="text-xs text-red-400 font-bold">
                    ⚠️ 異なります。ヒントや「正解を見る」を活用してください。
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleCliSubmit}
                  disabled={cliCompleted}
                  className="rounded-lg bg-[var(--accent-primary)] px-4 py-2 text-xs font-bold text-white hover:opacity-90 disabled:opacity-40"
                >
                  実行する
                </button>
                {!cliCompleted && (
                  <button
                    type="button"
                    onClick={handleCliSkipStep}
                    className="rounded-lg bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2 text-xs font-bold text-[var(--accent-purple)] hover:border-[var(--accent-purple)]"
                    title="このステップをスキップして進む"
                  >
                    ⏭️ スキップして進む
                  </button>
                )}
                {cliCompleted && cliQuestionIdx + 1 < CLI_QUESTIONS.length && (
                  <button
                    type="button"
                    onClick={handleNextCliQ}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500"
                  >
                    次の問題へ ➔
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        )
      )}

      {/* ─── 2. ドラッグ＆ドロップ ───────────────────────────── */}
      {activeTab === "dnd" && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-6 animate-fade-in">
          <div>
            <h2 className="text-lg font-bold text-[var(--foreground)]">
              {currentDndQ.title}
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {currentDndQ.description}
            </p>
          </div>

          {/* スマホ・PC両対応 操作ヒント */}
          <div className="rounded-xl border border-[rgba(88,166,255,0.3)] bg-[rgba(88,166,255,0.08)] p-3.5 flex items-start gap-3">
            <span className="text-xl shrink-0">💡</span>
            <div className="text-xs leading-relaxed">
              <p className="font-bold text-[var(--accent-primary)] mb-0.5">
                スマートフォン・PC両対応！快適な2つの操作モード
              </p>
              <p className="text-[var(--text-muted)]">
                【タップ操作（スマホ・PC推奨）】アイテムをタップして選択 ➔ 配置先のカテゴリーをタップして配置<br />
                【ドラッグ操作（PC向け）】アイテムをマウスで直接ドラッグ＆ドロップして配置
              </p>
            </div>
          </div>

          {/* ドラッグプール */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[var(--text-muted)]">
                未配置の項目 ({unassigned.length} 項目):
              </span>
              {selectedItemId && (
                <span className="text-xs font-bold text-[var(--accent-primary)] animate-pulse">
                  配置先のカテゴリーをタップしてください
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {unassigned.map((item) => {
                const isSelected = selectedItemId === item.id;
                return (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={() => {
                      setDragItem(item.id);
                      setSelectedItemId(item.id);
                    }}
                    onClick={() => setSelectedItemId(isSelected ? null : item.id)}
                    className={`cursor-pointer select-none rounded-xl border px-4 py-2.5 text-xs font-bold transition-all duration-200 ${
                      isSelected
                        ? "border-[var(--accent-primary)] bg-[rgba(88,166,255,0.2)] text-[var(--accent-primary)] ring-2 ring-[var(--accent-primary)]/50 scale-105 shadow-md"
                        : "border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:border-[var(--accent-primary)] active:scale-95"
                    }`}
                  >
                    {isSelected ? `✨ ${item.label} (選択中)` : item.label}
                  </div>
                );
              })}
              {unassigned.length === 0 && (
                <span className="text-xs text-emerald-400 font-bold">
                  ✨ すべてのアイテムがレイヤーに配置されました！
                </span>
              )}
            </div>
          </div>

          {/* レイヤーゾーン */}
          <div className="flex flex-col gap-3">
            {currentDndQ.layers.map((layer) => {
              const layerName = (currentDndQ.layerNames as unknown as Record<number, string>)[layer];
              const assignedItems = currentDndQ.items.filter((i) => assignments[i.id] === layer);
              const isCorrect = dndChecked && assignedItems.every((i) => i.correctLayer === layer);
              const hasWrong = dndChecked && assignedItems.some((i) => i.correctLayer !== layer);

              return (
                <div
                  key={layer}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(layer)}
                  onClick={() => {
                    if (selectedItemId) {
                      handleDrop(layer, selectedItemId);
                    }
                  }}
                  className={`flex flex-col sm:flex-row min-h-[64px] items-start sm:items-center gap-2 sm:gap-4 rounded-xl border p-3.5 transition-all duration-200 ${
                    selectedItemId ? "cursor-pointer ring-1 ring-[var(--accent-primary)]/40 hover:border-[var(--accent-primary)] hover:bg-[rgba(88,166,255,0.04)]" : ""
                  }`}
                  style={{
                    borderColor: hasWrong
                      ? "#f85149"
                      : isCorrect
                      ? "#3fb950"
                      : selectedItemId
                      ? "var(--accent-primary)"
                      : "var(--border)",
                    background: hasWrong
                      ? "rgba(248,81,73,0.06)"
                      : isCorrect
                      ? "rgba(63,185,80,0.06)"
                      : "var(--surface)",
                  }}
                >
                  <div className="flex items-center justify-between w-full sm:w-44 shrink-0">
                    <span className="text-xs font-extrabold text-[var(--foreground)]">
                      {layerName}
                    </span>
                    {selectedItemId && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(88,166,255,0.15)] px-2 py-0.5 text-[10px] font-bold text-[var(--accent-primary)] border border-[var(--accent-primary)]/30 animate-pulse">
                        ＋ タップして配置
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-wrap gap-2 w-full">
                    {assignedItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeAssignment(item.id);
                        }}
                        className="rounded-lg border border-[var(--accent-primary)] bg-[rgba(88,166,255,0.12)] px-3 py-1.5 text-xs font-bold text-[var(--accent-primary)] hover:bg-[rgba(248,81,73,0.15)] hover:border-[#f85149] hover:text-[#f85149] transition-colors"
                        title="タップ/クリックで取り外す"
                      >
                        {item.label} ×
                      </button>
                    ))}
                    {assignedItems.length === 0 && (
                      <span className="text-xs text-[var(--text-muted)] py-1">
                        {selectedItemId ? "✨ ここをタップしてアイテムを配置" : "ここにドロップまたはアイテム選択後にタップ"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleDndCheck}
              disabled={unassigned.length > 0}
              className="flex-1 rounded-xl py-3 font-bold text-white text-xs transition-all hover:opacity-90 disabled:opacity-40"
              style={{ background: "linear-gradient(135deg, #1d6fca, #58a6ff)" }}
            >
              {unassigned.length > 0 ? `残り ${unassigned.length} 項目` : "採点する"}
            </button>
            <button
              type="button"
              onClick={() => {
                setAssignments(Object.fromEntries(currentDndQ.items.map((i) => [i.id, null])));
                setDndChecked(false);
                setSelectedItemId(null);
              }}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--foreground)]"
            >
              リセット
            </button>
          </div>

          {dndChecked && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-center">
              <p className="text-base font-extrabold text-emerald-400">
                {dndScore === currentDndQ.items.length
                  ? "🎉 全問正解！素晴らしい！"
                  : `${dndScore} / ${currentDndQ.items.length} 項目正解！`}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ─── 3. トポロジー図解問題 (新規実装) ─────────────────── */}
      {activeTab === "topology" && (
        <div className="space-y-6 animate-fade-in">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
              <div>
                <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-400">
                  トポロジー演習 {topoQuestionIdx + 1} / {TOPOLOGY_QUESTIONS.length}
                </span>
                <h2 className="mt-2 text-lg font-bold text-[var(--foreground)]">
                  {topoQ.title}
                </h2>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  {topoQ.description}
                </p>
              </div>
              <div className="flex gap-2">
                {TOPOLOGY_QUESTIONS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setTopoQuestionIdx(i);
                      setSelectedOption(null);
                      setTopoChecked(false);
                    }}
                    className={`h-7 w-7 rounded-full text-xs font-bold ${
                      topoQuestionIdx === i
                        ? "bg-[var(--accent-primary)] text-white"
                        : "bg-[var(--surface-2)] text-[var(--text-muted)]"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* インタラクティブ構成図（SVGによる高品質トポロジー描画） */}
            <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[#0d1117] p-6 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute top-3 left-4 text-[11px] font-bold text-gray-400">
                🔴 INTERACTIVE TOPOLOGY DIAGRAM
              </div>

              {topoQ.diagramType === "svg-vlan" ? (
                <svg
                  viewBox="0 0 600 240"
                  className="w-full max-w-2xl h-auto drop-shadow-xl"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Lines */}
                  <line x1="300" y1="50" x2="300" y2="130" stroke="#58a6ff" strokeWidth="3" strokeDasharray="4 2" />
                  <line x1="300" y1="130" x2="160" y2="190" stroke="#3fb950" strokeWidth="3" />
                  <line x1="300" y1="130" x2="440" y2="190" stroke="#bc8cff" strokeWidth="3" />

                  {/* Router-1 */}
                  <g transform="translate(300,40)">
                    <circle r="26" fill="#1f6feb" stroke="#58a6ff" strokeWidth="2" />
                    <text y="-33" textAnchor="middle" fill="#58a6ff" fontSize="13" fontWeight="bold">Router-1</text>
                    <text y="5" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">R1</text>
                    <text y="42" textAnchor="middle" fill="#8b949e" fontSize="10">G0/0 (trunk? / dot1Q)</text>
                  </g>

                  {/* Switch-1 */}
                  <g transform="translate(300,130)">
                    <rect x="-35" y="-18" width="70" height="36" rx="6" fill="#238636" stroke="#3fb950" strokeWidth="2" />
                    <text y="-25" textAnchor="middle" fill="#3fb950" fontSize="13" fontWeight="bold">Switch-1</text>
                    <text y="5" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">SW1</text>
                    <text x="-48" y="10" fill="#e3b341" fontSize="10">G0/1</text>
                  </g>

                  {/* PC-A (VLAN 10) */}
                  <g transform="translate(160,190)">
                    <rect x="-30" y="-20" width="60" height="40" rx="8" fill="#21262d" stroke="#58a6ff" strokeWidth="2" />
                    <text y="5" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">PC-A</text>
                    <text y="36" textAnchor="middle" fill="#3fb950" fontSize="11" fontWeight="bold">VLAN 10</text>
                    <text y="50" textAnchor="middle" fill="#8b949e" fontSize="10">192.168.10.10/24</text>
                  </g>

                  {/* PC-B (VLAN 20) */}
                  <g transform="translate(440,190)">
                    <rect x="-30" y="-20" width="60" height="40" rx="8" fill="#21262d" stroke="#bc8cff" strokeWidth="2" />
                    <text y="5" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">PC-B</text>
                    <text y="36" textAnchor="middle" fill="#bc8cff" fontSize="11" fontWeight="bold">VLAN 20</text>
                    <text y="50" textAnchor="middle" fill="#8b949e" fontSize="10">192.168.20.10/24</text>
                  </g>
                </svg>
              ) : (
                <svg
                  viewBox="0 0 600 240"
                  className="w-full max-w-2xl h-auto drop-shadow-xl"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Triangle topology lines */}
                  <line x1="300" y1="50" x2="160" y2="180" stroke="#58a6ff" strokeWidth="3" />
                  <line x1="300" y1="50" x2="440" y2="180" stroke="#58a6ff" strokeWidth="3" />
                  <line x1="160" y1="180" x2="440" y2="180" stroke="#58a6ff" strokeWidth="3" />

                  {/* Router C */}
                  <g transform="translate(300,50)">
                    <circle r="26" fill="#8250df" stroke="#bc8cff" strokeWidth="2" />
                    <text y="-34" textAnchor="middle" fill="#bc8cff" fontSize="13" fontWeight="bold">Router-C</text>
                    <text y="5" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">R-C</text>
                    <text y="42" textAnchor="middle" fill="#e3b341" fontSize="11" fontWeight="bold">Pri: 10 | Lo0: 10.0.0.1</text>
                  </g>

                  {/* Router A */}
                  <g transform="translate(160,180)">
                    <circle r="26" fill="#1f6feb" stroke="#58a6ff" strokeWidth="2" />
                    <text y="-34" textAnchor="middle" fill="#58a6ff" fontSize="13" fontWeight="bold">Router-A</text>
                    <text y="5" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">R-A</text>
                    <text y="42" textAnchor="middle" fill="#8b949e" fontSize="11">Pri: 1 | Lo0: 10.1.1.1</text>
                  </g>

                  {/* Router B */}
                  <g transform="translate(440,180)">
                    <circle r="26" fill="#238636" stroke="#3fb950" strokeWidth="2" />
                    <text y="-34" textAnchor="middle" fill="#3fb950" fontSize="13" fontWeight="bold">Router-B</text>
                    <text y="5" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">R-B</text>
                    <text y="42" textAnchor="middle" fill="#8b949e" fontSize="11">Pri: 1 | Lo0: 10.2.2.2</text>
                  </g>
                </svg>
              )}
            </div>

            {/* 設問選択肢 */}
            <div className="mt-6 space-y-2.5">
              <span className="text-xs font-bold text-[var(--text-muted)] block mb-1">
                回答を選択してください:
              </span>
              {topoQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrectOption = idx === topoQ.correctIdx;
                let borderColor = "var(--border)";
                let bgColor = "var(--surface-2)";

                if (topoChecked) {
                  if (isCorrectOption) {
                    borderColor = "#3fb950";
                    bgColor = "rgba(63,185,80,0.1)";
                  } else if (isSelected && !isCorrectOption) {
                    borderColor = "#f85149";
                    bgColor = "rgba(248,81,73,0.1)";
                  }
                } else if (isSelected) {
                  borderColor = "var(--accent-primary)";
                  bgColor = "rgba(88,166,255,0.1)";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => !topoChecked && setSelectedOption(idx)}
                    disabled={topoChecked}
                    className="flex w-full items-center gap-3 rounded-xl border p-4 text-left text-xs font-semibold text-[var(--foreground)] transition-all"
                    style={{ borderColor, background: bgColor }}
                  >
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold"
                      style={{
                        borderColor: isSelected ? "var(--accent-primary)" : "var(--border)",
                        background: isSelected ? "var(--accent-primary)" : "transparent",
                        color: isSelected ? "#fff" : "var(--text-muted)",
                      }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* 判定＆解説 */}
            <div className="mt-6 flex items-center justify-between">
              {!topoChecked ? (
                <button
                  onClick={handleTopoCheck}
                  disabled={selectedOption === null}
                  className="rounded-xl bg-[var(--accent-primary)] px-6 py-2.5 text-xs font-bold text-white hover:opacity-90 disabled:opacity-40"
                >
                  採点して解説を見る
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSelectedOption(null);
                    setTopoChecked(false);
                  }}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--foreground)]"
                >
                  やり直す
                </button>
              )}
            </div>

            {topoChecked && (
              <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 animate-fade-in">
                <div className="flex items-center gap-2 font-bold text-xs">
                  {selectedOption === topoQ.correctIdx ? (
                    <span className="text-emerald-400">🎉 正解！</span>
                  ) : (
                    <span className="text-red-400">❌ 不正解... 正解は 「 {String.fromCharCode(65 + topoQ.correctIdx)} 」</span>
                  )}
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">
                  {topoQ.explanation}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── 4. S3画像シミュレーション (新規対応) ──────────────── */}
      {activeTab === "s3view" && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-6 animate-fade-in">
          <div className="border-b border-[var(--border)] pb-4">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-400">
                ☁️ S3 IMAGE INTEGRATION & SIMULATION
              </span>
              <span className="text-xs text-[var(--text-muted)] font-bold">
                (ユーザー要件 ⑥ 対応)
              </span>
            </div>
            <h2 className="mt-2 text-lg font-bold text-[var(--foreground)]">
              S3 構成図・実機画像によるシミュレーション演習
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              S3バケット等に保存された構成図画像・キャプチャをプレビューしながら、実務形式のシミュレーション設問に解答できます。
            </p>
          </div>

          {/* S3画像 URL 指定パネル */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 space-y-3">
            <label className="text-xs font-bold text-[var(--text-muted)] block">
              S3 または Web 上の画像URLを指定・切り替えできます:
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                value={customS3Input}
                onChange={(e) => setCustomS3Input(e.target.value)}
                placeholder="https://your-s3-bucket.s3.amazonaws.com/diagram.png など"
                className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--foreground)] outline-none focus:border-[var(--accent-primary)]"
              />
              <button
                type="button"
                onClick={() => {
                  if (customS3Input.trim()) {
                    setS3ImageUrl(customS3Input.trim());
                    setCustomS3Input("");
                  }
                }}
                className="rounded-lg bg-[var(--accent-primary)] px-4 py-2 text-xs font-bold text-white hover:opacity-90"
              >
                画像をロード
              </button>
            </div>

            {/* サンプル画像プリセットボタン */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] text-[var(--text-muted)]">プリセット構成図:</span>
              <button
                type="button"
                onClick={() =>
                  setS3ImageUrl(
                    "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80"
                  )
                }
                className="rounded border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-[11px] font-semibold text-[var(--text-muted)] hover:text-[var(--foreground)]"
              >
                ネットワーク機器ラック構成
              </button>
              <button
                type="button"
                onClick={() =>
                  setS3ImageUrl(
                    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80"
                  )
                }
                className="rounded border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-[11px] font-semibold text-[var(--text-muted)] hover:text-[var(--foreground)]"
              >
                サーバー＆スイッチ配線図
              </button>
            </div>
          </div>

          {/* 画像表示エリア */}
          <div className="rounded-2xl border border-[var(--border)] bg-[#0d1117] p-4 flex flex-col items-center justify-center relative min-h-[300px]">
            <div className="absolute top-3 left-4 rounded bg-black/60 px-2 py-1 text-[10px] font-bold text-white z-10">
              S3 IMAGE PREVIEW
            </div>
            {s3ImageUrl ? (
              <img
                src={s3ImageUrl}
                alt="S3 構成図シミュレーション"
                className="max-h-[420px] w-auto rounded-lg object-contain shadow-2xl border border-gray-800"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80";
                }}
              />
            ) : (
              <div className="text-xs text-[var(--text-muted)]">
                画像が読み込まれていません
              </div>
            )}
          </div>

          {/* 実戦シミュレーション設問・解答入力 */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 space-y-3">
            <h3 className="text-xs font-bold text-[var(--foreground)]">
              【実践シミュレーション問】: {s3SimQuestion}
            </h3>
            <textarea
              rows={3}
              value={s3AnswerText}
              onChange={(e) => {
                setS3AnswerText(e.target.value);
                setS3Submitted(false);
              }}
              placeholder="例: 上位ルーターのACL設定でポート80がブロックされているため、ip access-list extended で許可設定を行う。"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--accent-primary)]"
            />
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[var(--text-muted)]">
                ※ 解答を入力して検証レポートを出力します。
              </span>
              <button
                type="button"
                onClick={() => setS3Submitted(true)}
                disabled={!s3AnswerText.trim()}
                className="rounded-lg bg-[var(--accent-secondary)] px-5 py-2 text-xs font-bold text-white hover:opacity-90 disabled:opacity-40"
              >
                解答を提出・診断
              </button>
            </div>

            {s3Submitted && (
              <div className="mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 animate-fade-in">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <span>✅ 診断完了: 良好な記述です</span>
                </div>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  記述いただいた内容（「{s3AnswerText.slice(0, 30)}...」）は、トラブルシューティング手法として適切です。S3の画像を元にした実機ログや配線図チェックと合わせて、実務でも活用できます。
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
