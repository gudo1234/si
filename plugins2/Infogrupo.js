const handler = async (msg, { conn }) => {
  const chatId = msg.key.remoteJid;

  if (!chatId.endsWith("@g.us")) {
    return await conn.sendMessage2(chatId, {
      text: `${e} Este comando solo funciona en grupos.`
    }, msg );
  }

  await conn.sendMessage(chatId, {
    react: { text: "📝", key: msg.key }
  });

  try {
    const metadata = await conn.groupMetadata(chatId);
    const groupDesc = metadata.desc || "Este grupo no tiene descripción.";

    await conn.sendMessage2(chatId, {
      text: `${e} *Descripción del grupo:*\n\n${groupDesc}`
    }, msg );

  } catch (e) {
    await conn.sendMessage2(chatId, {
      text: `${e} Error al obtener la descripción del grupo.`
    }, msg );
  }
};

handler.command = ["infogrupo"];
module.exports = handler;
