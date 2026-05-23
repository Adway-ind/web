const http = require('http');

const loginData = JSON.stringify({ email: 'admin@adway.com', password: 'Adway@2026!' });
const loginOpts = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(loginData),
  },
};

const loginReq = http.request(loginOpts, (res) => {
  let body = '';
  res.on('data', (chunk) => (body += chunk));
  res.on('end', () => {
    console.log('LOGIN', res.statusCode, body);
    if (res.statusCode !== 200) return;

    const token = JSON.parse(body).token;
    const appsOpts = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/applications',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const appsReq = http.request(appsOpts, (res2) => {
      let body2 = '';
      res2.on('data', (chunk) => (body2 += chunk));
      res2.on('end', () => {
        console.log('APPS', res2.statusCode, body2);
      });
    });

    appsReq.on('error', (e) => console.error('APPS ERR', e.message));
    appsReq.end();
  });
});

loginReq.on('error', (e) => console.error('LOGIN ERR', e.message));
loginReq.write(loginData);
loginReq.end();
