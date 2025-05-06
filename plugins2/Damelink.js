const handler = async (msg, { conn }) => {
  const chatId = msg.key.remoteJid;

  if (!chatId.endsWith("@g.us")) {
    return await conn.sendMessage2(chatId, {
      text: `${e} Este comando solo funciona en grupos.`
    }, msg );
  }

  await conn.sendMessage(chatId, {
    react: { text: "🔗", key: msg.key }
  });

  try {
    const code = await conn.groupInviteCode(chatId);
    const link = `https://chat.whatsapp.com/${code}`;

    await conn.sendMessage2(chatId, {
      text: `${e} *Enlace de este grupo:*\n${link}`
    }, { quoted: msg });

  } catch (e) {
    await conn.sendMessage2(chatId, {
      text: `${e} No se pudo obtener el enlace. Asegúrate de ser administrador.`
    }, msg );
  }
};

handler.command = ["damelink", "link", "linkgc"];
module.exports = handler;
