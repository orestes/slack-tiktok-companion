import { Bot } from "./Bot";

const TOKEN = process.env.SLACK_BOT_TOKEN || "";
const APP_SECRET = process.env.SLACK_APP_SECRET || "";
const PORT = process.env.PORT!;

(async () => {
  await new Bot(TOKEN, APP_SECRET).start(PORT);

  console.log(`⚡️ TikTok Companion running on port ${PORT}`);
})();
