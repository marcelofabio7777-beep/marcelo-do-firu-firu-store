// --- Variáveis Globais e Configurações ---
const ORIGINAL_PRICE = 30.0;
const DISCOUNTED_PRICE = 19.0;
const CORRECT_COUPON = 'MARCELO';
const MINIMUM_AGE = 18; 
const PIX_KEY = '81997777361'; 
const INSTAGRAM_USERNAME = 'marcelinho_zzs';
const INSTAGRAM_MESSAGE = 'COMPREI O HS + HOLOGRAMA';

// Cria o link de deep link (URL Encoding para a mensagem)
const INSTAGRAM_LINK_DIRECT = `https://ig.me/m/${INSTAGRAM_USERNAME}?ref=COMPRA-SITE&text=${encodeURIComponent(INSTAGRAM_MESSAGE)}`;


const DURATION_PRICES = [
    { days: '2 dias', price: 7.00, key: '2D' },
    { days: '7 dias', price: 17.00, key: '7D' },
    { days: '14 dias', price: 30.00, key: '14D' },
    { days: '1 mês', price: 50.00, key: '1M' },
    { days: 'Permanente', price: 250.00, key: 'PERM' }
];

let selectedDurationPrice = 0;

// --- Seletores DOM (Referências aos elementos HTML) ---

// Tela 1 (Home)
const priceElement = document.getElementById('product-price');
const couponInput = document.getElementById('coupon-input');
const couponMessage = document.getElementById('coupon-message');
const applyCouponBtn = document.getElementById('apply-coupon-btn');
const startPurchaseBtn = document.getElementById('start-purchase-btn');

// Foi adicionado um seletor para incluir a nova seção de vantagens
const mainInfoElements = document.querySelectorAll(
    '.product-info h2, .product-info .price, .coupon-section, .image-placeholder, #start-purchase-btn, #exclusive-advantages-section'
);

// Tela 2 (Dados Pessoais)
const dataFormStep = document.getElementById('data-form-step');
const dataValidationMessage = document.getElementById('data-validation-message');
const emailInput = document.getElementById('email-input');
const dobInput = document.getElementById('dob-input');
const confirmationCheckbox = document.getElementById('confirmation-checkbox');
const goToDurationBtn = document.getElementById('go-to-duration-btn');

// Tela 3 (Duração e Pagamento)
const durationPaymentStep = document.getElementById('duration-payment-step');
const durationOptionsContainer = document.querySelector('.duration-options');
const paymentSelectionMessage = document.getElementById('payment-selection-message');
const paymentDetailsDiv = document.getElementById('payment-details');
const finalPriceElement = document.getElementById('final-price');
const copyPixBtn = document.getElementById('copy-pix-btn');
const copyFeedback = document.getElementById('copy-feedback');
const bankInfoDiv = document.getElementById('bank-info');
const instagramInstructions = document.getElementById('instagram-instructions');
const openInstagramBtn = document.getElementById('open-instagram-btn');


// --- FUNÇÕES DE CONTROLE DE TELA (FLUXO) ---

// Função genérica para esconder ou mostrar as telas
function setScreenVisibility(homeVisible, dataVisible, durationVisible) {
    // Esconde/mostra a seção de Vantagens e os elementos da home
    mainInfoElements.forEach(el => el.style.display = homeVisible ? '' : 'none');
    
    // Esconde/mostra os passos de compra
    dataFormStep.style.display = dataVisible ? 'block' : 'none';
    durationPaymentStep.style.display = durationVisible ? 'block' : 'none';
    
    document.querySelector('.container').scrollIntoView({ behavior: 'smooth' });
}

// Handler: Inicia o fluxo (vai da Tela 1 para a Tela 2)
startPurchaseBtn.addEventListener('click', () => {
    setScreenVisibility(false, true, false); 
});

// --- FUNÇÕES DE LÓGICA TELA 1 (Cupom) ---

