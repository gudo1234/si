const handler = async (msg, { conn, text, usedPrefix, command }) => {
  try {
    if (!text) {
      return await conn.sendMessage2(msg.key.remoteJid, {
        text: `❗ Usa el comando correctamente:\n\n📌 Ejemplo: *${usedPrefix + command}* Hola`
      }, msg);
    }

    await conn.sendMessage(msg.key.remoteJid, {
      react: { text: "🕒", key: msg.key }
    });

    const sender = msg.key.participant || msg.key.remoteJid;
    const avatar = await conn.profilePictureUrl(sender, 'image').catch(_ => 'https://telegra.ph/file/24fa902ead26340f3df2c.png');
    const displayName = await conn.getName(sender);
    const username = sender.split('@')[0];
    const replies = '69';
    const retweets = '69';
    const theme = 'dark';

    const url = `https://some-random-api.com/canvas/misc/tweet?displayname=${encodeURIComponent(displayName)}&username=${encodeURIComponent(username)}&avatar=${encodeURIComponent(avatar)}&comment=${encodeURIComponent(text)}&replies=${encodeURIComponent(replies)}&retweets=${encodeURIComponent(retweets)}&theme=${encodeURIComponent(theme)}`;

    await conn.sendMessage2(msg.key.remoteJid, {
      image: { url: url },
      caption: text
    }, msg);

  } catch (err) {
    console.error(err);
    await conn.sendMessage2(msg.key.remoteJid, {
      text: `⚠️ Ocurrió un error al generar el tweet.\n\nError: ${err.message}`
    }, msg);
  }
};

handler.command = ['tweet'];
module.exports = handler;
