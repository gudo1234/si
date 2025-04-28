const axios = require('axios');
const fetch = require("node-fetch");
const handler = async (msg, { conn }) => {
  const chatId = msg.key.remoteJid;
  const thumbnail = await (await fetch(icono)).buffer();
  conn.sendMessage(chatId, {
        text: wm, 
        contextInfo: {
            mentionedJid: [],
            groupMentions: [],
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: ch,
                newsletterName: wm,
                serverMessageId: 0
            },
            businessMessageForwardInfo: { businessOwnerJid: '50492280729@s.whatsapp.net' },
            forwardingScore: false,
            externalAdReply: {
                title: 'hola',
                body: 'IzuBot te da la bienvenida',
                thumbnailUrl: redes,
                thumbnail,
                sourceUrl: redes
            }
        }
    }, { quoted: chatId });
}
handler.command = ['hola'];
handler.reaction = '🔄';

module.exports = handler;
