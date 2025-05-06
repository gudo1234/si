const fs = require('fs');
const path = require('path');
const { Boom } = require('@hapi/boom');
const pino = require('pino');
const QRCode = require('qrcode');
const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  DisconnectReason
} = require('@whiskeysockets/baileys');

const handler = async (msg, { conn, command, sock }) => {
  const usarPairingCode = ["sercode", "code"].includes(command);
  let sentCodeMessage = false;

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function serbot() {
    try {
      const number = msg.key?.participant || msg.key.remoteJid;
      const sessionDir = path.join(__dirname, "../subbots");
      const sessionPath = path.join(sessionDir, number);
      const rid = number.split("@")[0];

      if (!fs.existsSync(sessionDir)) {
        fs.mkdirSync(sessionDir, { recursive: true });
      }

      await conn.sendMessage(msg.key.remoteJid, {
        react: { text: '⌛', key: msg.key }
      });

      const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
      const { version } = await fetchLatestBaileysVersion();
      const logger = pino({ level: "silent" });

      const socky = makeWASocket({
        version,
        logger,
        auth: {
          creds: state.creds,
          keys: makeCacheableSignalKeyStore(state.keys, logger)
        },
        printQRInTerminal: !usarPairingCode,
        browser: ['Windows', 'Chrome']
      });

      let reconnectionAttempts = 0;
      const maxReconnectionAttempts = 3;

      socky.ev.on("connection.update", async ({ qr, connection, lastDisconnect }) => {
        if (qr && !sentCodeMessage) {
          if (usarPairingCode) {
            const code = await socky.requestPairingCode(rid);
 await conn.sendMessage2(msg.key.remoteJid, {
                  text: `*SER BOT • MODE CODE*

${e} Usa este Código para convertirte en un *Sub-Bot* Temporal.

1• Haga clic en los tres puntos en la esquina superior derecha

2• Toque dispositivos vinculados

3• Selecciona Vincular con el número de teléfono

4• Escriba el Código para iniciar sesion con el bot

> 👉🏻 No es recomendable usar tu cuenta principal.` }, msg );       

            await sleep(1000);
            await conn.sendMessage(msg.key.remoteJid, {
              text: "```" + code + "```"
            }, { quoted: msg });
          } else {
            const qrImage = await QRCode.toBuffer(qr);
            await conn.sendMessage(msg.key.remoteJid, {
              image: qrImage,
              caption: `📲 Escanea este código QR desde *WhatsApp > Vincular dispositivo* para conectarte como subbot.`
            }, { quoted: msg });
          }
          sentCodeMessage = true;
        }

        switch (connection) {
          case "open":
            await conn.sendMessage2(msg.key.remoteJid, {
              text: `🟢 *Conectado exitosamente*\n\n> Usa los siguientes comandos para comenzar:
${global.prefix}help
${global.prefix}menu

${e} *Por defecto, el subbot está en *modo privado*, lo que significa que *solo tú puedes usarlo*.

*Usa el comando:*
\`${global.prefix}menu\` (para ver configuraciones y cómo hacer que otras personas puedan usarlo.)

> Los prefijos por defecto son: *. y #* Si quieres cambiarlos, usa: #setprefix`
            }, msg );

            await conn.sendMessage(msg.key.remoteJid, {
              react: { text: "🔁", key: msg.key }
            });
            break;

          case "close": {
            const reason = new Boom(lastDisconnect?.error)?.output.statusCode || lastDisconnect?.error?.output?.statusCode;
            const messageError = DisconnectReason[reason] || `Código desconocido: ${reason}`;

            const eliminarSesion = () => {
              if (fs.existsSync(sessionPath)) {
                fs.rmSync(sessionPath, { recursive: true, force: true });
              }
            };

            switch (reason) {
              case 401:
              case DisconnectReason.badSession:
              case DisconnectReason.loggedOut:
                await conn.sendMessage(msg.key.remoteJid, {
                  text: `⚠️ *Sesión eliminada.*
${messageError}
Usa ${global.prefix}serbot para volver a conectar.`
                }, { quoted: msg });
                eliminarSesion();
                break;

              case DisconnectReason.restartRequired:
                if (reconnectionAttempts < maxReconnectionAttempts) {
                  reconnectionAttempts++;
                  await sleep(3000);
                  await serbot();
                  return;
                }
                await conn.sendMessage(msg.key.remoteJid, {
                  text: `⚠️ *Reintentos de conexión fallidos.*`
                }, { quoted: msg });
                break;

              case DisconnectReason.connectionReplaced:
                console.log(`ℹ️ Sesión reemplazada por otra instancia.`);
                break;

              default:
                await conn.sendMessage2(msg.key.remoteJid, {
                  text: `
⚠️ *Problema de conexión detectado:*
╭──〔 ${messageError}〕──╮
🟢 Intentando reconectar...

${e} Si seguir en problemas, En ese caso, simplemente ejecuta: *#delbots* para eliminar tu sesión y luego vuelve a conectarte usando: *#serbot* o para code si no quieres qr usa: *#code* o #sercode. hasta que se conecte correctamente.`
                }, msg );
                break;
            }
            break;
          }
        }
      });

      socky.ev.on("creds.update", saveCreds);

    } catch (e) {
      console.error("❌ Error en serbot:", e);
      await conn.sendMessage(msg.key.remoteJid, {
        text: `❌ *Error inesperado:* ${e.message}`
      }, { quoted: msg });
    }
  }

  await serbot();
};

handler.command = ['sercode', 'code', 'jadibot', 'serbot', 'qr'];
handler.tags = ['owner'];
handler.help = ['serbot', 'code'];
module.exports = handler;
