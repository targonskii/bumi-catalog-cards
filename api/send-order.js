export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).end();
    }

    const { storeName, contactName, phone, email, comment, cart } = req.body;

    let message = `📦 Новый заказ BUMI

🏪 Магазин:
${storeName}

👤 Контакт:
${contactName}

📞 Телефон:
${phone}

✉️ Email:
${email}

📝 Комментарий:
${comment}

━━━━━━━━━━
`;

    cart.forEach((item) => {
        message += `${item.article}
${item.name}

Количество: ${item.qty}

`;
    });

    const telegramUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

    await fetch(telegramUrl, {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify({
            chat_id: process.env.TELEGRAM_CHAT_ID,

            text: message,
        }),
    });

    res.status(200).json({
        success: true,
    });
}
