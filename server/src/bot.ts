import TelegramBot from 'node-telegram-bot-api';
import fs from 'fs';
import { fetchImage } from './common/camera';
import { readSecrets } from './common/config';

const commands: TelegramBot.BotCommand[] = [
  {
    command: '/show',
    description: 'Send me a picture of surveillance cam',
  },
];

const cameras = [
  { id: 'camera1', name: 'Outside' },
  { id: 'camera2', name: 'Upstairs' },
  { id: 'camera3', name: 'Fireplace' },
  { id: 'camera4', name: 'Entrance' },
];

export async function setupBot() {
  const { BOT_TOKEN } = await readSecrets();

  const bot = new TelegramBot(BOT_TOKEN, { polling: true });

  bot.onText(/\/(.*?)/, (msg) => {
    const [cmd, ...args] = msg.text?.split('/')[1].split(' ') ?? [];

    if (!cmd) {
      return;
    }

    return handleCommand(bot, msg, cmd, args);
  });

  bot.on('callback_query', (query) => {
    const { data } = query;

    try {
      const parsed = JSON.parse(data ?? '');

      return handleCallback(bot, query, parsed);
    } catch {
      console.warn(`Failed to parse callback query data`);
    }
  });

  bot.setMyCommands(commands);

  console.log(`Bot setup successfully`);

  return bot;
}

async function handleCommand(
  bot: TelegramBot,
  msg: TelegramBot.Message,
  cmd: string,
  args: string[],
) {
  if (cmd === 'show') {
    if (args.length === 0) {
      const buttons = cameras.map((c) => [
        {
          text: c.name,
          callback_data: JSON.stringify({
            type: 'show',
            data: c,
          }),
        },
      ]);

      bot.sendMessage(msg.chat.id, `Please select from the following:`, {
        reply_markup: {
          inline_keyboard: buttons,
        },
      });
    }
  }
}

async function handleCallback(
  bot: TelegramBot,
  query: TelegramBot.CallbackQuery,
  data: any,
) {
  const chatId = query.message?.chat.id;

  const secrets = await readSecrets();

  if (data.type === 'show') {
    if (chatId !== Number(secrets.TG_CHAT_ID)) {
      return;
    }

    bot.sendMessage(chatId ?? '', `Taking photo of ${data.data.name}...`);

    try {
      const imagePath = await fetchImage(
        `${secrets.RTSP_URL}/${cameras.find((c) => c.id === data.data.id)?.id}`,
      );

      const readStream = fs.createReadStream(imagePath);

      bot.sendPhoto(chatId ?? '', readStream);
    } catch (e) {
      console.error(e);
      bot.sendMessage(chatId ?? '', `Something went wrong`);
    }
  }
}
