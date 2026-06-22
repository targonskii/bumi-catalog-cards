const SHEET_ID = "1kZkzZbyrg2kMPpHRwpcxMjZf3GoJ7fElaQ-kExwxG3I";

const url = `https://opensheet.elk.sh/${SHEET_ID}/Каталог%20открыток`;

async function loadCards() {
    const response = await fetch(url);
    const data = await response.json();

    const catalog = document.getElementById("catalog");

    data.forEach((card) => {
        catalog.innerHTML += `
        <div class="card">

            <img src="${card.ImageLink}" alt="">

            <div class="card-content">

                <h3>${card.Название}</h3>

                <p>${card.Артикул}</p>

                <p>${card.Описание}</p>

                <p>${card.Размер}</p>

                <p>${card.Упаковка}</p>

            </div>

        </div>
        `;
    });
}

loadCards();
