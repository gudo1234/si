const fs = require("fs");
const path = require("path");

async function handler({ sock, msg, args }) {
    try {
        // El comando es el primer argumento enviado por el usuario
        const commandName = args[0]?.toLowerCase();

        // Verificar si no se proporciona un comando y salir sin mensaje
        if (!commandName) return;

        // Leer el archivo main.js para obtener los casos de comandos
        const mainFilePath = path.join(__dirname, "main.js");
        if (!fs.existsSync(mainFilePath)) {
            await sock.sendMessage(msg.key.remoteJid, {
                text: "❌ *Error:* No se encontró el archivo de comandos."
            }, { quoted: msg });
            return;
        }

        const mainFileContent = fs.readFileSync(mainFilePath, "utf-8");

        // Buscar el comando solicitado en el archivo main.js
        const commandRegex = new RegExp(`case\\s+['"]${commandName}['"]:\\s*([\\s\\S]*?)\\s*break;`, "g");
        const mainMatches = [...mainFileContent.matchAll(commandRegex)];

        if (mainMatches.length > 0) {
            await sock.sendMessage(msg.key.remoteJid, {
                text: `✅ El comando *.${commandName}* fue encontrado en main.js.`
            }, { quoted: msg });
            return;
        }

        // Si no se encuentra en main.js, buscar en los plugins
        const pluginsPath = path.join(__dirname, "plugins");
        const pluginFiles = fs.readdirSync(pluginsPath);
        let pluginFound = false;

        for (const file of pluginFiles) {
            if (!file.endsWith(".js")) continue;
            const pluginFilePath = path.join(pluginsPath, file);
            const pluginContent = fs.readFileSync(pluginFilePath, "utf-8");

            // Buscar en el archivo del plugin el comando solicitado
            const pluginRegex = new RegExp(`handler\\.command\\s*=\\s*(\[^\]+\|['"][^'"]+['"])`, "g");
            const pluginMatches = [...pluginContent.matchAll(pluginRegex)];

            for (const match of pluginMatches) {
                const commands = eval(match[1].trim()); // Convertir string o array de comandos

                if (Array.isArray(commands) && commands.includes(commandName)) {
                    await sock.sendMessage(msg.key.remoteJid, {
                        text: `✅ El comando *.${commandName}* fue encontrado en el plugin ${file}.`
                    }, { quoted: msg });
                    pluginFound = true;
                    break;
                } else if (typeof commands === "string" && commands.toLowerCase() === commandName) {
                    await sock.sendMessage(msg.key.remoteJid, {
                        text: `✅ El comando *.${commandName}* fue encontrado en el plugin ${file}.`
                    }, { quoted: msg });
                    pluginFound = true;
                    break;
                }
            }

            if (pluginFound) break;
        }

        // Si no se encontró el comando en main.js ni en plugins
        if (!pluginFound) {
            await sock.sendMessage(msg.key.remoteJid, {
                text: `❌ El comando *.${commandName}* no fue encontrado ni en main.js ni en los plugins.`
            }, { quoted: msg });
        }
    } catch (err) {
        console.error("Error al procesar el comando git:", err);
        await sock.sendMessage(msg.key.remoteJid, {
            text: "⚠️ Ocurrió un error al procesar tu comando. Intenta de nuevo más tarde."
        }, { quoted: msg });
    }
}

module.exports = handler;
