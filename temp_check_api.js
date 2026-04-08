const https = require('https');

https.get('https://ca-rose-theta.vercel.app/api/health', (res) => {
  console.log('STATUS', res.statusCode);
  console.log('HEADERS', JSON.stringify(res.headers, null, 2));
  let body = '';
  res.on('data', (chunk) => (body += chunk));
  res.on('end', () => {
    console.log('BODY', body.slice(0, 500));
  });
}).on('error', (err) => {
  console.error('ERROR', err.message);
});
