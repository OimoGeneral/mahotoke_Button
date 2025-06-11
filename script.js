document.addEventListener('DOMContentLoaded', () => {
    // --- 要素の取得 ---
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
        if (mahotokeButton.classList.contains('button-active')) return;
        mahotokeButton.classList.add('button-active');

        if (nextSoundSrc) {
            audio.src = nextSoundSrc;
            audio.currentTime = 0;
            audio.play().catch(error => console.error("Audio playback failed:", error));
        }

        prepareNextSound();
    };

    // --- ボタンから離れた時の処理 ---
    const releaseButton = () => {
        mahotokeButton.classList.remove('button-active');
    };

    // --- ボタンのイベントリスナー設定 ---
    mahotokeButton.addEventListener('mousedown', pressButton);
    mahotokeButton.addEventListener('mouseup', releaseButton);
    mahotokeButton.addEventListener('mouseleave', releaseButton);
    mahotokeButton.addEventListener('touchstart', (e) => { e.preventDefault(); pressButton(); }, { passive: false });
    mahotokeButton.addEventListener('touchend', releaseButton);
    mahotokeButton.addEventListener('touchcancel', releaseButton);
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

    // --- 画面クリック時のエフェクト処理 ---
    function createAdvancedEffect(x, y) {
        const container = document.createElement('div');
        container.className = 'advanced-click-effect';
        container.style.left = `${x}px`;
        container.style.top = `${y}px`;

        const ripple = document.createElement('div');
        ripple.className = 'gradient-ripple';
        container.appendChild(ripple);

        // 三角形の数を3または4でランダムに決定
        const numTriangles = Math.floor(Math.random() * 2) + 3; 
        for (let i = 0; i < numTriangles; i++) {
            const tri = document.createElement('div');
            tri.className = 'effect-triangle';
            const size = Math.random() * 8 + 6;
            const angle = Math.random() * 360;
            const distance = Math.random() * 40 + 60;
            const initialRotation = Math.random() * 180 - 90;
            const finalRotation = initialRotation + (Math.random() > 0.5 ? 180 : -180);
            tri.style.setProperty('--size', `${size}px`);
            tri.style.setProperty('--r-from', `${initialRotation}deg`);
            tri.style.setProperty('--r-to', `${finalRotation}deg`);
            tri.style.transform = `rotate(${angle}deg) translateY(-${distance}px) rotate(-${angle}deg)`;
            tri.style.animationDelay = `${Math.random() * 0.2}s`;
            container.appendChild(tri);
        }

        // 2本の彗星（円弧）を生成する処理
        const svgContainer = document.createElement('div');
        svgContainer.className = 'svg-container';
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const svgSize = 180;
        svg.setAttribute('viewBox', `0 0 ${svgSize} ${svgSize}`);
        svg.style.width = `${svgSize}px`;
        svg.style.height = `${svgSize}px`;

        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        const gradientId = `grad-${Date.now()}`;
        gradient.setAttribute('id', gradientId);
        gradient.setAttribute('gradientTransform', 'rotate(90)');
        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', '#c1eeff');
        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', '#c1eeff');
        stop2.setAttribute('stop-opacity', '0');
        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);
        svg.appendChild(defs);

        const radius = 80;
        const semiCircumference = Math.PI * radius;
        const startAngle = Math.random() * 360;

        for (let i = 0; i < 2; i++) {
            const comet = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            comet.setAttribute('class', 'drawing-comet');
            comet.setAttribute('cx', svgSize / 2);
            comet.setAttribute('cy', svgSize / 2);
            comet.setAttribute('r', radius);
            comet.setAttribute('stroke', `url(#${gradientId})`);
            comet.setAttribute('stroke-dasharray', `${semiCircumference} ${semiCircumference * 2}`);
            const currentAngle = startAngle + (i * 180);
            comet.style.setProperty('--start-angle', `${currentAngle}deg`);
            svg.appendChild(comet);
        }
        svgContainer.appendChild(svg);
        container.appendChild(svgContainer);
        document.body.appendChild(container);

        setTimeout(() => {
            container.remove();
        }, 325);
    }

    document.addEventListener('click', (e) => { createAdvancedEffect(e.clientX, e.clientY); });
    document.addEventListener('touchstart', (e) => { const touch = e.touches[0]; createAdvancedEffect(touch.clientX, touch.clientY); }, { passive: true });

    // --- 初期化 ---
    prepareNextSound();
});
