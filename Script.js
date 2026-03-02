const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const mainContent = document.getElementById('mainContent');
const paymentInterface = document.getElementById('paymentInterface');
const plansContainer = document.getElementById('plansContainer');

const prices = {
    "MOD IOS": { "5 dias": "24,00$", "7 dias": "27$", "15 dias": "47$" },
    "MOD ANDROID": { "5 dias": "24,00$", "7 dias": "27$", "15 dias": "47$" },
    "HS PEITO IOS": { "5 dias": "26,00$", "7 dias": "30,00$", "15 dias": "44,00$" },
    "HS PEITO ANDROID": { "5 dias": "17,00$", "7 dias": "27,00$", "15 dias": "44,00$" }
};

function openPayment(name, img) {
    document.getElementById('paymentProductTitle').innerText = name;
    document.getElementById('paymentProductImg').src = img || "https://i.ibb.co/Y4YG8t0z/1000122868.jpg";
    const p = prices[name];
    plansContainer.innerHTML = `
        <div class="plan-box grow-on-hover"><span>5 DIAS</span><span class="plan-price" style="color:#00ff00">${p["5 dias"]}</span><div class="buy-mini-box">COMPRAR</div></div>
        <div class="plan-box grow-on-hover"><span>7 DIAS</span><span class="plan-price" style="color:#00ff00">${p["7 dias"]}</span><div class="buy-mini-box">COMPRAR</div></div>
        <div class="plan-box grow-on-hover"><span>15 DIAS</span><span class="plan-price" style="color:#00ff00">${p["15 dias"]}</span><div class="buy-mini-box">COMPRAR</div></div>
    `;
    mainContent.style.display = 'none';
    paymentInterface.style.display = 'block';
    document.body.classList.add('payment-active');
}

document.getElementById('backToStore').onclick = () => {
    paymentInterface.style.display = 'none';
    mainContent.style.display = 'block';
    document.body.classList.remove('payment-active');
};

document.getElementById('openMenu').onclick = () => { sidebar.classList.add('active'); overlay.classList.add('active'); };
document.getElementById('closeMenu').onclick = () => { sidebar.classList.remove('active'); overlay.classList.remove('active'); };
document.getElementById('menuVisual').onclick = (e) => { e.preventDefault(); document.getElementById('subMenuVisual').classList.toggle('active'); };

function setTheme(color) {
    document.documentElement.style.setProperty('--theme', color);
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
}

document.getElementById('btnRed').onclick = () => setTheme('#ff3333');
document.getElementById('btnBlue').onclick = () => setTheme('#0055ff');
document.getElementById('btnPurple').onclick = () => setTheme('#9933ff');
document.getElementById('btnGreen').onclick = () => setTheme('#00cc44');

const filterBtns = document.querySelectorAll('.f-btn');
const products = document.querySelectorAll('.product-item');
filterBtns.forEach(btn => {
    btn.onclick = () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.getAttribute('data-filter');
        products.forEach(p => { p.style.display = (f === 'all' || p.classList.contains(f)) ? 'block' : 'none'; });
    };
});

document.addEventListener('click', (e) => {
    const card = e.target.closest('.product-card-simple, .product-card-large');
    if (card) openPayment(card.getAttribute('data-product'), card.getAttribute('data-img'));
});

setInterval(() => {
    const names = ["Felipe", "Marcos", "Luan", "Julia"];
    const container = document.getElementById('notification-container');
    const div = document.createElement('div');
    div.className = 'notification';
    div.innerHTML = `<strong>${names[Math.floor(Math.random()*names.length)]}</strong> comprou agora!`;
    container.appendChild(div);
    setTimeout(() => div.remove(), 4000);
}, 10000);
