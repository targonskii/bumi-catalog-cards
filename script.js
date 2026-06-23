const SHEET_ID = "1kZkzZbyrg2kMPpHRwpcxMjZf3GoJ7fElaQ-kExwxG3I";

const url = `https://opensheet.elk.sh/${SHEET_ID}/Каталог%20открыток`;

let allCards = [];

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
