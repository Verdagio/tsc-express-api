import * as config from 'config';
// import * as fs from 'fs';
// import * as https from 'https';

import app from './app/app';

const env = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : 'default';
const server = {
    httpsPort: config.get(`Server.${env}.port`),
    port: config.get(`Server.${env}.port`),
    name: config.get(`Server.${env}.name`),
}
// Uncomment this to use ssl - requires additional configuration (not working)
//  const httpsOptions = {
//      key: fs.readFileSync('./config/key.pem'),
//      cert: fs.readFileSync('./config/cert.pem')
//  }
//  https.createServer(httpsOptions, app).listen(server.httpsPort, () => {
//      console.log(`https ${server.name} is listening on ${server.httpsPort}`);
// });

const api = app.listen(server.port, () => {
    console.log(`http ${server.name} is listening on ${server.port}`);
});

export default api;