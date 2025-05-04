const fs = require("fs");
const path = require("path");

const handler = async (msg, { conn, args }) => {
  const chatId = msg.key.remoteJid;
  const senderId = msg.key.participant || msg.key.remoteJid;
  const senderClean = senderId.replace(/[^0-9]/g, "");
  const isOwner = global.owner.some(([id]) => id === senderClean);
  const isGroup = chatId.endsWith("@g.us");
  const isFromMe = msg.key.fromMe;

  if (!isGroup) {
    return conn.sendMessage2(chatId, {
      text: `${e} Este comando solo puede usarse en grupos.`
    }, msg );
  }

  const metadata = await conn.groupMetadata(chatId);
  const isAdmin = metadata.participants.find(p => p.id === senderId)?.admin;

  if (!isAdmin && !isOwner && !isFromMe) {
    return conn.sendMessage2(chatId, {
      text: `${e} Solo los administradores del grupo, el owner del bot o el mismo bot pueden usar este comando.`
    }, msg );
  }

  if (!args[0] || !["on", "off"].includes(args[0].toLowerCase())) {
    return conn.sendMessage2(chatId, {
      text: `${e} Usa: *antidelete on/off*\n> Se encarga reenviar los mensajes eliminados.`
    }, msg );
  }

  const activosPath = path.resolve("activos.json");
  let activos = {};
  if (fs.existsSync(activosPath)) {
    activos = JSON.parse(fs.readFileSync(activosPath, "utf-8"));
  }

  if (!activos.antidelete) activos.antidelete = {};

  if (args[0].toLowerCase() === "on") {
    activos.antidelete[chatId] = true;
    await conn.sendMessage(chatId, {
      text: "✅ Antidelete *activado* en este grupo."
    }, { quoted: msg });
  } else {
    delete activos.antidelete[chatId];
    await conn.sendMessage(chatId, {
      text: "✅ Antidelete *desactivado* en este grupo."
    }, { quoted: msg });
  }

  fs.writeFileSync(activosPath, JSON.stringify(activos, null, 2));

  await conn.sendMessage(chatId, {
    react: { text: "✅", key: msg.key }
  });
};

handler.command = ["antidelete"];
module.exports = handler;
