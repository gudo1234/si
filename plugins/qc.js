const axios = require('axios');
const { writeExifImg } = require('../libs/fuctions');  // Ajusta si tu ruta es distinta

/*************************************************
 * 1) FUNCIONES DE APOYO (Banderas, nombre bonito)
 *************************************************/

// Añade la banderita según el número
function banderaPorPrefijo(numero) {
  const prefijos = {
    '507': '🇵🇦',
    '503': '🇸🇻',
    '502': '🇬🇹',
    '504': '🇭🇳',
    '505': '🇳🇮',
    '506': '🇨🇷',
    '509': '🇭🇹',
    '51':  '🇵🇪',
    '52':  '🇲🇽',
    '53':  '🇨🇺',
    '54':  '🇦🇷',
    '55':  '🇧🇷',
    '56':  '🇨🇱',
    '57':  '🇨🇴',
    '58':  '🇻🇪',
    '1':   '🇺🇸'
  };

  const numeroSinArroba = numero.split('@')[0];
  for (const pref of Object.keys(prefijos)) {
    if (numeroSinArroba.startsWith(pref)) {
      return prefijos[pref];
    }
  }
  return '🌎';
}

// Formatea el número (con banderita y guiones)
function formatPhoneNumber(jid) {
  const number = jid.split('@')[0];
  const bandera = banderaPorPrefijo(jid);

  if (number.length === 12) {
    return `${bandera} +${number.slice(0, 3)} ${number.slice(3, 7)}-${number.slice(7)}`;
  } else if (number.length === 11) {
    return `${bandera} +${number.slice(0, 2)} ${number.slice(2, 6)}-${number.slice(6)}`;
  } else {
    return `${bandera} +${number}`;
  }
}

/**
 * getNombreBonito(jid, conn, fallbackPushName)
 * 
 * - Intenta 1) conn.getName
 * - Si está vacío, 2) fallbackPushName
 * - Si sigue vacío, 3) conn.contacts
 * - Si nada funciona, 4) formatea número
 */
async function getNombreBonito(jid, conn, fallbackPushName = '') {
  if (!jid) return '???';
  try {
    let name = '';

    // 1) conn.getName
    if (typeof conn.getName === 'function') {
      name = await conn.getName(jid);
    }

    // 2) Si sigue vacío, usar pushName
    if (!name || !name.trim() || name.includes('@')) {
      if (fallbackPushName && fallbackPushName.trim()) {
        name = fallbackPushName;
      }
    }

    // 3) Revisar contactos
    if (!name || !name.trim() || name.includes('@')) {
      const c = conn.contacts?.[jid] || {};
      const cName = c.name || c.notify || c.vname || '';
      if (cName && cName.trim() && !cName.includes('@')) {
        name = cName;
      }
    }

    // 4) Si aún vacío, formateamos el número
    if (!name || !name.trim() || name.includes('@')) {
      name = formatPhoneNumber(jid);
    }

    return name;
  } catch (err) {
    console.log("Error en getNombreBonito:", err);
    // Como fallback, devuelvo el número
    return formatPhoneNumber(jid);
  }
}

/*************************************************
 * 2) HANDLER PRINCIPAL
 *************************************************/
