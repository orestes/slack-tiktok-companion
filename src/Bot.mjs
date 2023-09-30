import { default as bolt } from "@slack/bolt";
import { unfurl as unfurlTikTok } from "./app/LinkHandler/TikTok.mjs";

const EVENT_LINK_SHARED = "link_shared";

export class Bot {
  /**
     *
     * @param {string} botToken
     * @param {string} appToken

     * @returns {bolt.App}
     */
  constructor(botToken, appToken) {
    const app = new bolt.App({
      appToken: appToken,
      token: botToken,
      socketMode: true,
    });

    app.event(EVENT_LINK_SHARED, this.handleLinkShared.bind(this));

    this.app = app;
  }

  handleLinkShared({ event }) {
    setTimeout(async () => {
      await this.unfurlTikTok(event);
    }, 0);
  }

  async unfurlTikTok(event) {
    const response = await unfurlTikTok(event);
    // Here you go Slack :)
    await this.app.client.chat.unfurl(response);
  }

  /**
   *
   * @param {number} port
   * @returns {Promise}
   */
  start(port) {
    return this.app.start(port);
  }
}
