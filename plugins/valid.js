const fs = require('fs');
const path = require('path');
const levenshtein = require("fast-levenshtein");

const handler = async (msg, { conn, text }) => {
  if (!text) return;

  const userCommand = text.toLowerCase();

  // Función para extraer los case 'comando' del main.js
  function getSwitchCommands(filePath) {
    if (!fs.existsSync(filePath)) return [];
    const code = fs.readFileSync(filePath, 'utf8');
    const regex = /case\s+['"`](\w+)['"`]/g;
    const matches = [];
    let match;
    while ((match = regex.exec(code)) !== null) {
      matches.push(match[1]);
    }
    return matches;
  }

  // Función para extraer handler.command = ['comando'] de carpetas
  function getHandlerCommandsFromDir(dir) {
    const commands = [];
    if (!fs.existsSync(dir)) return [];

    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isFile() && file.endsWith('.js')) {
        const code = fs.readFileSync(filePath, 'utf8');
        const regex = /handler\.command\s*=\s*([^]+)/;
        const match = regex.exec(code);
        if (match) {
          const rawArray = match[1];
          const cmdMatches = rawArray.match(/['"`](\w+)['"`]/g);
          if (cmdMatches) {
            commands.push(...cmdMatches.map(c => c.replace(/['"`]/g, '')));
          }
        }
      }
    }
    return commands;
  }

  // Comprobar si el comando existe o sugerir el más parecido
  const mainCommands = getSwitchCommands('./main.js');
  const pluginCommands = getHandlerCommandsFromDir('./plugins');
  const plugin2Commands = getHandlerCommandsFromDir('./plugins2');
  const allCommands = [...new Set([...mainCommands, ...pluginCommands, ...plugin2Commands])];

  if (allCommands.includes(userCommand)) return; // Comando válido, continúa normalmente

  // Buscar el más parecido
  let closest = null;
  let minDistance = Infinity;
  for (const cmd of allCommands) {
    const distance = levenshtein.get(userCommand, cmd);
    if (distance < minDistance) {
      minDistance = distance;
      closest = cmd;
    }
  }

  const similarity = (1 - minDistance / Math.max(userCommand.length, closest.length)) * 100;

  // Respuesta si el comando no existe
  return await conn.sendMessage2(msg.key.remoteJid, {
    text: `🪐 El comando *.${userCommand}* no existe.\n> 🧮 Usa *.menu* para ver los comandos disponibles.\n\n*¿Quisiste decir?* ➤ *.${closest}* (${similarity.toFixed(0)}% de coincidencia)`
  }, msg);
};

module.exports = handler;
