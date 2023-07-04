# Gulp を使用した Wordpress テーマ制作特化型テンプレート

## 概要

HTML を使用した静的コーディングと、WordPress 制作に特化した gulp テンプレートです。<br> 静的 HTML データと一部 WP の実装が必要な案件で効率的にコーディングを進行するために作成しました。<br> /static/〜 ディレクトリで静的コーディングを行い Docker を使用してローカルで WordPress を起動することも可能です。<br> <br>

## 環境

-   gulp v4.0.2
-   node v16.15.0

<br>

### 環境構築方法

1. エディタでフォルダーを開いたあと【`npm i`】でパッケージをインストールします。
2. インストール後、用途によって使い分けてサーバーを立ててください。

<br><br>

### 静的コーディングのみの場合

`npm run dev_s`コマンドをターミナルまたは PowerShell で実行

ローカルサーバー http://localhost:3000/ が起動し、ファイルの変更があると自動で以下のコンパイルが行われます。<br> 画像の圧縮は、/static/slice_images/~にディレクトリを配置し格納していきます。<br> ※画像の圧縮は、開発サーバーが稼働しているときにしか動作しません。 <br><br>

### WordPress のテーマ作成する場合

1. Docker Desktop を起動します。（なければ[公式サイト](https://www.docker.com/products/docker-desktop/)からダウンロードしインストール）

2. `docker-compose up -d` コマンドでコンテナを起動します。

3. http://localhost:8000/ へアクセスして WordPress の初期設定を行い、制作したテーマを適応します。

4. 一部静的ページをワードプレスで使う場合は/wp/内の.htaccess に<pre>DirectoryIndex index.html index.php</pre>の文を追記する。

※　`npm run down` で WP サーバーを停止できます。 <br><br><br>

## フォルダ構成

<pre>
・
┣━━━━ /db_data/ …… docker初期構築のときに生成されるDBデータ
┃ ┃
┃ ┗━━━━ /node_modules/ …… nodeでインストールしたパッケージの格納場所
┃
┃
┣━━━━ /html/ …… 主にコーディングデータを構築する場所
┃      ┗━━ index.html …… layouts関連のリンク集
┃      ┗━━ /assets/
┃      ┃      ┗━━ / images        / ……  slice_imagesで最適化されたimgファイルが格納される場所
┃      ┃      ┗━━ / slice_images  / ……  各々素材やテンプレートで使用するimgデータをディレクトリごとに格納
┃      ┃      ┗━━ / styles        / ……  各々素材やテンプレートで使用したscssデータを格納
┃      ┃      ┗━━ / scripts       / ……  各々素材やテンプレートで使用したjsデータを格納
┃      ┃
┃      ┗━━━━ /下層ページDir(例：about)/
┃      ┗━━━━  / index.html  / …… 下層ページのhtmlファイル
┃      ┗━━━━ / index.html …… topページのhtmlファイル
┃
┃
┣━━━━ /themes/ …… docker初期構築のときに生成されるwordpressのテーマフォルダー郡
┃
┣━━━━ /wp/ …… docker初期構築のときに生成されるwordpressのシステムデータ等
┃
┃
┣━━ docker-compose.yml  …… dockerのコンテナを構築するための構成ファイル
┃
┣━━ gulpfile.js  …… Gulpの設定ファイル
┃
┃
┃
┗━━ README.md
</pre>
