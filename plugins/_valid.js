const levenshtein = require("fast-levenshtein");

const validCommands = [
    "menu", "git", "on", "off", "help", "start", "ping"
    // Agrega aquí tus comandos válidos
];

module.exports = {
    name: "notfound",
    command: /^.([^\s]+)/i,
    tags: ["sistema"],
    disabled: false,
    run: async ({ sock, msg, command }) => {
        // Si el comando es válido, no hacer nada
        if (validCommands.includes(command)) return;

        // Buscar el comando más parecido
        let closest = null;
        let minDistance = Infinity;

        for (const cmd of validCommands) {
            const distance = levenshtein.get(command, cmd);
            if (distance < minDistance) {
                minDistance = distance;
                closest = cmd;
            }
        }

        const similarityPercent = Math.max(0, 100 - Math.floor((minDistance / command.length) * 100));

        let response = `🪐 El comando *.${command}* no existe.\n> 🧮 Usa *.menu* para ver los comandos disponibles.`;

        if (similarityPercent >= 40 && closest) {
            response += `\n\n*¿Quisiste decir?* ➤ *.${closest}* (${similarityPercent}% de coincidencia)`;
        }

        await sock.sendMessage(msg.key.remoteJid, {
            text: response
        }, { quoted: msg });
    },
};
