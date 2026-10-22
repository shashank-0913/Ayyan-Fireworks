import https from 'https';

https.get('https://ayyansworld.com/wp-content/uploads/2024/02/7-cm-Electric-Sparklers-10-box.png', (res) => {
  console.log('Status code:', res.statusCode);
  console.log('Headers:', res.headers['content-type']);
}).on('error', (err) => {
  console.error('Fetch error:', err.message);
});
