// --- Variáveis Globais e Configurações ---
const CORRECT_COUPON = 'MARCELO';
const DISCOUNT_PERCENTAGE = 0.30; // 30%
const TIMER_START_SECONDS = 7 * 60; // 7 minutos
const PIX_KEY = '81997777361'; 
const INSTAGRAM_USERNAME = 'marcelinho_zzs';
const INSTAGRAM_MESSAGE = 'COMPREI O HS + HOLOGRAMA';

// Tabela de preços dinâmicos por dia (Seu pedido)
const DAY_PRICES = {
    1: 5.0, 2: 6.0, 3: 8.0, 4: 10.0, 5: 13.0, 6: 15.0, 7: 18.0, 8: 20.0, 9: 22.0, 10: 24.0,
    11: 26.0, 12: 28.0, 13: 30.0, 14: 31.0, 15: 32.0, 16: 34.0, 17: 36.0, 18: 38.0, 19: 39.0, 20: 40.0,
    21: 42.0, 22: 44.0, 23: 46.0, 24: 48.0, 25: 50.0, 26: 51.0, 27: 52.0, 28: 53.0, 29: 55.0, 30: 60.0
};

const INITIAL_PRODUCT_PRICE = 30.00;
let currentProductPrice = INITIAL_PRODUCT_PRICE;
let finalPaymentPrice = 0;
let daysSelected = 0;

// Cria o link de deep link
const INSTAGRAM_LINK_DIRECT = `https://ig.me/m/${INSTAGRAM_USERNAME}?ref=COMPRA-SITE&text=${encodeURIComponent(INSTAGRAM_MESSAGE)}`;


// --- Seletores DOM ---
const timerDisplay = document.getElementById('timer-display');
const countdownTimer = document.getElementById('countdown-timer');
const priceIndicator = document.querySelector('.price-indicator');

// Cupom
const couponInput = document.getElementById('coupon-input');
const couponMessage = document.getElementById('coupon-message');
const applyCouponBtn = document.getElementById('apply-coupon-btn');

// Modals e Botões
const startPurchaseBtn = document.getElementById('start-purchase-btn');
const attentionModal = document.getElementById('attention-modal');
const closeBtns = document.querySelectorAll('.close-btn');
const confirmModalBtn = document.getElementById('confirm-modal-btn');
const durationModal = document.getElementById('duration-modal');
const durationInput = document.getElementById('duration-input');
const durationValidationMessage = document.getElementById('duration-validation-message');
const paymentStepContent = document.getElementById('payment-step-content');
const finalPriceElement = document.getElementById('final-price');

// Pagamento
const copyPixBtn = document.getElementById('copy-pix-btn');
const copyFeedback = document.getElementById('copy-feedback');
const bankInfoDiv = document.getElementById('bank-info');
const instagramInstructions = document.getElementById('instagram-instructions');
const openInstagramBtn = document.getElementById('open-instagram-btn');


// --- FUNÇÕES DE TIMER (Contagem regressiva) ---

function formatTime(seconds) {
    const min = String(Math.floor(seconds / 60)).padStart(2, '0');
    const sec = String(seconds % 60).padStart(2, '0');
    return `${min}:${sec}`;
}

let timerInterval;

function startTimer() {
    let timeLeft = TIMER_START_SECONDS;
    timerDisplay.textContent = formatTime(timeLeft);

    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = formatTime(timeLeft);

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerDisplay.textContent = 'TEMPO ESGOTADO!';
            // Lógica opcional para desativar a compra aqui.
        }
    }, 1000);
}

// --- FUNÇÕES DE LÓGICA TELA 1 (Cupom e Preço) ---

function updatePriceDisplay() {
    priceIndicator.textContent = `Preço: R$${currentProductPrice.toFixed(2).replace('.', ',')}`;
}

applyCouponBtn.addEventListener('click', function() {
    const input = couponInput.value.trim();
    const messageElement = couponMessage;
    
    if (input.toUpperCase() === CORRECT_COUPON) { 
        currentProductPrice = INITIAL_PRODUCT_PRICE * (1 - DISCOUNT_PERCENTAGE);
        messageElement.textContent = `🎉 Cupom aceito! 30% de desconto aplicado. Preço: R$${currentProductPrice.toFixed(2).replace('.', ',')} 🎉`;
        messageElement.className = 'coupon-message success';
    } else {
        currentProductPrice = INITIAL_PRODUCT_PRICE;
        messageElement.textContent = 'O cupom está incorreto ou vazio. Preço original mantido.';
        messageElement.className = 'coupon-message incorrect';
    }
    updatePriceDisplay();
});


// --- FUNÇÕES DE CONTROLE DE MODAL ---

function openModal(modal) {
    modal.style.display = 'block';
}

