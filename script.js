// Audioオブジェクトを保持する変数を宣言
let currentAudio = null;

document.addEventListener('DOMContentLoaded', () => {
    // ボタン要素を取得
    const nyanpasuButton = document.getElementById('nyanpasuButton');

    // ボタンがクリックされたときの処理
    nyanpasuButton.addEventListener('click', () => {
        // 現在再生中の音声があれば停止させる
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0; // 再生位置を最初に戻す
        }

        // 新しいAudioオブジェクトを作成し、音声を再生
        currentAudio = new Audio('sound.mp3'); // 音声ファイルのパスを指定
        currentAudio.play();
    });
});
