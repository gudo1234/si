const stringSimilarity = require("string-similarity");

// Lista de comandos válidos
const validCommands = [
    "menu", "git", "on", "off", "help", "start", "ping"
    // Agrega aquí todos tus comandos reales
];

module.exports = {
    name: "notfound",
    command: /^.([^\s]+)/i,
    tags: ["sistema"],
    disabled: false,
    run: async ({ sock, msg, command }) => {
        const matches = stringSimilarity.findBestMatch(command, validCommands);
        const bestMatch = matches.bestMatch;

        let response = `🪐 El comando *.${command}* no existe.\n> 🧮 Usa *.menu* para ver los comandos disponibles.`;

        if (bestMatch.rating >= 0.4) {
            response += `\n\n*¿Quisiste decir?* ➤ *.${bestMatch.target}* (${Math.round(bestMatch.rating * 100)}% de coincidencia)`;
        }

        await sock.sendMessage(msg.key.remoteJid, {
            text: response
        }, { quoted: msg });
    },
};
