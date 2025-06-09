let currentAudio = null;

document.addEventListener('DOMContentLoaded', () => {
    const mahotokeImageButton = document.getElementById('mahotokeImageButton');

    const imagePaths = {
        normal: 'Assets/image/mahotoke_normal.png',
        clicked: 'Assets/image/mahotoke_clicked.png'
    };

    const soundPath = 'Assets/sound/sound.mp3';

    if (!mahotokeImageButton) {
        console.error('Error: mahotokeImageButton element not found!');
        return;
    }

    // 初期設定：ページのロード時に画像が確実にnormalになるように
    mahotokeImageButton.src = imagePaths.normal;

    // --- イベントハンドラー関数 ---
    function handleButtonPress() {
        // 現在再生中の音声があれば停止させる
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }

        // 新しいAudioオブジェクトを作成し、音声を再生
        currentAudio = new Audio(soundPath);
        currentAudio.play().catch(e => {
            console.error("Audio playback failed:", e);
        });

        // クリック開始時に画像を切り替え
        mahotokeImageButton.src = imagePaths.clicked;
    }

    function handleButtonRelease() {
        mahotokeImageButton.src = imagePaths.normal;
    }

    // --- イベントリスナー ---

    // PC (マウス) イベント
    mahotokeImageButton.addEventListener('mousedown', handleButtonPress);
    mahotokeImageButton.addEventListener('mouseup', handleButtonRelease);
    mahotokeImageButton.addEventListener('mouseleave', handleButtonRelease); // マウスが要素から離れた時

    // スマホ (タッチ) イベント
    // passive: false は、preventDefault() が呼ばれることをブラウザに知らせるため
    // タッチイベントのデリバリーを最適化するが、ここではpreventDefaultを使いたい
    mahotokeImageButton.addEventListener('touchstart', (e) => {
        e.preventDefault(); // デフォルトの動作（スクロール、ズーム）を防止
        handleButtonPress();
    }, { passive: false });

    mahotokeImageButton.addEventListener('touchend', (e) => {
        e.preventDefault(); // デフォルトの動作を防止
        handleButtonRelease();
    }, { passive: false });

    // キーボード操作など (PCでのアクセシビリティのため)
    mahotokeImageButton.addEventListener('blur', handleButtonRelease);

    // クリックイベントの追加 (フォールバックとして)
    // touchstart/touchend が発火しない環境や、一部の特殊なケースでの対策
    mahotokeImageButton.addEventListener('click', (e) => {
        // タッチイベントが既に処理していれば何もしない
        // または、音声再生がまだ行われていない場合にのみ実行
        if (!currentAudio || currentAudio.paused) {
            handleButtonPress();
            handleButtonRelease(); // クリックイベントは押して離す一連の動作なので、両方呼ぶ
        }
    });

});
