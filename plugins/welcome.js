const handler = async (msg, { conn }) => {
  if (!msg.messageStubType || !msg.isGroup) return;

  const type = msg.messageStubType;
  const chatId = msg.chat;

  const chat = global.db.data.chats[chatId];
  if (!chat || !chat.welcome) return;

  const participant = (msg.messageStubParameters || [])[0];
  if (!participant) return;

  const who = participant + '@s.whatsapp.net';
  const userName = (global.db.data.users[who]?.name) || await conn.getName(who);
  const groupMetadata = await conn.groupMetadata(chatId);
  const groupName = groupMetadata.subject;

  let text = '';
  if (type === 27 || type === 31) {
    // Nuevo miembro (agregado o se unió)
    text = `Hola, bienvenido/a *${userName}* a *${groupName}*`;
  } else if (type === 28 || type === 32) {
    // Salida o eliminación del grupo
    text = `Adiós *${userName}*, te has ido de *${groupName}*`;
  } else {
    return;
  }

  await conn.sendMessage2(msg.key.remoteJid, { text }, { quoted: null });
};


handler.customPrefix = /.^/;
handler.command = new RegExp();
handler.group = true;

module.exports = handler;
