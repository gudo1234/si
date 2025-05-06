const fs = require('fs');
const levenshtein = require('fast-levenshtein');

const getCaseCommands = () => {
  try {
    const file = 'main.js';
    if (!fs.existsSync(file)) return [];

    const content = fs.readFileSync(file, 'utf8');
    const regex = /case\s+['"]([^'"]+)['"]/gi;
    const commands = [];
    let match;

    while ((match = regex.exec(content)) !== null) {
      commands.push(match[1].toLowerCase());
    }

    return commands;
  } catch (err) {
    console.error('[ERROR al leer main.js]:', err);
    return [];
  }
};

const handler = async (msg, { conn }) => {
  try {
    const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
    if (!text) return;

    const usedPrefix = global.prefix.exec(text)?.[0];
    if (!usedPrefix) return;

    const command = text.slice(usedPrefix.length).trim().split(' ')[0].toLowerCase();
    if (!command || command === 'bot') return;

    console.log('[DEBUG] Comando recibido:', command);

    // Obtener comandos de plugins
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
      console.error('[ERROR leyendo comandos de plugins]:', err);
    }

    // Obtener comandos de main.js
    const caseCommands = getCaseCommands();

    const allCommands = [...new Set([...pluginCommands, ...caseCommands])];

    console.log('[DEBUG] Lista total de comandos:', allCommands.length);

    if (allCommands.includes(command)) {
      // Comando válido
      const id = msg.key.participant || msg.key.remoteJid;
      global.db.data.users[id] = global.db.data.users[id] || {};
      global.db.data.users[id].commands = (global.db.data.users[id].commands || 0) + 1;
      console.log('[DEBUG] Comando válido');
      return;
    }

    // Sugerencia del comando más parecido
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

  } catch (err) {
    console.error('[ERROR general en handler]:', err);
    await conn.sendMessage2(msg.key.remoteJid, {
      text: '⚠️ Error interno al procesar el comando. Revisa la consola.'
    }, msg);
  }
};

module.exports = handler;
