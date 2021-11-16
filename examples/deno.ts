import { Bot, Context, session, SessionFlavor } from "https://deno.land/x/grammy@v1.3.3/mod.ts";
import { FileAdapter } from "https://deno.land/x/grammy_file_storage/mod.ts"

interface SessionData {
  counter: number;
}
type MyContext = Context & SessionFlavor<SessionData>;

async function bootstrap() {
  const bot = new Bot<MyContext>("");
  bot.use(
    session({
      initial: () => ({ counter: 0 }),
      storage: new FileAdapter({
        dirName: "sessions",
      }),
    })
  );
  
  bot.command("stats", (ctx) =>
    ctx.reply(`Already got ${ctx.session.counter} photos!`)
  );
  bot.on(":photo", (ctx) => ctx.session.counter++);
  
  bot.start();
}

bootstrap()