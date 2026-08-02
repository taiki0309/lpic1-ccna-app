"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { submitAnswer } from "@/lib/submitAnswer";

interface CommandQuestion {
  id: string;
  category: string;
  description: string;
  prompt: string;
  expectedCommand: string;
  aliases?: string[];
  hint: string;
  explanation: string;
}

const COMMAND_QUESTIONS: CommandQuestion[] = [
  // ── 1. ファイル・ディレクトリ操作 (10問) ──
  {
    id: "cmd-1",
    category: "ファイル操作",
    description: "カレントディレクトリに新しい空のファイル「test.txt」を作成してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "touch test.txt",
    aliases: ["> test.txt"],
    hint: "空ファイルを作成したりタイムスタンプを更新するコマンドは touch です。",
    explanation: "touch <ファイル名> で空のファイルを作成します。既存のファイルの場合はタイムスタンプのみが更新されます。",
  },
  {
    id: "cmd-2",
    category: "ファイル操作",
    description: "ファイル「test.txt」をディレクトリ「/tmp」にコピーしてください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "cp test.txt /tmp",
    aliases: ["cp test.txt /tmp/", "cp -i test.txt /tmp"],
    hint: "ファイルをコピーするコマンドは cp <コピー元> <コピー先> です。",
    explanation: "cp test.txt /tmp により指定ファイルが /tmp ディレクトリ内に複製されます。",
  },
  {
    id: "cmd-3",
    category: "ファイル操作",
    description: "ファイル「old.txt」の名前を「new.txt」に変更（移動）してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "mv old.txt new.txt",
    aliases: ["mv -i old.txt new.txt"],
    hint: "ファイル名を変更する（移動する）コマンドは mv です。",
    explanation: "mv <旧名称> <新名称> でファイル名のリネームやディレクトリ移動を行います。",
  },
  {
    id: "cmd-4",
    category: "ファイル操作",
    description: "ファイル「unneeded.txt」を削除してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "rm unneeded.txt",
    aliases: ["rm -i unneeded.txt", "rm -f unneeded.txt"],
    hint: "ファイルを削除するコマンドは rm です。",
    explanation: "rm <ファイル名> で指定ファイルを削除します。誤消去に注意してください。",
  },
  {
    id: "cmd-5",
    category: "ファイル操作",
    description: "新しいディレクトリ「work」を作成してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "mkdir work",
    aliases: ["mkdir ./work"],
    hint: "ディレクトリを作成するコマンドは mkdir です。",
    explanation: "mkdir <ディレクトリ名> で新規ディレクトリを作成できます。",
  },
  {
    id: "cmd-6",
    category: "ファイル操作",
    description: "ディレクトリ「old_dir」を中身のファイルごと再帰的に削除してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "rm -r old_dir",
    aliases: ["rm -rf old_dir", "rm -R old_dir"],
    hint: "ディレクトリを中身ごと削除するには -r オプションが必要です。",
    explanation: "rm -r <ディレクトリ名> によりサブディレクトリや中のファイルをまとめて削除します。",
  },
  {
    id: "cmd-7",
    category: "ファイル操作",
    description: "カレントディレクトリの絶対パスを表示してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "pwd",
    aliases: ["pwd -P"],
    hint: "現在のディレクトリパスを表示するコマンドは pwd です。",
    explanation: "pwd (print working directory) を実行するとカレントディレクトリの完全パスが表示されます。",
  },
  {
    id: "cmd-8",
    category: "ファイル操作",
    description: "ホームディレクトリから「/var/log」ディレクトリへ移動してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "cd /var/log",
    aliases: ["cd /var/log/"],
    hint: "ディレクトリを移動するコマンドは cd です。",
    explanation: "cd <パス> で作業ディレクトリを変更できます。",
  },
  {
    id: "cmd-9",
    category: "ファイル操作",
    description: "カレントディレクトリにある全てのファイル（隠しファイル含む）を一覧表示してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "ls -a",
    aliases: ["ls -la", "ls -all"],
    hint: "隠しファイル（.で始まるファイル）を含む一覧は -a オプションを付けます。",
    explanation: "ls -a で、.bashrc などのドットファイルも含めてすべてのファイルを表示します。",
  },
  {
    id: "cmd-10",
    category: "ファイル操作",
    description: "カレントディレクトリ内のファイルを、権限やサイズを含む詳細形式で一覧表示してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "ls -l",
    aliases: ["ls -lh", "ls -l ./"],
    hint: "詳細情報表示オプションは -l です。",
    explanation: "ls -l でファイルタイプ、権限、所有者、サイズ、更新日時などの詳細情報が表示されます。",
  },

  // ── 2. テキスト・ログ処理 (10問) ──
  {
    id: "cmd-11",
    category: "テキスト処理",
    description: "ファイル「error.log」の内容をすべて画面に表示してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "cat error.log",
    aliases: ["cat ./error.log"],
    hint: "ファイル全体をそのまま表示するコマンドは cat です。",
    explanation: "cat <ファイル名> でテキストファイルの内容を順次標準出力に表示します。",
  },
  {
    id: "cmd-12",
    category: "テキスト処理",
    description: "長いログファイル「syslog.txt」を、ページング（1画面ずつ）で確認してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "less syslog.txt",
    aliases: ["more syslog.txt"],
    hint: "上下スクロールや検索が可能なページャーコマンドは less です。",
    explanation: "less <ファイル名> を使うと、長大なファイルでもメモリを消費せず快適に閲覧・検索できます。",
  },
  {
    id: "cmd-13",
    category: "テキスト処理",
    description: "ファイル「sample.txt」の最初の10行だけを表示してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "head sample.txt",
    aliases: ["head -n 10 sample.txt", "head -10 sample.txt"],
    hint: "先頭部分を表示するコマンドは head です。",
    explanation: "head はデフォルトでファイルの先頭10行を表示します。行数の変更は -n オプションを使います。",
  },
  {
    id: "cmd-14",
    category: "テキスト処理",
    description: "ファイル「sample.txt」の末尾10行を表示してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "tail sample.txt",
    aliases: ["tail -n 10 sample.txt", "tail -10 sample.txt"],
    hint: "最後（末尾）の部分を表示するコマンドは tail です。",
    explanation: "tail コマンドはファイルの最後の行を確認する際に利用され、ログのチェックで必須です。",
  },
  {
    id: "cmd-15",
    category: "テキスト処理",
    description: "ログファイル「app.log」に追記されるログをリアルタイムに継続表示してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "tail -f app.log",
    aliases: ["tail -F app.log", "tail --follow app.log"],
    hint: "ファイルの追記をリアルタイム監視するオプションは -f (follow) です。",
    explanation: "tail -f <ファイル名> を実行すると、サーバーの動作ログをリアルタイムで監視できます。",
  },
  {
    id: "cmd-16",
    category: "テキスト処理",
    description: "ファイル「data.txt」の中から文字列「error」を含む行を検索して表示してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "grep error data.txt",
    aliases: ["grep 'error' data.txt", 'grep "error" data.txt'],
    hint: "特定の文字列を含む行を抽出するコマンドは grep です。",
    explanation: "grep <検索文字列> <ファイル名> で一致する行だけを抽出して表示します。",
  },
  {
    id: "cmd-17",
    category: "テキスト処理",
    description: "ファイル「data.txt」の中から「ERROR」や「error」のように大文字小文字を区別せずに検索してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "grep -i error data.txt",
    aliases: ["grep -i 'error' data.txt", 'grep -i "error" data.txt'],
    hint: "大文字・小文字を無視するgrepオプションは -i (ignore case) です。",
    explanation: "grep -i により、大文字・小文字の表記揺れに関わらず対象をすべて抽出できます。",
  },
  {
    id: "cmd-18",
    category: "テキスト処理",
    description: "ファイル「list.txt」の行数をカウントして表示してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "wc -l list.txt",
    aliases: ["wc -l < list.txt"],
    hint: "行数を数えるwcコマンドのオプションは -l (lines) です。",
    explanation: "wc -l <ファイル名> によりファイルの総行数を確認できます。",
  },
  {
    id: "cmd-19",
    category: "テキスト処理",
    description: "ファイル「names.txt」の行をアルファベット順（昇順）に並べ替えて表示してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "sort names.txt",
    aliases: ["sort ./names.txt"],
    hint: "テキスト行をソートするコマンドは sort です。",
    explanation: "sort <ファイル名> で行単位の昇順並べ替えが行えます。",
  },
  {
    id: "cmd-20",
    category: "テキスト処理",
    description: "ソート済みのファイル「list.txt」から重複している行を一つにまとめて出力してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "uniq list.txt",
    aliases: ["sort list.txt | uniq"],
    hint: "連続する重複行を排除するコマンドは uniq です。",
    explanation: "uniq コマンドにより、並び順で重複している行を1行にして出力します。",
  },

  // ── 3. パーミッション・所有者 (10問) ──
  {
    id: "cmd-21",
    category: "パーミッション",
    description: "ファイル「script.sh」に対して所有者に実行権限(+x)を付与してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "chmod u+x script.sh",
    aliases: ["chmod +x script.sh", "chmod 755 script.sh", "chmod 744 script.sh"],
    hint: "所有者(u)に実行権限(x)を追加するシンボリックモード記法は u+x です。",
    explanation: "chmod u+x <ファイル> で所有者に実行権限を付与し、プログラムとして実行できるようにします。",
  },
  {
    id: "cmd-22",
    category: "パーミッション",
    description: "ファイル「data.txt」の権限を「所有者: rw-, グループ: r--, その他: r--」（8進数644）に変更してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "chmod 644 data.txt",
    aliases: ["chmod u=rw,go=r data.txt"],
    hint: "rw-r--r-- は 8進数で 644 と表します。",
    explanation: "chmod 644 <ファイル> は最も一般的なデータファイルの標準的なアクセス権設定です。",
  },
  {
    id: "cmd-23",
    category: "パーミッション",
    description: "ディレクトリ「public」の権限を「所有者: rwx, グループ: r-x, その他: r-x」（8進数755）に変更してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "chmod 755 public",
    aliases: ["chmod u=rwx,go=rx public"],
    hint: "rwxr-xr-x は 8進数で 755 と表します。",
    explanation: "chmod 755 により、ディレクトリの読み込み・一覧表示・移動が誰でも可能になります。",
  },
  {
    id: "cmd-24",
    category: "パーミッション",
    description: "ファイル「private.key」のアクセス権を所有者のみ「読み書き可能（rw-------／8進数600）」にしてください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "chmod 600 private.key",
    aliases: ["chmod u=rw,go= private.key"],
    hint: "所有者のみ rw (4+2=6)、他者は 0 となるので 600 です。",
    explanation: "SSH鍵などの機密ファイルは他者から読めないように chmod 600 に設定する必要があります。",
  },
  {
    id: "cmd-25",
    category: "パーミッション",
    description: "ファイル「file.txt」の所有者を「user2」に変更してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "chown user2 file.txt",
    aliases: ["sudo chown user2 file.txt"],
    hint: "所有者（オーナー）を変更するコマンドは chown です。",
    explanation: "chown <所有者名> <ファイル名> によりアクセス権のオーナーを変更します。",
  },
  {
    id: "cmd-26",
    category: "パーミッション",
    description: "ファイル「file.txt」の所属グループを「developers」に変更してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "chgrp developers file.txt",
    aliases: ["chown :developers file.txt"],
    hint: "所属グループを変更するコマンドは chgrp です。",
    explanation: "chgrp <グループ名> <ファイル名> でグループアクセス管理を設定します。",
  },
  {
    id: "cmd-27",
    category: "パーミッション",
    description: "ファイル「file.txt」の所有者を「admin」、所属グループも「admin」に同時に変更してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "chown admin:admin file.txt",
    aliases: ["chown admin.admin file.txt"],
    hint: "「所有者:グループ」の形式で chown を使います。",
    explanation: "chown <ユーザー>:<グループ> <ファイル> で所有者とグループを1つのコマンドで変更できます。",
  },
  {
    id: "cmd-28",
    category: "パーミッション",
    description: "新規ファイル作成時のデフォルトのアクセス許可マスク値（umask値）を確認してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "umask",
    aliases: ["umask -S"],
    hint: "デフォルトのパーミッションマスクを表示するコマンドは umask です。",
    explanation: "umask コマンドにより現在設定されているマスク値（022など）を確認できます。",
  },
  {
    id: "cmd-29",
    category: "パーミッション",
    description: "新規作成されるファイルの権限が 644 になるように、umask を 022 に設定してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "umask 022",
    aliases: ["umask 0022"],
    hint: "666 - 022 = 644 となるため、umask 022 を指定します。",
    explanation: "umask 022 を設定すると、新規ファイル作成時のパーミッションが標準で 644 に設定されます。",
  },
  {
    id: "cmd-30",
    category: "パーミッション",
    description: "ディレクトリ「project」およびその内部にある全てのファイルの所有者を再帰的に「appuser」に変更してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "chown -R appuser project",
    aliases: ["chown -r appuser project", "sudo chown -R appuser project"],
    hint: "ディレクトリ内すべてを再帰的に変更するオプションは -R です。",
    explanation: "chown -R を使用することでフォルダ構成全体の所有権を一括設定できます。",
  },

  // ── 4. プロセス管理・システム情報 (10問) ──
  {
    id: "cmd-31",
    category: "プロセス管理",
    description: "現在起動しているシステムのプロセスをリアルタイムにランキング表示して監視してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "top",
    aliases: ["htop"],
    hint: "CPUやメモリ消費量の多いプロセスをリアルタイム表示する標準ツールは top です。",
    explanation: "top コマンドを実行すると、システムのリソース使用状況や動作中プロセス一覧が画面更新され続けます。",
  },
  {
    id: "cmd-32",
    category: "プロセス管理",
    description: "自分のセッションに関連する現在のプロセス一覧をシンプルに表示してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "ps",
    aliases: ["ps -f"],
    hint: "プロセス情報を出力する基本コマンドは ps です。",
    explanation: "引数なしの ps コマンドで現在のシェル環境から実行されたプロセスが確認できます。",
  },
  {
    id: "cmd-33",
    category: "プロセス管理",
    description: "システム上で動作中のすべてのプロセスを詳細形式（aux形式）で表示してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "ps aux",
    aliases: ["ps -ef", "ps -aux"],
    hint: "全プロセスを表示する定番オプションの組み合わせは aux または -ef です。",
    explanation: "ps aux はBSD系の伝統的記法で、CPU消費率や開始時間などすべてのプロセス情報を確認できます。",
  },
  {
    id: "cmd-34",
    category: "プロセス管理",
    description: "プロセス名「nginx」で実行されているプロセスの PID（プロセスID）だけを検索・抽出してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "pgrep nginx",
    aliases: ["pgrep -l nginx", "pidof nginx"],
    hint: "プロセス名からPIDを検索する専用コマンドは pgrep です。",
    explanation: "pgrep <プロセス名> を使うと ps | grep よりも簡潔に該当のPIDを取得できます。",
  },
  {
    id: "cmd-35",
    category: "プロセス管理",
    description: "プロセスID 1234 のプロセスに対して標準の終了シグナル（SIGTERM）を送信して終了させてください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "kill 1234",
    aliases: ["kill -15 1234", "kill -TERM 1234"],
    hint: "プロセスIDを指定してシグナルを送るコマンドは kill です。",
    explanation: "kill <PID> により通常の終了通知（SIGTERM=15）をプロセスに送り、正常な停止を促します。",
  },
  {
    id: "cmd-36",
    category: "プロセス管理",
    description: "反応しなくなったプロセスID 1234 のプロセスを強制終了（SIGKILL=9）させてください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "kill -9 1234",
    aliases: ["kill -KILL 1234"],
    hint: "強制終了シグナル番号は 9 です。",
    explanation: "kill -9 <PID> により、プロセスに保存処理などの猶予を与えずに即時強制終了させます。",
  },
  {
    id: "cmd-37",
    category: "プロセス管理",
    description: "現在の Linux カーネルのバージョン番号（例: 5.15.0-xx-generic）を表示してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "uname -r",
    aliases: ["uname --kernel-release", "uname -a"],
    hint: "カーネルリリース番号を出力する uname コマンドのオプションは -r です。",
    explanation: "uname -r で実行中の Linux カーネルバージョン情報を正確に取得できます。",
  },
  {
    id: "cmd-38",
    category: "プロセス管理",
    description: "システム起動時にカーネルが出力したハードウェア検出などのメッセージログを表示してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "dmesg",
    aliases: ["dmesg -H", "sudo dmesg"],
    hint: "カーネルリングバッファの内容を出力するコマンドは dmesg です。",
    explanation: "dmesg コマンドを使うと、USBデバイス接続認識やブート時のエラーログを確認できます。",
  },
  {
    id: "cmd-39",
    category: "プロセス管理",
    description: "現在ログインしているユーザー名（自分が誰なのか）を表示してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "whoami",
    aliases: ["id -un"],
    hint: "英語の「Who am I?」を合わせたコマンド名です。",
    explanation: "whoami を実行すると現在の実質的なアカウント名が出力されます。",
  },
  {
    id: "cmd-40",
    category: "プロセス管理",
    description: "現在ユーザーの UID（ユーザーID）、GID（グループID）、および所属するすべてのグループ情報を表示してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "id",
    aliases: ["id -a"],
    hint: "ID情報をすべて出力する短い基本コマンドは id です。",
    explanation: "id コマンドによりユーザー権限の確認や所属グループの検証を行います。",
  },

  // ── 5. アーカイブ・パッケージ管理 (10問) ──
  {
    id: "cmd-41",
    category: "パッケージ管理",
    description: "ディレクトリ「docs」を一つのtarアーカイブファイル「docs.tar」にまとめてください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "tar -cvf docs.tar docs",
    aliases: ["tar cvf docs.tar docs"],
    hint: "tarアーカイブ作成の基本オプションは -cvf です。",
    explanation: "tar -cvf <作成するファイル名> <対象ディレクトリ> でアーカイブファイルを作成します。",
  },
  {
    id: "cmd-42",
    category: "パッケージ管理",
    description: "アーカイブファイル「docs.tar」を展開（解凍）してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "tar -xvf docs.tar",
    aliases: ["tar xvf docs.tar"],
    hint: "アーカイブ解凍（展開）の基本オプションは -xvf です。",
    explanation: "tar -xvf <アーカイブファイル> でアーカイブ内のファイルをカレントディレクトリに展開します。",
  },
  {
    id: "cmd-43",
    category: "パッケージ管理",
    description: "ディレクトリ「docs」をgzip圧縮を伴うtarアーカイブファイル「docs.tar.gz」として作成してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "tar -czvf docs.tar.gz docs",
    aliases: ["tar czvf docs.tar.gz docs"],
    hint: "gzip圧縮を組み合わせるオプションは -z を追加した -czvf です。",
    explanation: "tar -czvf を使用するとアーカイブ化とgzip圧縮をワンステップで高速に処理できます。",
  },
  {
    id: "cmd-44",
    category: "パッケージ管理",
    description: "圧縮アーカイブファイル「docs.tar.gz」を展開・解凍してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "tar -xzvf docs.tar.gz",
    aliases: ["tar xzvf docs.tar.gz"],
    hint: "gzip圧縮アーカイブの展開は -xzvf を指定します。",
    explanation: "tar -xzvf <ファイル名.tar.gz> により圧縮ファイルの解凍と展開を同時に行います。",
  },
  {
    id: "cmd-45",
    category: "パッケージ管理",
    description: "Debian/Ubuntu系Linuxで、最新のリポジトリ情報（パッケージインデックス）を更新してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "apt update",
    aliases: ["sudo apt update", "apt-get update"],
    hint: "パッケージ一覧を更新するコマンドは apt update です。",
    explanation: "apt update を実行することでインストール可能なソフトウェアの最新情報をサーバーから取得します。",
  },
  {
    id: "cmd-46",
    category: "パッケージ管理",
    description: "Debian/Ubuntu系Linuxで、パッケージ「curl」を新たにインストールしてください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "apt install curl",
    aliases: ["sudo apt install -y curl", "apt-get install curl"],
    hint: "パッケージをインストールするサブコマンドは install です。",
    explanation: "apt install <パッケージ名> で対象ソフトウェアと依存関係を自動的にインストールできます。",
  },
  {
    id: "cmd-47",
    category: "パッケージ管理",
    description: "Debian/Ubuntu系システムで、ローカルにある「package.deb」ファイルを個別にインストールしてください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "dpkg -i package.deb",
    aliases: ["sudo dpkg -i package.deb"],
    hint: "debファイルを直接インストールする dpkg オプションは -i (install) です。",
    explanation: "dpkg -i <ファイル名> でインターネットを介さずにダウンロード済みの deb パッケージを導入します。",
  },
  {
    id: "cmd-48",
    category: "パッケージ管理",
    description: "システムで稼働しているすべてのサービス（ユニット）の起動ステータスを確認してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "systemctl status",
    aliases: ["systemctl list-units"],
    hint: "systemd採用環境でサービス状態を確認するコマンドは systemctl status です。",
    explanation: "systemctl status によりシステム全体のサービス状態やエラー出力ログを確認できます。",
  },
  {
    id: "cmd-49",
    category: "パッケージ管理",
    description: "Webサーバーサービス「nginx」を開始（スタート）させてください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "systemctl start nginx",
    aliases: ["sudo systemctl start nginx"],
    hint: "サービスを起動する systemctl のサブコマンドは start です。",
    explanation: "systemctl start <サービス名> で daemon サービスを開始します。",
  },
  {
    id: "cmd-50",
    category: "パッケージ管理",
    description: "OS起動時に Webサーバーサービス「nginx」が自動起動するように有効化してください。",
    prompt: "user@linux:~$ ",
    expectedCommand: "systemctl enable nginx",
    aliases: ["sudo systemctl enable nginx", "systemctl enable --now nginx"],
    hint: "自動起動を有効化するサブコマンドは enable です。",
    explanation: "systemctl enable <サービス名> を設定することでサーバー再起動時にも自動でサービスが立ち上がります。",
  },
];

