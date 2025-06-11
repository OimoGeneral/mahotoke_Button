document.addEventListener('DOMContentLoaded', () => {
    const mahotokeButton = document.getElementById('mahotokeImageButton');
    const audio = document.getElementById('mahotokeAudio');

    // 安全装置：HTML要素が見つからない場合は処理を中断
    if (!mahotokeButton || !audio) {
        console.error('Error: Required HTML elements not found!');
        return;
    }

    // --- 音声ファイルリストの自動生成 ---
    // soundフォルダにある音声ファイルの総数をここに設定してください。
    // 例: sound1.mp3からsound80.mp3まである場合は「80」と入力します。
    const totalSounds = 144;

    // 上記の総数に基づいて、'Assets/sound/soundN.mp3'の形式で配列を自動生成します。
    const soundFiles = [];
    for (let i = 1; i <= totalSounds; i++) {
        soundFiles.push(`Assets/sound/sound${i}.mp3`);
    }

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
    mahotokeButton.addEventListener('mousedown', pressButton);
    mahotokeButton.addEventListener('mouseup', releaseButton);
    mahotokeButton.addEventListener('mouseleave', releaseButton);

    mahotokeButton.addEventListener('touchstart', (e) => {
        e.preventDefault(); // マウスイベントの重複発火（ゴーストクリック）を防止
        pressButton();
    }, { passive: false });
    mahotokeButton.addEventListener('touchend', releaseButton);
    mahotokeButton.addEventListener('touchcancel', releaseButton);

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
