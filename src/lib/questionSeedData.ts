export interface SeedQuestion {
  questionId: string;
  cert: "lpic1" | "ccna";
  category: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export const SEED_QUESTIONS: SeedQuestion[] = [
  // ─── LPIC-1: システムアーキテクチャ ─────────────────────────────────────
  {
    questionId: "q-lpic1-sysarch-01",
    cert: "lpic1",
    category: "システムアーキテクチャ",
    text: "BIOSとUEFIの違いについて正しい記述はどれか？",
    options: [
      "UEFIは2TB以上のディスクからの起動ができない",
      "UEFIはGPT（GUID Partition Table）をサポートしている",
      "BIOSはセキュアブートを標準サポートしている",
      "UEFIは16ビットモードでのみ動作する",
    ],
    correctIndex: 1,
    explanation:
      "UEFIはGPT（GUID Partition Table）をサポートし、2TBを超える大容量ディスクからの起動やセキュアブートが可能です。",
    difficulty: "beginner",
  },
  {
    questionId: "q-lpic1-sysarch-02",
    cert: "lpic1",
    category: "システムアーキテクチャ",
    text: "Linux起動時に接続されているPCIデバイスの一覧と詳細を表示するコマンドはどれか？",
    options: ["lsusb", "lspci", "lsdev", "pci-info"],
    correctIndex: 1,
    explanation:
      "lspci コマンドはPCIバスおよび接続されているデバイスの一覧を表示します。オプション -k で使用中のカーネルモジュールも確認可能です。",
    difficulty: "beginner",
  },
  {
    questionId: "q-lpic1-sysarch-03",
    cert: "lpic1",
    category: "システムアーキテクチャ",
    text: "systemd採用システムにおいて、現在のデフォルトターゲット（ランレベルに相当）を確認するコマンドはどれか？",
    options: [
      "systemctl get-default",
      "systemctl show-target",
      "systemctl list-default",
      "systemctl status target",
    ],
    correctIndex: 0,
    explanation:
      "systemctl get-default コマンドにより、現在のデフォルトのターゲットユニット（graphical.target や multi-user.target 等）を表示します。",
    difficulty: "intermediate",
  },
  {
    questionId: "q-lpic1-sysarch-04",
    cert: "lpic1",
    category: "システムアーキテクチャ",
    text: "カーネルモジュールとその依存関係を解決して自動でロードするコマンドはどれか？",
    options: ["insmod", "rmmod", "modinfo", "modprobe"],
    correctIndex: 3,
    explanation:
      "modprobe は modules.dep の依存関係情報を参照し、必要な依存モジュールを含めて自動でロードまたはアンロードします。",
    difficulty: "intermediate",
  },
  {
    questionId: "q-lpic1-sysarch-05",
    cert: "lpic1",
    category: "システムアーキテクチャ",
    text: "GRUB2の設定ファイル（/boot/grub/grub.cfg 等）を再生成する一般的なコマンドはどれか？（Debian系）",
    options: [
      "grub-mkconfig -o /boot/grub/grub.cfg",
      "grub-install /boot",
      "grub2-update",
      "make-grub-config",
    ],
    correctIndex: 0,
    explanation:
      "grub-mkconfig コマンド（Debian/Ubuntuでは update-grub）を使用して /boot/grub/grub.cfg を生成します。",
    difficulty: "advanced",
  },

  // ─── LPIC-1: パッケージ管理 ─────────────────────────────────────────
  {
    questionId: "q-lpic1-pkg-01",
    cert: "lpic1",
    category: "パッケージ管理",
    text: "Debian/Ubuntu系システムで、パッケージリストのインデックスをサーバー側と同期して更新するコマンドはどれか？",
    options: ["apt update", "apt upgrade", "apt install", "dpkg --update"],
    correctIndex: 0,
    explanation:
      "apt update コマンドはリポジトリのパッケージ情報（インデックス）を最新状態へ更新します。",
    difficulty: "beginner",
  },
  {
    questionId: "q-lpic1-pkg-02",
    cert: "lpic1",
    category: "パッケージ管理",
    text: "RPMパッケージがインストールしている全ファイルの一覧を表示する dpkg / rpm のオプションの組み合わせとして正しいものは？",
    options: [
      "rpm -ql パッケージ名",
      "rpm -qi パッケージ名",
      "rpm -qa",
      "rpm -e パッケージ名",
    ],
    correctIndex: 0,
    explanation:
      "rpm -ql (query list) コマンドにより、指定したパッケージに含まれる全ファイルパスを一覧表示します。",
    difficulty: "beginner",
  },
  {
    questionId: "q-lpic1-pkg-03",
    cert: "lpic1",
    category: "パッケージ管理",
    text: "Red Hat/Fedora系システムにおいて、dnf/yumコマンドを使用して特定ファイルの提供元パッケージを検索する構文は？",
    options: [
      "dnf provides /path/to/file",
      "dnf search-file /path/to/file",
      "dnf list-file /path/to/file",
      "dnf find /path/to/file",
    ],
    correctIndex: 0,
    explanation:
      "dnf provides (または yum provides / whatprovides) により、指定したファイルやコマンドを提供するパッケージを特定できます。",
    difficulty: "intermediate",
  },
  {
    questionId: "q-lpic1-pkg-04",
    cert: "lpic1",
    category: "パッケージ管理",
    text: "共有ライブラリキャッシュ（/etc/ld.so.cache）を再構築するためのコマンドはどれか？",
    options: ["ldconfig", "ldd", "ld.so.update", "libcache"],
    correctIndex: 0,
    explanation:
      "ldconfig コマンドを実行することで、/etc/ld.so.conf 等の設定に基づき共有ライブラリキャッシュを最新化します。",
    difficulty: "intermediate",
  },
  {
    questionId: "q-lpic1-pkg-05",
    cert: "lpic1",
    category: "パッケージ管理",
    text: "Debian系システムで、ダウンロード済みの .deb パッケージをオフラインインストールする dpkg オプションはどれか？",
    options: [
      "dpkg -i file.deb",
      "dpkg -s file.deb",
      "dpkg -r file.deb",
      "dpkg -L file.deb",
    ],
    correctIndex: 0,
    explanation:
      "dpkg -i (または --install) を用いて .deb パッケージファイルを個別にインストールします。",
    difficulty: "beginner",
  },

  // ─── LPIC-1: 基本コマンド ─────────────────────────────────────────
  {
    questionId: "q-lpic1-cmd-01",
    cert: "lpic1",
    category: "基本コマンド",
    text: "ファイル内の特定の文字列を正規表現で検索する最も基本的なコマンドはどれか？",
    options: ["grep", "find", "sed", "awk"],
    correctIndex: 0,
    explanation:
      "grep コマンドはファイル内容からパターンに一致する行を抽出します。-v で一致しない行、-i で大文字小文字を無視します。",
    difficulty: "beginner",
  },
  {
    questionId: "q-lpic1-cmd-02",
    cert: "lpic1",
    category: "基本コマンド",
    text: "コマンドの標準出力を画面に表示しつつ、同時にファイルへ保存するコマンドはどれか？",
    options: ["tee", "cat", "echo", "pipe"],
    correctIndex: 0,
    explanation:
      "tee コマンドは標準入力を受け取り、標準出力と指定したファイルの両方へデータを複製して出力します。",
    difficulty: "beginner",
  },
  {
    questionId: "q-lpic1-cmd-03",
    cert: "lpic1",
    category: "基本コマンド",
    text: "find コマンドで更新日時が7日以上前の拡張子 .log のファイルを探して削除する正しい記述はどれか？",
    options: [
      "find /var/log -name '*.log' -mtime +7 -delete",
      "find /var/log -file '*.log' -date 7 -rm",
      "find /var/log --delete-days 7 '*.log'",
      "find /var/log -name '*.log' -days +7 -exec rm {}",
    ],
    correctIndex: 0,
    explanation:
      "-mtime +7 は7日より前に変更されたファイルを指し、-delete オプションまたは -exec rm {} \\; により削除が可能です。",
    difficulty: "intermediate",
  },
  {
    questionId: "q-lpic1-cmd-04",
    cert: "lpic1",
    category: "基本コマンド",
    text: "テキストファイルの指定した列を区切り文字で切り出して出力するコマンドはどれか？",
    options: ["cut", "paste", "split", "head"],
    correctIndex: 0,
    explanation:
      "cut コマンドは -d オプションで区切り文字を指定し、-f で取り出すフィールド（列番）を切り出して表示します。",
    difficulty: "intermediate",
  },
  {
    questionId: "q-lpic1-cmd-05",
    cert: "lpic1",
    category: "基本コマンド",
    text: "テキスト中の特定の文字列を置換してストリーム出力する代表的なコマンドツールはどれか？",
    options: ["sed", "wc", "tr", "join"],
    correctIndex: 0,
    explanation:
      "sed ('s/検索文字列/置換文字列/g') は非対話的にテキストの置換や行抽出・削除を行う強力なストリームエディタです。",
    difficulty: "advanced",
  },

  // ─── LPIC-1: ファイルシステム ─────────────────────────────────────
  {
    questionId: "q-lpic1-fs-01",
    cert: "lpic1",
    category: "ファイルシステム",
    text: "ファイルシステムのディスク使用量と空き容量を人が読みやすい単位（MB/GB等）で表示するコマンドはどれか？",
    options: ["df -h", "du -h", "fdisk -l", "lsblk"],
    correctIndex: 0,
    explanation:
      "df (disk free) -h (--human-readable) はマウントされている各ファイルシステムの空き容量を人が読みやすい単位で表示します。",
    difficulty: "beginner",
  },
  {
    questionId: "q-lpic1-fs-02",
    cert: "lpic1",
    category: "ファイルシステム",
    text: "GPT（GUID Partition Table）ディスクのパーティション操作に適した対話型ツールはどれか？",
    options: ["gdisk", "fdisk-mbr", "sfdisk-old", "mbrpart"],
    correctIndex: 0,
    explanation:
      "gdisk はGPTパーティションテーブル専用のコマンドライン対話ツールです（MBRディスクには fdisk を使用します）。",
    difficulty: "intermediate",
  },
  {
    questionId: "q-lpic1-fs-03",
    cert: "lpic1",
    category: "ファイルシステム",
    text: "システム起動時に自動マウントするデバイスとそのマウントポイントを定義する設定ファイルはどれか？",
    options: [
      "/etc/fstab",
      "/etc/mtab",
      "/etc/mount.conf",
      "/etc/filesystems",
    ],
    correctIndex: 0,
    explanation:
      "/etc/fstab（file system table）ファイルにデバイスUUID、マウントポイント、ファイルシステム種類、マウントオプションを記述します。",
    difficulty: "beginner",
  },
  {
    questionId: "q-lpic1-fs-04",
    cert: "lpic1",
    category: "ファイルシステム",
    text: "ext4 ファイルシステムを作成（フォーマット）する一般的なコマンドはどれか？",
    options: [
      "mkfs.ext4 /dev/sdb1",
      "format -t ext4 /dev/sdb1",
      "fsck.ext4 /dev/sdb1",
      "mount -t ext4 /dev/sdb1",
    ],
    correctIndex: 0,
    explanation:
      "mkfs.ext4 (または mkfs -t ext4) によりパーティション上に新しく ext4 ファイルシステムを構築します。",
    difficulty: "intermediate",
  },
  {
    questionId: "q-lpic1-fs-05",
    cert: "lpic1",
    category: "ファイルシステム",
    text: "シンボリックリンクとハードリンクの違いについて正しい説明はどれか？",
    options: [
      "ハードリンクは異なるファイルシステム間をまたいで作成できないが、シンボリックリンクは作成できる",
      "シンボリックリンクは元ファイルが削除されても参照先にデータが残る",
      "ハードリンクはディレクトリに対しても標準で自由に作成できる",
      "シンボリックリンクのiノード番号は参照元のファイルと必ず同じになる",
    ],
    correctIndex: 0,
    explanation:
      "ハードリンクは同一ファイルシステム内でのみiノードを共有して作成可能ですが、シンボリックリンクはファイルシステムをまたいで作成可能です。",
    difficulty: "advanced",
  },

  // ─── LPIC-1: シェルとスクリプト ─────────────────────────────────────
  {
    questionId: "q-lpic1-sh-01",
    cert: "lpic1",
    category: "シェルとスクリプト",
    text: "bashスクリプトの1行目に記述するシバン（shebang）の正しい書き方はどれか？",
    options: [
      "#!/bin/bash",
      "# /bin/bash",
      "// /bin/bash",
      "$!/bin/bash",
    ],
    correctIndex: 0,
    explanation:
      "スクリプト先頭の #! に続けてインタープリターのパス（#!/bin/bash）を記載します。",
    difficulty: "beginner",
  },
  {
    questionId: "q-lpic1-sh-02",
    cert: "lpic1",
    category: "シェルとスクリプト",
    text: "シェル変数を環境変数としてエクスポートし、子プロセスへ引き継ぐコマンドはどれか？",
    options: ["export", "set", "env-share", "inherit"],
    correctIndex: 0,
    explanation:
      "export 変数名=値 コマンドにより、設定された変数が環境変数となりシェルから起動する子プロセスでも利用可能になります。",
    difficulty: "beginner",
  },
  {
    questionId: "q-lpic1-sh-03",
    cert: "lpic1",
    category: "シェルとスクリプト",
    text: "直前に実行したコマンドの終了ステータス（成功は0）が格納されている特殊なシェル変数はどれか？",
    options: ["$?", "$#", "$$", "$!"],
    correctIndex: 0,
    explanation:
      "$? には直前に実行したコマンドの戻り値（0なら成功、0以外はエラー）が保持されます。$#は引数の個数、$$は現在のプロセスIDを示します。",
    difficulty: "intermediate",
  },
  {
    questionId: "q-lpic1-sh-04",
    cert: "lpic1",
    category: "シェルとスクリプト",
    text: "bash スクリプトにおいて、条件判定 test -f /path/to/file が真になる条件はどれか？",
    options: [
      "指定したファイルが存在し、通常のファイルである場合",
      "指定したディレクトリが存在する場合",
      "ファイルが存在し、実行権限がある場合",
      "ファイルが空である場合",
    ],
    correctIndex: 0,
    explanation:
      "-f オプションは通常のファイルが存在するかを判定します（ディレクトリは -d、実行権限は -x、空ファイルは -s です）。",
    difficulty: "intermediate",
  },
  {
    questionId: "q-lpic1-sh-05",
    cert: "lpic1",
    category: "シェルとスクリプト",
    text: "ユーザーがログオンする際、システム全体で共通に読み込まれる初期化スクリプトファイルはどれか？",
    options: [
      "/etc/profile",
      "~/.bash_profile",
      "~/.bashrc",
      "/etc/skel/profile",
    ],
    correctIndex: 0,
    explanation:
      "ログインシェル起動時にはまずシステム共通の /etc/profile が実行され、その後ユーザー個別の ~/.bash_profile 等が処理されます。",
    difficulty: "advanced",
  },

  // ─── LPIC-1: ユーザーとセキュリティ ─────────────────────────────────
  {
    questionId: "q-lpic1-sec-01",
    cert: "lpic1",
    category: "ユーザーとセキュリティ",
    text: "ファイルの所有者と所有グループを同時に変更する chown コマンドの記述として正しいものはどれか？",
    options: [
      "chown user:group file.txt",
      "chown user-group file.txt",
      "chown user@group file.txt",
      "chgroup user:group file.txt",
    ],
    correctIndex: 0,
    explanation:
      "chown ユーザー名:グループ名 ファイル名（または ユーザー名.グループ名）の書式で所有者とグループを一度に変更できます。",
    difficulty: "beginner",
  },
  {
    questionId: "q-lpic1-sec-02",
    cert: "lpic1",
    category: "ユーザーとセキュリティ",
    text: "数値によるパーミッション指定で「所有者に読み書き実行 (7)、グループに読み実行 (5)、その他に読み出しのみ (4)」を与える値は？",
    options: ["chmod 754 file.sh", "chmod 745 file.sh", "chmod 654 file.sh", "chmod 775 file.sh"],
    correctIndex: 0,
    explanation:
      "読み出し(r=4) + 書き込み(w=2) + 実行(x=1)の合計値から、所有者7、グループ5、その他4の chmod 754 となります。",
    difficulty: "beginner",
  },
  {
    questionId: "q-lpic1-sec-03",
    cert: "lpic1",
    category: "ユーザーとセキュリティ",
    text: "umask値が 022 で設定されているシステムで、新規作成した一般ファイルのデフォルトパーミッションはどうなるか？",
    options: ["644 (-rw-r--r--)", "755 (-rwxr-xr-x)", "666 (-rw-rw-rw-)", "600 (-rw-------)"],
    correctIndex: 0,
    explanation:
      "通常のファイル作成時のベース権限 666 から umask 値 022 を差し引いた 644 (rw-r--r--) が適用されます。",
    difficulty: "intermediate",
  },
  {
    questionId: "q-lpic1-sec-04",
    cert: "lpic1",
    category: "ユーザーとセキュリティ",
    text: "ユーザーアカウントのハッシュ化されたパスワード文字列が保存されているセキュリティ上重要なファイルはどれか？",
    options: ["/etc/shadow", "/etc/passwd", "/etc/group", "/etc/gshadow"],
    correctIndex: 0,
    explanation:
      "/etc/passwd にはユーザー名やシェルパス等が記され、暗号化/ハッシュ化パスワードは root のみ読める /etc/shadow に格納されます。",
    difficulty: "intermediate",
  },
  {
    questionId: "q-lpic1-sec-05",
    cert: "lpic1",
    category: "ユーザーとセキュリティ",
    text: "sudo の設定ファイル /etc/sudoers を編集する際に、文法エラーによるロックアウトを防ぐために推奨される専用コマンドはどれか？",
    options: ["visudo", "sudoedit /etc/sudoers", "vi /etc/sudoers", "editsudo"],
    correctIndex: 0,
    explanation:
      "visudo コマンドは保存時に /etc/sudoers の文法テストを自動で実行し、構文エラーによる管理者権限喪失を未然に防ぎます。",
    difficulty: "advanced",
  },

  // ─── CCNA: ネットワーク基礎 ─────────────────────────────────────────
  {
    questionId: "q-ccna-net-01",
    cert: "ccna",
    category: "ネットワーク基礎",
    text: "OSI参照モデルにおいて、ルーターがIPアドレスを用いてパケットの宛先経路選択を行う階層はどれか？",
    options: ["ネットワーク層（第3層）", "データリンク層（第2層）", "トランスポート層（第4層）", "物理層（第1層）"],
    correctIndex: 0,
    explanation:
      "ルーターはOSI参照モデルのネットワーク層（第3層・L3）に位置し、IPヘッダ情報を見て最適なルーティングを行います。",
    difficulty: "beginner",
  },
  {
    questionId: "q-ccna-net-02",
    cert: "ccna",
    category: "ネットワーク基礎",
    text: "TCPとUDPの違いについて正しい記述はどれか？",
    options: [
      "TCPはコネクション型で信頼性が高く、UDPはコネクションレス型で高速・低遅延である",
      "UDPは3ウェイハンドシェイクにより通信の確立を確認する",
      "TCPは音声通話(VoIP)やストリーミング動画でのみ主に使用される",
      "UDPはパケット順序の並び替えや再送制御を標準で行う",
    ],
    correctIndex: 0,
    explanation:
      "TCPは3ウェイハンドシェイクや再送制御により高い信頼性を保証し、UDPはそれらを省くことでリアルタイム性や高速性を重視します。",
    difficulty: "beginner",
  },
  {
    questionId: "q-ccna-net-03",
    cert: "ccna",
    category: "ネットワーク基礎",
    text: "IPv4アドレスにおいて、クラスCのデフォルトサブネットマスク（プレフィックス長）はどれか？",
    options: ["255.255.255.0 (/24)", "255.255.0.0 (/16)", "255.0.0.0 (/8)", "255.255.255.255 (/32)"],
    correctIndex: 0,
    explanation:
      "クラスCアドレス（192.0.0.0〜223.255.255.255）の標準サブネットマスクは 255.255.255.0 (/24) です。",
    difficulty: "intermediate",
  },
  {
    questionId: "q-ccna-net-04",
    cert: "ccna",
    category: "ネットワーク基礎",
    text: "宛先IPアドレスから対応するMACアドレスを解決するために送信されるプロトコルはどれか？",
    options: ["ARP", "ICMP", "DNS", "DHCP"],
    correctIndex: 0,
    explanation:
      "ARP (Address Resolution Protocol) は宛先IPアドレスをもとに同一LAN内のMACアドレスを問い合わせます。",
    difficulty: "intermediate",
  },
  {
    questionId: "q-ccna-net-05",
    cert: "ccna",
    category: "ネットワーク基礎",
    text: "IPv6アドレスの中で、同一リンク内でのみ有効となる「リンクローカルアドレス」のプレフィックスはどれか？",
    options: ["fe80::/10", "fc00::/7", "ff00::/8", "2001::/16"],
    correctIndex: 0,
    explanation:
      "fe80::/10 で始まるアドレスはリンクローカルアドレスであり、ルーターを越えない同一セグメント内でのみ使用されます。",
    difficulty: "advanced",
  },

  // ─── CCNA: スイッチング・VLAN ──────────────────────────────────────
  {
    questionId: "q-ccna-sw-01",
    cert: "ccna",
    category: "スイッチング・VLAN",
    text: "複数のVLANフレームにタグを付けて1本の物理ポートで転送する規格として最も標準的なものはどれか？",
    options: ["IEEE 802.1Q", "IEEE 802.1X", "IEEE 802.11", "IEEE 802.3ad"],
    correctIndex: 0,
    explanation:
      "IEEE 802.1Q はイーサネットフレームに4バイトのVLANタグ（VLAN ID 等）を挿入する業界標準のトランクプロトコルです。",
    difficulty: "beginner",
  },
  {
    questionId: "q-ccna-sw-02",
    cert: "ccna",
    category: "スイッチング・VLAN",
    text: "スイッチのポートにおいて、PCやサーバなど単一端末を接続し、一つのVLANにのみ所属させるモードはどれか？",
    options: ["アクセスポート", "トランクポート", "ダイナミックポート", "コンソールポート"],
    correctIndex: 0,
    explanation:
      "アクセスポート（switchport mode access）は特定の1つのVLANにのみ所属し、タグなしフレームを送受信します。",
    difficulty: "beginner",
  },
  {
    questionId: "q-ccna-sw-03",
    cert: "ccna",
    category: "スイッチング・VLAN",
    text: "ループ構成においてブロードキャストストームを防ぐため、冗長経路の一方を自動ブロックするプロトコルは？",
    options: ["STP (Spanning Tree Protocol)", "LACP", "VTP", "CDP"],
    correctIndex: 0,
    explanation:
      "STP（または RSTP）はネットワーク内のループを検知して一部のポートをブロッキング状態にし、論理的にループのないツリー構成を維持します。",
    difficulty: "intermediate",
  },
  {
    questionId: "q-ccna-sw-04",
    cert: "ccna",
    category: "スイッチング・VLAN",
    text: "Cisco Catalyst スイッチで VLAN 10 と VLAN 20 を作成するための基本的な設定コマンド順序はどれか？",
    options: [
      "vlan 10 -> vlan 20",
      "switchport access vlan 10,20",
      "vlan database create 10 20",
      "interface vlan 10-20",
    ],
    correctIndex: 0,
    explanation:
      "グローバルコンフィギュレーションモードから vlan 10 で作成し、続けて vlan 20 を作成するのが標準書式です。",
    difficulty: "intermediate",
  },
  {
    questionId: "q-ccna-sw-05",
    cert: "ccna",
    category: "スイッチング・VLAN",
    text: "STPにおける「PortFast」機能の主な役割として正しいものはどれか？",
    options: [
      "リスニングおよびラーニング状態をスキップし、ただちにフォワーディング状態へ移行する",
      "スイッチ間でのBPDU交換を高速化する",
      "ポートのリンク速度を100Mbpsから10Gbpsに自動拡張する",
      "トランクポート上のVLANタグ付け処理を不要にする",
    ],
    correctIndex: 0,
    explanation:
      "PortFast はエンド端末接続ポートにおいてSTPのリスニング/ラーニング待機（約30秒）を省略し、即時フォワーディングに移行させる機能です。",
    difficulty: "advanced",
  },

  // ─── CCNA: IPルーティング ─────────────────────────────────────────
  {
    questionId: "q-ccna-rt-01",
    cert: "ccna",
    category: "IPルーティング",
    text: "Cisco ルーターにおいて、デフォルトルート（すべての宛先へのスタティックルート）の設定コマンドはどれか？",
    options: [
      "ip route 0.0.0.0 0.0.0.0 ネクストホップIP",
      "ip default-route 0.0.0.0 0.0.0.0",
      "route default 0.0.0.0",
      "ip gateway 0.0.0.0",
    ],
    correctIndex: 0,
    explanation:
      "ip route 0.0.0.0 0.0.0.0 <次のルーターIPまたはインターフェース> により、ルーティングテーブルに該当がない宛先のデフォルト経路を設定します。",
    difficulty: "beginner",
  },
  {
    questionId: "q-ccna-rt-02",
    cert: "ccna",
    category: "IPルーティング",
    text: "ルーティングプロトコル OSPF（Open Shortest Path First）の基本的な特徴として正しいものはどれか？",
    options: [
      "リンクステート型であり、コスト（帯域幅ベース）を指標に最短経路を計算する",
      "ディスタンスベクター型であり、ホップ数のみで経路を計算する",
      "アドミニストレーティブディスタンス（AD値）は標準で120である",
      "ルーター間で15ホップを超える経路を設定できない",
    ],
    correctIndex: 0,
    explanation:
      "OSPF はリンクステート型アルゴリズム（Dijkstra）を採用し、リンクのコスト（10^8/帯域幅）を指標とした高速・安定なルーティングを行います。",
    difficulty: "beginner",
  },
  {
    questionId: "q-ccna-rt-03",
    cert: "ccna",
    category: "IPルーティング",
    text: "異なるルーティングソース（静的やOSPF等）から同一宛先を学習した際、ルーターが優先順位の判断に用いる指標はどれか？",
    options: [
      "アドミニストレーティブディスタンス (AD値)",
      "メトリック値",
      "MTU値",
      "ホップカウント",
    ],
    correctIndex: 0,
    explanation:
      "AD値（Administrative Distance）はルーティング情報源の信頼性（小ささ重視: Static=1, EIGRP=90, OSPF=110等）を比較して採用経路を決定します。",
    difficulty: "intermediate",
  },
  {
    questionId: "q-ccna-rt-04",
    cert: "ccna",
    category: "IPルーティング",
    text: "ルーターがパケットを転送する際、ルーティングテーブル内で最も一致するビット数が長い経路を優先するルールを何と呼ぶか？",
    options: [
      "ロンゲストマッチ（最長一致）ルール",
      "ショートパスファースト",
      "イコールコストマルチパス",
      "デフォルトフォワード",
    ],
    correctIndex: 0,
    explanation:
      "ロンゲストマッチにより、10.0.0.0/8 より 10.1.1.0/24 など、よりプレフィックス長が長く具体的（詳細）に一致する経路が最優先で採用されます。",
    difficulty: "intermediate",
  },
  {
    questionId: "q-ccna-rt-05",
    cert: "ccna",
    category: "IPルーティング",
    text: "OSPFでルーターIDを明示的に指定していない場合、自動決定される順序として最優先されるものはどれか？",
    options: [
      "ループバックインターフェースの中で最大（最も高い）IPアドレス",
      "物理インターフェースの中で最も低いIPアドレス",
      "MACアドレスの中で最大の数値",
      "最初に起動したインターフェースのIPアドレス",
    ],
    correctIndex: 0,
    explanation:
      "OSPF ルーターIDの決定順位: ① router-id 設定値 > ② ループバックIF中の最大IP > ③ アクティブな物理IF中の最大IP となります。",
    difficulty: "advanced",
  },

  // ─── CCNA: IPサービス ─────────────────────────────────────────
  {
    questionId: "q-ccna-svc-01",
    cert: "ccna",
    category: "IPサービス",
    text: "社内LANのプライベートIPアドレスを、インターネット接続時に単一のグローバルIPアドレスの異なるポート番号へ変換する技術はどれか？",
    options: ["PAT (NAPT / IPマスカレード)", "スタティックNAT", "ダイナミックNAT", "DHCPリレー"],
    correctIndex: 0,
    explanation:
      "PAT (Port Address Translation) は送信元ポート番号を区別することで、複数のプライベートIPアドレスを1個のグローバルIPで共有してインターネット接続させます。",
    difficulty: "beginner",
  },
  {
    questionId: "q-ccna-svc-02",
    cert: "ccna",
    category: "IPサービス",
    text: "ネットワーク内のルーターやサーバの時刻を正確に同期させるために使用されるプロトコルはどれか？",
    options: ["NTP (Network Time Protocol)", "SNMP", "DHCP", "DNS"],
    correctIndex: 0,
    explanation:
      "NTP はUDPポート123番を使用し、タイムサーバから正確な時刻を取得してログ分析やセキュリティ証明書の正確な検証に役立ちます。",
    difficulty: "beginner",
  },
  {
    questionId: "q-ccna-svc-03",
    cert: "ccna",
    category: "IPサービス",
    text: "DHCPクライアントがIPアドレスを割り当ててもらう際、最初にブロードキャスト送信するメッセージはどれか？",
    options: [
      "DHCP DISCOVER",
      "DHCP OFFER",
      "DHCP REQUEST",
      "DHCP ACK",
    ],
    correctIndex: 0,
    explanation:
      "DHCPの通信手順(DORA): ① DISCOVER(探索) → ② OFFER(提供) → ③ REQUEST(要求) → ④ ACK(承認) の順序で行われます。",
    difficulty: "intermediate",
  },
  {
    questionId: "q-ccna-svc-04",
    cert: "ccna",
    category: "IPサービス",
    text: "ネットワーク機器のCPU使用率やインターフェース状態を収集し、監視するために使用される標準プロトコルはどれか？",
    options: ["SNMP (Simple Network Management Protocol)", "Syslog", "NetFlow", "CDP"],
    correctIndex: 0,
    explanation:
      "SNMP はマネージャとエージェント間で MIB 情報を収集・監視し、トラブル通知である Trap の受信などを実現します。",
    difficulty: "intermediate",
  },
  {
    questionId: "q-ccna-svc-05",
    cert: "ccna",
    category: "IPサービス",
    text: "Cisco 機器で Syslog サーバー（192.168.1.100）へログを送信するための設定コマンドはどれか？",
    options: [
      "logging host 192.168.1.100",
      "syslog server 192.168.1.100",
      "log-target 192.168.1.100",
      "logging server 192.168.1.100",
    ],
    correctIndex: 0,
    explanation:
      "グローバルコンフィギュレーションモードで logging host <SyslogサーバのIP> コマンドを設定することで外部サーバへログが転送されます。",
    difficulty: "advanced",
  },

  // ─── CCNA: セキュリティ基礎 ─────────────────────────────────────────
  {
    questionId: "q-ccna-sec-01",
    cert: "ccna",
    category: "セキュリティ基礎",
    text: "標準アクセス制御リスト（標準ACL: 番号1〜99）がパケットをフィルタリングする判断基準とする情報はどれか？",
    options: [
      "送信元IPアドレスのみ",
      "送信元IPアドレスと宛先IPアドレス",
      "送信元・宛先のIPアドレスとポート番号",
      "MACアドレス",
    ],
    correctIndex: 0,
    explanation:
      "標準ACL（番号1〜99または1300〜1999）はパケットの「送信元IPアドレス」のみに基づいて許可・拒否の判定を行います。",
    difficulty: "beginner",
  },
  {
    questionId: "q-ccna-sec-02",
    cert: "ccna",
    category: "セキュリティ基礎",
    text: "スイッチのポートセキュリティにおいて、不正なMACアドレスを検知した際にデフォルトで適用される違反アクションはどれか？",
    options: ["Shutdown（ポートのエラー無効化）", "Protect（パケット破棄のみ）", "Restrict（破棄およびSyslog通知）", "Warning"],
    correctIndex: 0,
    explanation:
      "ポートセキュリティの標準動作（violation mode shutdown）では、不正アクセス検知時にインターフェースが err-disabled（シャットダウン）状態になります。",
    difficulty: "beginner",
  },
  {
    questionId: "q-ccna-sec-03",
    cert: "ccna",
    category: "セキュリティ基礎",
    text: "拡張アクセス制御リスト（拡張ACL: 番号100〜199）を適用する場所の設計原則として最もベストプラクティスなのはどれか？",
    options: [
      "送信元（トラフィックの発生源）にできるだけ近い場所",
      "宛先（ターゲットサーバ）にできるだけ近い場所",
      "ネットワークの中央コアスイッチのみ",
      "インターネットゲートウェイの出口のみ",
    ],
    correctIndex: 0,
    explanation:
      "拡張ACLは送信元・宛先・ポート番号を判別できるため、不要なパケットを無駄にネットワーク内へ流さないよう送信元に近い場所への配置が基本です。",
    difficulty: "intermediate",
  },
  {
    questionId: "q-ccna-sec-04",
    cert: "ccna",
    category: "セキュリティ基礎",
    text: "「DHCPスヌーピング」機能の主なセキュリティ上の役割はどれか？",
    options: [
      "信頼できないポートからの悪意あるDHCPサーバ応答（攻撃メッセージ）を遮断する",
      "DHCPパケットを自動で暗号化する",
      "ルーターのCPU負荷を軽減するためにDHCPを停止する",
      "固定IPアドレスの端末のみをLANに接続させる",
    ],
    correctIndex: 0,
    explanation:
      "DHCPスヌーピングはポートを信頼ポート(Trusted)と非信頼ポート(Untrusted)に分け、正規のDHCPサーバポート以外からの不正応答をシャットアウトします。",
    difficulty: "intermediate",
  },
  {
    questionId: "q-ccna-sec-05",
    cert: "ccna",
    category: "セキュリティ基礎",
    text: "ネットワーク認証における「AAA」の3つの要素として正しい組み合わせはどれか？",
    options: [
      "Authentication (認証) / Authorization (認可) / Accounting (課金・ログ)",
      "Access / Administration / Audit",
      "Address / Authority / Alert",
      "Advanced / Application / Security",
    ],
    correctIndex: 0,
    explanation:
      "AAA は Authentication(本人確認)・Authorization(権限付与)・Accounting(利用履歴保存)の頭文字で、RADIUSやTACACS+等で使用されるセキュリティ概念です。",
    difficulty: "advanced",
  },

  // ─── CCNA: 自動化とプログラマビリティ ─────────────────────────────────
  {
    questionId: "q-ccna-auto-01",
    cert: "ccna",
    category: "自動化とプログラマビリティ",
    text: "REST API において、リソースの新規作成やデータ送信に使用される標準的な HTTP メソッドはどれか？",
    options: ["POST", "GET", "PUT", "DELETE"],
    correctIndex: 0,
    explanation:
      "REST API において、GET は取得、POST は新規作成・処理要求、PUT/PATCH は更新、DELETE は削除に使用されます。",
    difficulty: "beginner",
  },
  {
    questionId: "q-ccna-auto-02",
    cert: "ccna",
    category: "自動化とプログラマビリティ",
    text: "JSON（JavaScript Object Notation）のキーと値のペアを定義する正しい記述例はどれか？",
    options: [
      '{"hostname": "Router-A", "ip": "192.168.1.1"}',
      '<hostname>Router-A</hostname>',
      'hostname = "Router-A"',
      '{hostname: Router-A}',
    ],
    correctIndex: 0,
    explanation:
      "JSON のプロパティ名（キー）と文字列値は必ずダブルクォートで囲み、コロン（:）で結びます。",
    difficulty: "beginner",
  },
  {
    questionId: "q-ccna-auto-03",
    cert: "ccna",
    category: "自動化とプログラマビリティ",
    text: "エージェントレス構造（SSH経由）でYAML形式の Playbook を用いて構成管理や自動化を行うツールはどれか？",
    options: ["Ansible", "Puppet", "Chef", "Docker"],
    correctIndex: 0,
    explanation:
      "Ansible は管理対象機器に専用エージェントをインストールせず、SSH と YAML 形式の Playbook で自動設定を行います。",
    difficulty: "intermediate",
  },
  {
    questionId: "q-ccna-auto-04",
    cert: "ccna",
    category: "自動化とプログラマビリティ",
    text: "SDN（Software Defined Networking）において、コントローラーが下位のスイッチやルーターを制御する通信インタフェースを何と呼ぶか？",
    options: ["Southbound API", "Northbound API", "Eastbound API", "Westbound API"],
    correctIndex: 0,
    explanation:
      "SDNコントローラーとネットワーク機器間を繋ぐインターフェースは Southbound API（OpenFlow や NETCONF 等）、アプリケーションとの接続は Northbound API と呼ばれます。",
    difficulty: "intermediate",
  },
  {
    questionId: "q-ccna-auto-05",
    cert: "ccna",
    category: "自動化とプログラマビリティ",
    text: "REST API のレスポンスコードにおいて「認証失敗または認証トークン不正（Unauthorized）」を表すステータスコードはどれか？",
    options: ["401 Unauthorized", "403 Forbidden", "404 Not Found", "500 Internal Server Error"],
    correctIndex: 0,
    explanation:
      "HTTPステータスコード 401 は認証エラー（Unauthorized）、403 は権限不足（Forbidden）を示します。",
    difficulty: "advanced",
  },
];