type QuestionState = {
  input: string;
  status: "idle" | "correct" | "incorrect" | "revealed";
  attempts: number;
};

export default function Lpic1PracticePage() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [states, setStates] = useState<Record<string, QuestionState>>({});
  // 正解した問題のIDのみ保持（正解を見たりスキップした場合はスコア/ポイントに含めない）
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      const isTouch =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(hover: none), (pointer: coarse)").matches;
      setIsTouchDevice(isTouch);
    };
    checkTouch();
    window.addEventListener("resize", checkTouch);
    return () => window.removeEventListener("resize", checkTouch);
  }, []);

  if (isTouchDevice) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-xl">
          <div className="mb-4 text-4xl">🖥️</div>
          <h1 className="mb-2 text-xl font-bold text-[var(--foreground)]">PC（デスクトップ）専用機能です</h1>
          <p className="mb-6 text-sm text-[var(--text-muted)] leading-relaxed">
            コマンド練習機能は、キーボードを備えたPC環境で最適な学習を行えるよう設計されています。
            スマートフォンやタブレット（iPad等）からはご利用いただけません。
          </p>
          <Link
            href="/lpic1"
            className="inline-block rounded-xl bg-[var(--accent-primary)] px-6 py-2.5 text-xs font-bold text-white transition-opacity hover:opacity-90"
          >
            ← LPIC-1 コースへ戻る
          </Link>
        </div>
      </main>
    );
  }

  const question = COMMAND_QUESTIONS[currentIdx] || COMMAND_QUESTIONS[0];
  const state = states[question.id] || { input: "", status: "idle", attempts: 0 };

  const updateState = (qId: string, newState: Partial<QuestionState>) => {
    setStates((prev) => ({
      ...prev,
      [qId]: { ...(prev[qId] || { input: "", status: "idle", attempts: 0 }), ...newState },
    }));
  };

  const checkCommandMatch = (userInput: string, expected: string, aliases: string[] = []): boolean => {
    const normalize = (str: string) =>
      str
        .trim()
        .replace(/\s+/g, " ")
        .replace(/["']/g, "")
        .toLowerCase();

    const normalizedUser = normalize(userInput);
    if (normalizedUser === normalize(expected)) return true;

    return aliases.some((alias) => normalize(alias) === normalizedUser);
  };

  const handleSubmit = () => {
    if (!state.input.trim()) return;
    const isCorrect = checkCommandMatch(
      state.input,
      question.expectedCommand,
      question.aliases
    );

    if (isCorrect) {
      updateState(question.id, { status: "correct", attempts: state.attempts + 1 });
      // 「正解をみる」を使わず自力正解した場合のみ進捗・正答スコアに追加！
      setCompleted((prev) => new Set([...prev, question.id]));

      submitAnswer({
        cert: "lpic1",
        questionId: question.id,
        category: question.category,
        selectedIndex: 0,
        isCorrect: true,
      });
    } else {
      updateState(question.id, { status: "incorrect", attempts: state.attempts + 1 });
    }
  };

  // ※ ご指摘⑤対応:「正解を見る」を使っても正答率・ポイントには加算しない！
  const handleReveal = () => {
    updateState(question.id, {
      status: "revealed",
      input: question.expectedCommand,
    });
    // setCompleted は実行しない（＝ポイントは加算されない）
  };

  const handleNext = () => {
    setShowHint(false);
    if (currentIdx < COMMAND_QUESTIONS.length - 1) {
      setCurrentIdx((i) => i + 1);
    }
  };

  const handlePrev = () => {
    setShowHint(false);
    if (currentIdx > 0) {
      setCurrentIdx((i) => i - 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const totalCompleted = completed.size;
  const totalQuestions = COMMAND_QUESTIONS.length;

  return (
    <main className="relative min-h-screen px-4 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(88,166,255,0.10) 0%, transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-3xl">
        <nav className="mb-6 flex items-center gap-2 text-sm font-bold text-[var(--text-muted)]">
          <Link href="/" className="hover:text-[var(--foreground)] transition-colors">
            ホーム
          </Link>
          <span>/</span>
          <Link href="/lpic1" className="hover:text-[var(--foreground)] transition-colors">
            LPIC-1
          </Link>
          <span>/</span>
          <span className="text-[var(--foreground)]">Linux CLI コマンド練習</span>
        </nav>

        <header className="mb-8">
          <h1 className="mb-2 text-2xl font-extrabold text-[var(--foreground)]">
            ⌨️ Linux CLI コマンド実務練習
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            指示されたコマンドを入力し「実行」または Enter キーで判定できます。
            <span className="font-bold text-[var(--accent-secondary)] ml-1">
              ※ 自力入力で正解した問題のみがポイント・正答数にカウントされます。
            </span>
          </p>
        </header>

        {/* 進捗とスコア */}
        <div className="mb-6">
          <div className="mb-1 flex justify-between text-xs text-[var(--text-muted)] font-bold">
            <span>自力クリア進捗</span>
            <span>
              {totalCompleted} / {totalQuestions} クリア
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-[var(--surface-2)]">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(totalCompleted / totalQuestions) * 100}%`,
                background: "linear-gradient(90deg, #1d6fca, #58a6ff)",
              }}
            />
          </div>
        </div>

        {/* 問題選択番号バッジ */}
        <div className="mb-6 flex flex-wrap gap-2">
          {COMMAND_QUESTIONS.map((q, i) => {
            const isCleared = completed.has(q.id);
            const isCurrent = i === currentIdx;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => {
                  setCurrentIdx(i);
                  setShowHint(false);
                }}
                className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-extrabold transition-all ${
                  isCleared
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500"
                    : isCurrent
                    ? "bg-[var(--accent-primary)] text-white shadow-md scale-110"
                    : "bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent-primary)] hover:text-[var(--foreground)]"
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>

        {/* 問題カード */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl sm:p-8">
          <div className="mb-4 flex items-center justify-between">
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1 text-xs font-bold text-[var(--accent-primary)]">
              {question.category}
            </span>
            <span className="text-xs text-[var(--text-muted)] font-bold">
              問題 {currentIdx + 1} / {totalQuestions}
            </span>
          </div>

          <h2 className="mb-6 text-base font-extrabold leading-relaxed text-[var(--foreground)] sm:text-lg">
            {question.description}
          </h2>

          {/* ターミナル入力エリア（文字色問題・入力反応を完全解決） */}
          <div
            className="mb-4 overflow-hidden rounded-xl border border-[var(--border)] shadow-lg"
            style={{ background: "#0e131f" }}
          >
            <div
              className="flex items-center gap-1.5 border-b border-[var(--border)] px-4 py-2"
              style={{ background: "#161b26" }}
            >
              <span className="h-3 w-3 rounded-full bg-[#f85149]" />
              <span className="h-3 w-3 rounded-full bg-[#e3b341]" />
              <span className="h-3 w-3 rounded-full bg-[#3fb950]" />
              <span className="ml-2 text-xs font-mono font-bold" style={{ color: "#8b949e" }}>
                bash — Linux CLI Interactive
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-3.5 font-mono text-base">
              <span className="shrink-0 font-bold" style={{ color: "#3fb950" }}>
                {question.prompt}
              </span>
              <input
                id="command-input"
                type="text"
                value={state.input}
                onChange={(e) =>
                  updateState(question.id, { input: e.target.value, status: "idle" })
                }
                onKeyDown={handleKeyDown}
                disabled={state.status === "correct" || state.status === "revealed"}
                placeholder="コマンドを入力してください... (Enterで判定)"
                style={{
                  color: "#4ade80",
                  backgroundColor: "transparent",
                  fontWeight: 700,
                  fontSize: "1rem",
                }}
                className="flex-1 outline-none placeholder:text-gray-500 disabled:opacity-80"
                autoComplete="off"
                spellCheck={false}
              />
            </div>

            {/* 結果メッセージ表示欄 */}
            {state.status !== "idle" && (
              <div
                className="border-t border-[var(--border)] px-4 py-3 font-mono text-xs font-bold"
                style={{
                  background:
                    state.status === "correct"
                      ? "rgba(63, 185, 80, 0.12)"
                      : state.status === "revealed"
                      ? "rgba(188, 140, 255, 0.12)"
                      : "rgba(248, 81, 73, 0.12)",
                  color:
                    state.status === "correct"
                      ? "#3fb950"
                      : state.status === "revealed"
                      ? "#bc8cff"
                      : "#f85149",
                }}
              >
                {state.status === "correct" && "✓ [正解] 完璧です！ポイントを獲得しました。"}
                {state.status === "incorrect" &&
                  "✗ [不正解] コマンドまたはオプションが異なります。「ヒント」も確認できます。"}
                {state.status === "revealed" &&
                  `💡 [正解を表示] ${question.expectedCommand} (※ 正解閲覧時はポイント未加算)`}
              </div>
            )}
          </div>

          {/* 解説欄（正解時・正解閲覧時） */}
          {(state.status === "correct" || state.status === "revealed") && (
            <div className="mb-6 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm">
              <p className="font-extrabold text-[var(--accent-primary)] mb-1">💡 解説</p>
              <p className="text-[var(--foreground)] leading-relaxed font-medium">
                {question.explanation}
              </p>
            </div>
          )}

          {/* ヒント表示部 */}
          {showHint && state.status !== "correct" && state.status !== "revealed" && (
            <div className="mb-6 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-300 font-bold">
              <p className="mb-1 text-xs uppercase tracking-wide opacity-80">ヒント</p>
              <p>{question.hint}</p>
            </div>
          )}

          {/* アクションボタン群 */}
          <div className="flex flex-wrap items-center gap-3">
            {state.status === "idle" || state.status === "incorrect" ? (
              <>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!state.input.trim()}
                  className="flex-1 rounded-xl py-3 px-4 font-extrabold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 shadow-md"
                  style={{ background: "linear-gradient(135deg, #196c2e, #3fb950)" }}
                >
                  実行 (Enter)
                </button>
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 font-extrabold text-amber-400 hover:bg-amber-500/20"
                >
                  {showHint ? "ヒントを閉じる" : "💡 ヒント"}
                </button>
                <button
                  type="button"
                  onClick={handleReveal}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 font-extrabold text-[var(--foreground)] hover:border-[var(--accent-primary)]"
                >
                  🔑 正解を見る
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="w-full rounded-xl py-3 px-6 font-extrabold text-white transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #1d6fca, #58a6ff)" }}
              >
                {currentIdx < COMMAND_QUESTIONS.length - 1
                  ? "次の問題へ進む →"
                  : "結果・完了一覧を見る"}
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--foreground)]"
            >
              ⏭️ スキップ
            </button>
          </div>
        </div>

        {/* 前後ナビゲーションバー */}
        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-6 py-2.5 text-sm font-bold text-[var(--foreground)] disabled:opacity-40"
          >
            ← 前の問題
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={currentIdx === COMMAND_QUESTIONS.length - 1}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-6 py-2.5 text-sm font-bold text-[var(--foreground)] disabled:opacity-40"
          >
            次の問題 →
          </button>
        </div>
      </div>
    </main>
  );
}
