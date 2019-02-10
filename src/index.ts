import app from './app/app';
import * as config from 'config';

const env = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : 'default';
const server = {
    port: config.get(`Server.${env}.port`),
    name: config.get(`Server.${env}.name`)
}

app.listen(server.port, () => {
    console.log(`${server.name} is listening on ${server.port}`);
})

