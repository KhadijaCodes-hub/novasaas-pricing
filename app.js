const CACHE_KEY = 'nova_pricing_cache';
const CACHE_TTL = 5 * 60 * 1000;

const planDescriptions = {
  'Starter': 'Perfect for individuals and small projects.',
  'Professional': 'Best for growing teams and startups.',
  'Business': 'For scaling companies with advanced needs.',
  'Enterprise': 'Full-power solutions for large organizations.'
};

const planIcons = {
  'Starter': { emoji: '⚡', bg: 'rgba(110,231,183,0.12)' },
  'Professional': { emoji: '🚀', bg: 'rgba(129,140,248,0.12)' },
  'Business': { emoji: '🏢', bg: 'rgba(249,168,212,0.12)' },
  'Enterprise': { emoji: '🌐', bg: 'rgba(252,211,77,0.12)' }
};

let pricingData = null;
let currentCycle = 'monthly';
let currentCurrency = 'USD';

async function fetchPricingData() {
  const cached = sessionStorage.getItem(CACHE_KEY);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_TTL) {
        return parsed.data;
      }
    } catch (_) {}
  }

  const response = await fetch('data.json');
  if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to fetch pricing data`);
  const data = await response.json();

  sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  return data;
}

function convertPrice(basePrice, currency, rates) {
  const rate = rates[currency]?.rate ?? 1;
  return Math.round(basePrice * rate);
}

function getCurrencySymbol(currency, rates) {
  return rates[currency]?.symbol ?? '$';
}

function renderCards(plans, currencies) {
  const container = document.getElementById('cards-container');
  const symbol = getCurrencySymbol(currentCurrency, currencies);

  container.innerHTML = '';

  plans.forEach((plan, index) => {
    const convertedPrice = convertPrice(plan.price, currentCurrency, currencies);
    const isPopular = plan.popular;
    const icon = planIcons[plan.plan_name] || { emoji: '✦', bg: 'rgba(255,255,255,0.08)' };
    const desc = planDescriptions[plan.plan_name] || '';

    const yearlyNote = currentCycle === 'yearly'
      ? `Billed annually — you save ${symbol}${convertPrice(plan.price * 12 * 0.2, currentCurrency, currencies)}/yr`
      : '';

    const featuresHTML = plan.features.map(f => `
      <li>
        <span class="feature-check" style="background: ${plan.color}20;">
          <svg viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.5 5.5L3.5 7.5L8.5 2.5" stroke="${plan.color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        ${f}
      </li>
    `).join('');

    const card = document.createElement('div');
    card.className = `pricing-card${isPopular ? ' popular' : ''}`;
    card.style.setProperty('--card-color', plan.color);
    card.style.animationDelay = `${index * 0.08}s`;

    card.innerHTML = `
      ${isPopular ? '<div class="popular-badge">⭐ Most Popular</div>' : ''}
      <div class="card-icon" style="background: ${icon.bg}; color: ${plan.color};">
        ${icon.emoji}
      </div>
      <div class="plan-name">${plan.plan_name}</div>
      <div class="plan-desc">${desc}</div>
      <div class="price-block">
        <span class="currency-sym">${symbol}</span>
        <span class="price-value" style="color: ${plan.color};">${convertedPrice}</span>
      </div>
      <div class="price-period">per month${currentCycle === 'yearly' ? ', billed yearly' : ''}</div>
      <div class="price-yearly-note">${yearlyNote}</div>
      <div class="divider"></div>
      <ul class="features-list">${featuresHTML}</ul>
      <button class="cta-btn ${isPopular ? 'primary' : 'outline'}" onclick="handleCTA('${plan.plan_name}')">
        ${plan.cta} →
      </button>
    `;

    container.appendChild(card);
  });

  document.getElementById('skeleton-container').style.display = 'none';
  container.style.display = 'grid';
  document.getElementById('error-container').style.display = 'none';
}

function renderError(message) {
  document.getElementById('skeleton-container').style.display = 'none';
  document.getElementById('cards-container').style.display = 'none';

  const errorContainer = document.getElementById('error-container');
  errorContainer.style.display = 'block';
  errorContainer.innerHTML = `
    <div class="error-state">
      <div class="error-icon">⚠️</div>
      <h3>Failed to load pricing</h3>
      <p>${message || 'Something went wrong while fetching the plans.'}</p>
      <button class="retry-btn" onclick="init()">
        ↺ Try Again
      </button>
    </div>
  `;
}

function renderCurrentState() {
  if (!pricingData) return;
  const plans = pricingData.billing_cycles[currentCycle];
  renderCards(plans, pricingData.currencies);
}

let toastTimer = null;

function showToast(planName, icon) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  const toastIcon = document.getElementById('toast-icon');
  const toastProgress = document.getElementById('toast-progress');

  toastIcon.textContent = icon;
  toastMsg.textContent = `You selected the ${planName} plan. Redirecting to checkout…`;

  toastProgress.style.animation = 'none';
  toastProgress.offsetHeight;
  toastProgress.style.animation = 'toastProgress 3s linear forwards';

  toast.classList.remove('hide');
  toast.classList.add('show');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, 3000);
}

function hideToast() {
  const toast = document.getElementById('toast');
  toast.classList.remove('show');
  toast.classList.add('hide');
}

function handleCTA(planName) {
  const icons = { 'Starter': '⚡', 'Professional': '🚀', 'Business': '🏢', 'Enterprise': '🌐' };
  showToast(planName, icons[planName] || '✦');
}

async function init() {
  document.getElementById('skeleton-container').style.display = 'grid';
  document.getElementById('cards-container').style.display = 'none';
  document.getElementById('error-container').style.display = 'none';

  try {
    pricingData = await fetchPricingData();
    renderCurrentState();
  } catch (err) {
    renderError(err.message);
  }
}

document.getElementById('billing-toggle').addEventListener('change', function () {
  currentCycle = this.checked ? 'yearly' : 'monthly';

  const monthlyLabel = document.getElementById('label-monthly');
  const yearlyLabel = document.getElementById('label-yearly');

  monthlyLabel.classList.toggle('active', !this.checked);
  yearlyLabel.classList.toggle('active', this.checked);

  renderCurrentState();
});

document.getElementById('currency-select').addEventListener('change', function () {
  currentCurrency = this.value;
  renderCurrentState();
});

init();