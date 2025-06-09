let currentAudio = null;

document.addEventListener('DOMContentLoaded', () => {
    // 画像ボタン要素を取得
    const mahotokeImageButton = document.getElementById('mahotokeImageButton');

    // 画像パスを定義
    const imagePaths = {
        normal: 'Assets/image/mahotoke_normal.png',   // 通常時の画像
        clicked: 'Assets/image/mahotoke_clicked.png'  // クリック時の画像
    };

    // 音声ファイルのパス
    const soundPath = 'Assets/sound/sound.mp3';

    // mahotokeImageButton が存在することを確認
    if (!mahotokeImageButton) {
        console.error('Error: mahotokeImageButton element not found!');
        return; // 要素が見つからない場合は処理を中断
    }

    // 初期設定：ページのロード時に画像が確実にnormalになるように
    mahotokeImageButton.src = imagePaths.normal;

    // ボタンがクリックされたときの処理
    mahotokeImageButton.addEventListener('click', () => {
        // 現在再生中の音声があれば停止させる
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0; // 再生位置を最初に戻す
        }

        // 新しいAudioオブジェクトを作成し、音声を再生
        currentAudio = new Audio(soundPath);
        currentAudio.play().catch(e => {
            // 自動再生ポリシーなどで再生がブロックされた場合の対応
            console.error("Audio playback failed:", e);
            // ユーザーに再生を促すメッセージを表示するなど
        });

        // クリック時に画像を切り替え
        mahotokeImageButton.src = imagePaths.clicked;

        // 音声再生が終わったら画像を元に戻す
        currentAudio.onended = () => {
            mahotokeImageButton.src = imagePaths.normal;
        };
    });

    // マウスが離れた時や、ページのロード時など、
    // クリック状態が解除されたら画像を元に戻す処理
    mahotokeImageButton.addEventListener('mouseup', () => {
        // 音が鳴っている間はclicked画像を維持し、そうでなければnormalに戻す
        if (currentAudio && !currentAudio.paused) {
            // 音が鳴っている間はclicked画像を維持
        } else {
            mahotokeImageButton.src = imagePaths.normal;
        }
    });

    // キーボード操作などでフォーカスが外れた時
    mahotokeImageButton.addEventListener('blur', () => {
        mahotokeImageButton.src = imagePaths.normal;
    });

    // ここで document.addEventListener('DOMContentLoaded', ... のクロージャが閉じます
});
