const fs = require("fs");
const path = require("path");

async function handler({ sock, msg, args }) {
    try {
        const commandName = args[0]?.toLowerCase(); // El primer argumento del comando
        console.log(`Buscando comando: ${commandName}`); // Depuración: Ver el comando que estamos buscando

        // Si no hay comando, no hacemos nada
        if (!commandName) return;

        // Leer el archivo main.js para obtener los comandos definidos
        const mainFilePath = path.join(__dirname, "main.js");
        if (!fs.existsSync(mainFilePath)) {
            await sock.sendMessage(msg.key.remoteJid, {
                text: "❌ *Error:* No se encontró el archivo de comandos (main.js)."
            }, { quoted: msg });
            return;
        }

        const mainFileContent = fs.readFileSync(mainFilePath, "utf-8");

        // Buscar el comando en el archivo main.js
        const mainRegex = new RegExp(`case\\s+['"]${commandName}['"]\\s*:`, "g");
        const mainMatches = mainFileContent.match(mainRegex);
        console.log(`Comando encontrado en main.js: ${mainMatches ? mainMatches.length : 0}`); // Depuración: Ver cuántos comandos fueron encontrados en main.js

        // Si el comando está en main.js, no hacemos nada
        if (mainMatches && mainMatches.length > 0) return;

        // Buscar en los plugins
        const pluginsPath = path.join(__dirname, "plugins");
        const pluginFiles = fs.readdirSync(pluginsPath);
        let pluginFound = false;

        console.log(`Buscando en plugins...`); // Depuración: Comenzamos a buscar en los plugins

        for (const file of pluginFiles) {
            if (!file.endsWith(".js")) continue; // Solo archivos .js

            const pluginFilePath = path.join(pluginsPath, file);
            const pluginContent = fs.readFileSync(pluginFilePath, "utf-8");

            // Buscar la propiedad handler.command en el plugin
            const pluginRegex = /handler\.command\s*=\s*([^]+|['"][^'"]+['"])/g;
            const pluginMatches = [...pluginContent.matchAll(pluginRegex)];

            console.log(`Comprobando plugin: ${file}, coincidencias encontradas: ${pluginMatches.length}`); // Depuración: Ver cuántas coincidencias encontramos en el plugin

            for (const match of pluginMatches) {
                const rawCommands = match[1].trim();
                let commands = [];

                // Evaluar el array de comandos
                try {
                    if (rawCommands.startsWith('[')) {
                        commands = eval(rawCommands);
                    } else {
                        commands = [rawCommands.replace(/['"]/g, '').trim()];
                    }
                } catch (e) {
                    console.error(`Error al evaluar los comandos en ${file}:`, e);
                }

                console.log(`Comandos en ${file}: ${commands.join(", ")}`); // Depuración: Ver qué comandos tiene el plugin

                // Comprobar si el comando está en el array de comandos
                if (commands.includes(commandName)) {
                    pluginFound = true;
                    break;
                }
            }

            if (pluginFound) break; // Si ya encontramos el comando, salimos del bucle
        }

        // Si no encontramos el comando ni en main.js ni en los plugins
        if (!pluginFound) {
            await sock.sendMessage(msg.key.remoteJid, {
                text: `❌ El comando *.${commandName}* no existe.`
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
