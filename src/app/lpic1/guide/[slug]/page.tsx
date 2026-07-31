import Link from "next/link";
import { notFound } from "next/navigation";

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
    title: "Linux 環境の構築（VirtualBox + Ubuntu）",
    level: "初心者",
    levelColor: "#3fb950",
    duration: "30分",
    tags: ["VirtualBox", "Ubuntu", "インストール"],
    steps: [
      {
        title: "VirtualBox をダウンロード・インストール",
        content: "VirtualBox は無料の仮想化ソフトウェアです。Windows/Mac 両対応です。",
        code: null,
        note: "公式サイト https://www.virtualbox.org/wiki/Downloads から OS に合ったインストーラーをダウンロードしてください。",
      },
      {
        title: "Ubuntu ISO をダウンロード",
        content: "Ubuntu の公式サイトから ISO ファイル（インストールメディア）を取得します。",
        code: null,
        note: "ubuntu.com → 「Download Ubuntu Desktop」から LTS 版（22.04 または 24.04）を選びましょう。",
      },
      {
        title: "VirtualBox で新規仮想マシンを作成",
        content:
          "VirtualBox Manager を開き「新規」→ 名前: Ubuntu, タイプ: Linux, バージョン: Ubuntu (64-bit)、メモリ: 2048MB 以上、ディスク: 20GB 以上 を設定します。",
        code: null,
        note: "ホストPCのRAMが8GB以上なら2048MB、4GBなら1024MBが安全です。",
      },
      {
        title: "Ubuntu をインストール",
        content:
          "仮想マシンを起動し、設定からダウンロードした ISO を「光学ドライブ」にマウントします。起動後「Install Ubuntu」を選択し、指示に従ってインストールします。",
        code: null,
        note: "「通常のインストール」を選び、ユーザー名とパスワードを設定してください。",
      },
      {
        title: "パッケージリストを最新化",
        content: "インストール後、ターミナルを開いてパッケージを最新状態に更新します。",
        code: "sudo apt update && sudo apt upgrade -y",
        note: "パスワードを求められたら設定したパスワードを入力します（画面には表示されません）。",
      },
      {
        title: "基本ツールをインストール",
        content: "LPIC-1 学習に役立つツールを追加インストールします。",
        code: "sudo apt install -y curl wget git vim tree net-tools",
        note: "これらのコマンドは後の学習で頻繁に使います。",
      },
      {
        title: "シェルの確認",
        content: "現在使用しているシェルと bash のバージョンを確認します。",
        code: "echo $SHELL\nbash --version",
        note: "Ubuntu のデフォルトシェルは bash です。LPIC-1 の試験も bash が前提です。",
      },
      {
        title: "環境構築完了！次のステップ",
        content:
          "これで Linux 環境が整いました。次は基本コマンドガイドに進みましょう。スナップショット機能（VirtualBox のメニュー → スナップショット）を使うと、ミスしても元に戻せます。",
        code: null,
        note: "VirtualBox のゲスト追加（Guest Additions）をインストールするとクリップボード共有・画面リサイズが使えて便利です。",
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
      {
        title: "ファイル内容の表示",
        content: "ファイルの内容を確認するコマンドです。",
        code: "cat file.txt              # ファイル全体を表示\nless file.txt             # ページ送りで表示（q で終了）\nhead -n 10 file.txt       # 先頭10行を表示\ntail -n 10 file.txt       # 末尾10行を表示\ntail -f /var/log/syslog   # リアルタイムで末尾を追跡",
        note: "大きなファイルは cat より less を使いましょう。",
      },
      {
        title: "テキスト検索（grep）",
        content: "ファイル内の文字列を検索するコマンドです。",
        code: 'grep "error" log.txt            # log.txt から error を検索\ngrep -i "error" log.txt         # 大文字/小文字を無視\ngrep -r "TODO" ./src/           # ディレクトリを再帰検索\ngrep -n "error" log.txt         # 行番号付きで表示',
        note: "grep はパイプと組み合わせることも多い: `ls -la | grep .txt`",
      },
      {
        title: "コマンドの助けを借りる",
        content: "コマンドの使い方を調べる方法です。",
        code: "man ls          # ls のマニュアルを表示（q で終了）\nls --help       # ヘルプを表示\nwhich ls        # コマンドのパスを確認",
        note: "man ページは q で終了、/ で検索、n で次の検索結果に移動できます。",
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
        title: "パーミッションの読み方",
        content:
          "`ls -l` で表示されるパーミッション文字列 `-rwxr-xr--` の意味を理解しましょう。",
        code: "ls -l file.txt\n# -rwxr-xr-- 1 user group 1024 Jan 1 00:00 file.txt\n# └─────────── パーミッション\n#  |─ ファイルタイプ (- = 通常, d = ディレクトリ, l = シンボリックリンク)\n#   ───── 所有者 (rwx)\n#      ───── グループ (r-x)\n#         ───── その他 (r--)",
        note: "r=読み取り(4), w=書き込み(2), x=実行(1)",
      },
      {
        title: "chmod で権限を変更（記号モード）",
        content: "記号を使って直感的にパーミッションを変更できます。",
        code: "chmod u+x script.sh    # 所有者に実行権限を追加\nchmod g-w file.txt     # グループの書き込みを除去\nchmod o=r file.txt     # その他を読み取りのみに設定\nchmod a+r file.txt     # 全員に読み取りを追加 (a = all)",
        note: "u=所有者, g=グループ, o=その他, a=全員",
      },
      {
        title: "chmod で権限を変更（数値モード）",
        content: "数値を使ってパーミッションを一括設定できます。",
        code: "chmod 755 script.sh    # rwxr-xr-x (よく使われる実行ファイル)\nchmod 644 file.txt     # rw-r--r-- (よく使われるテキストファイル)\nchmod 600 secret.key   # rw------- (秘密鍵など)\nchmod 777 public/      # rwxrwxrwx (全員フルアクセス、危険！)",
        note: "755 = 7(所有者:rwx) 5(グループ:r-x) 5(その他:r-x)",
      },
      {
        title: "chown で所有者を変更",
        content: "ファイルの所有者・グループを変更します（root 権限が必要）。",
        code: "sudo chown alice file.txt           # 所有者を alice に変更\nsudo chown alice:staff file.txt     # 所有者とグループを変更\nsudo chown -R alice:staff mydir/    # ディレクトリ以下を再帰変更",
        note: "chown は root（sudo）でのみ実行できます。",
      },
      {
        title: "umask で新規ファイルのデフォルト権限を設定",
        content: "umask はファイル作成時の権限マスクです。",
        code: "umask              # 現在の umask を確認（例: 0022）\numask 027          # umask を一時変更\n# umask 0022 の場合:\n#   ディレクトリ: 777 - 022 = 755\n#   ファイル:     666 - 022 = 644",
        note: "umask 値を引いた値がデフォルトのパーミッションになります。",
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
        title: "apt（Debian/Ubuntu系）の基本",
        content: "Ubuntu/Debian 系 Linux のパッケージ管理ツールです。",
        code: "sudo apt update                  # パッケージリストを更新\nsudo apt upgrade -y              # インストール済みパッケージを更新\nsudo apt install nginx           # nginx をインストール\nsudo apt remove nginx            # nginx を削除\nsudo apt purge nginx             # 設定ファイルごと削除\napt search nginx                 # パッケージを検索\napt show nginx                   # パッケージ詳細を確認",
        note: "install 前に必ず `apt update` でリストを最新化しましょう。",
      },
      {
        title: "dpkg（Debian パッケージの直接操作）",
        content: "apt の低レベルコマンド。.deb ファイルを直接扱う際に使います。",
        code: "dpkg -i package.deb          # .deb ファイルをインストール\ndpkg -l                      # インストール済みパッケージ一覧\ndpkg -l | grep nginx         # nginx がインストール済みか確認\ndpkg --get-selections        # 全パッケージの選択状態を表示",
        note: "依存関係の解決は apt が行います。dpkg は低レベル操作です。",
      },
      {
        title: "yum/dnf（Red Hat/CentOS系）",
        content: "RHEL/CentOS/Fedora 系 Linux のパッケージ管理ツールです。",
        code: "sudo yum update -y               # パッケージを更新\nsudo yum install httpd           # Apache をインストール\nsudo yum remove httpd            # 削除\nyum search httpd                 # 検索\nyum info httpd                   # 詳細確認\n\n# CentOS 8 以降は dnf を使用\nsudo dnf install nginx",
        note: "CentOS 8 以降は yum のコマンドも dnf にリダイレクトされます。",
      },
      {
        title: "rpm（RPM パッケージの直接操作）",
        content: "Red Hat 系の低レベルパッケージコマンドです。",
        code: "rpm -ivh package.rpm         # .rpm ファイルをインストール\nrpm -qa                      # インストール済みパッケージ一覧\nrpm -q nginx                 # nginx のバージョン確認\nrpm -ql nginx                # nginx がインストールしたファイル一覧\nrpm -e nginx                 # 削除（依存関係注意）",
        note: "rpm は dpkg 相当。依存解決には yum/dnf を使いましょう。",
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
        title: "最初のシェルスクリプト",
        content: "シェバン行（#!）で実行シェルを指定し、基本的なスクリプトを書きます。",
        code: '#!/bin/bash\n# hello.sh - 最初のスクリプト\necho "Hello, Linux!"\necho "今日は $(date) です"',
        note: "`chmod +x hello.sh` で実行権限を付与し、`./hello.sh` で実行します。",
      },
      {
        title: "変数",
        content: "変数の定義と参照の方法です。",
        code: '#!/bin/bash\nNAME="Alice"\nAGE=25\necho "名前: $NAME, 年齢: $AGE"\n\n# コマンドの出力を変数に代入\nCURRENT_DIR=$(pwd)\necho "現在のディレクトリ: $CURRENT_DIR"',
        note: "変数名の前後にスペースを入れないこと: `NAME = Alice` は NGです。",
      },
      {
        title: "条件分岐（if文）",
        content: "ファイルの存在チェックや数値比較を行います。",
        code: '#!/bin/bash\nFILE="/etc/hosts"\n\nif [ -f "$FILE" ]; then\n  echo "$FILE は存在します"\nelif [ -d "$FILE" ]; then\n  echo "$FILE はディレクトリです"\nelse\n  echo "$FILE は存在しません"\nfi\n\n# 数値比較\nif [ $1 -gt 10 ]; then\n  echo "10より大きい"\nfi',
        note: "-f: ファイル, -d: ディレクトリ, -gt: >, -lt: <, -eq: ==",
      },
      {
        title: "ループ",
        content: "for ループと while ループの基本です。",
        code: '#!/bin/bash\n# for ループ\nfor i in 1 2 3 4 5; do\n  echo "番号: $i"\ndone\n\n# ファイルを対象にしたループ\nfor file in *.txt; do\n  echo "ファイル: $file"\ndone\n\n# while ループ\nCOUNT=0\nwhile [ $COUNT -lt 5 ]; do\n  echo "カウント: $COUNT"\n  COUNT=$((COUNT + 1))\ndone',
        note: "`$((式))` は算術演算に使います。",
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
        title: "プロセス一覧の確認（ps）",
        content: "現在実行中のプロセスを確認します。",
        code: "ps aux                      # 全プロセスを詳細表示\nps -ef                      # 別フォーマットで全プロセス\nps aux | grep nginx         # nginx のプロセスを検索\nps --sort=-%cpu | head -10  # CPU使用率上位10プロセス",
        note: "USER/PID/CPU%/MEM%/COMMAND の順で表示されます。",
      },
      {
        title: "リアルタイム監視（top / htop）",
        content: "プロセスをリアルタイムで監視します。",
        code: "top                 # リアルタイムプロセス監視（q で終了）\n# top 操作キー:\n# k: プロセスをkill, P: CPU順ソート, M: メモリ順ソート\n# r: nice値変更, h: ヘルプ\n\nsudo apt install htop  # カラフルな top（別途インストール）\nhtop",
        note: "htop は top より操作しやすく視覚的です。",
      },
      {
        title: "プロセスの終了（kill / killall）",
        content: "プロセスにシグナルを送って制御します。",
        code: "kill 1234               # PID 1234 にデフォルトシグナル(SIGTERM)を送る\nkill -9 1234            # SIGKILL（強制終了）\nkillall nginx           # nginx という名前の全プロセスを終了\npkill -f 'python'       # コマンド名にマッチするプロセスを終了\n\n# シグナル一覧\nkill -l",
        note: "SIGTERM(15)は正常終了要求、SIGKILL(9)は強制終了です。まず -15 を試しましょう。",
      },
      {
        title: "バックグラウンド実行とジョブ管理",
        content: "コマンドをバックグラウンドで実行する方法です。",
        code: "sleep 100 &          # バックグラウンドで実行\njobs                 # バックグラウンドジョブ一覧\nfg %1                # ジョブ1をフォアグラウンドに戻す\nbg %1                # 停止中のジョブをバックグラウンドで再開\n# Ctrl+Z: 実行中のプロセスを一時停止\n# Ctrl+C: 実行中のプロセスを終了",
        note: "& をつけてコマンドを実行するとすぐにプロンプトが返ります。",
      },
    ],
  },
};

