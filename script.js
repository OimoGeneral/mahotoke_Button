let currentAudio = null;

document.addEventListener('DOMContentLoaded', () => {
    // 画像ボタン要素を取得
    const mahotokeImageButton = document.getElementById('mahotokeImageButton');

    // 画像パスを定義（GitHubリポジトリ内に配置することを想定）
    const imagePaths = {
        normal: 'mahotoke_normal.png',   // 通常時の画像
        clicked: 'mahotoke_clicked.png'  // クリック時の画像
    };
    // もし画像ボタンのファイルもAssets/image/に移動した場合は、以下のように変更
    /*
    const imagePaths = {
        normal: 'Assets/image/mahotoke_normal.png',
        clicked: 'Assets/image/mahotoke_clicked.png'
    };
    */

    // 音声ファイルのパス
    const soundPath = 'sounds/sound.mp3'; // ここもGitHubリポジトリ内のパス。
                                       // もしAssets/sound/に移動した場合は 'Assets/sound/sound.mp3' に変更
    // ...
    currentAudio = new Audio(soundPath);
    currentAudio.play();

    // クリック時に画像を切り替え
    mahotokeImageButton.src = imagePaths.clicked;

    // 音声再生が終わったら画像を元に戻す（任意）
    currentAudio.onended = () => {
        mahotokeImageButton.src = imagePaths.normal;
    };
});

// マウスが離れた時や、ページのロード時など、
// クリック状態が解除されたら画像を元に戻す処理も追加できます。
// 例: マウスボタンを離した時
mahotokeImageButton.addEventListener('mouseup', () => {
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

// ページのロード時に画像が確実にnormalになるように
mahotokeImageButton.src = imagePaths.normal;
});
