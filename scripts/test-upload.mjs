const SUPABASE_URL = "https://bdvrcpisjatvbbqffswp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkdnJjcGlzamF0dmJicWZmc3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyMzUxMDQsImV4cCI6MjEwNTgxMTEwNH0.amQFqHKdkcHNFFa-HNFSXL-uFvDkGzJA9NyPErSRKOI";

async function testUpload() {
  const sampleUrl = "https://ayyansworld.com/wp-content/uploads/2024/02/7-cm-Electric-Sparklers-10-box.png";
  console.log('Downloading sample image from:', sampleUrl);
  
  const imgRes = await fetch(sampleUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  console.log('Image download status:', imgRes.status);
  const arrayBuffer = await imgRes.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  console.log('Downloaded bytes:', buffer.length);

  const filePath = `official/test_7cm_sparklers.png`;
  const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/products/${filePath}`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'image/png',
      'x-upsert': 'true'
    },
    body: buffer
  });

  console.log('Upload status:', uploadRes.status);
  console.log('Upload result:', await uploadRes.text());

  const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/products/${filePath}`;
  console.log('Public URL:', publicUrl);

  const verifyRes = await fetch(publicUrl);
  console.log('Verify public access status:', verifyRes.status, 'bytes:', (await verifyRes.arrayBuffer()).byteLength);
}

testUpload();
