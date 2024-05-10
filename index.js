/*!
 * Created by Ho Viet Anh
 * Please edit webhookUrl and token before run this script!!!
 */

import TelegramBot from 'node-telegram-bot-api';
import fetch from 'node-fetch';
import 'dotenv/config';

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.onText(/\/add (.+)/, (msg, match) => {
    const chatId = msg.chat.id;

    if (!match[1].includes('|')) {
        bot.sendMessage(chatId, 'Vui lòng nhập đúng định dạng.' + '\n\n' + 'Ví dụ:\n```\n/add name|email\n```', {
            parse_mode: 'Markdown'
        });
        return;
    }

    bot.sendChatAction(chatId, 'typing');

    const resp = match[1];
    const values = resp.split('|');

    const url = new URL(process.env.WEBHOOK_URL);
    url.searchParams.append('name', values[1]);
    url.searchParams.append('email', values[0]);


    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                bot.sendMessage(chatId, '✅ Đã thêm thành công.');
            } else {
                bot.sendMessage(chatId, 'Không thể thêm. Vui lòng thử lại sau!');
            }
        })
        .catch(err => {
            bot.sendMessage(chatId, 'Đã có lỗi xảy ra. Vui lòng thử lại sau!');
        });
});

console.log('Bot is running...')

// nếu npm install lỗi thì mình cái lại bản đúng
//npm install -g npm@10.7.0