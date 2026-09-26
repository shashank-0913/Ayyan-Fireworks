import fs from 'fs';
import zlib from 'zlib';

function decodePng(filePath) {
  const buffer = fs.readFileSync(filePath);
  let pos = 8;
  let width = 0, height = 0, bitDepth = 0, colorType = 0;
  let idatChunks = [];
  
  while (pos < buffer.length) {
    const length = buffer.readUInt32BE(pos);
    const type = buffer.toString('ascii', pos + 4, pos + 8);
    const data = buffer.slice(pos + 8, pos + 8 + length);
    
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data.readUInt8(8);
      colorType = data.readUInt8(9);
    } else if (type === 'IDAT') {
      idatChunks.push(data);
    } else if (type === 'IEND') {
      break;
    }
    pos += 12 + length;
  }
  
  const compressedData = Buffer.concat(idatChunks);
  const decompressed = zlib.inflateSync(compressedData);
  const bytesPerPixel = colorType === 6 ? 4 : colorType === 2 ? 3 : 4;
  const scanlineLength = 1 + width * bytesPerPixel;
  
  const rawRgba = Buffer.alloc(width * height * 4);
  const prevRow = Buffer.alloc(width * bytesPerPixel);
  const currRow = Buffer.alloc(width * bytesPerPixel);
  
  for (let y = 0; y < height; y++) {
    const filterType = decompressed[y * scanlineLength];
    const rowData = decompressed.slice(y * scanlineLength + 1, (y + 1) * scanlineLength);
    
    for (let x = 0; x < width * bytesPerPixel; x++) {
      const byte = rowData[x];
      const left = x >= bytesPerPixel ? currRow[x - bytesPerPixel] : 0;
      const above = prevRow[x];
      const aboveLeft = x >= bytesPerPixel ? prevRow[x - bytesPerPixel] : 0;
      
      let val = byte;
      if (filterType === 1) val = (byte + left) & 0xff;
      else if (filterType === 2) val = (byte + above) & 0xff;
      else if (filterType === 3) val = (byte + Math.floor((left + above) / 2)) & 0xff;
      else if (filterType === 4) {
        const p = left + above - aboveLeft;
        const pa = Math.abs(p - left);
        const pb = Math.abs(p - above);
        const pc = Math.abs(p - aboveLeft);
        let pr = left;
        if (pb < pa && pb <= pc) pr = above;
        else if (pc < pa && pc < pb) pr = aboveLeft;
        val = (byte + pr) & 0xff;
      }
      currRow[x] = val;
    }
    
    for (let x = 0; x < width; x++) {
      const srcIdx = x * bytesPerPixel;
      const dstIdx = (y * width + x) * 4;
      if (bytesPerPixel === 3) {
        rawRgba[dstIdx] = currRow[srcIdx];
        rawRgba[dstIdx + 1] = currRow[srcIdx + 1];
        rawRgba[dstIdx + 2] = currRow[srcIdx + 2];
        rawRgba[dstIdx + 3] = 255;
      } else if (bytesPerPixel === 4) {
        rawRgba[dstIdx] = currRow[srcIdx];
        rawRgba[dstIdx + 1] = currRow[srcIdx + 1];
        rawRgba[dstIdx + 2] = currRow[srcIdx + 2];
        rawRgba[dstIdx + 3] = currRow[srcIdx + 3];
      }
    }
    currRow.copy(prevRow);
  }
  
  return { width, height, rawRgba };
}

function encodePng(width, height, rawRgba, outputPath) {
  const newScanlineLen = 1 + width * 4;
  const outputRaw = Buffer.alloc(height * newScanlineLen);
  for (let y = 0; y < height; y++) {
    outputRaw[y * newScanlineLen] = 0;
    rawRgba.copy(outputRaw, y * newScanlineLen + 1, y * width * 4, (y + 1) * width * 4);
  }
  
  const newDeflated = zlib.deflateSync(outputRaw, { level: 9 });
  
  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      let b = buf[i];
      c ^= b;
      for (let j = 0; j < 8; j++) {
        c = (c >>> 1) ^ ((c & 1) ? 0xedb88320 : 0);
      }
    }
    return (c ^ 0xffffffff) >>> 0;
  }
  
  function makeChunk(type, data) {
    const len = data.length;
    const chunk = Buffer.alloc(12 + len);
    chunk.writeUInt32BE(len, 0);
    chunk.write(type, 4, 4, 'ascii');
    data.copy(chunk, 8);
    const typeAndData = chunk.slice(4, 8 + len);
    const crc = crc32(typeAndData);
    chunk.writeUInt32BE(crc, 8 + len);
    return chunk;
  }
  
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8);
  ihdrData.writeUInt8(6, 9);
  ihdrData.writeUInt8(0, 10);
  ihdrData.writeUInt8(0, 11);
  ihdrData.writeUInt8(0, 12);
  
  const ihdrChunk = makeChunk('IHDR', ihdrData);
  const idatChunk = makeChunk('IDAT', newDeflated);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));
  
  const pngSig = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  const finalPng = Buffer.concat([pngSig, ihdrChunk, idatChunk, iendChunk]);
  
  fs.writeFileSync(outputPath, finalPng);
}

