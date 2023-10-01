import { App, LinkSharedEvent } from "@slack/bolt";
import { unfurl as unfurlTikTok } from "./TikTok";

const EVENT_LINK_SHARED = "link_shared";

export class Bot {
  private app: App;
  public constructor(botToken: string, appSecret: string) {
    const app = new App({
      token: botToken,
      signingSecret: appSecret,
    });

    app.event(EVENT_LINK_SHARED, this.handleLinkShared.bind(this) as any);

    this.app = app;
  }

  handleLinkShared({ event }: { event: LinkSharedEvent }) {
    setTimeout(async () => {
      await this.unfurlTikTok(event);
    }, 0);
  }

  async unfurlTikTok(event: LinkSharedEvent) {
    const response = await unfurlTikTok(event);
    // Here you go Slack :)
    await this.app.client.chat.unfurl(response);
  }

  public start(port: string | number) {
    return this.app.start(port);
  }
}
