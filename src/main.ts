import { startBot } from "./discord.js";

async function bootstrap() {
  const bot = await startBot();
  console.log("Running");
}

bootstrap();
