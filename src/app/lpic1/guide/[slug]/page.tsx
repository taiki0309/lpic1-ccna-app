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
  "what-is-linux": {
    title: "Linuxとは？ OSの概念・歴史・仕組みを学ぼう",
    level: "初心者入門",
    levelColor: "#3fb950",
    duration: "15分",
    tags: ["Linuxとは", "オープンソース", "OS基礎", "ディストリビューション"],
    steps: [
      {
        title: "1. Linuxとは何か？（OSとカーネルの基礎概念）",
        subtitle: "世界中のインフラやクラウドを支える最強のオープンソースOS",
        content:
          "Linux は 1991 年にリーナス・トーバルズ氏によって開発が開始されたオープンソースのオペレーティングシステム（OS）カーネルです。Webサーバー、クラウド基盤、スーパーコンピュータからスマートフォン（Android）まで、現在の IT インフラの中核を担っています。",
        details: [
          "カーネルの役割: ハードウェア（CPU・メモリ・ディスク等）とアプリケーションを仲介し、リソースを安全に管理します。",
          "マルチユーザー＆マルチタスク: 複数のユーザーが同時に接続し、多数の処理を同時に実行できる高い安定性を持ちます。",
          "高機能なコマンドラインインターフェース(CLI): ターミナルからコマンドを実行することで、高度な自動化やサーバー管理が可能です。",
        ],
        code: null,
        note: "LPIC-1 では、実務のサーバーエンジニアとして必須の Linux 標準知識と操作手法が問われます。",
      },
      {
        title: "2. オープンソースとGPLライセンス",
        subtitle: "誰でも自由に利用・改変・再配布できる開発エコシステム",
        content:
          "Linux は GPL（GNU General Public License）と呼ばれるライセンスに基づいて公開されています。個人でも企業でも無償で自由に使用・検証でき、ソースコードを改良したり独自に配布することが認められています。",
        details: [
          "自由な利用: サーバー構築や開発にライセンス費用がかからず、自由に展開できます。",
          "透明性とセキュリティ: 全世界のエンジニアがコードを監視しているため、脆弱性への対応が非常に高速です。",
          "広がるエコシステム: Linux をベースとした数多くの派生OSやクラウドサービスが生まれ続けています。",
        ],
        code: null,
        note: "GPL の理念はオープンソース文化の要であり、LPIC-1 試験でも重要な基礎知識です。",
      },
      {
        title: "3. 主な Linux ディストリビューションの違い",
        subtitle: "Red Hat 系 と Debian 系 の特徴を理解しよう",
        content:
          "Linux カーネルに基本ソフトウェアやパッケージ管理ツールを組み合わせて、すぐに使える状態にまとめたものを「ディストリビューション（配布版）」と呼びます。用途に応じて以下の2大系統が使われます。",
        table: {
          header: ["系統", "代表的なOS", "特徴と主な用途", "パッケージ管理"],
          rows: [
            ["Red Hat 系", "RHEL, AlmaLinux, Rocky Linux", "企業のエンタープライズサーバー・業務用基盤", "rpm / dnf / yum"],
            ["Debian 系", "Ubuntu, Debian", "クラウドサーバー・Web開発・個人端末", "deb / apt"],
          ],
        },
        code: null,
        note: "LPIC-1 はどちら特定のOSに偏らず、Linux 全般で使える共通の標準技術（LPI規格）を扱います。",
      },
      {
        title: "4. シェル（Shell）とターミナルの基礎",
        subtitle: "ユーザーとOSカーネルを繋ぐ対話型インターフェース",
        content:
          "ユーザーがキーボードで入力したコマンドを解釈し、OSカーネルに指示を伝えるソフトウェアを「シェル（Shell）」と呼びます。Linux の標準シェルである bash（Bourne-Again SHell）の仕組みを理解しましょう。",
        details: [
          "対話型実行: ターミナルからコマンドを実行し、即座に結果を得る基本的な対話操作です。",
          "シェルスクリプト: 複数のコマンドをファイルにまとめて実行することで、日々の運用作業を自動化できます。",
          "環境変数・エイリアス: 自分好みのコマンド設定やパス設定を行い、作業効率を高められます。",
        ],
        code:
          "# ── 基本的なシェル確認コマンド例 ──\necho $SHELL          # 現在お使いの標準シェルを確認\nwhoami               # 現在のログインユーザーを表示\nuname -a             # LinuxカーネルバージョンとOS情報を表示",
        note: "本アプリの問題演習と学習ガイドで、これらのコマンド仕様と出力結果の意味を着実に身につけられます。",
      },
      {
        title: "5. LPIC-1 資格学習の歩き方",
        subtitle: "問題演習と学習ガイドで最短合格を目指そう",
        content:
          "LPIC-1（101試験・102試験）の合格に向けては、各トピックの概念を理解したうえで、多くの設問に触れることが最大の近道です。本アプリを活用した学習ロードマップをおすすめします。",
        details: [
          "1. まずは「学習ガイド」で各分野（ファイル操作・パーミッション等）の概要を読む",
          "2. 「問題演習」で 4 択問題・コマンド補充問題に繰り返しチャレンジ",
          "3. 苦手カテゴリは詳細解説をチェックして知識を定着させる",
        ],
        code: null,
        note: "LPIC-1・CCNA の合格に向けて、今日も一歩頑張りましょう！",
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
          学習ガイド
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
            className="pc-only inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-xs font-extrabold text-white transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #196c2e, #3fb950)" }}
          >
            <span>💻 コマンド実践練習へ進む (PC専用)</span>
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
