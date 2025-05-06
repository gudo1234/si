const handler = async (msg, { conn }) => {
  const ownerNumber = "50492280729@s.whatsapp.net"; // Número del creador
  const ownerName = author ; // Nombre visible del creador

  const messageText = `📞 *Contacto del Creador del Subbot:*

Si tienes dudas, preguntas o sugerencias sobre el funcionamiento del bot, puedes contactar a su creador.

📌 *Nombre:* ${author}
📌 *Número:* +504 9228-0729
💬 *Toca el contacto para enviarle un mensaje directo.`;

  // Enviar contacto vCard
  await conn.sendMessage(msg.key.remoteJid, {
    contacts: {
      displayName: ownerName,
      contacts: [
        {
          vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${ownerName}\nTEL;waid=${ownerNumber.split('@')[0]}:+${ownerNumber.split('@')[0]}\nEND:VCARD`
        }
      ]
    }
  });

  // Enviar texto informativo
  await conn.sendMessage2(msg.key.remoteJid, {
    text: messageText
  }, msg );
};

handler.command = ['creador'];
module.exports = handler;
