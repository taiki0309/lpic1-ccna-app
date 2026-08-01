import Link from "next/link";
import { notFound } from "next/navigation";

interface GuideStep {
  title: string;
  subtitle?: string;
  content: string;
  details?: string[];
  table?: { header: string[]; rows: string[][] };
  code: string | null;
  note: string;
}

// ─── ガイドコンテンツ定義 ──────────────────────────────────
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
  "linux-install": {
    title: "Linux 環境の構築（VirtualBox + Ubuntu 丁寧構築ガイド）",
    level: "初心者 (超丁寧解説版)",
    levelColor: "#3fb950",
    duration: "45〜60分",
    tags: ["VirtualBox", "Ubuntu", "SSH接続", "仮想環境", "Linux初心者"],
    steps: [
      {
        title: "■手順1 ubuntuのダウンロード",
        subtitle: "LTS（長期サポート版）の公式 ISO インストールメディアを取得する",
        content:
          "まずは仮想サーバーにインストールするための Ubuntu OS のインストーラー（ISOファイル）を公式サイトから無償ダウンロードします。LPIC-1および実務で最も広く使われている Ubuntu 22.04 LTS または 24.04 LTS を選択するのがベストです。",
        details: [
          "1. Ubuntu 公式サイト（https://ubuntu.com/download/desktop）にアクセスします。",
          "2. 「Ubuntu 24.04.x LTS (Long Term Support)」の「Download」ボタンをクリックします。",
          "3. 容量は約5GB〜6GBあります。通信回線の安定した環境でダウンロードしてください。",
          "※ サーバー版（Ubuntu Server）をお使いの場合も手順やコマンド操作は同様に学習できます。",
        ],
        code: null,
        note: "ダウンロードファイル名: ubuntu-24.04.1-desktop-amd64.iso (等)。保存先フォルダをメモしておきましょう。",
      },
      {
        title: "■手順2 VirtualBoxのインストール",
        subtitle: "Windows / Mac に無料の仮想化ソフト Oracle VM VirtualBox を導入",
        content:
          "現在お使いのパソコン（ホストOS）の中に仮想的な別のコンピューター（ゲストOS）を作るために、Oracle VM VirtualBox をインストールします。",
        details: [
          "1. VirtualBox 公式ダウンロードページ（https://www.virtualbox.org/wiki/Downloads）へ移動します。",
          "2. お使いのOSに合わせて「Windows hosts」または「macOS / Intel hosts」をクリックしてインストーラーを取得します。",
          "3. インストーラーを起動し、デフォルト設定のまま「Next」→「Install」でインストールを完了します。",
          "4. インストール中にネットワークアダプタの警告が出た場合は「Yes」を選択してください（インターネットは瞬断される場合があります）。",
        ],
        code: null,
        note: "併せて「Oracle VM VirtualBox Extension Pack」もダウンロード・インストールしておくと、USB接続などが拡張されます。",
      },
      {
        title: "■手順3 仮想サーバの構築",
        subtitle: "VirtualBox マネージャーで Ubuntu 用の新しい仮想マシン（VM）を設定する",
        content:
          "VirtualBox を起動し、先ほどダウンロードした Ubuntu 用の空の仮想サーバーを作成・割り当てます。以下の推奨パラメータを参考に設定してください。",
        table: {
          header: ["設定項目", "推奨パラメータ", "説明・補足"],
          rows: [
            ["名前 (Name)", "Ubuntu-LPIC1", "分かりやすい英数字の名称"],
            ["タイプ / バージョン", "Linux / Ubuntu (64-bit)", "自動で選択されない場合は手動で指定"],
            ["メインメモリ (RAM)", "2048 MB 〜 4096 MB", "PC搭載RAMの4分の1〜半分程度が目安 (最小2GB)"],
            ["CPUプロセッサ数", "2 コア", "スムーズな動作のため2コア推奨 (最小1コア)"],
            ["ハードディスク (VDI)", "25 GB 〜 40 GB", "可変サイズ (実使用分だけストレージ消費)"],
          ],
        },
        code: null,
        note: "設定メニューの「ネットワーク」→「アダプター1」はデフォルトの『NAT』のまま作成します。",
      },
      {
        title: "■手順4 仮想サーバへのubuntuのインストール",
        subtitle: "作成した仮想マシンに ISO ファイルをマウントし、OSをセットアップ",
        content:
          "いよいよ仮想サーバーの電源を入れ、手順1でダウンロードした Ubuntu ISO から Linux OS を組み込みます。",
        details: [
          "1. 作成した仮想マシンを選択し、「設定」→「ストレージ」→ コントローラー:IDE の「空(Empty)」をクリックします。",
          "2. 右側のディスクアイコンを押して、手順1の「ubuntu-xx.xx-desktop-amd64.iso」を選択し「OK」を押します。",
          "3. 「起動 (Start)」ボタンを押すと、Ubuntu のインストーラーが立ち上がります。",
          "4. 言語設定で「日本語」を選択し、「Ubuntu をインストール」をクリックします。",
          "5. ユーザー設定画面で「ユーザー名」「コンピューター名」「パスワード」を設定します（※SSH接続とsudoで使うため忘れないようにしてください）。",
          "6. 「再起動」を求められたら「Enter」を押し、仮想マシンが起動すればインストール完了です！",
        ],
        code: null,
        note: "ログイン後の初回画面で「更新の通知」が出た場合は、キャンセルせず「今すぐインストール」を押しておきましょう。",
      },
      {
        title: "■手順5 仮想サーバへのSSH接続設定",
        subtitle: "ホストPC (Windows/Mac) から Terminal / TeraTerm / VSCode でリモート操作",
        content:
          "実務のサーバー管理では、仮想マシンの画面を直接触るのではなく「SSH（Secure Shell）」経由でコマンドを打ち込みます。VirtualBox のポートフォワーディングを設定し、SSHサーバーを起動しましょう。",
        details: [
          "【ステップA: Ubuntu 側に OpenSSH サーバーを導入】",
          "仮想マシンのターミナル（端末）を開き、以下のコマンドで ssh サーバーをインストール・起動します。",
          "【ステップB: VirtualBox のポートフォワーディング設定】",
          "VirtualBox マネージャー → 仮想マシン選択 → 「設定」→「ネットワーク」→「高度」→「ポートフォワーディング」をクリック。",
          "・ルール名: SSH | プロトコル: TCP | ホストIP: 127.0.0.1 | ホストポート: 2222 | ゲストポート: 22 を追加して「OK」保存。",
          "【ステップC: ホストOS側からSSHで接続！】",
          "PC（Windows PowerShell や Mac ターミナル、Tera Term など）からポート 2222 を指定してログインします。",
        ],
        code:
          "# 1. 仮想サーバー(Ubuntu)側でSSHサーバーをインストール・稼働確認\nsudo apt update && sudo apt install -y openssh-server\nsudo systemctl status ssh\n\n# 2. お手元のパソコン(ホストOS)の PowerShell または Terminal からSSH接続\nssh -p 2222 ユーザー名@127.0.0.1\n\n# （初回確認で「Are you sure... (yes/no)?」と聞かれたら「yes」と入力してパスワード入力）",
        note: "パスワード入力時はキーを打っても画面に文字やアスタリスクは表示されませんが、内部で入力されています。そのまま Enter を押してください。",
      },
      {
        title: "■Linuxの操作",
        subtitle: "接続したサーバーで第一歩！環境確認・パッケージ更新・基本操作を試そう",
        content:
          "SSH接続が成功したら、そこは完全な Linux サーバーの世界です。LPIC-1 学習で頻出のシステム確認コマンドや、最初のファイル・ユーザー確認を実際に手を動かして練習してみましょう。",
        details: [
          "1. 現在のログインユーザー名とホスト名、カーネルバージョンを確認する",
          "2. サーバー内のソフトウェアとパッケージ一覧を最新化する",
          "3. 初代テストファイルを作って、権限（パーミッション）を見てみる",
        ],
        code:
          "# ── 1. システム環境・自分の情報を見る ──\nwhoami               # 現在のユーザー名\nhostname             # サーバーのホスト名\nuname -a             # LinuxカーネルバージョンとOS情報\npwd                  # 現在位置（ホームディレクトリ: /home/ユーザー名）\n\n# ── 2. パッケージ管理（システムの最新化） ──\nsudo apt update      # 最新パッケージリストの取得\nsudo apt upgrade -y  # インストール済みソフトの更新\n\n# ── 3. LPIC-1 の基礎コマンドを体験 ──\nmkdir -p ~/lpic_study               # 練習用ディレクトリを作成\ncd ~/lpic_study                     # ディレクトリに移動\necho 'Hello Linux World' > test.txt # テストファイル作成\nls -la                              # 隠しファイルと権限を確認\ncat test.txt                        # ファイル内容を表示",
        note: "これで「■手順1 〜 ■Linuxの操作」の丁寧な環境構築がすべて完了です！学習の途中でいつでもこの環境を実験場にしてください。",
      },
    ],
  },
  "basic-commands": {
    title: "基本コマンドをマスターしよう",
    level: "初心者",
    levelColor: "#3fb950",
    duration: "20分",
    tags: ["ファイル操作", "ナビゲーション"],
    steps: [
      {
        title: "ディレクトリ操作の基本",
        content: "Linux のナビゲーションの基本となる3つのコマンドです。",
        code: "pwd          # 現在のディレクトリを表示\nls           # ファイル一覧を表示\nls -la       # 詳細表示（隠しファイル含む）\ncd /home     # /home に移動\ncd ~         # ホームディレクトリに移動\ncd ..        # 一つ上のディレクトリへ",
        note: "pwd = Print Working Directory, ls = List, cd = Change Directory",
      },
      {
        title: "ファイルとディレクトリの作成",
        content: "新しいファイルとディレクトリを作成するコマンドです。",
        code: "touch test.txt           # 空ファイルを作成\nmkdir mydir              # ディレクトリを作成\nmkdir -p a/b/c           # 中間ディレクトリも含めて作成\ntouch mydir/file.txt     # ディレクトリ内にファイル作成",
        note: "touch は既存ファイルのタイムスタンプ更新にも使われます。",
      },
      {
        title: "ファイルのコピー・移動・削除",
        content: "ファイル操作の基本コマンドです。",
        code: "cp file.txt backup.txt        # ファイルをコピー\ncp -r mydir/ mydir_backup/    # ディレクトリを再帰コピー\nmv file.txt renamed.txt       # ファイルを移動/リネーム\nrm file.txt                   # ファイルを削除\nrm -rf mydir/                 # ディレクトリを強制削除（注意！）",
        note: "`rm -rf` は確認なしで削除します。ルートディレクトリに使うと OS が壊れます。",
      },
    ],
  },
  "permissions": {
    title: "パーミッションと所有権を理解する",
    level: "初級",
    levelColor: "#58a6ff",
    duration: "25分",
    tags: ["パーミッション", "chmod", "chown"],
    steps: [
      {
        title: "rwx 表記の読み方",
        content:
          "`ls -l` で表示される9文字のパーミッション表記を理解します。\n\n• **r (Read)** = 4 (読み取り)\n• **w (Write)** = 2 (書き込み)\n• **x (Execute)** = 1 (実行)\n\n• 最初の3文字 = 所有者 (User)\n• 次の3文字 = グループ (Group)\n• 最後の3文字 = その他 (Others)",
        code: "rwx r-x r--  # 754  User: rwx(7), Group: r-x(5), Others: r--(4)\nrw- r-- r--  # 644  一般的なファイル\nrwx rwx r-x  # 775  共有スクリプト",
        note: "ディレクトリの x (実行) 権限はそのディレクトリの中に移動 (cd) する権利です。",
      },
      {
        title: "chmod でパーミッションを変更",
        content: "数値表記と記号表記の両方で変更する方法です。",
        code: "# 数値表記（推奨）\nchmod 755 script.sh     # 実行権限を付与 (rwxr-xr-x)\nchmod 600 private.key   # 所有者のみアクセス可 (rw-------)\nchmod 644 config.txt    # 一般的なファイル (rw-r--r--)\n\n# 記号表記\nchmod u+x script.sh     # 所有者に実行権限を追加\nchmod g-w file.txt      # グループから書き込み権限を削除\nchmod a+r file.txt      # 全員に読み取り権限を追加",
        note: "u=User, g=Group, o=Others, a=All, +=追加, -=削除, ==指定",
      },
      {
        title: "chown / chgrp で所有権を変更",
        content: "ファイルの所有者やグループを変更するコマンドです。",
        code: "sudo chown user1 file.txt          # 所有者を user1 に変更\nsudo chown user1:group1 file.txt   # 所有者とグループを同時変更\nsudo chown -R user1:group1 mydir/  # ディレクトリ全体を再帰変更\nsudo chgrp group1 file.txt         # グループのみ変更",
        note: "-R オプションはディレクトリ内のすべてのファイル・サブディレクトリを対象にします。",
      },
    ],
  },
  "package-management": {
    title: "パッケージ管理（apt / yum / rpm）",
    level: "初級",
    levelColor: "#58a6ff",
    duration: "20分",
    tags: ["apt", "yum", "rpm", "パッケージ"],
    steps: [
      {
        title: "apt（Debian / Ubuntu 系）",
        content: "Ubuntu/Debian で使用する標準的なパッケージ管理コマンドです。",
        code: "sudo apt update              # パッケージリストを更新\nsudo apt upgrade -y          # パッケージを更新\nsudo apt install -y nginx    # パッケージをインストール\nsudo apt remove nginx        # パッケージを削除（設定ファイル残る）\nsudo apt purge nginx         # 完全削除（設定ファイル込み）\napt search nginx             # パッケージを検索\napt show nginx               # 詳細情報を表示",
        note: "インストール作業前に必ず `sudo apt update` でリストを最新化してください。",
      },
      {
        title: "dnf / yum（Red Hat / CentOS / Rocky 系）",
        content: "RHEL 系 Linux で使用するパッケージ管理コマンドです。",
        code: "sudo dnf check-update        # 更新可能パッケージを確認\nsudo dnf upgrade -y          # パッケージを更新\nsudo dnf install -y nginx    # インストール\nsudo dnf remove nginx        # 削除\ndnf search nginx             # 検索",
        note: "RHEL 8 以降は yum の後継である dnf がデフォルトですが、yum コマンドもエイリアスとして使えます。",
      },
    ],
  },
  "shell-scripting": {
    title: "シェルスクリプト入門",
    level: "中級",
    levelColor: "#e3b341",
    duration: "40分",
    tags: ["bash", "スクリプト", "自動化"],
    steps: [
      {
        title: "シェバンとスクリプトの実行",
        content: "スクリプトの1行目にシェバン（#!/bin/bash）を記述して実行します。",
        code: "#!/bin/bash\n# 最初のシェルスクリプト\n\necho \"Hello, Linux World!\"\necho \"現在時刻: $(date)\"",
        note: "作成後 `chmod +x script.sh` で実行権限を付与し `./script.sh` で実行します。",
      },
      {
        title: "変数と引数",
        content: "変数の定義・参照方法と、コマンドライン引数の受け取り方です。",
        code: "#!/bin/bash\n\nNAME=\"LPIC-1\"\necho \"学習ターゲット: $NAME\"\n\n# 引数の受け取り\necho \"第1引数: $1\"\necho \"引数の総数: $#\"\necho \"すべての引数: $@\"",
        note: "変数を代入するときは `=` の前後にスペースを入れないでください。",
      },
      {
        title: "if 文による条件分岐",
        content: "ファイルの存在確認や数値比較を行う `if` 文です。",
        code: "#!/bin/bash\n\nFILE=\"/etc/passwd\"\n\nif [ -f \"$FILE\" ]; then\n  echo \"$FILE は存在します\"\nelse\n  echo \"$FILE は存在しません\"\nfi\n\n# 数値の比較\nSCORE=85\nif [ \"$SCORE\" -ge 80 ]; then\n  echo \"合格！\"\nfi",
        note: "-f = ファイル存在, -d = ディレクトリ存在, -eq = 等しい, -ge = 以上, -le = 以下",
      },
    ],
  },
  "process-management": {
    title: "プロセス管理とジョブコントロール",
    level: "中級",
    levelColor: "#e3b341",
    duration: "25分",
    tags: ["プロセス", "ps", "kill", "top"],
    steps: [
      {
        title: "プロセスの確認（ps / top）",
        content: "実行中のプロセスを表示するコマンドです。",
        code: "ps aux              # すべてのユーザーのプロセスを詳細表示\nps -ef              # ツリー形式のプロセス表示\nps aux | grep nginx # 特定のプロセスを検索\n\ntop                 # リアルタイムでプロセス監視 (q で終了)\nhyper               # (または htop) グラフィカルなtop",
        note: "ps aux の a=すべてのユーザー, u=詳細フォーマット, x=制御端末なしも含む",
      },
      {
        title: "プロセスの終了（kill）",
        content: "PID（プロセスID）を指定してプロセスにシグナルを送り終了させます。",
        code: "kill 1234              # SIGTERM (15) で通常終了を要請\nkill -9 1234           # SIGKILL (9) で強制終了\nkillall nginx          # 名前指定でまとめて終了\npkill -f \"python app\"  # コマンド名パターンで終了",
        note: "強制終了 (kill -9) はデータ破損のリスクがあるため、まずは通常終了 (kill) を試してください。",
      },
      {
        title: "バックグラウンド実行とジョブ制御",
        content: "コマンドの後ろに `&` をつけてバックグラウンドで実行する方法です。",
        code: "sleep 100 &     # バックグラウンドで実行開始\njobs            # 現在のジョブ一覧を表示\nfg %1           # ジョブ1をフォアグラウンドに戻す\nbg %1           # 停止中のジョブ1をバックグラウンド再開\n\n# Ctrl + C = プロセス終了, Ctrl + Z = プロセス一時停止",
        note: "`nohup コマンド &` を使うと、ログアウト後もプロセスが動き続けます。",
      },
    ],
  },
};

