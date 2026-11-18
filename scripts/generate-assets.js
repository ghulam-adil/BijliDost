const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CRC32 implementation
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  const crc = crc32(Buffer.concat([typeBuf, data]));
  crcBuf.writeUInt32BE(crc, 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function createSolidPng(width, height, r, g, b) {
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8 bits per channel
  ihdrData[9] = 2; // RGB
  ihdrData[10] = 0; // Deflate
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // Interlace
  const ihdr = makeChunk('IHDR', ihdrData);

  const rowSize = 1 + width * 3;
  const rawData = Buffer.alloc(height * rowSize);
  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0;
    for (let x = 0; x < width; x++) {
      const px = rowOffset + 1 + x * 3;
      rawData[px] = r;
      rawData[px + 1] = g;
      rawData[px + 2] = b;
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const idat = makeChunk('IDAT', compressed);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

const imagesDir = path.join(__dirname, '..', 'assets', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Brand color: #0E7C5B (R: 14, G: 124, B: 91)
console.log('Generating PNG image assets in assets/images/...');

// 1. icon.png (1024x1024)
fs.writeFileSync(path.join(imagesDir, 'icon.png'), createSolidPng(1024, 1024, 14, 124, 91));
console.log('✓ Created assets/images/icon.png (1024x1024)');

// 2. adaptive-icon.png (1024x1024)
fs.writeFileSync(path.join(imagesDir, 'adaptive-icon.png'), createSolidPng(1024, 1024, 14, 124, 91));
console.log('✓ Created assets/images/adaptive-icon.png (1024x1024)');

// 3. splash-icon.png (1024x1024)
fs.writeFileSync(path.join(imagesDir, 'splash-icon.png'), createSolidPng(1024, 1024, 14, 124, 91));
console.log('✓ Created assets/images/splash-icon.png (1024x1024)');

// 4. favicon.png (48x48)
fs.writeFileSync(path.join(imagesDir, 'favicon.png'), createSolidPng(48, 48, 14, 124, 91));
console.log('✓ Created assets/images/favicon.png (48x48)');

console.log('Done! All assets ready for Expo Prebuild.');

