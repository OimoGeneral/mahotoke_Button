document.addEventListener('DOMContentLoaded', () => {
    const mahotokeButton = document.getElementById('mahotokeImageButton');
    if (!mahotokeButton) {
        console.error('Error: mahotokeImageButton element not found!');
        return;
    }

    const audio = new Audio('Assets/sound/sound.mp3');

    const pressButton = () => {
        if (mahotokeButton.classList.contains('button-active')) return;
        mahotokeButton.classList.add('button-active');
        audio.currentTime = 0;
        audio.play().catch(error => console.error("Audio playback failed:", error));
    };

    const releaseButton = () => {
        mahotokeButton.classList.remove('button-active');
    };

    // --- イベントリスナー ---

    // PCでの押下
    mahotokeButton.addEventListener('mousedown', pressButton);

    // 【修正箇所】スマホでの押下
    mahotokeButton.addEventListener('touchstart', (e) => {
        // 後続のマウスイベント（mousedown, clickなど）の発火をキャンセルする
        e.preventDefault();
        pressButton();
    }, { passive: false }); // preventDefaultを許可するためにpassiveをfalseに設定

    // 離した時
    mahotokeButton.addEventListener('mouseup', releaseButton);
    mahotokeButton.addEventListener('mouseleave', releaseButton);
    mahotokeButton.addEventListener('touchend', releaseButton);
    mahotokeButton.addEventListener('touchcancel', releaseButton);

    // キーボード操作
    mahotokeButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            pressButton();
        }
    });

    mahotokeButton.addEventListener('keyup', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            releaseButton();
        }
    });
});
