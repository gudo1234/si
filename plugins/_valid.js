const levenshtein = require('fast-levenshtein');

const handler = async (msg, { conn }) => {
  if (!msg.message || !msg.message.conversation) return;

  const text = msg.message.conversation;
  const prefixMatch = text.match(global.prefix);
  if (!prefixMatch) return;

  const usedPrefix = prefixMatch[0];
  const command = text.slice(usedPrefix.length).trim().split(' ')[0].toLowerCase();
  if (!command || command === 'bot') return;

  // Función para verificar si el comando existe
  const isValidCommand = (cmd, plugins) => {
    for (const plugin of Object.values(plugins)) {
      if (!plugin.command) continue;
      const cmds = Array.isArray(plugin.command) ? plugin.command : [plugin.command];
      if (cmds.includes(cmd)) return true;
    }
    return false;
  };

  if (isValidCommand(command, global.plugins)) return;

  // Si no existe, buscar sugerencia
  let allCommands = [];
  for (const plugin of Object.values(global.plugins)) {
    if (!plugin.command) continue;
    const cmds = Array.isArray(plugin.command) ? plugin.command : [plugin.command];
    allCommands.push(...cmds);
  }

  let closest = '';
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

  const response = 
    `❌ El comando *${usedPrefix + command}* no existe.\n` +
    `> Usa *${usedPrefix}menu* para ver los comandos disponibles.` +
    (similarity >= 40 ? `\n\n*¿Quisiste decir?* ➤ \`${usedPrefix + closest}\` (${similarity}% de coincidencia)` : '');

  await conn.sendMessage(msg.key.remoteJid, {
    text: response
  }, { quoted: msg });
};

module.exports = handler;
