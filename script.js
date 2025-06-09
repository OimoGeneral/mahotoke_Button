let currentAudio = null;

document.addEventListener('DOMContentLoaded', () => {
    const mahotokeImageButton = document.getElementById('mahotokeImageButton');

    const soundPath = 'Assets/sound/sound.mp3';

    if (!mahotokeImageButton) {
        console.error('Error: mahotokeImageButton element not found!');
        return;
    }

    // --- イベントハンドラー関数 ---
    // ボタンが押されたときの共通処理（音声再生のみ）
    function handleAudioPlay() {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0; // 再生位置を最初に戻す
        }
        currentAudio = new Audio(soundPath);
        currentAudio.play().catch(e => {
            console.error("Audio playback failed:", e);
        });
    }

    // --- イベントリスナー ---
    // マウスイベントとタッチイベントの両方で音声再生をトリガー
    // CSSの:activeで画像縮小は処理されます。

    // PC: マウスが押されたら音を鳴らす
    mahotokeImageButton.addEventListener('mousedown', handleAudioPlay);

    // スマホ: タッチが開始されたら音を鳴らす
    mahotokeImageButton.addEventListener('touchstart', (e) => {
        // e.preventDefault(); // ★★★ ここを削除 ★★★
        handleAudioPlay();
    }, { passive: false }); // passive: false は残しておく（touchstartでpreventDefaultを呼ぶ場合のためだが、残しても問題なし）

    // キーボード操作での再生（Enter/Spaceキー）
    mahotokeImageButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleAudioPlay();
        }
    });
});
