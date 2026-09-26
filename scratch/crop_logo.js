import fs from 'fs';
import zlib from 'zlib';
import path from 'path';

// Decode uncompressed/compressed PNG
function processPng() {
  const inputPath = 'C:\\Users\\Shash\\.gemini\\antigravity-ide\\brain\\62838604-e228-4ad4-9693-93697b624b5e\\.user_uploaded\\media_1790341813730.png';
  const buffer = fs.readFileSync(inputPath);
  
  console.log('PNG Signature valid:', buffer.readUInt32BE(0) === 0x89504E47);
  
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
      console.log({ width, height, bitDepth, colorType });
    } else if (type === 'IDAT') {
      idatChunks.push(data);
    } else if (type === 'IEND') {
      break;
    }
    pos += 12 + length;
  }
  
  const compressedData = Buffer.concat(idatChunks);
  const decompressed = zlib.inflateSync(compressedData);
  console.log('Decompressed size:', decompressed.length);
  
  // Color type 2 is RGB (3 bytes per pixel), 6 is RGBA (4 bytes per pixel)
  const bytesPerPixel = colorType === 6 ? 4 : colorType === 2 ? 3 : 4;
  const scanlineLength = 1 + width * bytesPerPixel;
  
  // Let's reconstruct the raw pixel grid (RGBA)
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
      if (filterType === 1) { // Sub
        val = (byte + left) & 0xff;
      } else if (filterType === 2) { // Up
        val = (byte + above) & 0xff;
      } else if (filterType === 3) { // Average
        val = (byte + Math.floor((left + above) / 2)) & 0xff;
      } else if (filterType === 4) { // Paeth
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
    
    // Copy into rawRgba
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
  
  // Now let's calculate the circle center and radius of the emblem.
  // In the image, the outer black ring of the circular badge:
  // Let's find the bounding box and exact center.
  // Center is approximately (width / 2, height / 2) = (117, 128) for 235x257 image.
  const cx = width / 2;
  const cy = height / 2;
  // Let's measure radius to the outer black border
  const radius = Math.min(width, height) * 0.485;
  console.log('Center:', cx, cy, 'Radius:', radius);
  
  // Apply circular mask with smooth 1.5px antialiasing
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist > radius + 1.0) {
        // Outside circle: completely transparent!
        rawRgba[idx + 3] = 0;
      } else if (dist > radius - 1.0) {
        // Antialiased edge
        const alphaFraction = (radius + 1.0 - dist) / 2.0;
        rawRgba[idx + 3] = Math.round(Math.max(0, Math.min(255, 255 * alphaFraction)));
      }
    }
  }
  
  // Now re-encode to PNG (RGBA format, Filter 0)
  const newScanlineLen = 1 + width * 4;
  const outputRaw = Buffer.alloc(height * newScanlineLen);
  for (let y = 0; y < height; y++) {
    outputRaw[y * newScanlineLen] = 0; // Filter 0 (None)
    rawRgba.copy(outputRaw, y * newScanlineLen + 1, y * width * 4, (y + 1) * width * 4);
  }
  
  const newDeflated = zlib.deflateSync(outputRaw, { level: 9 });
  
  // Helper CRC32
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
  
  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // 8-bit
  ihdrData.writeUInt8(6, 9); // RGBA
  ihdrData.writeUInt8(0, 10);
  ihdrData.writeUInt8(0, 11);
  ihdrData.writeUInt8(0, 12);
  
  const ihdrChunk = makeChunk('IHDR', ihdrData);
  const idatChunk = makeChunk('IDAT', newDeflated);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));
  
  const pngSig = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  const finalPng = Buffer.concat([pngSig, ihdrChunk, idatChunk, iendChunk]);
  
  fs.writeFileSync('public/ayyan-emblem.png', finalPng);
  console.log('Saved clean public/ayyan-emblem.png successfully!');
}

processPng();