const handler = async (msg, { conn, args }) => {
  try {
    // Saber si lo envió el bot
    const isFromBot = !!msg.key.fromMe;

    // pushName (nombre visible del remitente)
    const fallbackPushName = msg.pushName || '';

    // Objeto contextInfo (para mensaje citado)
    const context = msg.message?.extendedTextMessage?.contextInfo;
    // quotedMsg si existe
    const quotedMsg = context?.quotedMessage;

    // DEBUG (opcional): para ver qué recibes
    console.log('--- Mensaje completo ---');
    console.log(JSON.stringify(msg, null, 2));

    let targetJid = null;
    let textoCitado = '';

    // Si hay mensaje citado
    if (quotedMsg) {
      // El logs te mostró que "quotedParticipant: undefined"
      // y "participant" sale en "contextInfo.participant" con "50765000000@s.whatsapp.net"
      // así que usemos `context?.participant` si no es del bot

      textoCitado = quotedMsg.conversation || ''; // o la forma que uses para extraer
      // (Acá revisa si es conversation, extendedTextMessage, etc.)

      // Con tu log, viste:
      // "participant": "50765000000@s.whatsapp.net"
      // => Ése es el JID real del usuario que escribió el mensaje
      //    (SI no es tu bot, se asume que es el autor real).
      const quotedFromMe = !!quotedMsg.key?.fromMe; // si el citado lo escribió el bot

      if (!quotedFromMe && context.participant) {
        // Ese JID es el autor del mensaje citado
        targetJid = context.participant;
      } else {
        // Fallback: no hay info, usar el que manda el comando
        targetJid = msg.key.participant || msg.key.remoteJid;
      }
    } 

    // Si no hay quotedMsg
    if (!targetJid) {
      // Normal: si no se cita nada
      targetJid = msg.key.participant || msg.key.remoteJid;
    }

    // En privado, si fromMe es true (el bot)
    // y remoteJid es @s.whatsapp.net, puede que quieras forzar algo
    if (msg.key.remoteJid.endsWith('@s.whatsapp.net') && isFromBot) {
      // Forzar a usar tu propio JID de bot, si quieres
      // targetJid = conn.user.jid;
    }

    // Texto del comando (args)
    let contenido = args.join(' ').trim();
    // Si no hay texto en el comando, usar el texto del citado
    if (!contenido) contenido = textoCitado;

    // Validar si quedó vacío
    if (!contenido.trim()) {
      return await conn.sendMessage(
        msg.key.remoteJid,
        { text: '⚠️ Escribe algo o cita un mensaje para crear el sticker.' },
        { quoted: msg }
      );
    }

    // Límite de 35 caracteres
    const textoLimpio = contenido.replace(/@[\d\-]+/g, '').trim();
    if (textoLimpio.length > 35) {
      return await conn.sendMessage(
        msg.key.remoteJid,
        { text: '⚠️ El texto no puede tener más de 35 caracteres.' },
        { quoted: msg }
      );
    }

    // Obtener nombre y foto
    const targetName = await getNombreBonito(targetJid, conn, fallbackPushName);
    let targetPp;
    try {
      targetPp = await conn.profilePictureUrl(targetJid, 'image');
    } catch {
      targetPp = 'https://telegra.ph/file/24fa902ead26340f3df2c.png';
    }

    // Reacción de “procesando�?
    await conn.sendMessage(msg.key.remoteJid, {
      react: { text: '🎨', key: msg.key }
    });

    // Construir el cuerpo para la API “quote�?
    const quoteData = {
      type: "quote",
      format: "png",
      backgroundColor: "#000000",
      width: 600,
      height: 900,
      scale: 3,
      messages: [
        {
          entities: [],
          avatar: true,
          from: {
            id: 1,
            name: targetName,
            photo: { url: targetPp }
          },
          text: textoLimpio,
          replyMessage: {}
        }
      ]
    };

    // Llamamos a la API
    const res = await axios.post('https://bot.lyo.su/quote/generate', quoteData, {
      headers: { 'Content-Type': 'application/json' }
    });
    const buffer = Buffer.from(res.data.result.image, 'base64');

    // Convertir a sticker con los metadatos
    const sticker = await writeExifImg(buffer, {
      packname: wm,
      author: `${msg.pushName}`
    });

    // Enviar sticker
    await conn.sendMessage(
      msg.key.remoteJid,
      { sticker: { url: sticker } },
      { quoted: msg }
    );

    // Reacción final
    await conn.sendMessage(msg.key.remoteJid, {
      react: { text: '�?', key: msg.key }
    });

  } catch (err) {
    console.error("�? Error en qc:", err);
    await conn.sendMessage(
      msg.key.remoteJid,
      { text: '�? Error al generar el sticker.' },
      { quoted: msg }
    );
  }
};

handler.command = ['qc'];
module.exports = handler;
