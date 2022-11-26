import TelegramBot from 'node-telegram-bot-api';
import { readSecrets } from './common/config';

const commands: TelegramBot.BotCommand[] = [
  {
    command: '/show',
    description: 'Send me a picture of surveillance cam',
  },
];

const cameras = ['camera1', 'camera2', 'camera3', 'camera4'];

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
          text: c,
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
  if (data.type === 'show') {
    bot.sendMessage(query.message?.chat.id ?? '', `Showing ${data.data}`);
  }
}