const userImg = decodePng('C:\\Users\\Shash\\.gemini\\antigravity-ide\\brain\\62838604-e228-4ad4-9693-93697b624b5e\\.user_uploaded\\media_1790341813730.png');

const targetSize = 400;
const outRgba = Buffer.alloc(targetSize * targetSize * 4);

// The badge in userImg is tilted ~-5 degrees and centered around (102.5, 93.5), rx=88.5, ry=86.5
const srcCx = 102.5;
const srcCy = 93.5;
const srcRx = 88.0;
const srcRy = 86.5;

const outCx = targetSize / 2;
const outCy = targetSize / 2;
const outR = targetSize * 0.46; // Radius of outer circle boundary

for (let y = 0; y < targetSize; y++) {
  for (let x = 0; x < targetSize; x++) {
    const outIdx = (y * targetSize + x) * 4;
    const dx = x - outCx;
    const dy = y - outCy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist > outR + 1.5) {
      outRgba[outIdx + 3] = 0;
      continue;
    }
    
    // Map to source with tilt adjustment
    const angle = 0; // standard orientation
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const rotX = (dx * cos - dy * sin) / outR;
    const rotY = (dx * sin + dy * cos) / outR;
    
    const srcX = srcCx + rotX * srcRx;
    const srcY = srcCy + rotY * srcRy;
    
    if (srcX < 0 || srcX >= userImg.width - 1 || srcY < 0 || srcY >= userImg.height - 1) {
      outRgba[outIdx + 3] = 0;
      continue;
    }
    
    const x0 = Math.floor(srcX);
    const x1 = x0 + 1;
    const y0 = Math.floor(srcY);
    const y1 = y0 + 1;
    const fx = srcX - x0;
    const fy = srcY - y0;
    
    const i00 = (y0 * userImg.width + x0) * 4;
    const i10 = (y0 * userImg.width + x1) * 4;
    const i01 = (y1 * userImg.width + x0) * 4;
    const i11 = (y1 * userImg.width + x1) * 4;
    
    let r = 0, g = 0, b = 0;
    for (let c = 0; c < 3; c++) {
      const val = (1 - fx) * (1 - fy) * userImg.rawRgba[i00 + c] +
                  fx * (1 - fy) * userImg.rawRgba[i10 + c] +
                  (1 - fx) * fy * userImg.rawRgba[i01 + c] +
                  fx * fy * userImg.rawRgba[i11 + c];
      if (c === 0) r = val;
      else if (c === 1) g = val;
      else if (c === 2) b = val;
    }

    // Check if pixel is outer black border or inside yellow/white/black badge
    // Outer border is black ring
    const isBorderZone = dist >= outR - 4;
    if (isBorderZone) {
      // Clean up the outer black ring stroke to be sharp jet black
      outRgba[outIdx] = Math.round(Math.min(r, 20));
      outRgba[outIdx + 1] = Math.round(Math.min(g, 20));
      outRgba[outIdx + 2] = Math.round(Math.min(b, 20));
    } else {
      outRgba[outIdx] = Math.round(r);
      outRgba[outIdx + 1] = Math.round(g);
      outRgba[outIdx + 2] = Math.round(b);
    }
    
    // Antialiased outer edge
    if (dist > outR - 1.5) {
      const alpha = Math.max(0, Math.min(1, (outR + 1.5 - dist) / 3.0));
      outRgba[outIdx + 3] = Math.round(255 * alpha);
    } else {
      outRgba[outIdx + 3] = 255;
    }
  }
}

encodePng(targetSize, targetSize, outRgba, 'public/ayyan-emblem.png');
console.log('Successfully saved perfect circular public/ayyan-emblem.png!');
