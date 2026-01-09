const tg = window.Telegram.WebApp;
tg.expand();

const products = [
  { id: 1, name: "Espresso", price: 3, img: "assets/espresso.jpg" },
  { id: 2, name: "Latte", price: 4, img: "assets/latte.jpg" },
  { id: 3, name: "Cappuccino", price: 4.5, img: "assets/cappuccino.jpg" },
  { id: 4, name: "Flat White", price: 4, img: "assets/flatwhite.jpg" },
];

const cart = {};
const list = document.getElementById("products");

function updateMainButton() {
  let total = 0;
  for (const id in cart) {
    total += cart[id].price * cart[id].count;
  }

  if (total === 0) {
    tg.MainButton.hide();
    return;
  }

  tg.MainButton.setText(`Checkout · $${total}`);
  tg.MainButton.show();
}

products.forEach(p => {
  const item = document.createElement("div");
  item.className = "item";

  item.innerHTML = `
    <img src="${p.img}">
    <div class="info">
      <h3>${p.name}</h3>
      <span>$${p.price}</span>
    </div>
    <div class="controls">
      <button>-</button>
      <span>0</span>
      <button>+</button>
    </div>
  `;

  const [minus, countEl, plus] = item.querySelectorAll("button, span");

  plus.onclick = () => {
    cart[p.id] ??= { ...p, count: 0 };
    cart[p.id].count++;
    countEl.textContent = cart[p.id].count;
    tg.HapticFeedback.impactOccurred("light");
    updateMainButton();
  };

  minus.onclick = () => {
    if (!cart[p.id]) return;
    cart[p.id].count--;
    if (cart[p.id].count <= 0) delete cart[p.id];
    countEl.textContent = cart[p.id]?.count || 0;
    updateMainButton();
  };

  list.appendChild(item);
});

tg.MainButton.onClick(() => {
  tg.sendData(JSON.stringify(Object.values(cart)));
});
