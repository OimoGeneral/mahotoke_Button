document.addEventListener('DOMContentLoaded', () => {
    const mahotokeButton = document.getElementById('mahotokeImageButton');
    if (!mahotokeButton) {
        console.error('Error: mahotokeImageButton element not found!');
        return;
    }

    // Audioオブジェクトは一度だけ生成し、使い回す
    const audio = new Audio('Assets/sound/sound.mp3');

    // --- 処理を関数に分離 ---

    // 押した時の処理（再生 & 縮小）
    const pressButton = () => {
        // 既にアクティブな場合は処理しない（キーボード長押しなどでの連続発火を防ぐ）
        if (mahotokeButton.classList.contains('button-active')) return;

        mahotokeButton.classList.add('button-active'); // 先にクラスを追加して視覚的反応を速くする
        audio.currentTime = 0;
        audio.play().catch(error => console.error("Audio playback failed:", error));
    };

    // 離した時の処理（元のサイズに戻す）
    const releaseButton = () => {
        mahotokeButton.classList.remove('button-active');
    };

    // --- イベントリスナーの再設定 ---

    // 押下時
    mahotokeButton.addEventListener('mousedown', pressButton);
    mahotokeButton.addEventListener('touchstart', pressButton, { passive: true }); // passive:trueでスクロール性能を阻害しない

    // 離した時
    mahotokeButton.addEventListener('mouseup', releaseButton);
    mahotokeButton.addEventListener('mouseleave', releaseButton); // カーソルがボタンから外れた場合
    mahotokeButton.addEventListener('touchend', releaseButton);
    mahotokeButton.addEventListener('touchcancel', releaseButton); // タッチが予期せずキャンセルされた場合

    // キーボード操作
    mahotokeButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault(); // Spaceキーでの画面スクロールを防止
            pressButton();
        }
    });

    mahotokeButton.addEventListener('keyup', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            releaseButton();
        }
    });
});
