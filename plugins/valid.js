const fs = require('fs');
const levenshtein = require('fast-levenshtein');

const getCaseCommands = () => {
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
};

const handler = async (msg, { conn }) => {
  if (!msg.message || !msg.message.conversation) return;

  const body = msg.message.conversation;
  const usedPrefix = body.match(global.prefix)?.[0];
  if (!usedPrefix) return;

  const command = body.slice(usedPrefix.length).trim().split(' ')[0].toLowerCase();
  if (!command || command === 'bot') return;

  // Comandos desde plugins
  const pluginCommands = [];
  for (const plugin of Object.values(global.plugins)) {
    if (!plugin || !plugin.command) continue;
    const cmds = Array.isArray(plugin.command)
      ? plugin.command.map(c => c.toLowerCase())
      : [plugin.command.toLowerCase()];
    pluginCommands.push(...cmds);
  }

  // Comandos desde main.js
  const caseCommands = getCaseCommands();

  // Unir todos los comandos
  const allCommands = [...new Set([...pluginCommands, ...caseCommands])];

  if (allCommands.includes(command)) {
    // Comando válido
    const user = global.db.data.users[msg.key.participant || msg.key.remoteJid];
    user.commands = (user.commands || 0) + 1;
  } else {
    // Sugerencia
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
};

module.exports = handler;
