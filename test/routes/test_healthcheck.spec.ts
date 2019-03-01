import * as request from 'supertest';
import jasmine from 'jasmine';
import api from '../../src';


// Need to create a spy on mongoose.connect() and return mocked db connection

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