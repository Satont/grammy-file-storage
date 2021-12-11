
import { session } from 'https://deno.land/x/grammy@v1.5.3/mod.ts';
import { expect } from 'https://deno.land/x/expect@v0.2.9/mod.ts'
import { FileAdapter } from '../src/mod.ts';
import { fs, path } from '../src/deps.deno.ts'
import { createMessage, createBot } from "https://deno.land/x/grammy_storage_utils@1.0.2/mod.ts"

const dirPath = path.resolve(Deno.cwd(), 'sessions')
const cleanDir = () => Deno.remove(dirPath, { recursive: true })

Deno.test('Should create sessions dir', async () => {
  new FileAdapter({ dirName: 'sessions' })
  expect(await fs.exists(dirPath)).toBe(true)

  await cleanDir()
})
 
Deno.test('Pizza counter tests', async () => {
  const bot = createBot()

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
  const bot = createBot(false)

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
