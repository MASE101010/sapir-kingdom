// The kingdom's clock: every minute Cloudflare wakes this up, and it asks the site to read new Instagram comments, so
// every commenter gets a house and an answer within a minute, even when nobody has the site open.
export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(fetch(`${env.SITE_URL ?? 'https://sapir-kingdom.pages.dev'}/api/sync?tick=1`, { headers: { 'user-agent': 'sapir-kingdom-clock' } }));
  },
};
