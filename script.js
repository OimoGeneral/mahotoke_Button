let currentAudio = null;
let isTouched = false; // タッチイベントが先に発火したかを管理するフラグ

document.addEventListener('DOMContentLoaded', () => {
    const mahotokeImageButton = document.getElementById('mahotokeImageButton');

    const imagePaths = {
        normal: 'Assets/image/mahotoke_normal.png',   // 通常時の画像
        clicked: 'Assets/image/mahotoke_clicked.png'  // クリック時の画像
    };

    const soundPath = 'Assets/sound/sound.mp3';

    if (!mahotokeImageButton) {
        console.error('Error: mahotokeImageButton element not found!');
        return;
    }

    // 初期設定：ページのロード時に画像が確実にnormalになるように
    mahotokeImageButton.src = imagePaths.normal;

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

    // 画像を切り替える共通処理（押された時）
    function setImageClicked() {
        mahotokeImageButton.src = imagePaths.clicked;
    }

    // 画像を元に戻す共通処理（離された時）
    function setImageNormal() {
        mahotokeImageButton.src = imagePaths.normal;
    }

    // --- イベントリスナー ---

    // PC (マウス) イベント
    mahotokeImageButton.addEventListener('mousedown', () => {
        setImageClicked(); // マウス押下時に画像を切り替え
        handleAudioPlay(); // 音を再生
    });

    mahotokeImageButton.addEventListener('mouseup', setImageNormal); // マウスボタンを離した時に画像を元に戻す
    mahotokeImageButton.addEventListener('mouseleave', setImageNormal); // マウスがボタンから離れた時に画像を元に戻す

    // スマホ (タッチ) イベント
    mahotokeImageButton.addEventListener('touchstart', (e) => {
        e.preventDefault(); // デフォルトの動作（スクロール、ズームなど）を防止
        isTouched = true; // タッチイベントが発火したことを示す
        setImageClicked(); // タッチ開始時に画像を切り替え
        handleAudioPlay(); // 音を再生
    }, { passive: false });

    mahotokeImageButton.addEventListener('touchend', (e) => {
        e.preventDefault(); // デフォルトの動作を防止
        setImageNormal(); // タッチ終了時に画像を元に戻す
        isTouched = false; // フラグリセット
    }, { passive: false });

    // クリックイベント (マウスとタッチの両方で発火する可能性があるが、
    // touchstart/touchend が発火した場合、clickは無視するか制御する)
    mahotokeImageButton.addEventListener('click', (e) => {
        // もし直前にtouchstartが発火していたら、clickイベントは無視する
        // (多くのブラウザではtouchstart後にclickも発火するため、二重処理を防ぐ)
        if (isTouched) {
            return;
        }
        // タッチイベントが発火しなかったPCのクリックなどでは、この処理が走る
        setImageClicked();
        handleAudioPlay();
        // 通常のクリックでは、すぐにmouseupが来るので、setImageNormalはmouseupに任せる
        // または、短い時間で自動的に戻すタイマーを設定することもできますが、
        // 今回はmouseup/touchendに任せるのがシンプル。
    });


    // キーボード操作など (PCでのアクセシビリティのため)
    mahotokeImageButton.addEventListener('blur', setImageNormal);
});