interface GuideStep {
  title: string;
  content: string;
  code: string | null;
  note: string | null;
}

type Params = Promise<{ slug: string }>;

export default async function Lpic1GuideDetailPage({ params }: { params: Params }) {
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
          <Link href="/lpic1" className="hover:text-[var(--foreground)] transition-colors">LPIC-1</Link>
          <span>/</span>
          <Link href="/lpic1/guide" className="hover:text-[var(--foreground)] transition-colors">ガイド</Link>
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
              className="relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
            >
              {/* ステップ番号 */}
              <div className="mb-4 flex items-center gap-3">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black text-white"
                  style={{ background: "linear-gradient(135deg, #6e40c9, #bc8cff)" }}
                >
                  {i + 1}
                </div>
                <h2 className="text-base font-bold text-[var(--foreground)]">{step.title}</h2>
              </div>

              {/* 説明文 */}
              <p className="mb-4 text-sm leading-relaxed text-[var(--text-muted)]">
                {step.content}
              </p>

              {/* コードブロック */}
              {step.code && (
                <div
                  className="mb-4 overflow-x-auto rounded-xl border border-[var(--border)]"
                  style={{ background: "#0d1117" }}
                >
                  <div className="flex items-center gap-1.5 border-b border-[var(--border)] px-4 py-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#f85149]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#e3b341]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#3fb950]" />
                    <span className="ml-2 text-xs text-[var(--text-muted)] font-mono">bash</span>
                  </div>
                  <pre className="overflow-x-auto px-4 py-4 font-mono text-sm leading-relaxed text-[var(--foreground)]">
                    <code>{step.code}</code>
                  </pre>
                </div>
              )}

              {/* 補足ノート */}
              {step.note && (
                <div className="flex items-start gap-2 rounded-xl border border-[#e3b341] bg-[rgba(227,179,65,0.08)] px-4 py-3 text-xs leading-relaxed text-[#e3b341]">
                  <span className="shrink-0">💡</span>
                  <span>{step.note}</span>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* 完了・次へ */}
        <div className="mt-10 rounded-2xl border border-[#3fb950] bg-[rgba(63,185,80,0.08)] p-6 text-center">
          <p className="mb-2 text-2xl">🎉</p>
          <p className="font-bold text-[#3fb950]">このガイドを完了しました！</p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            コマンド練習で実力を試してみましょう。
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/lpic1/practice"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-white transition-all hover:scale-105 hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #196c2e, #3fb950)" }}
            >
              コマンド練習へ →
            </Link>
            <Link
              href="/lpic1/guide"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-6 py-3 font-semibold text-[var(--foreground)] transition-all hover:scale-105"
            >
              ガイド一覧に戻る
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

// 静的パス生成
export function generateStaticParams() {
  return Object.keys(guides).map((slug) => ({ slug }));
}
