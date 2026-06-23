const SHEET_ID = "1kZkzZbyrg2kMPpHRwpcxMjZf3GoJ7fElaQ-kExwxG3I";

const url = `https://opensheet.elk.sh/${SHEET_ID}/Каталог%20открыток`;

let allCards = [];
let cart = [];

async function loadCards() {
    const response = await fetch(url);
    const data = await response.json();

    allCards = data;

    renderCards(allCards);
    createCollectionChips(allCards);
}

function renderCards(cards) {
    const catalog = document.getElementById("catalog");

    catalog.innerHTML = "";

    cards.forEach((card) => {
        catalog.innerHTML += `
            <div class="card">

                <img src="${card.ImageLink}" alt="${card.Название}">

                <div class="card-content">

                    <h3>${card.Название}</h3>

                    <p><strong>Описание:</strong> ${card.Описание}</p>
                    <p><strong>Размер:</strong> ${card.Размер} см</p>
                    <p><strong>Упаковка:</strong> ${card.Упаковка}</p>
                    <p><strong>Коллекция:</strong> ${card.Коллекция}</p>
                    <p><strong>Артикул:</strong> ${card.Артикул}</p>

                    <div class="qty-box">
                        <button onclick="changeQty('${card.Артикул}', -1)">−</button>

                        <input
                            type="number"
                            id="qty-${card.Артикул}"
                            min="0"
                            value="0"
                        >

                        <button onclick="changeQty('${card.Артикул}', 1)">+</button>
                    </div>

                    <button
                        class="add-cart-btn"
                        onclick='addToCart(${JSON.stringify(card)})'
                    >
                        Добавить в корзину
                    </button>

                </div>

            </div>
            `;
    });
}

function createCollectionChips(cards) {
    const container = document.getElementById("filters");

    const collections = [
        ...new Set(cards.map((card) => card.Коллекция).filter(Boolean)),
    ];

    collections.sort();

    collections.forEach((collection) => {
        const chip = document.createElement("button");

        chip.className = "chip";

        const count = cards.filter(
            (card) => card.Коллекция === collection,
        ).length;

        chip.textContent = `${collection} (${count})`;

        chip.addEventListener("click", () => {
            document
                .querySelectorAll(".chip")
                .forEach((ch) => ch.classList.remove("active"));

            chip.classList.add("active");

            const filtered = allCards.filter(
                (card) => card.Коллекция === collection,
            );

            renderCards(filtered);
        });

        container.appendChild(chip);
    });

    document
        .querySelector('[data-collection="all"]')
        .addEventListener("click", () => {
            document
                .querySelectorAll(".chip")
                .forEach((ch) => ch.classList.remove("active"));

            document
                .querySelector('[data-collection="all"]')
                .classList.add("active");

            renderCards(allCards);
        });
}

loadCards();

function changeQty(article, delta) {
    const input = document.getElementById(`qty-${article}`);

    let value = parseInt(input.value) || 0;

    value += delta;

    if (value < 0) value = 0;

    input.value = value;
}

function addToCart(card) {
    const qty =
        parseInt(document.getElementById(`qty-${card.Артикул}`).value) || 0;

    if (qty <= 0) {
        alert("Укажите количество");
        return;
    }

    const existing = cart.find((item) => item.article === card.Артикул);

    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({
            article: card.Артикул,
            name: card.Название,
            qty,
        });
    }

    updateCartCounter();

    document.getElementById(`qty-${card.Артикул}`).value = 0;

    alert("Добавлено в корзину");
}

function updateCartCounter() {
    const total = cart.reduce((sum, item) => sum + item.qty, 0);

    document.getElementById("cartCounter").textContent = total;
}

function openCart() {
    const modal = document.getElementById("cartModal");

    const container = document.getElementById("cartItems");

    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = "<p>Корзина пуста</p>";
    } else {
        cart.forEach((item) => {
            container.innerHTML += `
                <p>
                    ${item.article}
                    —
                    ${item.name}
                    —
                    ${item.qty} шт
                </p>
            `;
        });
    }

    modal.style.display = "block";
}

function closeCart() {
    document.getElementById("cartModal").style.display = "none";
}

async function sendOrder() {
    if (cart.length === 0) {
        alert("Корзина пуста");
        return;
    }

    const payload = {
        storeName: document.getElementById("storeName").value,

        contactName: document.getElementById("contactName").value,

        phone: document.getElementById("phone").value,

        email: document.getElementById("email").value,

        comment: document.getElementById("comment").value,

        cart,
    };

    const response = await fetch("http://31.57.105.93/api/send-order", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": "skdkcwe2323nlf",
        },
        body: JSON.stringify(payload),
    });

    if (response.ok) {
        alert("Заказ отправлен");

        cart = [];

        updateCartCounter();

        closeCart();
    } else {
        alert("Ошибка отправки");
    }
}
