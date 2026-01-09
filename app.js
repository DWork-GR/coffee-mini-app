const tg = window.Telegram.WebApp;
tg.expand();

const products = [
  { id: 1, name: "Espresso", price: 3 },
  { id: 2, name: "Latte", price: 4 },
  { id: 3, name: "Cappuccino", price: 4.5 },
  { id: 4, name: "Flat White", price: 4 },
];

const cart = {};
const productsEl = document.getElementById("products");
const cartBar = document.getElementById("cartBar");
const cartText = document.getElementById("cartText");

function updateCartUI() {
  let items = 0;
  let total = 0;

  for (const id in cart) {
    items += cart[id].count;
    total += cart[id].count * cart[id].price;
  }

  if (items === 0) {
    cartBar.classList.add("hidden");
    tg.MainButton.hide();
    return;
  }

  cartText.textContent = `${items} items · $${total}`;
  cartBar.classList.remove("hidden");

  tg.MainButton.setText(`Checkout · $${total}`);
  tg.MainButton.show();
}

products.forEach(p => {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <h3>${p.name}</h3>
    <p>$${p.price}</p>
    <div class="controls">
      <button>-</button>
      <span>0</span>
      <button>+</button>
    </div>
  `;

  const [minus, countEl, plus] = card.querySelectorAll("button, span");

  plus.onclick = () => {
    cart[p.id] ??= { ...p, count: 0 };
    cart[p.id].count++;
    countEl.textContent = cart[p.id].count;
    tg.HapticFeedback.impactOccurred("light");
    updateCartUI();
  };

  minus.onclick = () => {
    if (!cart[p.id]) return;
    cart[p.id].count--;
    if (cart[p.id].count <= 0) delete cart[p.id];
    countEl.textContent = cart[p.id]?.count || 0;
    updateCartUI();
  };

  productsEl.appendChild(card);
});

tg.MainButton.onClick(() => {
  const order = Object.values(cart);
  tg.sendData(JSON.stringify(order));
});
