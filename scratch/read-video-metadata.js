const fs = require('fs');

const fileBuffer = fs.readFileSync('14684159_3840_2160_30fps.mp4');
console.log('Video size:', fileBuffer.length, 'bytes');

// Let's search for text strings in the first 20000 bytes of the video
const firstChunk = fileBuffer.slice(0, 20000);
let text = '';
for (let i = 0; i < firstChunk.length; i++) {
  const charCode = firstChunk[i];
  if (charCode >= 32 && charCode <= 126) {
    text += String.fromCharCode(charCode);
  } else {
    text += ' ';
  }
}

console.log('Found ASCII segments:');
console.log(text.replace(/\s+/g, ' ').substring(0, 1000));
