const levenshtein = require("fast-levenshtein");

const handler = async (msg, { command, usedPrefix, conn }) => {
  const allCommands = Object.entries(global.plugins)
    .filter(([_, plugin]) => plugin?.command)
    .flatMap(([_, plugin]) => {
      const cmds = Array.isArray(plugin.command) ? plugin.command : [plugin.command];
      return cmds.map(c => c.toLowerCase());
    });

  if (allCommands.includes(command)) return; // Comando válido, no hacer nada

  let closest = "";
  let shortest = Infinity;

  for (const cmd of allCommands) {
    const dist = levenshtein.get(command, cmd);
    if (dist < shortest) {
      shortest = dist;
      closest = cmd;
    }
  }

  const maxLen = Math.max(command.length, closest.length);
  const similarity = Math.round((1 - shortest / maxLen) * 100);

  let msgText = `❌ El comando *${usedPrefix + command}* no existe.\n`;
  msgText += `> Usa *${usedPrefix}menu* para ver los comandos disponibles.`;

  if (similarity >= 40 && closest) {
    msgText += `\n\n*¿Quisiste decir?* ➤ *${usedPrefix + closest}* (${similarity}% de coincidencia)`;
  }

  // Usamos conn.sendMessage con sms
  await conn.sendMessage(msg.key.remoteJid, { text: msgText }, { quoted: msg });
};

handler.command = new RegExp('.*'); // Captura cualquier texto como comando
handler.customPrefix = /^[/!#.\$%&=?¿¡+<>~^°]/i;
handler.before = true;
handler.group = true;
handler.private = true;

module.exports = handler;