export default async function Lpic1GuideDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = guides[slug];

  if (!guide) {
    notFound();
  }

  return (
    <main className="min-h-screen px-4 py-10 max-w-4xl mx-auto">
      {/* パンくず */}
      <nav className="mb-6 flex items-center gap-2 text-xs font-bold text-[var(--text-muted)]">
        <Link href="/" className="hover:text-[var(--foreground)] transition-colors">
          ホーム
        </Link>
        <span>/</span>
        <Link href="/lpic1" className="hover:text-[var(--foreground)] transition-colors">
          LPIC-1
        </Link>
        <span>/</span>
        <Link href="/lpic1/guide" className="hover:text-[var(--foreground)] transition-colors">
          環境構築ガイド
        </Link>
        <span>/</span>
        <span className="text-[var(--foreground)] truncate max-w-[200px]">{guide.title}</span>
      </nav>

      {/* ヘッダー */}
      <header className="mb-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-xl">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span
            className="rounded-full border px-3 py-1 text-xs font-black"
            style={{ borderColor: guide.levelColor, color: guide.levelColor }}
          >
            {guide.level}
          </span>
          <span className="text-xs font-bold text-[var(--text-muted)]">⏱ 学習目安: {guide.duration}</span>
          <span className="text-xs font-bold text-[var(--text-muted)]">🔢 全 {guide.steps.length} 手順</span>
        </div>
        <h1 className="mb-3 text-2xl font-black leading-snug text-[var(--foreground)] sm:text-3xl">
          {guide.title}
        </h1>
        <div className="flex flex-wrap gap-1.5">
          {guide.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-[var(--surface-2)] border border-[var(--border)] px-2.5 py-0.5 text-xs font-bold text-[var(--text-muted)]"
            >
              #{tag}
            </span>
          ))}
        </div>
      </header>

      {/* ステップ（手順一覧） */}
      <div className="flex flex-col gap-8">
        {guide.steps.map((step, i) => (
          <section
            key={i}
            className="relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-md hover:border-gray-600 transition-colors"
          >
            {/* ステップヘッダー */}
            <div className="mb-4 flex items-start gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base font-black text-white shadow-lg"
                style={{ background: "linear-gradient(135deg, #1d6fca, #3fb950)" }}
              >
                {i + 1}
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-[var(--foreground)]">
                  {step.title}
                </h2>
                {step.subtitle && (
                  <p className="text-xs font-bold text-[var(--accent-primary)] mt-0.5">
                    {step.subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* 本文 */}
            <p className="mb-4 text-xs sm:text-sm leading-relaxed text-[var(--foreground)]">
              {step.content}
            </p>

            {/* 詳細ステップリスト（詳細手順・箇条書き） */}
            {step.details && step.details.length > 0 && (
              <div className="mb-5 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/60 p-4 space-y-2">
                <div className="text-xs font-extrabold text-[var(--accent-secondary)]">
                  ▼ 操作チェックリスト＆詳細手順
                </div>
                <ul className="space-y-1.5 text-xs leading-relaxed text-[var(--text-muted)]">
                  {step.details.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[var(--accent-primary)] font-bold mt-0.5">✔</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* パラメータ表（スペック等がある場合） */}
            {step.table && (
              <div className="mb-5 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface-2)]">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[var(--border)] bg-[var(--surface)] font-bold text-[var(--foreground)]">
                    <tr>
                      {step.table.header.map((th, idx) => (
                        <th key={idx} className="px-4 py-2.5">
                          {th}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)] text-[var(--text-muted)]">
                    {step.table.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-[var(--surface)]/50">
                        {row.map((td, cIdx) => (
                          <td key={cIdx} className="px-4 py-2.5 font-medium">
                            {cIdx === 0 ? (
                              <span className="font-bold text-[var(--foreground)]">{td}</span>
                            ) : cIdx === 1 ? (
                              <span className="font-mono font-bold text-[var(--accent-primary)]">
                                {td}
                              </span>
                            ) : (
                              td
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* コード・コマンドブロック */}
            {step.code && (
              <div
                className="mb-5 overflow-hidden rounded-xl border border-[var(--border)]"
                style={{ background: "#0d1117" }}
              >
                <div className="flex items-center justify-between border-b border-[var(--border)] bg-[#161b22] px-4 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-red-500/80" />
                    <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                    <span className="h-3 w-3 rounded-full bg-green-500/80" />
                    <span className="ml-2 text-xs font-mono font-bold text-gray-400">
                      Terminal / Bash
                    </span>
                  </div>
                </div>
                <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-gray-200">
                  <code>{step.code}</code>
                </pre>
              </div>
            )}

            {/* 補足ノート */}
            {step.note && (
              <div className="flex items-start gap-3 rounded-xl border border-amber-500/50 bg-[var(--surface-2)] px-4 py-3.5 text-xs leading-relaxed text-[var(--foreground)] shadow-sm">
                <span className="shrink-0 text-base">💡</span>
                <div>
                  <strong className="font-extrabold text-amber-600 dark:text-amber-400 mr-1.5">
                    ワンポイントアドバイス:
                  </strong>
                  <span className="font-medium text-[var(--foreground)]">{step.note}</span>
                </div>
              </div>
            )}
          </section>
        ))}
      </div>

      {/* 完了・次のアクションカード */}
      <div className="mt-12 rounded-2xl border border-[#3fb950] bg-[rgba(63,185,80,0.08)] p-8 text-center shadow-2xl">
        <p className="mb-2 text-3xl">🎉</p>
        <h2 className="text-xl font-extrabold text-[#3fb950]">
          環境構築・コマンドガイドを完了しました！
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-[var(--text-muted)] max-w-xl mx-auto leading-relaxed">
          これでLinuxの基礎から応用、実機操作の準備が整いました。次のコマンド練習ページや問題演習で、実際に覚えた操作や知識をアウトプットしましょう！
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/lpic1/practice"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-xs font-extrabold text-white transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #196c2e, #3fb950)" }}
          >
            <span>💻 コマンド実践練習へ進む</span>
            <span>➔</span>
          </Link>
          <Link
            href="/lpic1/guide"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-6 py-3 text-xs font-bold text-[var(--foreground)] transition-all hover:scale-105"
          >
            <span>📖 ガイド一覧に戻る</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

// 静的パス生成
export function generateStaticParams() {
  return Object.keys(guides).map((slug) => ({ slug }));
}