function closeModal(modal) {
    modal.style.display = 'none';
}

// Handler: Abre o Modal de Atenção
startPurchaseBtn.addEventListener('click', () => {
    openModal(attentionModal);
});

// Handler: Fecha os Modals (Botão X)
closeBtns.forEach(btn => btn.addEventListener('click', () => {
    closeModal(attentionModal);
    closeModal(durationModal);
}));

// Handler: Passa do Modal de Atenção para o Modal de Duração
confirmModalBtn.addEventListener('click', () => {
    closeModal(attentionModal);
    openModal(durationModal);
    // Limpa a entrada e mensagem de erro ao abrir
    durationInput.value = '';
    durationValidationMessage.textContent = '';
    paymentStepContent.style.display = 'none';
});

// --- FUNÇÕES DE LÓGICA MODAL DURAÇÃO ---

durationInput.addEventListener('input', function() {
    // 1. Limitar a entrada a 2 dígitos (ou 1 se for o caso)
    let value = this.value.replace(/\D/g, ''); // Remove não-dígitos
    if (value.length > 2) {
        value = value.slice(0, 2);
    }
    this.value = value;

    daysSelected = parseInt(value);

    // Esconde os detalhes do pagamento por padrão
    paymentStepContent.style.display = 'none';
    durationValidationMessage.textContent = '';
    durationValidationMessage.className = 'validation-message';

    if (isNaN(daysSelected) || daysSelected < 1) {
        // Nada selecionado ou inválido, apenas retorna
        return;
    }

    if (daysSelected > 30) {
        durationValidationMessage.textContent = 'VOCÊ SÓ PODE ESCOLHER DE 1 A 30 DIAS';
        durationValidationMessage.className = 'validation-message incorrect';
        return;
    }
    
    // 2. Cálculo do Preço
    finalPaymentPrice = DAY_PRICES[daysSelected];
    
    if (finalPaymentPrice) {
        const priceFormatted = finalPaymentPrice.toFixed(2).replace('.', ',');
        finalPriceElement.textContent = `R$${priceFormatted}`;
        durationValidationMessage.textContent = `✅ ${daysSelected} dias selecionados. Preço: R$${priceFormatted}`;
        durationValidationMessage.className = 'validation-message success';
        
        // Exibe a seção de pagamento
        paymentStepContent.style.display = 'block';
        
        // Reseta informações de pagamento
        copyFeedback.textContent = '';
        bankInfoDiv.style.display = 'none';
        openInstagramBtn.style.display = 'none';
        instagramInstructions.style.display = 'none';
    }
});

// Forçar o teclado numérico em dispositivos móveis (já feito com inputmode="numeric" no HTML, mas reforçando)
durationInput.addEventListener('focus', function() {
    this.setAttribute('inputmode', 'numeric');
});

// --- FUNÇÕES DE LÓGICA PAGAMENTO ---

// Handler: Copia a chave PIX
copyPixBtn.addEventListener('click', function() {
    if (finalPaymentPrice === 0) {
        copyFeedback.textContent = 'Selecione a duração antes de copiar.';
        copyFeedback.className = 'incorrect';
        return;
    }

    const priceFormatted = finalPaymentPrice.toFixed(2).replace('.', ',');
    
    // Copia a chave Pix
    navigator.clipboard.writeText(PIX_KEY)
        .then(() => {
            // Sucesso na cópia
            copyFeedback.textContent = `✅ Chave PIX copiada com sucesso! Valor: R$${priceFormatted}`;
            copyFeedback.className = 'success';
            
            // Mostra os detalhes do banco e o botão Instagram
            bankInfoDiv.style.display = 'block';
            openInstagramBtn.style.display = 'block';
            instagramInstructions.style.display = 'block';
        })
        .catch(err => {
            // Falha na cópia (fallback)
            console.error('Falha ao copiar:', err);
            copyFeedback.textContent = `Erro ao copiar (Copie manualmente): ${PIX_KEY}. Valor: R$${priceFormatted}`;
            copyFeedback.className = 'incorrect';
            bankInfoDiv.style.display = 'block'; // Mostra os dados mesmo com erro
        });
});

// Handler: Abre o Instagram no Direct com a mensagem pronta
openInstagramBtn.addEventListener('click', function() {
    window.open(INSTAGRAM_LINK_DIRECT, '_blank');
});

// --- FUNÇÕES DE SCROLL (Para o Timer Fixo) ---

function handleScroll() {
    if (window.scrollY > 50) { // Se rolar mais de 50px
        countdownTimer.classList.add('scrolled-timer');
    } else {
        countdownTimer.classList.remove('scrolled-timer');
    }
}


// --- Inicialização ---

window.addEventListener('scroll', handleScroll);
startTimer(); 
updatePriceDisplay(); 
