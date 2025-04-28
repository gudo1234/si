const fs = require("fs");
const chalk = require("chalk");
//const { isOwner, setPrefix, allowedPrefixes } = require("./config");
const axios = require("axios");
const fetch = require("node-fetch");
const FormData = require("form-data");
const { downloadContentFromMessage } = require("@whiskeysockets/baileys");
const os = require("os");
const { execSync } = require("child_process");
const path = require("path");
//const { imageToWebp, videoToWebp, writeExifImg, writeExifVid, writeExif, toAudio } = require('./libs/fuctions');
const activeSessions = new Set();
const stickersDir = "./stickers";
const stickersFile = "./stickers.json";
function isUrl(string) {
  const regex = /^(https?:\/\/[^\s]+)/g;
  return regex.test(string);
}
const handler = async (msg, { conn }) => {
  const chatId = msg.key.remoteJid;
  const thumbnail = await (await fetch(`https://files.catbox.moe/ztexr8.jpg`)).buffer();
  /*conn.sendMessage(chatId, {
        text: 'test', 
        contextInfo: {
            mentionedJid: [],
            groupMentions: [],
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363285614743024@newsletter',
                newsletterName: '🤖⃧►iʑυвöτ◃2.0▹',
                serverMessageId: 0
            },
            businessMessageForwardInfo: { businessOwnerJid: '50492280729@s.whatsapp.net' },
            forwardingScore: false,
            externalAdReply: {
                title: 'hola',
                body: 'hola mosha',
                thumbnailUrl: 'https://www.instagram.com/edar504__',
                thumbnail,
                sourceUrl: 'https://www.instagram.com/edar504__'
            }
        }
    }, { quoted: chatId });*/
await conn.sendMessage2(msg.key.remoteJid,
  {
    image: { url: icono }, 
    caption: `${msg.pushName}`
  },
  msg
)
}
handler.command = ['hola'];
handler.reaction = '🔄';

module.exports = handler;
