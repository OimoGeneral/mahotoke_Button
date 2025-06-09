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
        e.preventDefault(); // デフォルトの動作（スクロール、ズーム）を防止
        handleAudioPlay();
    }, { passive: false });

    // クリックイベントは削除（これが二重再生の原因になっている可能性が高い）
    // mahotokeImageButton.addEventListener('click', handleAudioPlay);

    // キーボード操作での再生（Enter/Spaceキー）
    mahotokeImageButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleAudioPlay();
        }
    });

    // 押したときに画像が小さくなるのはCSSの:activeで自動的に処理されるため、
    // JavaScript側でsetImageNormalなどを呼ぶ必要はありません。
    // そのため、mouseup, mouseleave, touchend, blur のリスナーも音声再生や画像変更のためには不要です。
});
