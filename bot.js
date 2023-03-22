const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options');
const token = '6258272516:AAGIgWN0jc6UpdxQm591A9CUlpbjP8Okwj8';

const bot = new TelegramApi(token, {polling: true});

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю число от 1 до 9. Попробуй угадать!');
    chats[chatId] = Math.floor(Math.random() * 10);
    await bot.sendMessage(chatId, 'Я загадал. Отгадывай', gameOptions);
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начало'},
        {command: '/game', description: 'Игра'}
    ]);

    bot.on('message', async msg => {
        const text = msg.text,
            chatId = msg.chat.id,
            username = msg.from.first_name;

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/86b/5a1/86b5a1ba-2635-46de-9667-7cff20d663a8/1.webp');
            return bot.sendMessage(chatId, `Добро пожаловать, ${username}!`);
        }

        if (text === '/game') {
            return startGame(chatId);
        }

        return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз :(');
    });

    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === '/again') {
            return startGame(chatId);
        }

        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю! Ты угадал цифру ${data}`, againOptions);
        } else {
            return bot.sendMessage(chatId, `Ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions);
        }

    });
}

start()
