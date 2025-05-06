const fs = require("fs");
const path = require("path");

const handler = async (msg, { conn }) => {
  await conn.sendMessage(msg.key.remoteJid, {
    react: { text: "➕", key: msg.key }
  });

  const fromMe = msg.key.fromMe;
  if (!fromMe) return await conn.sendMessage2(msg.key.remoteJid, {
    text: `${e} Solo el *dueño del subbot* puede usar este comando.`
  }, msg );

  const groupID = msg.key.remoteJid;
  if (!groupID.endsWith("@g.us")) {
    return await conn.sendMessage2(groupID, {
      text: `${e} Este comando solo funciona dentro de un grupo. y es para que subbots responda en ese grupo donde uses este comando.`
    }, msg );
  }

  const rawID = conn.user?.id || "";
  const subbotID = rawID.split(":")[0] + "@s.whatsapp.net";
  const filePath = path.resolve("grupo.json");
  let data = {};

  if (fs.existsSync(filePath)) {
    data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  }

  if (!Array.isArray(data[subbotID])) {
    data[subbotID] = [];
  }

  if (data[subbotID].includes(groupID)) {
    return await conn.sendMessage2(groupID, {
      text: `${e} Este grupo ya está autorizado.`
    }, msg );
  }

  data[subbotID].push(groupID);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  await conn.sendMessage2(groupID, {
    text: `${e} Grupo autorizado correctamente a hora el subbots respondera a usuarios en este grupo.`
  }, msg );
};

handler.command = ['addgrupo'];
module.exports = handler;
