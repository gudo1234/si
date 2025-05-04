// plugins/addco.js
const fs = require("fs");
const path = require("path");

const handler = async (msg, { conn, args }) => {
  const chatId = msg.key.remoteJid;
  const isGroup = chatId.endsWith("@g.us");
  const senderId = msg.key.participant || msg.key.remoteJid;
  const senderNum = senderId.replace(/[^0-9]/g, "");
  const isOwner = global.owner.some(([id]) => id === senderNum);
  const isFromMe = msg.key.fromMe;

  // Verificación de permisos
  if (isGroup && !isOwner && !isFromMe) {
    const metadata = await conn.groupMetadata(chatId);
    const participant = metadata.participants.find(p => p.id === senderId);
    const isAdmin = participant?.admin === "admin" || participant?.admin === "superadmin";

    if (!isAdmin) {
      return conn.sendMessage2(chatId, {
        text: `${e} *Solo los administradores, el owner o el bot pueden usar este comando.*`
      }, msg );
    }
  } else if (!isGroup && !isOwner && !isFromMe) {
    return conn.sendMessage2(chatId, {
      text: `${e} *Solo el owner o el mismo bot pueden usar este comando en privado.*`
    }, msg );
  }

  // Verifica que se responda a un sticker
  const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  if (!quoted?.stickerMessage) {
    return conn.sendMessage2(chatId, {
      text: `${e} *Responde a un sticker para asignarle un comando.*`
    }, msg );
  }

  const comando = args.join(" ").trim();
  if (!comando) {
    return conn.sendMessage2(chatId, {
      text: `${e} *Especifica el comando a asignar. Ejemplo:* addco kick`
    }, msg );
  }

  const fileSha = quoted.stickerMessage.fileSha256?.toString("base64");
  if (!fileSha) {
    return conn.sendMessage2(chatId, {
      text: `${e} *No se pudo obtener el ID único del sticker.*`
    }, msg );
  }

  const jsonPath = path.resolve("./comandos.json");
  const data = fs.existsSync(jsonPath)
    ? JSON.parse(fs.readFileSync(jsonPath, "utf-8"))
    : {};

  data[fileSha] = comando;
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

  await conn.sendMessage(chatId, {
    react: { text: "✅", key: msg.key }
  });

  return conn.sendMessage(chatId, {
    text: `✅ *Sticker vinculado al comando:* \`${comando}\``,
    quoted: msg
  });
};

handler.command = ["addco"];
handler.tags = ["tools"];
handler.help = ["addco <comando>"];
module.exports = handler;
