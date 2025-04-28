const fs = require("fs");
const axios = require("axios");
const fetch = require("node-fetch");

const handler = async (msg, { conn }) => {
  const chatId = msg.key.remoteJid;
  const imageBuffer = await global.getRandomIcon();
if (imageBuffer) {
  await conn.sendMessage(chatId, {
    text: 'test', 
    contextInfo: {
      mentionedJid: [],
      groupMentions: [],
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363285614743024@newsletter',
        newsletterName: wm,
        serverMessageId: 0
      },
      businessMessageForwardInfo: { businessOwnerJid: '50492280729@s.whatsapp.net' },
      forwardingScore: 0,
      externalAdReply: {
        title: 'hola',
        body: 'hola mosha',
        thumbnailUrl: getRandomRed,
        thumbnail: imageBuffer,
        sourceUrl: getRandomRed
      }
    }
  }, { quoted: msg })};

await conn.sendMessage(chatId, { image: imageBuffer, caption: '🪐xd' });
};

handler.command = ['hola'];
handler.reaction = '🔄';

module.exports = handler;
