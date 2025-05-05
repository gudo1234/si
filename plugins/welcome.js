const { prepareWAMessageMedia } = require("@whiskeysockets/baileys");

const handler = async (msg, { conn, participants, groupMetadata }) => {
  if (!msg.messageStubType || !msg.key.remoteJid.endsWith("@g.us")) return true;
  if (![27, 28, 32].includes(msg.messageStubType)) return true;

  let chat = global.db.data.chats[msg.key.remoteJid];
  if (!chat || !chat.welcome) return;

  let who = msg.messageStubParameters[0] + "@s.whatsapp.net";
  let user = global.db.data.users[who] || {};
  let userName = user.name || await conn.getName(who);

  let emoji = "👋"; // o cualquier otro que desees usar

  if (msg.messageStubType === 27) {
    // MENSAJE DE BIENVENIDA
    await conn.sendMessage(msg.key.remoteJid, {
      text: `${emoji} Hola, bienvenido/a ${userName}`
    });
  } else {
    const action = msg.messageStubType === 28 ? "fue eliminado del grupo" : "salió del grupo";
    // MENSAJE DE DESPEDIDA
    await conn.sendMessage(msg.key.remoteJid, {
      text: `${emoji} ${userName} ${action}`
    });
  }
};

module.exports = handler;
