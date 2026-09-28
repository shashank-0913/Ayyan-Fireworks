async function testOtherAyyanSites() {
  const sites = [
    'https://ayyanfireworks.com',
    'https://ayyanfireworks.com/products',
    'https://ayyanfireworks.com/pricelist',
    'https://ayyanfireworks.in'
  ];

  for (const s of sites) {
    try {
      const res = await fetch(s, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      console.log('Site:', s, 'Status:', res.status);
      if (res.ok) {
        const text = await res.text();
        const imgs = text.match(/https?:\/\/[^\s\"']+\.(jpg|jpeg|png|webp)/gi) || [];
        console.log(`Found ${imgs.length} images on ${s}`);
        console.log('Sample images:', imgs.slice(0, 5));
      }
    } catch (e) {
      console.error('Error fetching', s, e.message);
    }
  }
}

testOtherAyyanSites();
