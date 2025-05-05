const handler = async (m, { conn }) => {
  if (!m.messageStubType || !m.isGroup) return;

  const type = m.messageStubType;
  const chatId = m.chat;

  const chat = global.db.data.chats[chatId];
  if (!chat || !chat.welcome) return;

  const participant = (m.messageStubParameters || [])[0];
  if (!participant) return;

  const who = participant + '@s.whatsapp.net';
  const userName = (global.db.data.users[who]?.name) || await conn.getName(who);
  const groupMetadata = await conn.groupMetadata(chatId);
  const groupName = groupMetadata.subject;

  let text = '';
  if (type === 27) {
    // Agregado al grupo
    text = `👋 ¡Bienvenido/a *${userName}* al grupo *${groupName}*!`;
  } else if (type === 28 || type === 32) {
    // Eliminado o salió del grupo
    text = `👋 *${userName}* ha salido del grupo *${groupName}*.`;
  } else {
    return;
  }

  await conn.sendMessage(chatId, { text });
};

handler.customPrefix = /.^/; // para que no reaccione a comandos
handler.command = new RegExp(); // lo hace silencioso
module.exports = handler;
