document.addEventListener('DOMContentLoaded', () => {
    const mahotokeButton = document.getElementById('mahotokeImageButton');
    const audio = document.getElementById('mahotokeAudio');

    if (!mahotokeButton || !audio) {
        console.error('Error: Element not found!');
        return;
    }

    // 64個の音声ファイルリスト
const soundFiles = [
    'Assets/sound/sound1.mp3',
    'Assets/sound/sound2.mp3',
    'Assets/sound/sound3.mp3',
    'Assets/sound/sound4.mp3',
    'Assets/sound/sound5.mp3',
    'Assets/sound/sound6.mp3',
    'Assets/sound/sound7.mp3',
    'Assets/sound/sound8.mp3',
    'Assets/sound/sound9.mp3',
    'Assets/sound/sound10.mp3',
    'Assets/sound/sound11.mp3',
    'Assets/sound/sound12.mp3',
    'Assets/sound/sound13.mp3',
    'Assets/sound/sound14.mp3',
    'Assets/sound/sound15.mp3',
    'Assets/sound/sound16.mp3',
    'Assets/sound/sound17.mp3',
    'Assets/sound/sound18.mp3',
    'Assets/sound/sound19.mp3',
    'Assets/sound/sound20.mp3',
    'Assets/sound/sound21.mp3',
    'Assets/sound/sound22.mp3',
    'Assets/sound/sound23.mp3',
    'Assets/sound/sound24.mp3',
    'Assets/sound/sound25.mp3',
    'Assets/sound/sound26.mp3',
    'Assets/sound/sound27.mp3',
    'Assets/sound/sound28.mp3',
    'Assets/sound/sound29.mp3',
    'Assets/sound/sound30.mp3',
    'Assets/sound/sound31.mp3',
    'Assets/sound/sound32.mp3',
    'Assets/sound/sound33.mp3',
    'Assets/sound/sound34.mp3',
    'Assets/sound/sound35.mp3',
    'Assets/sound/sound36.mp3',
    'Assets/sound/sound37.mp3',
    'Assets/sound/sound38.mp3',
    'Assets/sound/sound39.mp3',
    'Assets/sound/sound40.mp3',
    'Assets/sound/sound41.mp3',
    'Assets/sound/sound42.mp3',
    'Assets/sound/sound43.mp3',
    'Assets/sound/sound44.mp3',
    'Assets/sound/sound45.mp3',
    'Assets/sound/sound46.mp3',
    'Assets/sound/sound47.mp3',
    'Assets/sound/sound48.mp3',
    'Assets/sound/sound49.mp3',
    'Assets/sound/sound50.mp3',
    'Assets/sound/sound51.mp3',
    'Assets/sound/sound52.mp3',
    'Assets/sound/sound53.mp3',
    'Assets/sound/sound54.mp3',
    'Assets/sound/sound55.mp3',
    'Assets/sound/sound56.mp3',
    'Assets/sound/sound57.mp3',
    'Assets/sound/sound58.mp3',
    'Assets/sound/sound59.mp3',
    'Assets/sound/sound60.mp3',
    'Assets/sound/sound61.mp3',
    'Assets/sound/sound62.mp3',
    'Assets/sound/sound63.mp3',
    'Assets/sound/sound64.mp3'
];

    // ▼▼▼【追加】前回再生した音声の番号を記憶する変数 ▼▼▼
    let lastPlayIndex = -1;

    const pressButton = () => {
        if (mahotokeButton.classList.contains('button-active')) return;
        mahotokeButton.classList.add('button-active');

        // ▼▼▼【修正】ランダム選択ロジック ▼▼▼
        let randomIndex;
        // 前回と同じ番号だったら、もう一度だけ選び直す
        do {
            randomIndex = Math.floor(Math.random() * soundFiles.length);
        } while (soundFiles.length > 1 && randomIndex === lastPlayIndex);

        // 今回再生した番号を記憶しておく
        lastPlayIndex = randomIndex;
        // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

        const randomSoundSrc = soundFiles[randomIndex];
        audio.src = randomSoundSrc;
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
