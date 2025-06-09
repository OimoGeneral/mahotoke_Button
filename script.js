let currentAudio = null;

document.addEventListener('DOMContentLoaded', () => {
    const mahotokeImageButton = document.getElementById('mahotokeImageButton');

    // 画像パスはCSSが担当するため、ここからは削除
    // const imagePaths = { ... };

    const soundPath = 'Assets/sound/sound.mp3';

    if (!mahotokeImageButton) {
        console.error('Error: mahotokeImageButton element not found!');
        return;
    }

    // 画像の初期設定はHTMLのsrc属性とCSSが担当するため、ここからは削除
    // mahotokeImageButton.src = imagePaths.normal;

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
    // 画像の縮小はCSSの:activeに任せるため、setImageClicked/Normalは不要

    mahotokeImageButton.addEventListener('mousedown', handleAudioPlay); // PC：マウスが押されたら音を鳴らす
    mahotokeImageButton.addEventListener('touchstart', (e) => {
        e.preventDefault(); // デフォルトの動作（スクロール、ズーム）を防止
        handleAudioPlay();  // スマホ：タッチが開始されたら音を鳴らす
    }, { passive: false });

    // クリックイベントも念のため残す（フォールバック）
    mahotokeImageButton.addEventListener('click', handleAudioPlay);


    // キーボード操作での再生（オプション）
    mahotokeImageButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { // Enterキーまたはスペースキーで発火
            e.preventDefault(); // デフォルトのスクロールなどを防止
            handleAudioPlay();
        }
    });

    // 画像の戻し処理もCSSが:activeで自動的に行うため、JavaScriptからは削除
    // mouseup, mouseleave, touchend, blur などはもはや画像変更のためには不要
    // （ただし、必要なら他の目的でリスナーを残すことは可能）
});