applyCouponBtn.addEventListener('click', function() {
    const input = couponInput.value.trim();
    const messageElement = couponMessage;
    
    // NOTA: O cupom ainda é 'MARCELO', mas o placeholder foi atualizado no HTML
    if (input.toUpperCase() === CORRECT_COUPON) { 
        priceElement.textContent = `$${DISCOUNTED_PRICE.toFixed(2)}`;
        messageElement.textContent = '🎉 Cupom aceito! Preço atualizado! 🎉';
        messageElement.className = 'coupon-message success';
    } else {
        priceElement.textContent = `$${ORIGINAL_PRICE.toFixed(2)}`;
        messageElement.textContent = 'O cupom está incorreto. Preço original mantido.';
        messageElement.className = 'coupon-message incorrect';
    }
});


// --- FUNÇÕES DE LÓGICA TELA 2 (Dados Pessoais) ---

function calculateAge(birthday) {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

// Handler: Valida a Tela 2 e avança para a Tela 3
goToDurationBtn.addEventListener('click', function() {
    const email = emailInput.value.trim();
    const dob = dobInput.value; 
    const isConfirmed = confirmationCheckbox.checked;

    function showValidationError(message) {
        dataValidationMessage.textContent = message;
        dataValidationMessage.className = 'validation-message incorrect';
    }
    
    if (!email || !email.includes('@') || !email.includes('.')) {
        showValidationError('Por favor, insira um e-mail válido.');
        return;
    }

    if (!dob) {
        showValidationError('Por favor, insira sua data de nascimento.');
        return;
    }
    
    const age = calculateAge(dob);
    
    if (age < MINIMUM_AGE) {
        showValidationError(`Você deve ser maior de ${MINIMUM_AGE} anos para prosseguir.`);
        return;
    }

    if (!isConfirmed) {
        showValidationError('Você deve confirmar que é maior de 18 anos.');
        return;
    }

    dataValidationMessage.textContent = '✅ Dados válidos! Escolha a duração.';
    dataValidationMessage.className = 'validation-message success';
    setScreenVisibility(false, false, true); 
});


// --- FUNÇÕES DE LÓGICA TELA 3 (Duração e Pagamento) ---

function renderDurationOptions() {
    // Usamos dois spans na estrutura para que o CSS possa separar a duração e o preço
    durationOptionsContainer.innerHTML = DURATION_PRICES.map(item => `
        <button class="duration-btn" data-price="${item.price.toFixed(2)}" data-key="${item.key}">
            <span>${item.days}</span>
            <span>R$${item.price.toFixed(2).replace('.', ',')}</span>
        </button>
    `).join('');
}

function handleDurationSelection(event) {
    const button = event.target.closest('.duration-btn');
    if (!button) return;

    document.querySelectorAll('.duration-btn').forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');

    selectedDurationPrice = parseFloat(button.getAttribute('data-price'));
    
    const priceFormatted = selectedDurationPrice.toFixed(2).replace('.', ',');
    finalPriceElement.textContent = `R$${priceFormatted}`;
    
    const durationText = button.querySelector('span:first-child').textContent;
    paymentSelectionMessage.textContent = `Você selecionou ${durationText}.`;
    paymentSelectionMessage.className = 'validation-message success';
    paymentDetailsDiv.style.display = 'block';
    
    // Reseta/Esconde os detalhes de pagamento/Instagram até a cópia
    bankInfoDiv.style.display = 'none';
    openInstagramBtn.style.display = 'none';
    instagramInstructions.style.display = 'none';
    copyFeedback.textContent = ''; 
}

// Handler: Copia a chave PIX
copyPixBtn.addEventListener('click', function() { // CORRIGIDO: O token extra foi removido daqui
    if (selectedDurationPrice === 0) {
        copyFeedback.textContent = 'Selecione uma duração antes de copiar.';
        copyFeedback.className = 'incorrect';
        return;
    }

    const priceFormatted = selectedDurationPrice.toFixed(2).replace('.', ',');
    
    // Copia APENAS os números da chave Pix
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


// Adiciona o event listener ao container para lidar com cliques nos botões de duração
durationOptionsContainer.addEventListener('click', handleDurationSelection);


// --- Inicialização ---
renderDurationOptions();
setScreenVisibility(true, false, false);
