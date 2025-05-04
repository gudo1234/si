Agregar errores que se presentan en la consola

const Starlights = require("@StarlightsTeam/Scraper");

const handler = async (msg, { conn, text, usedPrefix, command }) => {
if (!text) {
return await conn.sendMessage2(msg.key.remoteJid, {
text: ${e} Usa el comando correctamente:\n\n📌 Ejemplo: *${usedPrefix + command}* https://www.xnxx.es/video-1331hhfa/rubia_de_tetas_grandes_es_golpeada_y_un_bocado_de_semen
}, msg);
}
await conn.sendMessage(msg.key.remoteJid, {
react: { text: "🕒", key: msg.key}
});
try {
let { title, dl_url } = await Starlights.xnxxdl(args[0])
//await conn.sendFile(m.chat, dl_url, title + '.mp4', *» Título* : ${title}, m, false, { asDocument: user.useDocument })

await conn.sendMessage(msg.key.remoteJid, {
video: dl_url,
mimetype: 'video/mp4',
fileName: `${title}.mp4`,
caption: `*» Título* : ${title}`
}, { quoted: msg });

await conn.sendMessage(msg.key.remoteJid, {
react: { text: "✅", key: msg.key}
});
} catch {
}}

handler.command = ['xnxxdl']
module.exports = handler;
