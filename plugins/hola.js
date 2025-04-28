const axios = require('axios');
const fetch = require("node-fetch");

const handler = async (msg, { conn, sock }) => {
  const chatId = msg.key.remoteJid;
  const thumbnail = await (await fetch(`https://files.catbox.moe/ztexr8.jpg`)).buffer();
  sock.sendMessage2(chatId, {
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
            forwardingScore: false,
            externalAdReply: {
                title: 'hola',
                body: 'hola mosha',
                thumbnailUrl: 'https://www.instagram.com/edar504__',
                thumbnail,
                sourceUrl: 'https://www.instagram.com/edar504__'
            }
        }
    }, { quoted: chatId });
}
handler.command = ['hola'];
handler.reaction = '🔄';

module.exports = handler;
