const fs = require("fs");
const path = require("path");

const handler = async (msg, { conn, text }) => {
  // Agregar reacción inicial
  await conn.sendMessage(msg.key.remoteJid, {
    react: { text: "🗑️", key: msg.key }
  });

  const fromMe = msg.key.fromMe;

  if (!fromMe) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Solo el *dueño del subbot* puede usar este comando.`
    }, msg );
  }

  let target;
  if (msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
    target = msg.message.extendedTextMessage.contextInfo.participant;
  } else if (text && text.trim() !== "") {
    target = text;
  }

  if (!target) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Cita el mensaje del usuario o escribe su número.`
    }, msg );
  }

  target = target.replace(/\D/g, "");

  // Obtener el ID limpio del subbot
  const rawID = conn.user?.id || "";
  const subbotID = rawID.split(":")[0] + "@s.whatsapp.net";

  // Ruta del archivo desde la raíz del proyecto
  const filePath = path.resolve("listasubots.json");
  let data = {};

  if (fs.existsSync(filePath)) {
    data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  }

  if (!Array.isArray(data[subbotID]) || !data[subbotID].includes(target)) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Ese número no está en tu lista.`
    }, msg );
  }

  data[subbotID] = data[subbotID].filter(n => n !== target);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  await conn.sendMessage2(msg.key.remoteJid, {
    text: `${e} Usuario *${target}* eliminado de tu lista. ya no le respondera a los comando a este usuario que eliminastes de tu lista.`
  }, msg );
};

handler.command = ['dellista'];
module.exports = handler;
