let currentAudio = null;

document.addEventListener('DOMContentLoaded', () => {
    const mahotokeImageButton = document.getElementById('mahotokeImageButton');

    const imagePaths = {
        normal: 'Assets/image/mahotoke_normal.png',   // 通常時の画像
        clicked: 'Assets/image/mahotoke_clicked.png'  // クリック時の画像
    };

    const soundPath = 'Assets/sound/sound.mp3';

    if (!mahotokeImageButton) {
        console.error('Error: mahotokeImageButton element not found!');
        return;
    }

    // 初期設定：ページのロード時に画像が確実にnormalになるように
    mahotokeImageButton.src = imagePaths.normal;

    // ボタンがクリックされたときの処理 (mousedownイベントを使用することで、クリック"開始時"に画像を切り替える)
    mahotokeImageButton.addEventListener('mousedown', () => { // ★ ここを'mousedown'に変更
        // 現在再生中の音声があれば停止させる
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0; // 再生位置を最初に戻す
        }

        // 新しいAudioオブジェクトを作成し、音声を再生
        currentAudio = new Audio(soundPath);
        currentAudio.play().catch(e => {
            console.error("Audio playback failed:", e);
            // ユーザーに再生を促すメッセージなどを表示するならここに
        });

        // クリック開始時に画像を切り替え
        mahotokeImageButton.src = imagePaths.clicked;
    });

    // マウスボタンを離したときに画像を元に戻す
    mahotokeImageButton.addEventListener('mouseup', () => {
        mahotokeImageButton.src = imagePaths.normal;
    });

    // マウスがボタンから離れたときに画像を元に戻す（ドラッグしてボタン外で離した場合など）
    mahotokeImageButton.addEventListener('mouseleave', () => {
        mahotokeImageButton.src = imagePaths.normal;
    });

    // (補足) 音声再生が終わったら画像を元に戻す処理は、
    // mouseupやmouseleaveで画像を戻すため、必須ではなくなりますが、
    // 長い音声でボタンを押しっぱなしにしない場合に備え残しておいても良いでしょう。
    // その場合はmousedownイベント内で currentAudio.onended を設定します。
    // 今回はmouseup/mouseleaveで十分でしょう。

    // キーボード操作などでフォーカスが外れた時（PCでのアクセシビリティのため）
    mahotokeImageButton.addEventListener('blur', () => {
        mahotokeImageButton.src = imagePaths.normal;
    });
});
