import * as request from 'supertest';
import api from '../../src';

describe('Healthcheck', () => {
    describe('GET', () => {
        it('should respond with a http 200', (done) => {
            request(api)
                .get('/healthcheck')
                .expect(200, done)
        });
    });
    after(() => api.close());
});