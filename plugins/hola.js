const fs = require("fs");
const axios = require("axios");
const fetch = require("node-fetch");

const handler = async (msg, { conn }) => {
  const chatId = msg.key.remoteJid;
  const red = await global.getRandomRed();
console.log(red);
  const im = await global.getRandomIcon();
if (im) {
  await sock.sendMessage(msg.key.remoteJid, {
            react: { text: "⚡", key: msg.key } 
        });
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
        thumbnailUrl: red,
        thumbnail: im,
        sourceUrl: red
      }
    }
  }, { quoted: msg })};

};
chatId.react('⚡')
handler.command = ['hola'];

module.exports = handler;
