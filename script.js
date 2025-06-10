document.addEventListener('DOMContentLoaded', () => {
    const mahotokeButton = document.getElementById('mahotokeImageButton');
    const audio = document.getElementById('mahotokeAudio');

    // 安全装置：HTML要素が見つからない場合は処理を中断
    if (!mahotokeButton || !audio) {
        console.error('Error: Required HTML elements not found!');
        return;
    }

    // 64個の音声ファイルリスト
    const soundFiles = [
        'Assets/sound/sound1.mp3', 'Assets/sound/sound2.mp3', 'Assets/sound/sound3.mp3', 'Assets/sound/sound4.mp3',
        'Assets/sound/sound5.mp3', 'Assets/sound/sound6.mp3', 'Assets/sound/sound7.mp3', 'Assets/sound/sound8.mp3',
        'Assets/sound/sound9.mp3', 'Assets/sound/sound10.mp3', 'Assets/sound/sound11.mp3', 'Assets/sound/sound12.mp3',
        'Assets/sound/sound13.mp3', 'Assets/sound/sound14.mp3', 'Assets/sound/sound15.mp3', 'Assets/sound/sound16.mp3',
        'Assets/sound/sound17.mp3', 'Assets/sound/sound18.mp3', 'Assets/sound/sound19.mp3', 'Assets/sound/sound20.mp3',
        'Assets/sound/sound21.mp3', 'Assets/sound/sound22.mp3', 'Assets/sound/sound23.mp3', 'Assets/sound/sound24.mp3',
        'Assets/sound/sound25.mp3', 'Assets/sound/sound26.mp3', 'Assets/sound/sound27.mp3', 'Assets/sound/sound28.mp3',
        'Assets/sound/sound29.mp3', 'Assets/sound/sound30.mp3', 'Assets/sound/sound31.mp3', 'Assets/sound/sound32.mp3',
        'Assets/sound/sound33.mp3', 'Assets/sound/sound34.mp3', 'Assets/sound/sound35.mp3', 'Assets/sound/sound36.mp3',
        'Assets/sound/sound37.mp3', 'Assets/sound/sound38.mp3', 'Assets/sound/sound39.mp3', 'Assets/sound/sound40.mp3',
        'Assets/sound/sound41.mp3', 'Assets/sound/sound42.mp3', 'Assets/sound/sound43.mp3', 'Assets/sound/sound44.mp3',
        'Assets/sound/sound45.mp3', 'Assets/sound/sound46.mp3', 'Assets/sound/sound47.mp3', 'Assets/sound/sound48.mp3',
        'Assets/sound/sound49.mp3', 'Assets/sound/sound50.mp3', 'Assets/sound/sound51.mp3', 'Assets/sound/sound52.mp3',
        'Assets/sound/sound53.mp3', 'Assets/sound/sound54.mp3', 'Assets/sound/sound55.mp3', 'Assets/sound/sound56.mp3',
        'Assets/sound/sound57.mp3', 'Assets/sound/sound58.mp3', 'Assets/sound/sound59.mp3', 'Assets/sound/sound60.mp3',
        'Assets/sound/sound61.mp3', 'Assets/sound/sound62.mp3', 'Assets/sound/sound63.mp3', 'Assets/sound/sound64.mp3'
    ];

    // --- 状態管理のための変数 ---
    let nextSoundSrc = null;    // 次に再生するために予約・プリロード済みの音
    let lastPlayIndex = -1;     // 連続再生防止用のインデックス

    // --- 次の音声を準備（予約＆プリロード）する関数 ---
    function prepareNextSound() {
        let nextIndex;
        // 前回と同じでないランダムなインデックスを選ぶ
        do {
            nextIndex = Math.floor(Math.random() * soundFiles.length);
        } while (soundFiles.length > 1 && nextIndex === lastPlayIndex);
        
        lastPlayIndex = nextIndex; // 次回の抽選のために、今回の番号を記憶
        nextSoundSrc = soundFiles[nextIndex]; // 次の音のパスを「予約」

        // 予約した音をプリロード開始
        new Audio(nextSoundSrc);
    }

    // --- ボタンが押された時の処理 ---
    const pressButton = () => {
        // 既に押されている状態なら何もしない（キーボード長押し対策）
        if (mahotokeButton.classList.contains('button-active')) return;

        mahotokeButton.classList.add('button-active');

        // 再生処理：予約されていた 'nextSoundSrc' を再生対象とする
        if (nextSoundSrc) {
            audio.src = nextSoundSrc;
            audio.currentTime = 0;
            audio.play().catch(error => console.error("Audio playback failed:", error));
        }

        // 次の音の準備：再生と同時に、次の次のクリックに備えて新しい音を予約＆プリロードする
        prepareNextSound();
    };

    // --- ボタンから離れた時の処理 ---
    const releaseButton = () => {
        mahotokeButton.classList.remove('button-active');
    };

    // --- 各種イベントリスナーの設定 ---

    // PC: マウス操作
    mahotokeButton.addEventListener('mousedown', pressButton);
    mahotokeButton.addEventListener('mouseup', releaseButton);
    mahotokeButton.addEventListener('mouseleave', releaseButton);

    // スマホ: タッチ操作
    mahotokeButton.addEventListener('touchstart', (e) => {
        e.preventDefault(); // マウスイベントの重複発火（ゴーストクリック）を防止
        pressButton();
    }, { passive: false });
    mahotokeButton.addEventListener('touchend', releaseButton);
    mahotokeButton.addEventListener('touchcancel', releaseButton);

    // PC: キーボード操作
    mahotokeButton.addEventListener('keydown', (e) => {
        // EnterキーかSpaceキーが押された場合
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault(); // Spaceキーでの画面スクロール防止
            pressButton();
        }
    });
    mahotokeButton.addEventListener('keyup', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            releaseButton();
        }
    });

    // --- 初期化 ---
    // ページを開いた時点で、最初の音を準備しておく
    prepareNextSound();
});
