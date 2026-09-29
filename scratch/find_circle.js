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
      rawRgba[dstIdx] = currRow[srcIdx];
      rawRgba[dstIdx + 1] = currRow[srcIdx + 1];
      rawRgba[dstIdx + 2] = currRow[srcIdx + 2];
      rawRgba[dstIdx + 3] = bytesPerPixel === 4 ? currRow[srcIdx + 3] : 255;
    }
    currRow.copy(prevRow);
  }
  
  return { width, height, rawRgba };
}

const img = decodePng('C:\\Users\\Shash\\.gemini\\antigravity-ide\\brain\\62838604-e228-4ad4-9693-93697b624b5e\\.user_uploaded\\media_1790341813730.png');

console.log('Image dimensions:', img.width, 'x', img.height);

// Let's print out the pixel colors along vertical and horizontal cross sections through center
const cx = Math.floor(img.width / 2);
const cy = Math.floor(img.height / 2);

console.log(`Horizontal cross section at y = ${cy}:`);
for (let x = 0; x < img.width; x += 5) {
  const idx = (cy * img.width + x) * 4;
  const r = img.rawRgba[idx];
  const g = img.rawRgba[idx + 1];
  const b = img.rawRgba[idx + 2];
  console.log(`x=${x}: R=${r} G=${g} B=${b}`);
}

console.log(`Vertical cross section at x = ${cx}:`);
for (let y = 0; y < img.height; y += 5) {
  const idx = (y * img.width + cx) * 4;
  const r = img.rawRgba[idx];
  const g = img.rawRgba[idx + 1];
  const b = img.rawRgba[idx + 2];
  console.log(`y=${y}: R=${r} G=${g} B=${b}`);
}
