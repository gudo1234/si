const fs = require("fs");
const path = require("path");

const handler = async (msg, { conn }) => {
  const rawID = conn.user?.id || "";
  const subbotID = rawID.split(":")[0] + "@s.whatsapp.net";

  const prefixPath = path.resolve("prefixes.json");
  let prefixes = {};
  if (fs.existsSync(prefixPath)) {
    prefixes = JSON.parse(fs.readFileSync(prefixPath, "utf-8"));
  }
  const usedPrefix = prefixes[subbotID] || ".";

  if (!msg.key.remoteJid.includes("@g.us")) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} *Este comando solo funciona en grupos.*`
    }, msg );
  }

  const chat = await conn.groupMetadata(msg.key.remoteJid);
  const senderId = msg.key.participant.replace(/@s\.whatsapp\.net/, "");
  const groupAdmins = chat.participants.filter(p => p.admin);
  const isAdmin = groupAdmins.some(admin => admin.id === msg.key.participant);

  let isOwner = false;
  try {
    const config = require("../../../config.js");
    if (config.owner) isOwner = config.owner.some(o => o[0] === senderId);
  } catch {}

  if (!isAdmin && !isOwner) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} *No tienes permisos para cerrar el grupo.*\n⚠️ *Solo administradores o el dueño del bot pueden usar este comando.*`
    }, msg );
  }

  await conn.groupSettingUpdate(msg.key.remoteJid, "announcement");

  return await conn.sendMessage2(msg.key.remoteJid, {
    text: `${e} *El grupo ha sido cerrado.*\n📢 *Solo los administradores pueden enviar mensajes ahora.*`
  }, msg );
};

handler.command = ["cerrargrupo"];
module.exports = handler;
