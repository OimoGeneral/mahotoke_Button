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

    // --- PC (マウス) イベント ---
    // マウスボタンが押されたときの処理
    mahotokeImageButton.addEventListener('mousedown', () => {
        handleButtonPress();
    });

    // マウスボタンを離したときに画像を元に戻す
    mahotokeImageButton.addEventListener('mouseup', () => {
        handleButtonRelease();
    });

    // マウスがボタンから離れたときに画像を元に戻す
    mahotokeImageButton.addEventListener('mouseleave', () => {
        handleButtonRelease();
    });

    // --- スマホ (タッチ) イベント ---
    // タッチが開始されたときの処理
    mahotokeImageButton.addEventListener('touchstart', (e) => {
        e.preventDefault(); // デフォルトの動作（スクロールなど）を防止
        handleButtonPress();
    });

    // タッチが終了したときに画像を元に戻す
    mahotokeImageButton.addEventListener('touchend', (e) => {
        e.preventDefault(); // デフォルトの動作を防止
        handleButtonRelease();
    });

    // キーボード操作などでフォーカスが外れた時（PCでのアクセシビリティのため）
    mahotokeImageButton.addEventListener('blur', () => {
        handleButtonRelease(); // フォーカスが外れたら画像を戻す
    });

    // --- ヘルパー関数 ---
    // ボタンが押されたときの共通処理
    function handleButtonPress() {
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
    }

    // ボタンが離されたときの共通処理
    function handleButtonRelease() {
        mahotokeImageButton.src = imagePaths.normal;
    }

    // （補足）音声再生が終わったら画像を元に戻す処理は、
    // mouseup/touchend/mouseleaveで画像を戻すため、必須ではありませんが、
    // 長い音声でボタンを押しっぱなしにしない場合に備え残しておいても良いでしょう。
    // その場合は handleButtonPress() 内で currentAudio.onended を設定します。
});
