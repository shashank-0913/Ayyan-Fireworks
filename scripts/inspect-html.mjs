import fs from 'fs';

async function inspectHtml() {
  const res = await fetch('https://ayyansworld.com/shop/', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  const html = await res.text();
  console.log('HTML size:', html.length);
  
  // Find table rows or card elements containing images and text
  const trMatches = html.match(/<tr[\s\S]*?<\/tr>/gi) || [];
  console.log('TR matches:', trMatches.length);
  if (trMatches.length > 0) {
    console.log('Sample TR 1:', trMatches[1]?.slice(0, 500));
    console.log('Sample TR 2:', trMatches[2]?.slice(0, 500));
  }

  // Find all images with their nearest text or parent
  const imgRegex = /<img[^>]+src="([^">]+)"[^>]*>/gi;
  let m;
  let count = 0;
  while ((m = imgRegex.exec(html)) !== null && count < 20) {
    console.log('Img tag:', m[0]);
    count++;
  }
}

inspectHtml();
