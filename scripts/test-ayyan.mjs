async function testAyyan() {
  try {
    const res = await fetch('https://ayyansworld.com/shop/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
      }
    });
    console.log('Status:', res.status);
    const html = await res.text();
    console.log('HTML Length:', html.length);
    
    // Extract product card links and images
    const imgRegex = /<img[^>]+src="([^">]+)"/gi;
    let match;
    const images = [];
    while ((match = imgRegex.exec(html)) !== null) {
      images.push(match[1]);
    }
    console.log('Found images:', images.slice(0, 15));
  } catch (err) {
    console.error('Error:', err);
  }
}

testAyyan();
