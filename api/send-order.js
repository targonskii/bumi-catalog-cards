// export default async function handler(req, res) {
//     if (req.method !== "POST") {
//         return res
//             .status(405)
//             .json({ success: false, error: "Method not allowed" });
//     }

//     try {
//         const {
//             storeName = "",
//             contactName = "",
//             phone = "",
//             email = "",
//             comment = "",
//             cart = [],
//         } = req.body || {};

//         // защита от пустого cart
//         if (!Array.isArray(cart) || cart.length === 0) {
//             return res.status(400).json({
//                 success: false,
//                 error: "Cart is empty",
//             });
//         }

//         let message = `📦 Новый заказ BUMI\n\n`;

//         message += `🏪 Магазин:\n${storeName}\n\n`;
//         message += `👤 Контакт:\n${contactName}\n\n`;
//         message += `📞 Телефон:\n${phone}\n\n`;
//         message += `✉️ Email:\n${email}\n\n`;
//         message += `📝 Комментарий:\n${comment}\n\n`;

//         message += `━━━━━━━━━━\n`;

//         let totalQty = 0;

//         cart.forEach((item) => {
//             const article = item.article || "-";
//             const name = item.name || "-";
//             const qty = item.qty || 0;

//             totalQty += qty;

//             message += `\n${article}\n${name}\nКоличество: ${qty}\n`;
//         });

//         message += `\n━━━━━━━━━━\n`;
//         message += `📊 Всего товаров: ${cart.length}\n`;
//         message += `📦 Общее количество: ${totalQty}\n`;

//         const telegramUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

//         const tgRes = await fetch(telegramUrl, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//                 chat_id: process.env.TELEGRAM_CHAT_ID,
//                 text: message,
//             }),
//         });

//         const tgData = await tgRes.json();

//         if (!tgData.ok) {
//             console.error("Telegram error:", tgData);
//             return res.status(500).json({
//                 success: false,
//                 error: "Telegram failed",
//             });
//         }

//         return res.status(200).json({
//             success: true,
//         });
//     } catch (error) {
//         console.error("API error:", error);

//         return res.status(500).json({
//             success: false,
//             error: "Server error",
//         });
//     }
// }
