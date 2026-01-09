const tg = window.Telegram.WebApp;
tg.expand();

const products = [
  { id: 1, name: "Espresso", price: 3 },
  { id: 2, name: "Latte", price: 4 },
  { id: 3, name: "Cappuccino", price: 4.5 },
];

let cart = [];

const container = document.getElementById("products");

products.forEach(p => {
  const el = document.createElement("div");
  el.className = "card";
  el.innerHTML = `
    <h3>${p.name}</h3>
    <p>$${p.price}</p>
    <button>Add</button>
  `;
  el.querySelector("button").onclick = () => {
    cart.push(p);
    tg.HapticFeedback.impactOccurred("light");
  };
  container.appendChild(el);
});

document.getElementById("checkoutBtn").onclick = () => {
  tg.sendData(JSON.stringify(cart));
};
