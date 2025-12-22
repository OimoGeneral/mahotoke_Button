1. 概要
本サイトは、ウェブページ中央に配置された画像ボタン「まほとけボタン」を中核とするインタラクティブなウェブアプリケーションである。ユーザーがボタンを操作すると、あらかじめ用意された複数の音声ファイルの中からランダムに選択された一つが再生され、同時に視覚的なエフェクトが発生する。
2. 機能要件
2.1. UI・表示要素
 * ボタン画像:
   * 指定された画像ファイル（mahotoke_normal.webp）をページ中央（水平・垂直）に配置する。
   * 画像のサイズはビューポートに応じて可変し、PC向けに最大幅が設定される。
 * 背景画像:
   * 指定された画像ファイル（background.webp）をページ全体の背景として表示する。
2.2. ボタン操作時の挙動
 * 押下時 (PC: mousedown / スマホ: touchstart / キーボード: keydown):
   * 音声再生:
     * 前回押下時に「予約」された音声ファイルを再生する。
     * 再生処理と同時に、次回再生するための新しい音声ファイルを、音声ファイルリストの中からランダムに選択して「予約」し、バックグラウンドでのプリロード（先読み）を開始する。
     * ランダム選択時、直前に再生された音声と同じ音声は連続で選ばれないロジックを持つ。
   * 視覚的エフェクト:
     * ボタンの画像が、視覚的にわずかに縮小する（例: transform: scale(0.95)）。
 * 離上時 (mouseup, mouseleave, touchend, touchcancel, keyup):
   * ボタンの縮小エフェクトを解除し、元のサイズに復元する。
2.3. キーボード操作 (アクセシビリティ)
 * ボタン要素 (<img>) にフォーカスが当たっている状態で、EnterキーまたはSpaceキーが押された場合も、マウスクリック/タップと同様の動作をトリガーする。
3. 非機能要件
 * 3.1. パフォーマンス:
   * 画像最適化: 主要な画像リソース（背景、ボタン）には、圧縮効率の高いWebP形式を採用する。
   * スクリプト実行: JavaScriptの<script>タグにdefer属性を使用し、HTMLのレンダリングをブロックしないことで、ページの初期表示速度を向上させる。
   * 音声再生の応答性: 次回再生する音声ファイルを事前にプリロードする戦略により、2回目以降のユーザーインタラクションに対する音声再生の遅延を最小化する。（ボタンを押した瞬間に次のまほとけがロードされる）
 * 3.2. アクセシビリティ:
   * ボタン画像にrole="button", tabindex="0", alt属性を設定し、キーボード操作やスクリーンリーダーへの配慮を行う。
4. 使用技術・アーキテクチャ
 * 技術スタック: HTML5, CSS3, JavaScript (ES6+)
 * アーキテクチャ: 基本はクライアントサイドで完結する静的サイト。
   * ただし「公開カウンタ（合算）」を有効化する場合のみ、外部API（Cloudflare Workers + D1 など）を利用する。
 * ホスティング: GitHub Pages, Vercel, Netlifyなど、任意の静的サイトホスティングサービスで展開可能。
5. ファイル構成
/ (プロジェクトのルートディレクトリ)
├── index.html
├── style.css
├── script.js
└── Assets/
    ├── image/
    │   ├── background.webp
    │   └── mahotoke_normal.webp
    └── sound/
        ├── sound1.mp3
        ├── sound2.mp3
        └── ... (音声ファイルは将来的に追加・変更される)

6. 公開カウンタ（合算）の有効化（Cloudflare Workers + D1）

本リポジトリには、公開カウンタ用の Worker が `worker/` に同梱されています。

6.1. Cloudflare 側でやること（概要）
1) D1 データベースを作成
2) `worker/schema.sql` を適用（テーブル作成）
3) Worker をデプロイ

6.2. 設定（最低限）
* `worker/wrangler.toml` の `database_id` を作成したD1のIDに差し替える
* `worker/wrangler.toml` の `ALLOW_ORIGIN` を GitHub Pages の origin にする
  * 例: `https://username.github.io`（パスは含めない）

6.3. フロント側（GitHub Pages）
`index.html` の `window.__COUNTER_API_URL__` を、デプロイ後の Worker URL に差し替える。
例: `https://mahotoke-counter.<your-subdomain>.workers.dev/counter`

