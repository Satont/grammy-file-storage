
import { Bot, Context, SessionFlavor, session } from 'https://deno.land/x/grammy@v1.3.4/mod.ts';
import { expect } from 'https://deno.land/x/expect@v0.2.9/mod.ts'
import { FileAdapter } from '../src/mod.ts';
import { fs, path } from '../src/deps.deno.ts'

interface SessionData {
  pizzaCount: number;
}

interface StringSessionFlavor {
  get session(): string;
  set session(session: string | null | undefined);
}

const dirPath = path.resolve(Deno.cwd(), 'sessions')
const cleanDir = () => Deno.remove(dirPath, { recursive: true })

Deno.test('Should create sessions dir', async () => {
  new FileAdapter({ dirName: 'sessions' })
  expect(await fs.exists(dirPath)).toBe(true)

  await cleanDir()
})
 
Deno.test('Pizza counter tests', async () => {
  const bot = new Bot<Context & SessionFlavor<SessionData>>('fake-token', { 
    botInfo: {
      id: 42,
      first_name: 'Test Bot',
      is_bot: true,
      username: 'bot',
      can_join_groups: true,
      can_read_all_group_messages: true,
      supports_inline_queries: false,
    },
  });;

  bot.use(session({
    initial: () => ({ pizzaCount: 0 }),
    storage: new FileAdapter({ dirName: 'sessions' }),
  }));

  bot.hears('first', (ctx) => {
    expect(ctx.session.pizzaCount).toEqual(0)
    ctx.session.pizzaCount = Number(ctx.session.pizzaCount) + 1;
  });
  
  bot.hears('second', (ctx) => {
    expect(ctx.session.pizzaCount).toEqual(1);
  });
  
  await bot.handleUpdate(createMessage(bot, 'first').update);
  await bot.handleUpdate(createMessage(bot, 'second').update);

  await cleanDir()
})

Deno.test('Simple string tests', async () => {
  const bot = new Bot<Context & StringSessionFlavor>('fake-token', { 
    botInfo: {
      id: 42,
      first_name: 'Test Bot',
      is_bot: true,
      username: 'bot',
      can_join_groups: true,
      can_read_all_group_messages: true,
      supports_inline_queries: false,
    },
  });;

  bot.use(session({
    initial: () => 'test',
    storage: new FileAdapter({ dirName: 'sessions' }),
  }));

  bot.hears('first', async (ctx) => {
    ctx.session = `${ctx.session} edited`;
  });
  
  bot.hears('second', async (ctx) => {
    expect(ctx.session).toEqual('test edited');
  });
  
  await bot.handleUpdate(createMessage(bot, 'first').update);
  await bot.handleUpdate(createMessage(bot, 'second').update);

  await cleanDir()
})

function createMessage(bot: Bot<any>, text = 'Test Text') {
  const createRandomNumber = () => Math.floor(Math.random() * (123456789 - 1) + 1);

  const ctx = new Context({ 
    update_id: createRandomNumber(), 
    message: { 
      text,
      message_id: createRandomNumber(),
      chat: { 
        id: 1,
        type: 'private',
        first_name: 'Test User',
      },
      date: Date.now(),
    },
  }, 
  bot.api, 
  bot.botInfo
  );

  return ctx;
}