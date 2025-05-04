const fs = require("fs");
const path = require("path");

const handler = async (msg, { conn, args }) => {
  const chatId = msg.key.remoteJid;
  const sender = msg.key.participant || msg.key.remoteJid;
  const senderClean = sender.replace(/[^0-9]/g, "");

  const isFromMe = msg.key.fromMe;
  const isOwner = global.owner.some(([id]) => id === senderClean);

  let isAdmin = false;
  if (chatId.endsWith("@g.us")) {
    const groupMetadata = await conn.groupMetadata(chatId);
    const participant = groupMetadata.participants.find(p => p.id === senderClean + "@s.whatsapp.net");
    isAdmin = participant?.admin !== null && participant?.admin !== undefined;
  }

  if (!isOwner && !isFromMe && !isAdmin) {
    return conn.sendMessage2(chatId, {
      text: `${e} Solo el owner, el bot o un admin del grupo puede quitar restricciones.`
    }, msg );
  }

  if (!args[0]) return conn.sendMessage2(chatId, {
    text: "⚠️ Usa: *.unre comando* para removerlo de las restricciones de este grupo.\n*Ejemplo:* .unre kick"
  }, msg );

  const filePath = path.resolve("./re.json");
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify({}, null, 2));

  const data = JSON.parse(fs.readFileSync(filePath));
  const comando = args[0].toLowerCase();

  if (!data[chatId] || !data[chatId].includes(comando)) {
    return conn.sendMessage2(chatId, {
      text: `⚠️ El comando *${comando}* no está restringido en este grupo.`
    }, msg );
  }

  data[chatId] = data[chatId].filter(c => c !== comando);
  if (data[chatId].length === 0) delete data[chatId];

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  await conn.sendMessage(chatId, {
    react: { text: "✅", key: msg.key }
  });

  return conn.sendMessage2(chatId, {
    text: `🔓 El comando *${comando}* ya no está restringido en este grupo.`
  }, msg );
};

handler.command = ["unre"];
module.exports = handler;
