// dependencias
const { dirname } = require('path');
const { fileURLToPath } = require('url');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { ffmpeg } = require('./converter.js');
const fluent_ffmpeg = require('fluent-ffmpeg');
const { spawn } = require('child_process');
const uploadFile = require('./uploadFile.js');
const uploadImage = require('./uploadImage.js');
const { fileTypeFromBuffer } = require('file-type');
const webp = require('node-webpmux');
const fetch = require('node-fetch');
const { Sticker } = require('wa-sticker-formatter');

const __dirname = dirname(fileURLToPath(__filename));
const tmp = path.join(__dirname, '../tmp');

async function addExif(webpSticker, packname, author, categories = [''], extra = {}) {
  const img = new webp.Image();
  const stickerPackId = crypto.randomBytes(32).toString('hex');
  const json = {
    'sticker-pack-id': stickerPackId,
    'sticker-pack-name': packname,
    'sticker-pack-publisher': author,
    'android-app-store-link': 'https://play.google.com/store/apps/details?id=com.marsvard.stickermakerforwhatsapp',
    'ios-app-store-link': 'https://itunes.apple.com/app/sticker-maker-studio/id1443326857',
    'emojis': categories,
    ...extra
  };
  let exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
  let jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8');
  let exif = Buffer.concat([exifAttr, jsonBuffer]);
  exif.writeUIntLE(jsonBuffer.length, 14, 4);
  await img.load(webpSticker);
  img.exif = exif;
  return await img.save(null);
}

async function sticker(img, url, packname = '', author = '', categories = [''], extra = {}) {
  const support = {
    ffmpeg: true,
    ffmpegWebp: true,
    convert: true,
    magick: false,
    gm: false
  };

  const sticker5 = async () => {
    const metadata = {
      type: 'default',
      pack: packname,
      author,
      categories,
      ...extra
    };
    return new Sticker(img ?? url, metadata).toBuffer();
  };

  const sticker3 = async () => {
    const finalUrl = url ?? await uploadFile(img);
    const res = await fetch('https://api.xteam.xyz/sticker/wm?' + new URLSearchParams({
      url: finalUrl,
      packname,
      author
    }));
    return await res.buffer();
  };

  const sticker4 = async () => {
    const input = url ? await (await fetch(url)).buffer() : img;
    return await ffmpeg(input, [
      '-vf', 'scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1'
    ], 'jpeg', 'webp');
  };

  const sticker6 = async () => {
    const buffer = url ? await (await fetch(url)).buffer() : img;
    const type = await fileTypeFromBuffer(buffer) || { mime: 'application/octet-stream', ext: 'bin' };
    if (type.ext === 'bin') throw 'Invalid file type';
    const inputPath = path.join(tmp, `${Date.now()}.${type.ext}`);
    const outputPath = inputPath + '.webp';
    await fs.promises.writeFile(inputPath, buffer);

    return new Promise((resolve, reject) => {
      fluent_ffmpeg(inputPath)
        .addOutputOptions([
          '-vcodec', 'libwebp',
          '-vf', `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15,pad=320:320:-1:-1:color=white@0.0,split[a][b];[a]palettegen=reserve_transparent=on:transparency_color=ffffff[p];[b][p]paletteuse`
        ])
        .toFormat('webp')
        .on('end', async () => {
          const output = await fs.promises.readFile(outputPath);
          await fs.promises.unlink(inputPath);
          await fs.promises.unlink(outputPath);
          resolve(output);
        })
        .on('error', reject)
        .save(outputPath);
    });
  };

  let lastError;
  for (const fn of [sticker3, support.ffmpeg && sticker6, sticker5, support.ffmpeg && support.ffmpegWebp && sticker4].filter(Boolean)) {
    try {
      const result = await fn();
      if (result.includes && result.includes('WEBP')) {
        try {
          return await addExif(result, packname, author, categories, extra);
        } catch (e) {
          console.error('Error en addExif:', e);
          return result;
        }
      }
      return result;
    } catch (err) {
      lastError = err;
      continue;
    }
  }

  throw lastError;
}

module.exports = sticker;
