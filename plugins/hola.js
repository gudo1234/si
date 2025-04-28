import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
  const chatId = m.chat;
  const thumbnail = await (await fetch(`https://files.catbox.moe/ztexr8.jpg`)).buffer();

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
  }, { quoted: m });
}

handler.command = ['hola'];
handler.reaction = '🔄';

export default handler;
