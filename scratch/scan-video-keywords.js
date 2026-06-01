const fs = require('fs');
const fileBuffer = fs.readFileSync('14684159_3840_2160_30fps.mp4');

// Search the entire buffer for strings like "Pexels", "Pixabay", "Shutterstock", "Adobe", "download", or URLs
let text = '';
for (let i = 0; i < fileBuffer.length; i++) {
  const charCode = fileBuffer[i];
  if (charCode >= 32 && charCode <= 126) {
    text += String.fromCharCode(charCode);
  } else {
    text += ' ';
  }
}

// Find matches for domain names or stock sites
const urls = text.match(/[a-zA-Z0-9.-]+\.(com|org|net|io|co|cc|me)/g);
if (urls) {
  console.log('URLs found in file:', [...new Set(urls)].slice(0, 10));
}

// Find any long words or tags
const words = text.match(/[a-zA-Z]{5,}/g);
if (words) {
  const uniqueWords = [...new Set(words)];
  console.log('Some keywords found:', uniqueWords.filter(w => !/^[A-Za-z]+$/.test(w) === false && w.length > 6).slice(0, 40));
}
