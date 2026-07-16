(function() {
    const CONFIG = {
        spriteUrl: "https://raw.githubusercontent.com/WykosVx/Brazilian-Dog-/main/assets/Sprites.png",
        containerId: "brazilian-dog-container",
         menuId: "brazilian-dog-menu",
        totalFrames: 11,
        cols: 4,
        frameSize: 40,
        skins: {
            "Normal": "https://raw.githubusercontent.com/WykosVx/Brazilian-Dog-/main/assets/Sprites.png",
            "Sombrero": "https://raw.githubusercontent.com/WykosVx/Brazilian-Dog-/main/assets/Sprites_sombrero1.png",
            "Lentes": "https://raw.githubusercontent.com/WykosVx/Brazilian-Dog-/main/assets/Sprites_lentes1.png",
            "Gafas de sol": "https://raw.githubusercontent.com/WykosVx/Brazilian-Dog-/main/assets/Sprites_lentes2.png"
        },
        sfxUrls: [
            "https://raw.githubusercontent.com/WykosVx/Brazilian-Dog-/main/assets/Laser_dancehall.mp3",
            "https://raw.githubusercontent.com/WykosVx/Brazilian-Dog-/main/assets/Siren-Sound2.mp3",
            "https://raw.githubusercontent.com/WykosVx/Brazilian-Dog-/main/assets/airhorn.mp3",
            "https://raw.githubusercontent.com/WykosVx/Brazilian-Dog-/main/assets/hey-dj-sound.mp3"
        ]
    };

    function injectDog() {
        const target = document.querySelector(".main-nowPlayingBar-center");
        if (!target || document.getElementById(CONFIG.containerId)) return;

        const container = document.createElement("div");
        container.id = CONFIG.containerId;
        
        Object.assign(container.style, {
            position: "absolute",
            top: "-50px",
            left: "50%",
            transform: "translateX(-50%)",
            width: CONFIG.frameSize + "px",
            height: CONFIG.frameSize + "px",
            backgroundImage: `url('${CONFIG.spriteUrl}')`,
            backgroundSize: "160px 120px",
            zIndex: "99999",
            cursor: "pointer",       
            pointerEvents: "auto"   
        });
        container.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            createMenu(e.clientX, e.clientY);
        });

        target.style.position = "relative";
        target.appendChild(container);

        function createMenu(x, y) {
            let menu = document.getElementById(CONFIG.menuId);
            if (menu) menu.remove();

            menu = document.createElement("div");
            menu.id = CONFIG.menuId;
            Object.assign(menu.style, {
                position: "fixed",
                top: y + "px",
                left: x + "px",
                background: "#282828",
                border: "1px solid #333",
                borderRadius: "8px",
                padding: "5px",
                zIndex: "200000",
                color: "white"
            });
            
            const menuWidth = 150; 
            const menuHeight = Object.keys(CONFIG.skins).length * 36;
            
            let finalX = x;
            let finalY = y;

            if (finalX + menuWidth > window.innerWidth) finalX = window.innerWidth - menuWidth - 10;
            if (finalY + menuHeight > window.innerHeight) finalY = window.innerHeight - menuHeight - 10;

            menu.style.left = finalX + "px";
            menu.style.top = finalY + "px";

            Object.keys(CONFIG.skins).forEach(skinName => {
                const btn = document.createElement("div");
                btn.innerText = skinName;
                btn.style.padding = "8px 15px";
                btn.style.cursor = "pointer";
                btn.onclick = () => {
                    container.style.backgroundImage = `url('${CONFIG.skins[skinName]}')`;
                    menu.remove();
                };
                menu.appendChild(btn);
            });

            document.body.appendChild(menu);
            document.addEventListener("click", () => menu.remove(), { once: true });
        }

    let soundIndex = 0; 
        container.addEventListener("click", () => {
            const currentSfx = CONFIG.sfxUrls[soundIndex];
            const audio = new Audio(currentSfx);
            audio.play();
            
            soundIndex = (soundIndex + 1) % CONFIG.sfxUrls.length;
        });

        target.style.position = "relative";
        target.appendChild(container);

        let frame = 0;
        let currentBpm = 120;

        const updateBpm = async () => {
            try {
                const audioData = await Spicetify.getAudioData();
                currentBpm = audioData?.track?.tempo || 120;
            } catch (e) { currentBpm = 120; }
        };

        Spicetify.Player.addEventListener("songchange", updateBpm);
        updateBpm();

        function animate() {
            if (!Spicetify.Player.data.isPaused) {
                const col = frame % CONFIG.cols;
                const row = Math.floor(frame / CONFIG.cols);
                container.style.backgroundPosition = `-${col * CONFIG.frameSize}px -${row * CONFIG.frameSize}px`;
                
                frame = (frame + 1) % CONFIG.totalFrames;
            }
            const interval = 60000 / (currentBpm * 10);
            setTimeout(animate, interval);
        }
        
        animate(); 
    }

    const observer = new MutationObserver(injectDog);
    observer.observe(document.body, { childList: true, subtree: true });
    injectDog();
})();
