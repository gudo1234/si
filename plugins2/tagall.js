const fs = require("fs");
const path = require("path");

const handler = async (msg, { conn, args }) => {
  const rawID = conn.user?.id || "";
  const subbotID = rawID.split(":")[0] + "@s.whatsapp.net";
  const botNumber = rawID.split(":")[0].replace(/[^0-9]/g, "");

  const prefixPath = path.resolve("prefixes.json");
  let prefixes = {};
  if (fs.existsSync(prefixPath)) {
    prefixes = JSON.parse(fs.readFileSync(prefixPath, "utf-8"));
  }
  const usedPrefix = prefixes[subbotID] || ".";

  const chatId = msg.key.remoteJid;
  const senderJid = msg.key.participant || msg.key.remoteJid;
  const senderNum = senderJid.replace(/[^0-9]/g, "");

  if (!chatId.endsWith("@g.us")) {
    return await conn.sendMessage2(chatId, {
      text: `${e} *Este comando solo se puede usar en grupos.*`
    }, msg );
  }

  const metadata = await conn.groupMetadata(chatId);
  const participants = metadata.participants;

  // Verificación de permisos
  const participant = participants.find(p => p.id.includes(senderNum));
  const isAdmin = participant?.admin === "admin" || participant?.admin === "superadmin";
  const isBot = botNumber === senderNum;

  if (!isAdmin && !isBot) {
    return await conn.sendMessage2(chatId, {
      text: `${e} Solo los administradores del grupo o el subbot pueden usar este comando.`
    }, msg );
  }

  const mentionList = participants.map(p => `➥ @${p.id.split("@")[0]}`).join("\n");
  const extraMsg = args.join(" ");
  let finalMsg = "━〔 *📢 INVOCACIÓN 📢* 〕━➫\n";
  finalMsg += "___________________\n";
  if (extraMsg.trim().length > 0) {
    finalMsg += `\n❑ Mensaje: ${extraMsg}\n\n`;
  } else {
    finalMsg += "\n";
  }
  finalMsg += mentionList;

  const mentionIds = participants.map(p => p.id);

  await conn.sendMessage(chatId, {
    text: finalMsg,
    mentions: mentionIds
  }, { quoted: null });
};

handler.command = ["tagall", "invocar", "todos"];
module.exports = handler;
