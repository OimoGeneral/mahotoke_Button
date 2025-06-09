let currentAudio = null;
let isTouched = false; // タッチイベントが先に発火したかを管理するフラグ
let releaseTimer = null; // 画像を元に戻すためのタイマーID

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
    function handleAudioPlay() {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }
        currentAudio = new Audio(soundPath);
        currentAudio.play().catch(e => {
            console.error("Audio playback failed:", e);
        });
    }

    function setImageClicked() {
        mahotokeImageButton.src = imagePaths.clicked;
    }

    function setImageNormal() {
        mahotokeImageButton.src = imagePaths.normal;
    }

    // --- イベントリスナー ---

    // PC (マウス) イベント
    mahotokeImageButton.addEventListener('mousedown', () => {
        setImageClicked();
        handleAudioPlay();
        // 短いタイマーを設定し、もしmouseupが来なかったら自動的に元に戻す
        releaseTimer = setTimeout(setImageNormal, 300); // 300ms後に戻す（調整可能）
    });

    mahotokeImageButton.addEventListener('mouseup', () => {
        clearTimeout(releaseTimer); // mouseupが正常に来たのでタイマーをクリア
        setImageNormal();
    });
    mahotokeImageButton.addEventListener('mouseleave', () => {
        clearTimeout(releaseTimer); // mouseleaveが正常に来たのでタイマーをクリア
        setImageNormal();
    });

    // スマホ (タッチ) イベント
    mahotokeImageButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isTouched = true;
        setImageClicked();
        handleAudioPlay();
        // 短いタイマーを設定し、もしtouchendが来なかったら自動的に元に戻す
        releaseTimer = setTimeout(setImageNormal, 300); // 300ms後に戻す（調整可能）
    }, { passive: false });

    mahotokeImageButton.addEventListener('touchend', (e) => {
        e.preventDefault();
        clearTimeout(releaseTimer); // touchendが正常に来たのでタイマーをクリア
        setImageNormal();
        isTouched = false;
    }, { passive: false });

    // クリックイベント (フォールバック)
    mahotokeImageButton.addEventListener('click', (e) => {
        if (isTouched) { // タッチイベントが発火した場合は無視
            return;
        }
        // PCクリックの場合、mousedown/mouseupで既に処理されるので、
        // このclickイベントでは特に画像切り替えは不要かもしれないが、
        // 念のため画像がclickedになっていないかチェック
        if (mahotokeImageButton.src !== imagePaths.clicked) {
             setImageClicked();
             handleAudioPlay();
             releaseTimer = setTimeout(setImageNormal, 300); // 300ms後に戻す
        }
    });

    // キーボード操作など (PCでのアクセシビリティのため)
    mahotokeImageButton.addEventListener('blur', () => {
        clearTimeout(releaseTimer); // フォーカスが外れたらタイマーをクリア
        setImageNormal();
    });
});
