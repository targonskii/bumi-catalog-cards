export async function onRequestPost(context) {
    try {
        const { request, env } = context;

        const body = await request.json();

        const {
            storeName = "",
            contactName = "",
            phone = "",
            email = "",
            comment = "",
            cart = [],
        } = body || {};

        if (!Array.isArray(cart) || cart.length === 0) {
            return Response.json(
                { success: false, error: "Cart is empty" },
                { status: 400 },
            );
        }

        let message = `📦 Новый заказ BUMI\n\n`;

        message += `🏪 Магазин:\n${storeName}\n\n`;
        message += `👤 Контакт:\n${contactName}\n\n`;
        message += `📞 Телефон:\n${phone}\n\n`;
        message += `✉️ Email:\n${email}\n\n`;
        message += `📝 Комментарий:\n${comment}\n\n`;

        message += `━━━━━━━━━━\n`;

        let totalQty = 0;

        cart.forEach((item) => {
            const article = item.article || "-";
            const name = item.name || "-";
            const qty = item.qty || 0;

            totalQty += qty;

            message += `\n${article}\n${name}\nКоличество: ${qty}\n`;
        });

        message += `\n━━━━━━━━━━\n`;
        message += `📊 Всего товаров: ${cart.length}\n`;
        message += `📦 Общее количество: ${totalQty}\n`;

        const telegramUrl = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;

        const tgRes = await fetch(telegramUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chat_id: env.TELEGRAM_CHAT_ID,
                text: message,
            }),
        });

        const tgData = await tgRes.json();

        if (!tgData.ok) {
            return Response.json(
                { success: false, error: "Telegram failed" },
                { status: 500 },
            );
        }

        return Response.json({ success: true });
    } catch (error) {
        return Response.json(
            { success: false, error: "Server error" },
            { status: 500 },
        );
    }
}
