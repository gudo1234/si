const fetch = require("node-fetch")

export async function before(msg, { conn }) {

  global.rcanal = {
    contextInfo: {
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: channel,
        serverMessageId: 100,
        newsletterName: wm,
      },
    },
  }
}
