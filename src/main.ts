import { Bot } from "./Bot";

const TOKEN = process.env.SLACK_BOT_TOKEN || "";
const APP_TOKEN = process.env.SLACK_APP_TOKEN || "";
const PORT = process.env.PORT!;

(async () => {
  await new Bot(TOKEN, APP_TOKEN).start(PORT);

  console.log(`⚡️ TikTok Companion running on port ${PORT}`);
})();
