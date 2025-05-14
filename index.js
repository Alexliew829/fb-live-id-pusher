const fetch = require("node-fetch");

module.exports = async (req, res) => {
  const PAGE_ID = "101411206173416";
  const PAGE_TOKEN = process.env.PAGE_TOKEN;
  const WEBHOOK_URL = process.env.MAKE_WEBHOOK_URL;

  const liveUrl = `https://graph.facebook.com/v19.0/${PAGE_ID}/live_videos?status=LIVE_NOW&fields=id,creation_time,permalink_url&access_token=${PAGE_TOKEN}`;

  try {
    const fbRes = await fetch(liveUrl);
    const data = await fbRes.json();

    if (data.data && data.data.length > 0) {
      const video = data.data[0];
      const postID = video.id;
      // 发送到 Make Webhook
      const hookRes = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postID })
      });

      const hookData = await hookRes.text();
      return res.status(200).json({ sent: true, postID, hookData });
    } else {
      return res.status(200).json({ sent: false, message: "No live video found." });
    }
  } catch (err) {
    return res.status(500).json({ error: err.toString() });
  }
};