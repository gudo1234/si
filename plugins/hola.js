const fs = require("fs");
const axios = require("axios");
const fetch = require("node-fetch");

const handler = async (msg, { conn }) => {
  const chatId = msg.key.remoteJid;
  
  await conn.sendMessage(chatId, {
    text: 'test', 
    contextInfo: {
      mentionedJid: [],
      groupMentions: [],
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363285614743024@newsletter',
        newsletterName: '🤖⃧►iʑυвöτ◃2.0▹',
        serverMessageId: 0
      },
      businessMessageForwardInfo: { businessOwnerJid: '50492280729@s.whatsapp.net' },
      forwardingScore: 0,
      externalAdReply: {
        title: 'hola',
        body: 'hola mosha',
        thumbnailUrl: 'https://www.instagram.com/edar504__', // Aquí ahora sí una imagen válida
        thumbnail: imageBuffer,
        sourceUrl: 'https://www.instagram.com/edar504__' // Esto está bien aunque no sea imagen directa
      }
    }
  }, { quoted: msg });

    await conn.sendMessage(chatId, { image: imageBuffer, caption: '🪐' });

};

handler.command = ['hola'];
handler.reaction = '🔄';

module.exports = handler;
