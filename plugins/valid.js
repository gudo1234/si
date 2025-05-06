const fs = require('fs');
const path = require('path');
const levenshtein = require('fast-levenshtein');

// Escanea "case" desde main.js
function getMainCaseCommands() {
  try {
    const content = fs.readFileSync('main.js', 'utf8');
    const regex = /case\s+['"]([^'"]+)['"]/g;
    const matches = [...content.matchAll(regex)].map(m => m[1].toLowerCase());
    return matches;
  } catch (e) {
    console.error('[ERROR al leer main.js]:', e);
    return [];
  }
}

// Escanea handler.command en todos los archivos .js de una carpeta
function getCommandsFromFolder(folderPath) {
  const commands = [];

  try {
    const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.js'));
    for (const file of files) {
      const content = fs.readFileSync(path.join(folderPath, file), 'utf8');
      const matchArray = [
        ...content.matchAll(/handler\.command\s*=\s*([^]+|['"`][^'"`]+['"`])/gi)
      ];

      for (const match of matchArray) {
        const raw = match[1];
        try {
          // Evalúa la cadena como array o string literal seguro
          const cmds = eval(raw);
          if (Array.isArray(cmds)) {
            commands.push(...cmds.map(c => c.toLowerCase()));
          } else if (typeof cmds === 'string') {
            commands.push(cmds.toLowerCase());
          }
        } catch (err) {
          console.warn(`[WARNING al parsear comando en ${file}]`, err.message);
        }
      }
    }
  } catch (e) {
    console.error(`[ERROR al leer carpeta ${folderPath}]:`, e);
  }

  return commands;
}

// MAIN HANDLER
const handler = async (msg, { conn }) => {
  try {
    const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
    if (!text) return;

    const usedPrefix = global.prefix.exec(text)?.[0];
    if (!usedPrefix) return;

    const command = text.slice(usedPrefix.length).trim().split(' ')[0].toLowerCase();
    if (!command) return;

    console.log('[COMANDO RECIBIDO]:', command);

    // Escanea todas las fuentes posibles
    const caseCommands = getMainCaseCommands();
    const plugin1 = getCommandsFromFolder('./plugins');
    const plugin2 = getCommandsFromFolder('./plugins2');

    const allCommands = [...new Set([...caseCommands, ...plugin1, ...plugin2])];
    console.log('[TOTAL COMANDOS DETECTADOS]:', allCommands.length);

    if (allCommands.includes(command)) {
      console.log('[COMANDO VÁLIDO DETECTADO]');
      return; // comando válido, continúa normalmente
    }

    // Buscar sugerencia
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
    console.error('[ERROR FATAL]:', err);
    await conn.sendMessage2(msg.key.remoteJid, {
      text: '⚠️ Error interno al procesar el comando.'
    }, msg);
  }
};

module.exports = handler;
