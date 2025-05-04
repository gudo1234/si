const fs = require("fs");
const path = require("path");

const handler = async (msg, { conn, args }) => {
  const chatId = msg.key.remoteJid;
  const sender = msg.key.participant || msg.key.remoteJid;
  const senderClean = sender.replace(/[^0-9]/g, "");

  const isFromMe = msg.key.fromMe;
  const isOwner = global.owner.some(([id]) => id === senderClean);

  // Obtener los metadatos del grupo para verificar admins
  const groupMetadata = await conn.groupMetadata(chatId).catch(() => null);
  const isAdmin = groupMetadata?.participants?.some(p => 
    p.id === sender && (p.admin === "admin" || p.admin === "superadmin")
  );

  if (!isOwner && !isFromMe && !isAdmin) {
    return conn.sendMessage2(chatId, {
      text: `${e} Solo el owner, el bot o un admin del grupo puede restringir comandos.`
    }, msg );
  }

  if (!args[0]) return conn.sendMessage2(chatId, {
    text: "⚠️ Usa: *.re comando* para restringirlo en este grupo.\n*Ejemplo:* .re kick"
  }, msg );

  const filePath = path.resolve("./re.json");
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify({}, null, 2));

  const data = JSON.parse(fs.readFileSync(filePath));
  const comando = args[0].toLowerCase();

  if (!data[chatId]) data[chatId] = [];
  if (data[chatId].includes(comando)) {
    return conn.sendMessage2(chatId, {
      text: `⚠️ El comando *${comando}* ya está restringido en este grupo.`
    }, msg );
  }

  data[chatId].push(comando);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  await conn.sendMessage(chatId, {
    react: { text: "🔒", key: msg.key }
  });

  return conn.sendMessage2(chatId, {
    text: `✅ El comando *${comando}* ha sido restringido en este grupo.`
  }, msg );
};

handler.command = ["re"];
module.exports = handler;
