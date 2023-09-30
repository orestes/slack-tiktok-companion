import { default as axios } from "axios";

const CHROME_WINDOWS_UA =
  "Mozilla/5.0 (X11; CrOS x86_64 8172.45.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.64 Safari/537.36";

export async function unfurl(event) {
  // This field will always be present otherwise the link_shared event could not have been triggered
  const unfurl_id = event.unfurl_id;

  // Will always have at least one event, otherwise the link_shared event could not have been triggered
  const url = event.links[0].url;

  const info = await getTikTokInfo(url);

  // Calculate what we want to display
  return getResponse(unfurl_id, url, info);
}

async function getResponse(unfurl_id, url, info) {
  return {
    unfurl_id,
    source: "conversations_history",
    unfurls: {
      [url]: {
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: info.title,
            },
            accessory: {
              type: "image",
              image_url: info.thumbnail_url,
              alt_text: `${info.title} by ${info.author_name} on ${info.provider_name}`,
            },
          },
        ],
      },
    },
  };
}

async function getTikTokInfo(shortenedUrl) {
  const pathWithId = await getPathWithId(shortenedUrl);

  if (!pathWithId) {
    throw new Error("Could not find path with ID");
  }

  const fullUrl = `https://www.tiktok.com/${pathWithId}`;

  return await getOEmbedInfo(fullUrl);
}

async function getOEmbedInfo(url) {
  const oEmbedUrl = `https://www.tiktok.com/oembed?url=${url}`;

  try {
    const response = await axios.get(oEmbedUrl, {
      maxRedirects: 1,
      headers: {
        "User-Agent": CHROME_WINDOWS_UA,
      },
    });

    return response.data;
  } catch (e) {
    console.error("Request to TikTok OEmbed failed", e);

    throw new Error("TikTok request failed");
  }
}

async function getPathWithId(shortenedUrl) {
  // AXIOS hangs up on head requests since they have no response body
  // Instead we allow 1 redirect (via the `Location` HTTP Header)
  try {
    const response = await axios.head(shortenedUrl, {
      maxRedirects: 1,
      headers: {
        "User-Agent": CHROME_WINDOWS_UA,
      },
    });

    // And the look at the last URL we got redirected to
    return response.request.path;
  } catch (e) {
    console.error("Request to TikTok short url failed", e);

    throw new Error("TikTok request failed");
  }
}
