const fs = require("fs");
const path = require("path");

const handler = async (msg, { conn, usedPrefix }) => {
    const who = msg.mentionedJid?.[0] || (msg.quoted ? msg.quoted.sender : msg.sender)
    const name = await conn.getName(who)
    const name2 = await conn.getName(msg.sender)

    const text = msg.mentionedJid?.length > 0 || msg.quoted 
        ? `\`${name2}\` está pensando en \`${name || who}\` (⸝⸝╸-╺⸝⸝)` 
        : `\`${name2}\` está pensando (⸝⸝╸-╺⸝⸝)`

    if (msg.isGroup) {
        const videos = [
            'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745592229686.mp4',
            'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745592209280.mp4',
            'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745592200461.mp4',
            'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745592192308.mp4',
            'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745592186204.mp4',
            'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745592234203.mp4',
            'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745592238943.mp4',
            'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745592243571.mp4',
            'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745592249319.mp4',
            'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745592253509.mp4',
            'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745592258067.mp4',
            'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745592262229.mp4',
            'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745592268408.mp4',
            'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745592273582.mp4',
            'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745592277332.mp4'
        ]
        
        const randomVideo = videos[Math.floor(Math.random() * videos.length)]

        await conn.sendMessage(msg.chat, {
            video: { url: randomVideo },
            gifPlayback: true,
            caption: text,
            mentions: [who]
        }, { quoted: msg })
    }
}

handler.command = ['think', 'pensar']
module.exports = handler;
