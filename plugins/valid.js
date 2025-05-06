const fs = require('fs');
const levenshtein = require('fast-levenshtein');

const getCaseCommands = () => {
  try {
    const file = 'main.js';
    if (!fs.existsSync(file)) return [];
    const content = fs.readFileSync(file, 'utf8');
    const regex = /case\s+['"]([^'"]+)['"]/g;
    const commands = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      commands.push(match[1].toLowerCase());
    }
    return commands;
  } catch (err) {
    console.error('[ERROR leyendo comandos de main.js]:', err);
    return [];
  }
};

const handler = async (msg, { conn }) => {
  try {
    if (!msg.message || !msg.message.conversation) return;

    const body = msg.message.conversation;
    const usedPrefix = body.match(global.prefix)?.[0];
    if (!usedPrefix) return;

    const command = body.slice(usedPrefix.length).trim().split(' ')[0].toLowerCase();
    if (!command || command === 'bot') return;

    console.log('[DEBUG] Comando recibido:', command);

    let pluginCommands = [];
    try {
      for (const plugin of Object.values(global.plugins)) {
        if (!plugin || !plugin.command) continue;
        const cmds = Array.isArray(plugin.command)
          ? plugin.command.map(c => c.toLowerCase())
          : [plugin.command.toLowerCase()];
        pluginCommands.push(...cmds);
      }
    } catch (err) {
      console.error('[ERROR leyendo plugins]:', err);
    }

    let caseCommands = [];
    try {
      caseCommands = getCaseCommands();
    } catch (err) {
      console.error('[ERROR obteniendo caseCommands]:', err);
    }

    const allCommands = [...new Set([...pluginCommands, ...caseCommands])];

    console.log('[DEBUG] Comandos encontrados:', allCommands);

    if (allCommands.includes(command)) {
      const userId = msg.key.participant || msg.key.remoteJid;
      const user = global.db.data.users[userId] || {};
      user.commands = (user.commands || 0) + 1;
      global.db.data.users[userId] = user;
    } else {
      let closest = '';
      let shortest = Infinity;
      for (const cmd of allCommands) {
        const dist = levenshtein.get(command, cmd);
        if (dist < shortest) {
          shortest = dist;
          closest = cmd;
        }
      }

      const maxLength = Math.max(command.length, closest.length);
      const similarity = Math.round((1 - shortest / maxLength) * 100);

      const response = `❌ El comando *${usedPrefix + command}* no existe.\n` +
                       `> Usa *${usedPrefix}menu* para ver los comandos disponibles.\n\n` +
                       `*¿Quisiste decir?* ➤ \`${usedPrefix + closest}\` (${similarity}% de coincidencia)`;

      await conn.sendMessage2(msg.key.remoteJid, { text: response }, msg);
    }
  } catch (err) {
    console.error('[ERROR en handler]:', err);
    await conn.sendMessage2(msg.key.remoteJid, {
      text: '⚠️ Error interno al procesar el comando. Revisa la consola del bot.'
    }, msg);
  }
};

module.exports = handler;
